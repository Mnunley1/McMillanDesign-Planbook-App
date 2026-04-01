import { X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useInstantSearch, useRange } from "react-instantsearch";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
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

  // Get current range from URL state if it exists
  const currentRange = indexUiState.range?.[attribute];
  const currentMin = currentRange
    ? Number(String(currentRange).split(":")[0])
    : undefined;
  const currentMax = currentRange
    ? Number(String(currentRange).split(":")[1])
    : undefined;

  const [localRange, setLocalRange] = useState<[number, number]>([
    currentMin !== undefined && !Number.isNaN(currentMin) ? currentMin : min,
    currentMax !== undefined && !Number.isNaN(currentMax) ? currentMax : max,
  ]);

  const isActive = currentRange !== undefined;

  // Sync local state with external changes
  useEffect(() => {
    if (currentRange) {
      const parts = String(currentRange).split(":");
      const newMin = Number(parts[0]);
      const newMax = Number(parts[1]);
      if (!(Number.isNaN(newMin) || Number.isNaN(newMax))) {
        setLocalRange([newMin, newMax]);
      }
    } else {
      setLocalRange([min, max]);
    }
  }, [currentRange, min, max]);

  const step = attribute === "sqft" ? 100 : 1;

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

  const handleValueCommit = (values: number[]) => {
    const [newMin, newMax] = values;
    if (newMin === min && newMax === max) {
      updateRange(undefined, undefined);
    } else {
      updateRange(newMin, newMax);
    }
  };

  const handleClear = () => {
    setLocalRange([min, max]);
    updateRange(undefined, undefined);
  };

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center gap-2">
        <Slider
          className="flex-1"
          max={max}
          min={min}
          onValueChange={(values) => setLocalRange(values as [number, number])}
          onValueCommit={handleValueCommit}
          step={step}
          value={localRange}
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
      <div className="flex justify-between text-muted-foreground text-xs">
        <span>
          {attribute === "sqft"
            ? localRange[0].toLocaleString()
            : localRange[0]}
        </span>
        <span>
          {attribute === "sqft"
            ? localRange[1].toLocaleString()
            : localRange[1]}
        </span>
      </div>
    </div>
  );
}

export default CustomRangeInput;
