import FocusTrap from "focus-trap-react";
import { FilterIcon, SearchIcon, XIcon } from "lucide-react";
import * as React from "react";
import { createPortal } from "react-dom";
import { useInstantSearch } from "react-instantsearch";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import CustomNumericMenu from "./CustomNumericMenu";
import CustomRangeInput from "./CustomRangeInput";
import CustomRefinementList from "./CustomRefinementList";
import CustomToggleRefinement from "./CustomToggleRefinement";

// Separate component for filter content to ensure it stays mounted
const FilterContent = React.memo(function FilterContent() {
  return (
    <Accordion
      className="w-full"
      defaultValue={["plan-details", "dimensions"]}
      type="multiple"
    >
      {/* Plan Details */}
      <AccordionItem value="plan-details">
        <AccordionTrigger>Plan Details</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-4">
            <div>
              <span
                className="mb-2 block text-muted-foreground text-sm"
                id="mobile-filter-plan-type"
              >
                Plan Type
              </span>
              <CustomRefinementList attribute="planType" searchable={false} />
            </div>
            <div>
              <span
                className="mb-2 block text-muted-foreground text-sm"
                id="mobile-filter-levels"
              >
                Number of Levels
              </span>
              <CustomRefinementList
                attribute="numberOfLevels"
                searchable={false}
              />
            </div>
            <div>
              <span
                className="mb-2 block text-muted-foreground text-sm"
                id="mobile-filter-suite"
              >
                Primary Suite
              </span>
              <CustomRefinementList
                attribute="primarySuite"
                searchable={false}
              />
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* Dimensions */}
      <AccordionItem value="dimensions">
        <AccordionTrigger>Dimensions</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-4">
            <div>
              <span
                className="mb-2 block text-muted-foreground text-sm"
                id="mobile-filter-sqft"
              >
                Square Feet
              </span>
              <CustomRangeInput attribute="sqft" max={20_000} min={10} />
            </div>
            <div>
              <span
                className="mb-2 block text-muted-foreground text-sm"
                id="mobile-filter-width"
              >
                Plan Width (ft)
              </span>
              <CustomRangeInput attribute="planWidth" max={100} min={20} />
            </div>
            <div>
              <span
                className="mb-2 block text-muted-foreground text-sm"
                id="mobile-filter-depth"
              >
                Plan Depth (ft)
              </span>
              <CustomRangeInput attribute="planDepth" max={100} min={20} />
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* Rooms */}
      <AccordionItem value="rooms">
        <AccordionTrigger>Rooms</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-4">
            <div>
              <span
                className="mb-2 block text-muted-foreground text-sm"
                id="mobile-filter-bedrooms"
              >
                Bedrooms
              </span>
              <CustomNumericMenu
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
              <span
                className="mb-2 block text-muted-foreground text-sm"
                id="mobile-filter-vehicle"
              >
                Vehicle Spaces
              </span>
              <CustomNumericMenu
                attribute="vehicleSpaces"
                items={[
                  { label: "All", value: "" },
                  { label: "1+", value: "1", start: 1 },
                  { label: "2+", value: "2", start: 2 },
                  { label: "3+", value: "3", start: 3 },
                ]}
              />
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* Features */}
      <AccordionItem value="features">
        <AccordionTrigger>Features</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-2">
            <CustomToggleRefinement attribute="basement" label="Basement" />
            <CustomToggleRefinement
              attribute="walkupAttic"
              label="Walk-up Attic"
            />
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* Garage */}
      <AccordionItem value="garage">
        <AccordionTrigger>Garage</AccordionTrigger>
        <AccordionContent>
          <div>
            <span
              className="mb-2 block text-muted-foreground text-sm"
              id="mobile-filter-garage"
            >
              Garage Orientation
            </span>
            <CustomRefinementList
              attribute="garageOrientation"
              searchable={false}
            />
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
});

export function MobileFilters() {
  const { indexUiState, setIndexUiState } = useInstantSearch();
  const [open, setOpen] = React.useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [mounted, setMounted] = React.useState(false);
  const portalRef = React.useRef<HTMLDivElement>(null);

  // Ensure we only render the portal on the client side
  React.useEffect(() => {
    setMounted(true);
    return () => {
      setMounted(false);
      setOpen(false);
    };
  }, []);

  // Handle click outside and escape key to close the filters
  React.useEffect(() => {
    if (!(mounted && open)) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (
        portalRef.current &&
        !portalRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [mounted, open]);

  const handleClose = React.useCallback(() => {
    setOpen(false);
  }, []);

  // Active filters count
  const activeFiltersCount = React.useMemo(() => {
    let count = 0;
    const { refinementList, range, toggle, numericMenu } = indexUiState;

    if (refinementList) {
      for (const refinements of Object.values(refinementList)) {
        if (Array.isArray(refinements) && refinements.length > 0) {
          count += refinements.length;
        }
      }
    }

    if (range) {
      for (const r of Object.values(range)) {
        if (r && typeof r === "string" && r.includes(":")) {
          count += 1;
        } else if (r && typeof r === "object" && ("min" in r || "max" in r)) {
          count += 1;
        }
      }
    }

    if (toggle) {
      count += Object.values(toggle).filter(Boolean).length;
    }

    if (numericMenu) {
      count += Object.keys(numericMenu).length;
    }

    return count;
  }, [indexUiState]);

  // Debounce state updates — properly extracted, no nested hooks
  const debouncedSetIndexUiState = React.useMemo(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    return (updater: Parameters<typeof setIndexUiState>[0]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIndexUiState(updater);
      }, 100);
    };
  }, [setIndexUiState]);

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
    return null;
  }

  // Create a portal for the filter content
  const filterPortal = mounted ? (
    <FocusTrap active={open} focusTrapOptions={{ allowOutsideClick: true }}>
      <div
        aria-label="Filters"
        aria-modal="true"
        className={cn(
          "fixed inset-0 z-50",
          "bg-background/80 backdrop-blur-sm",
          "transition-colors duration-200",
          !open && "hidden"
        )}
        data-state={open ? "open" : "closed"}
        ref={portalRef}
        role="dialog"
      >
        <div
          className={cn(
            "fixed top-0 right-0 h-full w-full sm:max-w-md",
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
                <div className="flex items-center gap-2 p-4 font-semibold text-lg">
                  <FilterIcon className="h-5 w-5" />
                  Filters
                  {activeFiltersCount > 0 && (
                    <Badge
                      className="rounded-sm px-1 font-normal"
                      variant="secondary"
                    >
                      {activeFiltersCount}
                    </Badge>
                  )}
                </div>
                <Button
                  aria-label="Close filters"
                  className="h-8 w-8"
                  onClick={handleClose}
                  size="icon"
                  variant="ghost"
                >
                  <XIcon className="h-4 w-4" />
                </Button>
              </div>
              <Separator />
            </div>

            {/* Scrollable Content */}
            <div className="min-h-0 flex-1">
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
                    className="flex-1"
                    onClick={handleReset}
                    variant="outline"
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
    </FocusTrap>
  ) : null;

  return (
    <div className="md:hidden">
      <Button
        aria-expanded={open}
        className="w-full"
        onClick={() => setOpen(true)}
        size="sm"
        variant="outline"
      >
        <FilterIcon className="mr-2 h-4 w-4" />
        Filters
        {activeFiltersCount > 0 && (
          <Badge
            className="ml-2 rounded-sm px-1 font-normal"
            variant="secondary"
          >
            {activeFiltersCount}
          </Badge>
        )}
      </Button>
      {mounted && createPortal(filterPortal, document.body)}
    </div>
  );
}
