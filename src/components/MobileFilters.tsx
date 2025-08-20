import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { FilterIcon, SearchIcon, XIcon } from "lucide-react";
import * as React from "react";
import { createPortal } from "react-dom";
import { useInstantSearch } from "react-instantsearch";
import CustomNumericMenu from "./CustomNumericMenu";
import CustomRangeInput from "./CustomRangeInput";
import CustomRefinementList from "./CustomRefinementList";
import CustomSortBy from "./CustomSortBy";
import CustomToggleRefinement from "./CustomToggleRefinement";

// Memoize filter sections to prevent unnecessary re-renders
const FilterSection = React.memo(function FilterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">{title}</h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
});

// Memoize individual filter components
const MemoizedCustomRefinementList = React.memo(CustomRefinementList);
const MemoizedCustomRangeInput = React.memo(CustomRangeInput);
const MemoizedCustomNumericMenu = React.memo(CustomNumericMenu);
const MemoizedCustomToggleRefinement = React.memo(CustomToggleRefinement);
const MemoizedCustomSortBy = React.memo(CustomSortBy);

interface MobileFiltersProps {
  children?: React.ReactNode;
  className?: string;
}

// Separate component for filter content to ensure it stays mounted
const FilterContent = React.memo(function FilterContent() {
  return (
    <div className="space-y-6">
      {/* Sort */}
      <div className="space-y-4">
        <div>
          <label className="text-sm text-muted-foreground mb-2 block">
            Sort By
          </label>
          <MemoizedCustomSortBy
            items={[
              { label: "Default", value: "allPlans" },
              { label: "Bedrooms (asc)", value: "allPlans_bedrooms_asc" },
              { label: "Bedrooms (desc)", value: "allPlans_bedrooms_desc" },
              { label: "Plan Width (asc)", value: "allPlans_width_asc" },
              { label: "Plan Width (desc)", value: "allPlans_width_desc" },
              { label: "Plan Depth (asc)", value: "allPlans_depth_asc" },
              { label: "Plan Depth (desc)", value: "allPlans_depth_desc" },
            ]}
            className="w-full"
          />
        </div>
      </div>

      {/* Plan Details */}
      <FilterSection title="Plan Details">
        <div>
          <label className="text-sm text-muted-foreground mb-2 block">
            Plan Type
          </label>
          <MemoizedCustomRefinementList
            attribute="planType"
            searchable={false}
          />
        </div>
        <div>
          <label className="text-sm text-muted-foreground mb-2 block">
            Number of Levels
          </label>
          <MemoizedCustomRefinementList
            attribute="numberOfLevels"
            searchable={false}
          />
        </div>
        <div>
          <label className="text-sm text-muted-foreground mb-2 block">
            Primary Suite
          </label>
          <MemoizedCustomRefinementList
            attribute="primarySuite"
            searchable={false}
          />
        </div>
      </FilterSection>

      {/* Dimensions */}
      <FilterSection title="Dimensions">
        <div>
          <label className="text-sm text-muted-foreground mb-2 block">
            Square Feet
          </label>
          <MemoizedCustomRangeInput attribute="sqft" min={10} max={20000} />
        </div>
        <div>
          <label className="text-sm text-muted-foreground mb-2 block">
            Plan Width (ft)
          </label>
          <MemoizedCustomRangeInput attribute="planWidth" min={20} max={100} />
        </div>
        <div>
          <label className="text-sm text-muted-foreground mb-2 block">
            Plan Depth (ft)
          </label>
          <MemoizedCustomRangeInput attribute="planDepth" min={20} max={100} />
        </div>
      </FilterSection>

      {/* Rooms */}
      <FilterSection title="Rooms">
        <div>
          <label className="text-sm text-muted-foreground mb-2 block">
            Bedrooms
          </label>
          <MemoizedCustomNumericMenu
            attribute="bedrooms"
            items={[
              { label: "All", value: "" },
              { label: "1+", value: "1", start: 1 },
              { label: "2+", value: "2", start: 2 },
              { label: "3+", value: "3", start: 3 },
              { label: "4+", value: "4", start: 4 },
              { label: "5+", value: "5", start: 5 },
            ]}
          />
        </div>
        <div>
          <label className="text-sm text-muted-foreground mb-2 block">
            Vehicle Spaces
          </label>
          <MemoizedCustomNumericMenu
            attribute="vehicleSpaces"
            items={[
              { label: "All", value: "" },
              { label: "1+", value: "1", start: 1 },
              { label: "2+", value: "2", start: 2 },
              { label: "3+", value: "3", start: 3 },
            ]}
          />
        </div>
      </FilterSection>

      {/* Features */}
      <FilterSection title="Features">
        <div className="space-y-2">
          <MemoizedCustomToggleRefinement
            attribute="basement"
            label="Basement"
          />
          <MemoizedCustomToggleRefinement
            attribute="walkupAttic"
            label="Walk-up Attic"
          />
        </div>
      </FilterSection>

      {/* Garage */}
      <FilterSection title="Garage">
        <div>
          <label className="text-sm text-muted-foreground mb-2 block">
            Garage Orientation
          </label>
          <MemoizedCustomRefinementList
            attribute="garageOrientation"
            searchable={false}
          />
        </div>
      </FilterSection>
    </div>
  );
});

