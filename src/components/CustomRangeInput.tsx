import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useInstantSearch, useRange } from "react-instantsearch";

interface CustomRangeInputProps {
  attribute: string;
  min: number;
  max: number;
  className?: string;
}

interface ValidationState {
  from: { isValid: boolean; message: string };
  to: { isValid: boolean; message: string };
}

function CustomRangeInput({
  attribute,
  min,
  max,
  className,
}: CustomRangeInputProps) {
  const { setIndexUiState, indexUiState } = useInstantSearch();
  const { refine } = useRange({ attribute });

  // Get current range from URL state if it exists
  const currentRange = indexUiState.range?.[attribute];
  const currentMin = currentRange
    ? Number(currentRange.split(":")[0])
    : undefined;
  const currentMax = currentRange
    ? Number(currentRange.split(":")[1])
    : undefined;

  // Initialize from and to values from URL state if it exists
  const [from, setFrom] = useState(() => {
    if (currentMin !== undefined && currentMin !== min) {
      return currentMin.toString();
    }
    return "";
  });
  const [to, setTo] = useState(() => {
    if (currentMax !== undefined && currentMax !== max) {
      return currentMax.toString();
    }
    return "";
  });

  // Sync input fields with refinement state when it changes externally
  useEffect(() => {
    if (!currentRange) {
      // If there's no range in the URL state, clear the inputs
      setFrom("");
      setTo("");
      setValidation({
        from: { isValid: true, message: "" },
        to: { isValid: true, message: "" },
      });
    }
  }, [currentRange]);

  // Add validation state
  const [validation, setValidation] = useState<ValidationState>({
    from: { isValid: true, message: "" },
    to: { isValid: true, message: "" },
  });

  const validateInput = (value: string, field: "from" | "to"): boolean => {
    if (value === "") return true;

    const numValue = Number(value);
    if (isNaN(numValue)) return false;

    if (field === "from") {
      if (numValue < min) {
        setValidation((prev) => ({
          ...prev,
          from: { isValid: false, message: `Minimum value is ${min}` },
        }));
        return false;
      }
      if (to && numValue > Number(to)) {
        setValidation((prev) => ({
          ...prev,
          from: { isValid: false, message: "Must be less than max value" },
        }));
        return false;
      }
    } else {
      if (numValue > max) {
        setValidation((prev) => ({
          ...prev,
          to: { isValid: false, message: `Maximum value is ${max}` },
        }));
        return false;
      }
      if (from && numValue < Number(from)) {
        setValidation((prev) => ({
          ...prev,
          to: { isValid: false, message: "Must be greater than min value" },
        }));
        return false;
      }
    }

    setValidation((prev) => ({
      ...prev,
      [field]: { isValid: true, message: "" },
    }));
    return true;
  };

  const updateRange = useCallback(
    (startValue: number | undefined, endValue: number | undefined) => {
      // First update the refinement
      if (startValue !== undefined && endValue !== undefined) {
        refine([startValue, endValue]);
      } else {
        refine([min, max]);
      }

      // Then update the URL state
      setIndexUiState((prevState) => {
        const newRange = prevState.range ? { ...prevState.range } : {};

        if (startValue !== undefined && endValue !== undefined) {
          newRange[attribute] = `${startValue}:${endValue}`;
        } else {
          delete newRange[attribute];
        }

        return {
          ...prevState,
          range: Object.keys(newRange).length > 0 ? newRange : undefined,
        };
      });
    },
    [attribute, setIndexUiState, refine, min, max]
  );

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    // Validate both inputs before submitting
    const isFromValid = validateInput(from, "from");
    const isToValid = validateInput(to, "to");

    if (!isFromValid || !isToValid) {
      return;
    }

    // Convert empty strings to undefined to use min/max defaults
    const startValue = from === "" ? min : Number(from);
    const endValue = to === "" ? max : Number(to);

    // Always update if values are valid
    if (startValue <= endValue) {
      updateRange(startValue, endValue);
    }
  };

  const handleInputChange = (field: "from" | "to", value: string) => {
    // Allow empty string, numbers, and a single decimal point
    if (value === "" || /^-?\d*\.?\d*$/.test(value)) {
      if (field === "from") {
        setFrom(value);
        validateInput(value, "from");
      } else {
        setTo(value);
        validateInput(value, "to");
      }
    }
  };

  const handleClear = () => {
    setFrom("");
    setTo("");
    setValidation({
      from: { isValid: true, message: "" },
      to: { isValid: true, message: "" },
    });
    // Only update if there are current refinements
    if (currentMin !== undefined || currentMax !== undefined) {
      updateRange(undefined, undefined);
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      <form onSubmit={handleSubmit} className="space-y-2">
        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-[1fr_1fr_auto_auto] gap-2 items-start">
            <div className="flex flex-col">
              <Input
                type="text"
                inputMode="numeric"
                value={from}
                onChange={(e) => handleInputChange("from", e.target.value)}
                className={cn(
                  "bg-background hover:bg-accent focus:bg-background",
                  !validation.from.isValid &&
                    "border-destructive focus-visible:ring-destructive"
                )}
                placeholder={`Min ${min}`}
                pattern="-?\d*\.?\d*"
                min={min}
              />
              {!validation.from.isValid && (
                <p className="text-xs text-destructive mt-1 absolute top-full">
                  {validation.from.message}
                </p>
              )}
            </div>

            <div className="flex flex-col">
              <Input
                type="text"
                inputMode="numeric"
                value={to}
                onChange={(e) => handleInputChange("to", e.target.value)}
                className={cn(
                  "bg-background hover:bg-accent focus:bg-background",
                  !validation.to.isValid &&
                    "border-destructive focus-visible:ring-destructive"
                )}
                placeholder={`Max ${max}`}
                pattern="-?\d*\.?\d*"
                max={max}
              />
              {!validation.to.isValid && (
                <p className="text-xs text-destructive mt-1 absolute top-full">
                  {validation.to.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              variant="default"
              size="sm"
              className="bg-primary text-primary-foreground hover:bg-primary/90 h-10"
              disabled={!validation.from.isValid || !validation.to.isValid}
            >
              Apply
            </Button>

            {(from || to) && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleClear}
                className="h-10 w-10 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Clear range</span>
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}

export default CustomRangeInput;
