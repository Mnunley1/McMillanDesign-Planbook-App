import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useRefinementList } from "react-instantsearch";

interface RefinementItem {
  label: string;
  value: string;
  count: number;
  isRefined: boolean;
}

interface CustomRefinementListProps {
  attribute: string;
  searchable?: boolean;
  defaultRefinement?: string[];
  className?: string;
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

  // Handle defaultRefinement
  useEffect(() => {
    if (defaultRefinement.length > 0) {
      defaultRefinement.forEach((value) => refine(value));
    }
  }, [defaultRefinement, refine]);

  // Reset search when attribute changes
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
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={searchValue}
                onChange={handleSearch}
                className="pl-9 bg-background hover:bg-accent focus:bg-background"
                autoFocus
              />
              {searchValue && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={clearSearch}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Clear search</span>
                </Button>
              )}
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSearch(true)}
              className="w-full border-muted-foreground/20 text-muted-foreground hover:border-primary hover:text-primary"
            >
              <Search className="mr-2 h-4 w-4" />
              Search options
            </Button>
          )}
        </div>
      )}

      {visibleItems.length === 0 ? (
        <p className="text-sm text-muted-foreground">No options found</p>
      ) : (
        <div className="space-y-2">
          {visibleItems.map((item: RefinementItem) => (
            <div
              key={item.value}
              className="flex items-center justify-between rounded-md p-2 transition-colors hover:bg-accent"
            >
              <div className="flex items-center space-x-3">
                <Checkbox
                  id={`refinement-${item.value}`}
                  checked={item.isRefined}
                  onCheckedChange={() => handleRefine(item.value)}
                  className="border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                />
                <label
                  htmlFor={`refinement-${item.value}`}
                  className={cn(
                    "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                    item.isRefined && "font-semibold"
                  )}
                >
                  {item.label}
                </label>
              </div>
              <Badge
                variant={item.isRefined ? "default" : "outline"}
                className={cn(
                  item.isRefined
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "border-muted-foreground/20 text-muted-foreground"
                )}
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
            variant="link"
            size="sm"
            onClick={displayCount === 5 ? showMore : showLess}
            className="text-primary hover:text-primary/90"
          >
            {displayCount === 5 ? "Show more" : "Show less"}
          </Button>
        </div>
      )}
    </div>
  );
}

export default CustomRefinementList;
