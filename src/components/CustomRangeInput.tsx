import { X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useInstantSearch, useRange } from "react-instantsearch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface CustomRangeInputProps {
  attribute: string;
  className?: string;
  max: number;
  min: number;
}

function CustomRangeInput({
  attribute,
  min,
  max,
  className,
}: CustomRangeInputProps) {
  const { setIndexUiState, indexUiState } = useInstantSearch();
  const { refine } = useRange({ attribute });

  const currentRange = indexUiState.range?.[attribute];
  const currentMin = currentRange
    ? Number(String(currentRange).split(":")[0])
    : undefined;
  const currentMax = currentRange
    ? Number(String(currentRange).split(":")[1])
    : undefined;

  const [minInput, setMinInput] = useState<string>(
    currentMin !== undefined && !Number.isNaN(currentMin)
      ? String(currentMin)
      : ""
  );
  const [maxInput, setMaxInput] = useState<string>(
    currentMax !== undefined && !Number.isNaN(currentMax)
      ? String(currentMax)
      : ""
  );

  const isActive = currentRange !== undefined;
  const step = attribute === "sqft" ? 100 : 1;

  // Sync inputs with external state changes (Reset All, saved searches, etc.)
  useEffect(() => {
    if (currentRange) {
      const parts = String(currentRange).split(":");
      const newMin = Number(parts[0]);
      const newMax = Number(parts[1]);
      if (!(Number.isNaN(newMin) || Number.isNaN(newMax))) {
        setMinInput(String(newMin));
        setMaxInput(String(newMax));
      }
    } else {
      setMinInput("");
      setMaxInput("");
    }
  }, [currentRange]);

  const updateRange = useCallback(
    (startValue: number | undefined, endValue: number | undefined) => {
      if (startValue !== undefined && endValue !== undefined) {
        refine([startValue, endValue]);
      } else {
        refine([min, max]);
      }

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

  const commit = useCallback(() => {
    const parsedMin = minInput === "" ? undefined : Number(minInput);
    const parsedMax = maxInput === "" ? undefined : Number(maxInput);

    if (
      (parsedMin !== undefined && Number.isNaN(parsedMin)) ||
      (parsedMax !== undefined && Number.isNaN(parsedMax))
    ) {
      return;
    }

    if (parsedMin === undefined && parsedMax === undefined) {
      updateRange(undefined, undefined);
      return;
    }

    let finalMin = Math.max(min, Math.min(parsedMin ?? min, max));
    let finalMax = Math.max(min, Math.min(parsedMax ?? max, max));
    if (finalMin > finalMax) {
      [finalMin, finalMax] = [finalMax, finalMin];
    }

    setMinInput(String(finalMin));
    setMaxInput(String(finalMax));

    if (finalMin === min && finalMax === max) {
      updateRange(undefined, undefined);
    } else {
      updateRange(finalMin, finalMax);
    }
  }, [minInput, maxInput, min, max, updateRange]);

  const handleClear = () => {
    setMinInput("");
    setMaxInput("");
    updateRange(undefined, undefined);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.currentTarget.blur();
    }
  };

  const minPlaceholder =
    attribute === "sqft" ? min.toLocaleString() : String(min);
  const maxPlaceholder =
    attribute === "sqft" ? max.toLocaleString() : String(max);

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Input
        aria-label="Minimum"
        className="h-8"
        inputMode="numeric"
        min={min}
        onBlur={commit}
        onChange={(e) => setMinInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={minPlaceholder}
        step={step}
        type="number"
        value={minInput}
      />
      <span aria-hidden="true" className="text-muted-foreground text-sm">
        –
      </span>
      <Input
        aria-label="Maximum"
        className="h-8"
        inputMode="numeric"
        max={max}
        onBlur={commit}
        onChange={(e) => setMaxInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={maxPlaceholder}
        step={step}
        type="number"
        value={maxInput}
      />
      {isActive && (
        <Button
          className="h-8 w-8 shrink-0 text-muted-foreground hover:text-foreground"
          onClick={handleClear}
          size="icon"
          type="button"
          variant="ghost"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Clear range</span>
        </Button>
      )}
    </div>
  );
}

export default CustomRangeInput;
