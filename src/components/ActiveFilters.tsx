import { X } from "lucide-react";
import { useInstantSearch } from "react-instantsearch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Human-readable labels for attributes
const ATTRIBUTE_LABELS: Record<string, string> = {
  planType: "Plan Type",
  numberOfLevels: "Levels",
  primarySuite: "Primary Suite",
  garageOrientation: "Garage",
  sqft: "Sq Ft",
  planWidth: "Width",
  planDepth: "Depth",
  bedrooms: "Bedrooms",
  vehicleSpaces: "Vehicle Spaces",
  basement: "Basement",
  walkupAttic: "Walk-up Attic",
};

interface FilterChip {
  key: string;
  label: string;
  onRemove: () => void;
}

export default function ActiveFilters() {
  const { indexUiState, setIndexUiState } = useInstantSearch();
  const chips: FilterChip[] = [];

  // Refinement lists
  if (indexUiState.refinementList) {
    for (const [attribute, values] of Object.entries(
      indexUiState.refinementList
    )) {
      if (Array.isArray(values)) {
        for (const value of values) {
          chips.push({
            key: `refinement-${attribute}-${value}`,
            label: `${ATTRIBUTE_LABELS[attribute] || attribute}: ${value}`,
            onRemove: () => {
              setIndexUiState((prev) => {
                const newList = { ...prev.refinementList };
                const currentValues = newList[attribute];
                if (currentValues) {
                  newList[attribute] = currentValues.filter((v) => v !== value);
                  if (newList[attribute]?.length === 0) {
                    delete newList[attribute];
                  }
                }
                return { ...prev, refinementList: newList };
              });
            },
          });
        }
      }
    }
  }

  // Range filters
  if (indexUiState.range) {
    for (const [attribute, value] of Object.entries(indexUiState.range)) {
      if (value) {
        const rangeStr =
          typeof value === "string"
            ? value
            : `${(value as Record<string, string>).min || ""}:${(value as Record<string, string>).max || ""}`;
        const [min, max] = rangeStr.split(":");
        const displayMin = min || "any";
        const displayMax = max || "any";
        chips.push({
          key: `range-${attribute}`,
          label: `${ATTRIBUTE_LABELS[attribute] || attribute}: ${displayMin}–${displayMax}`,
          onRemove: () => {
            setIndexUiState((prev) => {
              const newRange = { ...prev.range };
              delete newRange[attribute];
              return {
                ...prev,
                range: Object.keys(newRange).length > 0 ? newRange : undefined,
              };
            });
          },
        });
      }
    }
  }

  // Toggle refinements
  if (indexUiState.toggle) {
    for (const [attribute, isActive] of Object.entries(indexUiState.toggle)) {
      if (isActive) {
        chips.push({
          key: `toggle-${attribute}`,
          label: ATTRIBUTE_LABELS[attribute] || attribute,
          onRemove: () => {
            setIndexUiState((prev) => {
              const newToggle = { ...prev.toggle };
              delete newToggle[attribute];
              return { ...prev, toggle: newToggle };
            });
          },
        });
      }
    }
  }

  // Numeric menus
  if (indexUiState.numericMenu) {
    for (const [attribute, value] of Object.entries(indexUiState.numericMenu)) {
      if (value) {
        chips.push({
          key: `numeric-${attribute}`,
          label: `${ATTRIBUTE_LABELS[attribute] || attribute}: ${value}+`,
          onRemove: () => {
            setIndexUiState((prev) => {
              const newNumeric = { ...prev.numericMenu };
              delete newNumeric[attribute];
              return { ...prev, numericMenu: newNumeric };
            });
          },
        });
      }
    }
  }

  if (chips.length === 0) {
    return null;
  }

  const handleClearAll = () => {
    setIndexUiState((prev) => ({
      ...prev,
      refinementList: {},
      range: undefined,
      toggle: {},
      numericMenu: {},
    }));
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <Badge
          className="gap-1 pr-1 text-xs bg-primary/15 text-primary border border-primary/20"
          key={chip.key}
          variant="secondary"
        >
          {chip.label}
          <button
            className="ml-1 rounded-full p-0.5 hover:bg-muted-foreground/20"
            onClick={chip.onRemove}
            type="button"
          >
            <X className="h-3 w-3" />
            <span className="sr-only">Remove {chip.label} filter</span>
          </button>
        </Badge>
      ))}
      {chips.length > 1 && (
        <Button
          className="h-auto px-2 py-1 text-xs"
          onClick={handleClearAll}
          size="sm"
          variant="ghost"
        >
          Clear All
        </Button>
      )}
    </div>
  );
}
