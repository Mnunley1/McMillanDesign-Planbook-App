import { useUser } from "@clerk/clerk-react";
import { useMutation } from "convex/react";
import { Lightbulb, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { InstantSearch, useInstantSearch } from "react-instantsearch";
import { Outlet } from "react-router-dom";
import { searchClient } from "@/lib/algolia";
import type { SortItem } from "@/types/floor-plan";
import { api } from "../../convex/_generated/api";
import ActiveFilters from "./ActiveFilters";
import CustomHits from "./CustomHits";
import CustomNumericMenu from "./CustomNumericMenu";
import CustomPagination from "./CustomPagination";
import CustomRangeInput from "./CustomRangeInput";
import CustomRefinementList from "./CustomRefinementList";
import CustomSearchBox from "./CustomSearchBox";
import CustomSortBy from "./CustomSortBy";
import CustomToggleRefinement from "./CustomToggleRefinement";
import ListHits from "./ListHits";
import { MobileFilters } from "./MobileFilters";
import MobileSortButton from "./MobileSortButton";
import SavedSearches from "./SavedSearches";
import SaveSearchDialog from "./SaveSearchDialog";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Container } from "./ui/container";
import ViewToggle, { type ViewMode } from "./ViewToggle";

const ONBOARDING_KEY = "planbook-onboarding-dismissed";

