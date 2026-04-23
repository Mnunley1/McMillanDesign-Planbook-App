// src/components/CustomSortBy.tsx

import { X } from "lucide-react";
import { useSortBy } from "react-instantsearch";
import Select from "react-select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SortOption {
  label: string;
  value: string;
}

interface CustomSortByProps {
  baseIndex: string;
  className?: string;
  items: SortOption[];
}

function CustomSortBy({ baseIndex, items, className }: CustomSortByProps) {
  const { currentRefinement, refine, canRefine } = useSortBy({
    items,
  });

  if (!canRefine) {
    return null;
  }

  // If the current sort is the base index, it won't be in items — fall back to
  // a null value so react-select shows the placeholder instead of items[0].
  const currentOption =
    items.find((item) => item.value === currentRefinement) ?? null;
  const isActive = currentOption !== null;

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="w-[200px]">
        <Select
          classNamePrefix="sort-select"
          classNames={{
            control: () =>
              "!bg-background !border-border hover:!border-border !min-h-[36px] !shadow-none rounded-md",
            menu: () =>
              "!bg-background !border !border-border !shadow-md rounded-xl z-[100]",
            option: (state) =>
              cn(
                "cursor-pointer px-3",
                state.isSelected && "!bg-primary !text-primary-foreground",
                state.isFocused && !state.isSelected && "!bg-accent",
                "hover:!bg-accent"
              ),
            singleValue: () => "!text-foreground",
            dropdownIndicator: () =>
              "!text-muted-foreground hover:!text-foreground",
            indicatorSeparator: () => "!bg-border",
            input: () => "!text-foreground",
            placeholder: () => "!text-muted-foreground",

            noOptionsMessage: () => "!text-muted-foreground py-2 px-3",
            loadingMessage: () => "!text-muted-foreground py-2 px-3",
          }}
          isDisabled={!canRefine}
          isSearchable={false}
          menuPlacement="auto"
          onChange={(option) => option && refine(option.value)}
          options={items}
          placeholder="Sort by..."
          styles={{
            // Only keep styles that can't be handled by Tailwind
            control: (base) => ({
              ...base,
              backgroundColor: "transparent",
              borderColor: "transparent",
            }),
            menu: (base) => ({
              ...base,
              backgroundColor: "transparent",
              borderColor: "transparent",
            }),
            option: (base) => ({
              ...base,
              backgroundColor: "transparent",
            }),
          }}
          value={currentOption}
        />
      </div>
      {isActive && (
        <Button
          aria-label="Clear sort"
          className="h-8 w-8 shrink-0 text-muted-foreground hover:text-foreground"
          onClick={() => refine(baseIndex)}
          size="icon"
          type="button"
          variant="ghost"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}

export default CustomSortBy;
