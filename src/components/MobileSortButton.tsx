import { ArrowUpDown } from "lucide-react";
import { useSortBy } from "react-instantsearch";
import type { SortItem } from "@/types/floor-plan";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface MobileSortButtonProps {
  sortItems: SortItem[];
}

export default function MobileSortButton({
  sortItems,
}: MobileSortButtonProps) {
  const { currentRefinement, refine, canRefine } = useSortBy({
    items: sortItems,
  });

  if (!canRefine) {
    return null;
  }

  const currentLabel =
    sortItems.find((item) => item.value === currentRefinement)?.label ??
    "Sort";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" variant="outline">
          <ArrowUpDown className="mr-1.5 h-3.5 w-3.5" />
          <span className="max-w-[80px] truncate text-xs">{currentLabel}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Sort By</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          onValueChange={refine}
          value={currentRefinement}
        >
          {sortItems.map((item) => (
            <DropdownMenuRadioItem key={item.value} value={item.value}>
              {item.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