function OnboardingBanner() {
  const [dismissed, setDismissed] = useState(() => {
    return localStorage.getItem(ONBOARDING_KEY) === "true";
  });

  if (dismissed) {
    return null;
  }

  return (
    <div className="mb-4 flex items-start gap-3 rounded-lg border border-primary/20 bg-primary/10 p-3">
      <Lightbulb className="mt-0.5 h-4 w-4 flex-none text-primary" />
      <p className="flex-1 text-foreground/80 text-sm">
        Tip: Use the heart icon to save favorites and the scale icon to compare
        plans side by side.
      </p>
      <button
        aria-label="Dismiss tip"
        className="flex-none text-muted-foreground transition-colors hover:text-foreground"
        onClick={() => {
          localStorage.setItem(ONBOARDING_KEY, "true");
          setDismissed(true);
        }}
        type="button"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

// Stats component to show hit count
function Stats() {
  const { results } = useInstantSearch();
  return (
    <div className="text-muted-foreground text-sm">
      {results
        ? `${results.nbHits.toLocaleString()} results found`
        : "Loading..."}
    </div>
  );
}

interface ResultsHeaderProps {
  baseIndex: string;
  sortItems: SortItem[];
}

interface ResultsHeaderFullProps extends ResultsHeaderProps {
  onViewModeChange: (mode: ViewMode) => void;
  viewMode: ViewMode;
}

// Results Header component
function ResultsHeader({
  baseIndex,
  sortItems,
  viewMode,
  onViewModeChange,
}: ResultsHeaderFullProps) {
  return (
    <div className="mb-4 flex flex-col justify-between gap-4 md:flex-row md:items-center">
      <div className="flex items-center justify-between gap-4 md:justify-start">
        <Stats />
        <div className="flex items-center gap-2 md:hidden">
          <MobileSortButton baseIndex={baseIndex} sortItems={sortItems} />
          <MobileFilters />
        </div>
      </div>
      <div className="hidden items-center gap-3 md:flex">
        <SavedSearches />
        <ViewToggle onChange={onViewModeChange} value={viewMode} />
        <CustomSortBy baseIndex={baseIndex} items={sortItems} />
      </div>
    </div>
  );
}

// Filters Card Component
function FiltersCard() {
  const { setIndexUiState } = useInstantSearch();

  const handleResetFilters = () => {
    setIndexUiState((uiState) => ({
      ...uiState,
      refinementList: {},
      range: {},
      toggle: {},
      numericMenu: {},
    }));
  };

  return (
    <Card className="col-span-3 self-start">
      <CardHeader className="flex flex-row items-center justify-between px-4">
        <h2 className="font-semibold text-lg">Filters</h2>
        <Button
          className="text-muted-foreground text-sm transition-colors hover:text-foreground"
          onClick={handleResetFilters}
          size="sm"
          variant="ghost"
        >
          Reset All
        </Button>
      </CardHeader>
      <div className="px-4 pb-2">
        <SaveSearchDialog />
      </div>
      <CardContent className="space-y-6 px-4">
        {/* Search */}
        <div className="w-full">
          <CustomSearchBox />
        </div>

        {/* Plan Details */}
        <fieldset className="space-y-4">
          <legend className="font-medium text-sm">Plan Details</legend>
          <div className="space-y-4">
            <div>
              <span
                className="mb-2 block text-muted-foreground text-sm"
                id="filter-plan-type"
              >
                Plan Type
              </span>
              <CustomRefinementList
                aria-labelledby="filter-plan-type"
                attribute="planType"
                searchable={false}
              />
            </div>
            <div>
              <span
                className="mb-2 block text-muted-foreground text-sm"
                id="filter-levels"
              >
                Number of Levels
              </span>
              <CustomRefinementList
                aria-labelledby="filter-levels"
                attribute="numberOfLevels"
                searchable={false}
              />
            </div>
            <div>
              <span
                className="mb-2 block text-muted-foreground text-sm"
                id="filter-primary-suite"
              >
                Primary Suite
              </span>
              <CustomRefinementList
                aria-labelledby="filter-primary-suite"
                attribute="primarySuite"
                searchable={false}
              />
            </div>
          </div>
        </fieldset>

        {/* Dimensions */}
        <fieldset className="space-y-4">
          <legend className="font-medium text-sm">Dimensions</legend>
          <div className="space-y-4">
            <div>
              <span
                className="mb-2 block text-muted-foreground text-sm"
                id="filter-sqft"
              >
                Square Feet
              </span>
              <CustomRangeInput
                aria-labelledby="filter-sqft"
                attribute="sqft"
                max={20_000}
                min={10}
              />
            </div>
            <div>
              <span
                className="mb-2 block text-muted-foreground text-sm"
                id="filter-width"
              >
                Plan Width (ft)
              </span>
              <CustomRangeInput
                aria-labelledby="filter-width"
                attribute="planWidth"
                max={100}
                min={20}
              />
            </div>
            <div>
              <span
                className="mb-2 block text-muted-foreground text-sm"
                id="filter-depth"
              >
                Plan Depth (ft)
              </span>
              <CustomRangeInput
                aria-labelledby="filter-depth"
                attribute="planDepth"
                max={100}
                min={20}
              />
            </div>
          </div>
        </fieldset>

        {/* Rooms */}
        <fieldset className="space-y-4">
          <legend className="font-medium text-sm">Rooms</legend>
          <div className="space-y-4">
            <div>
              <span
                className="mb-2 block text-muted-foreground text-sm"
                id="filter-bedrooms"
              >
                Bedrooms
              </span>
              <CustomNumericMenu
                aria-labelledby="filter-bedrooms"
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
                id="filter-vehicle"
              >
                Vehicle Spaces
              </span>
              <CustomNumericMenu
                aria-labelledby="filter-vehicle"
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
        </fieldset>

        {/* Features */}
        <fieldset className="space-y-4">
          <legend className="font-medium text-sm">Features</legend>
          <div className="space-y-2">
            <CustomToggleRefinement attribute="basement" label="Basement" />
            <CustomToggleRefinement
              attribute="walkupAttic"
              label="Walk-up Attic"
            />
          </div>
        </fieldset>

        {/* Garage */}
        <fieldset className="space-y-4">
          <legend className="font-medium text-sm">Garage</legend>
          <div>
            <span
              className="mb-2 block text-muted-foreground text-sm"
              id="filter-garage"
            >
              Garage Orientation
            </span>
            <CustomRefinementList
              aria-labelledby="filter-garage"
              attribute="garageOrientation"
              searchable={false}
            />
          </div>
        </fieldset>
      </CardContent>
    </Card>
  );
}

// Scrolls the most recently clicked plan card back into view when the user
// returns to the search page from a plan detail.
function ScrollRestorer() {
  const { status, results } = useInstantSearch();
  const attemptedRef = useRef(false);

  useEffect(() => {
    if (attemptedRef.current) {
      return;
    }
    if (status !== "idle" || !results || results.hits.length === 0) {
      return;
    }
    const planId = sessionStorage.getItem("pendingScrollToPlan");
    if (!planId) {
      return;
    }

    attemptedRef.current = true;
    sessionStorage.removeItem("pendingScrollToPlan");

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const el = document.getElementById(planId);
        if (el) {
          el.scrollIntoView({ block: "center", behavior: "auto" });
        }
      });
    });
  }, [status, results]);

  return null;
}