export function MobileFilters({ children, className }: MobileFiltersProps) {
  const { indexUiState, setIndexUiState } = useInstantSearch();
  const [open, setOpen] = React.useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [mounted, setMounted] = React.useState(false);
  const portalRef = React.useRef<HTMLDivElement>(null);

  // Ensure we only render the portal on the client side and handle cleanup
  React.useEffect(() => {
    setMounted(true);
    return () => {
      setMounted(false);
      setOpen(false);
    };
  }, []);

  // Handle click outside to close the filters
  React.useEffect(() => {
    if (!mounted || !open) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        portalRef.current &&
        !portalRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mounted, open]);

  // Preserve filter state when closing the mobile filters
  const handleClose = React.useCallback(() => {
    setOpen(false);
  }, []);

  // Use useMemo for activeFiltersCount calculation
  const activeFiltersCount = React.useMemo(() => {
    let count = 0;
    const { refinementList, range, toggle, numericMenu } = indexUiState;

    if (refinementList) {
      Object.values(refinementList).forEach((refinements) => {
        if (Array.isArray(refinements) && refinements.length > 0) {
          count += refinements.length;
        }
      });
    }

    if (range) {
      Object.values(range).forEach((r) => {
        if (r && typeof r === "object" && ("min" in r || "max" in r)) {
          count += 1;
        }
      });
    }

    if (toggle) {
      count += Object.values(toggle).filter(Boolean).length;
    }

    if (numericMenu) {
      count += Object.keys(numericMenu).length;
    }

    return count;
  }, [indexUiState]);

  // Debounce state updates
  const debouncedSetIndexUiState = React.useCallback(
    React.useMemo(() => {
      let timeoutId: NodeJS.Timeout;
      return (updater: (uiState: any) => any) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          setIndexUiState(updater);
        }, 100);
      };
    }, [setIndexUiState]),
    [setIndexUiState]
  );

  const handleReset = React.useCallback(() => {
    debouncedSetIndexUiState((uiState) => ({
      ...uiState,
      refinementList: {},
      range: {},
      toggle: {},
      numericMenu: {},
    }));
  }, [debouncedSetIndexUiState]);

  if (!isMobile) {
    return <div className={cn("hidden md:block", className)}>{children}</div>;
  }

  // Create a portal for the filter content to keep it mounted
  const filterPortal = mounted ? (
    <div
      ref={portalRef}
      className={cn(
        "fixed inset-0 z-50",
        "pointer-events-none",
        "data-[state=open]:pointer-events-auto",
        "data-[state=open]:bg-background/80",
        "data-[state=open]:backdrop-blur-sm",
        "transition-colors duration-200",
        !open && "hidden"
      )}
      data-state={open ? "open" : "closed"}
    >
      <div
        className={cn(
          "fixed right-0 top-0 h-full w-full sm:max-w-md",
          "translate-x-0 data-[state=closed]:translate-x-full",
          "transition-transform duration-200",
          "rounded-none border-l bg-background",
          "p-0",
          "max-h-[100dvh]",
          "overflow-hidden"
        )}
        data-state={open ? "open" : "closed"}
      >
        <div className="flex h-full flex-col">
          {/* Header - Fixed */}
          <div className="flex-none border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center p-4 gap-2 text-lg font-semibold">
                <FilterIcon className="h-5 w-5" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal"
                  >
                    {activeFiltersCount}
                  </Badge>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClose}
                className="h-8 w-8"
              >
                <XIcon className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </div>
            <Separator />
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 min-h-0">
            <ScrollArea className="h-full">
              <div className="space-y-6 p-4">
                <FilterContent />
              </div>
            </ScrollArea>
          </div>

          {/* Footer - Fixed */}
          <div className="flex-none border-t bg-background p-4">
            <div className="flex gap-2">
              {activeFiltersCount > 0 && (
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleReset}
                >
                  Reset All
                </Button>
              )}
              <Button className="flex-1" onClick={handleClose}>
                <SearchIcon className="mr-2 h-4 w-4" />
                Close Filters
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <div className="md:hidden">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        className="w-full"
      >
        <FilterIcon className="mr-2 h-4 w-4" />
        Filters
        {activeFiltersCount > 0 && (
          <Badge
            variant="secondary"
            className="ml-2 rounded-sm px-1 font-normal"
          >
            {activeFiltersCount}
          </Badge>
        )}
      </Button>
      {mounted && createPortal(filterPortal, document.body)}
    </div>
  );
}
