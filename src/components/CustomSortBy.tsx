// src/components/CustomSortBy.tsx
import { cn } from "@/lib/utils";
import { useSortBy } from "react-instantsearch";
import Select from "react-select";

interface SortOption {
  label: string;
  value: string;
}

interface CustomSortByProps {
  items: SortOption[];
  className?: string;
}

function CustomSortBy({ items, className }: CustomSortByProps) {
  const { currentRefinement, refine, canRefine } = useSortBy({
    items,
  });

  if (!canRefine) {
    return null;
  }

  // Find the current option to set as default value
  const currentOption =
    items.find((item) => item.value === currentRefinement) || items[0];

  return (
    <div className={cn("w-[200px]", className)}>
      <Select
        classNamePrefix="sort-select"
        value={currentOption}
        onChange={(option) => option && refine(option.value)}
        options={items}
        isDisabled={!canRefine}
        isSearchable={false}
        menuPlacement="auto"
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
      />
    </div>
  );
}

export default CustomSortBy;
