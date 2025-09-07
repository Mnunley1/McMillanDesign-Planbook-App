import CustomNumericMenu from "@/components/CustomNumericMenu";
import CustomPagination from "@/components/CustomPagination";
import CustomRangeInput from "@/components/CustomRangeInput";
import CustomRefinementList from "@/components/CustomRefinementList";
import CustomSearchBox from "@/components/CustomSearchBox";
import CustomSortBy from "@/components/CustomSortBy";
import CustomToggleRefinement from "@/components/CustomToggleRefinement";
import FloorPlanCard from "@/components/FloorPlanCard";
import { MobileFilters } from "@/components/MobileFilters";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import algoliasearch, { SearchClient } from "algoliasearch";
import { InstantSearch, useHits, useInstantSearch } from "react-instantsearch";
import { Outlet } from "react-router-dom";

// Initialize Algolia client with configuration
const searchClient: SearchClient = algoliasearch(
  import.meta.env.VITE_ALGOLIA_APP_ID,
  import.meta.env.VITE_ALGOLIA_SEARCH_API_KEY
);

interface FloorPlanHit {
  objectID: string;
  image?: string;
  planNumber: string;
  description: string;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  createdAt?: string; // ISO date string for when the plan was created
}

// Stats component to show hit count
function Stats() {
  const { results } = useInstantSearch();
  return (
    <div className="text-sm text-muted-foreground">
      {results?.nbHits.toLocaleString()} results found
    </div>
  );
}

// Custom Hits component to handle grid layout
function GridHits() {
  const { hits } = useHits<FloorPlanHit>();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {hits.map((hit) => (
        <div key={hit.objectID} className="h-full">
          <FloorPlanCard hit={hit} />
        </div>
      ))}
    </div>
  );
}

// Results Header component
function ResultsHeader() {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
      <div className="flex items-center justify-between md:justify-start gap-4">
        <Stats />
        <div className="md:hidden">
          <MobileFilters>
            <FiltersCard />
          </MobileFilters>
        </div>
      </div>
      <div className="hidden md:block">
        <CustomSortBy
          items={[
            { label: "Default", value: "floorPlans" },
            {
              label: "Newest",
              value: "floorPlans_dateAdded_desc",
            },
            {
              label: "Bedrooms (asc)",
              value: "floorPlans_bedrooms_asc",
            },
            {
              label: "Bedrooms (desc)",
              value: "floorPlans_bedrooms_desc",
            },
            {
              label: "Plan Width (asc)",
              value: "floorPlans_width_asc",
            },
            {
              label: "Plan Width (desc)",
              value: "floorPlans_width_desc",
            },
            {
              label: "Plan Depth (asc)",
              value: "floorPlans_depth_asc",
            },
            {
              label: "Plan Depth (desc)",
              value: "floorPlans_depth_desc",
            },
          ]}
        />
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
      <CardHeader className="px-4 flex flex-row items-center justify-between">
        <h2 className="text-lg font-semibold">Filters</h2>
        <button
          onClick={handleResetFilters}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Reset All
        </button>
      </CardHeader>
      <CardContent className="px-4 space-y-6">
        {/* Search */}
        <div className="w-full">
          <CustomSearchBox />
        </div>

        {/* Plan Details */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Plan Details</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">
                Plan Type
              </label>
              <CustomRefinementList attribute="planType" searchable={false} />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">
                Number of Levels
              </label>
              <CustomRefinementList
                attribute="numberOfLevels"
                searchable={false}
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">
                Primary Suite
              </label>
              <CustomRefinementList
                attribute="primarySuite"
                searchable={false}
              />
            </div>
          </div>
        </div>

        {/* Dimensions */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Dimensions</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">
                Square Feet
              </label>
              <CustomRangeInput attribute="sqft" min={10} max={20000} />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">
                Plan Width (ft)
              </label>
              <CustomRangeInput attribute="planWidth" min={20} max={100} />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">
                Plan Depth (ft)
              </label>
              <CustomRangeInput attribute="planDepth" min={20} max={100} />
            </div>
          </div>
        </div>

        {/* Rooms */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Rooms</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">
                Bedrooms
              </label>
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
              <label className="text-sm text-muted-foreground mb-2 block">
                Vehicle Spaces
              </label>
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
        </div>

        {/* Features */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Features</h3>
          <div className="space-y-2">
            <CustomToggleRefinement attribute="basement" label="Basement" />
            <CustomToggleRefinement
              attribute="walkupAttic"
              label="Walk-up Attic"
            />
          </div>
        </div>

        {/* Garage */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Garage</h3>
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">
              Garage Orientation
            </label>
            <CustomRefinementList
              attribute="garageOrientation"
              searchable={false}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function Home() {
  return (
    <>
      <InstantSearch
        searchClient={searchClient}
        indexName="floorPlans"
        routing={true}
        stalledSearchDelay={500}
        future={{
          preserveSharedStateOnUnmount: true,
        }}
      >
        <Container className="max-w-full">
          <div className="py-6">
            {/* Main Content Grid */}
            <div className="grid grid-cols-12 gap-6">
              {/* Mobile Search */}
              <div className="col-span-12 md:hidden">
                <div className="w-full mb-4">
                  <CustomSearchBox />
                </div>
              </div>

              {/* Desktop Filters */}
              <div className="hidden md:block md:col-span-3">
                <FiltersCard />
              </div>

              {/* Results Section */}
              <div className="col-span-12 md:col-span-9">
                {/* Results Grid */}
                <div className="space-y-6">
                  <ResultsHeader />
                  <GridHits />
                  {/* Pagination */}
                  <div className="flex justify-center pb-6">
                    <CustomPagination />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </InstantSearch>
      <Outlet />
    </>
  );
}

export default Home;