function SearchEventTracker() {
  const { indexUiState, results } = useInstantSearch();
  const { user } = useUser();
  const trackSearch = useMutation(api.searchEvents.track);
  const trackSearchRef = useRef(trackSearch);
  trackSearchRef.current = trackSearch;
  const prevStateRef = useRef<string>("");
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  // Store latest values in refs so the debounced callback always reads current data
  const latestRef = useRef({ indexUiState, results, userId: user?.id });
  latestRef.current = { indexUiState, results, userId: user?.id };

  // Debounce: reset timer on every state change, fire after 2s of inactivity
  const stateKey = JSON.stringify(indexUiState);

  // biome-ignore lint/correctness/useExhaustiveDependencies: stateKey is intentionally used as the trigger for this debounced effect
  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      const { indexUiState: uiState, results: res, userId } = latestRef.current;
      if (!(userId && res)) {
        return;
      }

      const key = JSON.stringify(uiState);
      if (key === prevStateRef.current) {
        return;
      }
      prevStateRef.current = key;

      trackSearchRef.current({
        userId,
        query: uiState.query ?? "",
        filters: JSON.stringify({
          refinementList: uiState.refinementList,
          range: uiState.range,
          toggle: uiState.toggle,
          numericMenu: uiState.numericMenu,
        }),
        resultsCount: res.nbHits,
      });
    }, 2000);
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [stateKey]);

  return null;
}

interface PlanSearchProps {
  indexName: string;
  sortItems: SortItem[];
}

export default function PlanSearch({ indexName, sortItems }: PlanSearchProps) {
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    return (localStorage.getItem("planbook-view-mode") as ViewMode) || "grid";
  });

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    localStorage.setItem("planbook-view-mode", mode);
  };

  return (
    <InstantSearch
      future={{
        preserveSharedStateOnUnmount: true,
      }}
      indexName={indexName}
      routing={true}
      searchClient={searchClient}
      stalledSearchDelay={500}
    >
      <SearchEventTracker />
      <ScrollRestorer />
      <Container className="max-w-full">
        <div className="py-6">
          {/* Main Content Grid */}
          <div className="grid grid-cols-12 gap-6">
            {/* Mobile Search — sticky */}
            <div className="sticky top-0 z-40 col-span-12 bg-background pb-2 md:hidden">
              <div className="w-full">
                <CustomSearchBox />
              </div>
            </div>

            {/* Desktop Filters */}
            <div className="hidden md:col-span-3 md:block">
              <FiltersCard />
            </div>

            {/* Results Section */}
            <div className="col-span-12 md:col-span-9">
              <div className="space-y-6">
                <OnboardingBanner />
                <ResultsHeader
                  baseIndex={indexName}
                  onViewModeChange={handleViewModeChange}
                  sortItems={sortItems}
                  viewMode={viewMode}
                />
                <ActiveFilters />
                {viewMode === "grid" ? <CustomHits /> : <ListHits />}
                {/* Pagination */}
                <div className="flex justify-center pb-6">
                  <CustomPagination />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
      <Outlet />
    </InstantSearch>
  );
}
