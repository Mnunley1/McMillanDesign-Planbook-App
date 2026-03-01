import { Search, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useRefinementList } from "react-instantsearch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface RefinementItem {
  count: number;
  isRefined: boolean;
  label: string;
  value: string;
}

interface CustomRefinementListProps {
  attribute: string;
  className?: string;
  defaultRefinement?: string[];
  searchable?: boolean;
}

function CustomRefinementList({
  attribute,
  searchable = true,
  defaultRefinement = [],
  className,
}: CustomRefinementListProps) {
  const { items, refine, searchForItems } = useRefinementList({
    attribute,
  });

  const [searchValue, setSearchValue] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [displayCount, setDisplayCount] = useState(5);

  // Handle defaultRefinement — only on initial mount
  const defaultRefinementApplied = React.useRef(false);
  useEffect(() => {
    if (!defaultRefinementApplied.current && defaultRefinement.length > 0) {
      defaultRefinementApplied.current = true;
      for (const value of defaultRefinement) {
        refine(value);
      }
    }
  }, [defaultRefinement, refine]);

  // Reset search when attribute changes
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentionally reset when attribute prop changes
  useEffect(() => {
    setSearchValue("");
    setShowSearch(false);
    setDisplayCount(5);
  }, [attribute]);

  const handleRefine = (value: string) => {
    refine(value);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    searchForItems(value);
  };

  const clearSearch = () => {
    setSearchValue("");
    searchForItems("");
  };

  const showMore = () => {
    setDisplayCount(items.length);
  };

  const showLess = () => {
    setDisplayCount(5);
  };

  const filteredItems = items;
  const hasMoreItems = items.length > displayCount;
  const visibleItems = filteredItems.slice(0, displayCount);

  return (
    <div className={cn("space-y-3", className)}>
      {searchable && (
        <div className="mb-2">
          {showSearch ? (
            <div className="relative">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                autoFocus
                className="bg-background pl-9 hover:bg-accent focus:bg-background"
                onChange={handleSearch}
                placeholder="Search..."
                value={searchValue}
              />
              {searchValue && (
                <Button
                  className="absolute top-1/2 right-0 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={clearSearch}
                  size="icon"
                  type="button"
                  variant="ghost"
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Clear search</span>
                </Button>
              )}
            </div>
          ) : (
            <Button
              className="w-full border-muted-foreground/20 text-muted-foreground hover:border-primary hover:text-primary"
              onClick={() => setShowSearch(true)}
              size="sm"
              variant="outline"
            >
              <Search className="mr-2 h-4 w-4" />
              Search options
            </Button>
          )}
        </div>
      )}

      {visibleItems.length === 0 ? (
        <p className="text-muted-foreground text-sm">No options found</p>
      ) : (
        <div className="space-y-2">
          {visibleItems.map((item: RefinementItem) => (
            <div
              className="flex items-center justify-between rounded-md p-2 transition-colors hover:bg-accent"
              key={item.value}
            >
              <div className="flex items-center space-x-3">
                <Checkbox
                  checked={item.isRefined}
                  className="border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                  id={`refinement-${item.value}`}
                  onCheckedChange={() => handleRefine(item.value)}
                />
                <label
                  className={cn(
                    "font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                    item.isRefined && "font-semibold"
                  )}
                  htmlFor={`refinement-${item.value}`}
                >
                  {item.label}
                </label>
              </div>
              <Badge
                className={cn(
                  item.isRefined
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "border-muted-foreground/20 text-muted-foreground"
                )}
                variant={item.isRefined ? "default" : "outline"}
              >
                {item.count}
              </Badge>
            </div>
          ))}
        </div>
      )}

      {hasMoreItems && (
        <div className="flex justify-center">
          <Button
            className="text-primary hover:text-primary/90"
            onClick={displayCount === 5 ? showMore : showLess}
            size="sm"
            variant="link"
          >
            {displayCount === 5 ? "Show more" : "Show less"}
          </Button>
        </div>
      )}
    </div>
  );
}

export default CustomRefinementList;
