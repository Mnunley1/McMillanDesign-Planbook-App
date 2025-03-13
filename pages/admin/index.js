import { Box, Button, Flex, HStack, Spacer } from "@chakra-ui/react";
import { useUser } from "@clerk/nextjs";
import algoliasearch from "algoliasearch/lite";
import Head from "next/head";
import { withRouter } from "next/router";
import { useEffect, useState } from "react";
import { InstantSearch, Stats } from "react-instantsearch";
import { createInstantSearchRouterNext } from "react-instantsearch-router-nextjs";
import CustomHits from "../../components/CustomHits";
import CustomPagination from "../../components/CustomPagination";
import CustomSortBy from "../../components/CustomSortBy";
import Layout from "../../components/Layout";
import MobileFilters from "../../components/MobileFilters";
import { ScrollTo } from "../../components/ScrollTo";
import Sidebar from "../../components/Sidebar";

const searchClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY
);

// Storage key for admin search state
const SEARCH_STATE_STORAGE_KEY = "planbook_admin_search_state";

function AdminDashboard({ router }) {
  const { user, isLoaded, isSignedIn } = useUser();
  const [showFilters, setShowFilters] = useState(false);
  const [initialUiState, setInitialUiState] = useState({
    floorPlans: {
      refinementList: {},
      range: {},
      menu: {},
      toggle: {},
      numericMenu: {},
    },
  });

  // Load saved search state on initial render
  useEffect(() => {
    try {
      const savedState = sessionStorage.getItem(SEARCH_STATE_STORAGE_KEY);
      if (savedState) {
        const { state, timestamp } = JSON.parse(savedState);

        // Only use saved state if it's less than 30 minutes old
        if (Date.now() - timestamp < 30 * 60 * 1000) {
          setInitialUiState(state);
        } else {
          // Clear expired state
          sessionStorage.removeItem(SEARCH_STATE_STORAGE_KEY);
        }
      }
    } catch (error) {
      console.error("Error restoring search state:", error);
    }
  }, []);

  const routing = {
    stateMapping: {
      stateToRoute(uiState) {
        const indexUiState = uiState.floorPlans || {};
        const route = {};

        // Handle pagination (preserve page number)
        route.page = !indexUiState.page ? 1 : indexUiState.page;

        // Handle refinement lists
        if (indexUiState.refinementList) {
          Object.entries(indexUiState.refinementList).forEach(
            ([key, values]) => {
              if (Array.isArray(values) && values.length > 0) {
                route[key] = values;
              }
            }
          );
        }

        // Handle numeric menu
        if (indexUiState.numericMenu) {
          Object.entries(indexUiState.numericMenu).forEach(([key, value]) => {
            if (value) {
              if (["sqft", "planDepth", "planWidth"].includes(key)) {
                // Handle both string and object formats
                if (typeof value === "object") {
                  route[key] = value;
                } else {
                  try {
                    route[key] = JSON.parse(value);
                  } catch (e) {
                    route[key] = value;
                  }
                }
              } else {
                route[key] = value;
              }
            }
          });
        }

        // Handle toggle refinements
        if (indexUiState.toggle) {
          Object.entries(indexUiState.toggle).forEach(([key, value]) => {
            if (value) {
              route[key] = value;
            }
          });
        }

        // Handle query
        if (indexUiState.query) {
          route.q = indexUiState.query;
        }

        // Save the current state to sessionStorage when navigating away
        try {
          sessionStorage.setItem(
            SEARCH_STATE_STORAGE_KEY,
            JSON.stringify({
              state: { floorPlans: indexUiState },
              timestamp: Date.now(),
            })
          );
        } catch (error) {
          console.error("Error saving search state:", error);
        }

        return Object.keys(route).reduce(
          (acc, key) =>
            route[key] === undefined || route[key] === "" || route[key] === null
              ? acc
              : { ...acc, [key]: route[key] },
          {}
        );
      },

      routeToState(routeState) {
        const refinementList = {};
        const numericMenu = {};
        const toggle = {};
        const state = {};

        // Handle page number separately to preserve it
        if (routeState.page) {
          state.page = Number(routeState.page);
        }

        Object.entries(routeState).forEach(([key, value]) => {
          if (value === undefined || key === "page") return;

          if (["sqft", "planDepth", "planWidth"].includes(key)) {
            if (!numericMenu[key]) {
              numericMenu[key] = value;
            }
          } else if (["bedrooms", "vehicleSpaces"].includes(key)) {
            numericMenu[key] = value;
          } else if (key === "q") {
            state.query = value;
          } else if (
            [
              "numberOfLevels",
              "planType",
              "garageOrientation",
              "primarySuite",
            ].includes(key)
          ) {
            refinementList[key] = Array.isArray(value) ? value : [value];
          } else if (["basement", "walkupAttic"].includes(key)) {
            toggle[key] = value === true || value === "true";
          }
        });

        return {
          floorPlans: {
            ...state,
            refinementList:
              Object.keys(refinementList).length > 0
                ? refinementList
                : undefined,
            numericMenu:
              Object.keys(numericMenu).length > 0 ? numericMenu : undefined,
            toggle: Object.keys(toggle).length > 0 ? toggle : undefined,
          },
        };
      },
    },
    router: createInstantSearchRouterNext({
      preservePageOnEmptyQuery: true,
      windowTitle({ routeState }) {
        const page = routeState.page || 1;
        return `Admin Dashboard - Page ${page}`;
      },
      serverUrl:
        typeof window !== "undefined"
          ? window.location.origin
          : "https://your-website.com",
      routerOptions: {
        shallow: true,
      },
      singletonRouter: router,
      cleanUrlOnDispose: true,
      writeDelay: 400,
    }),
  };

  // Role-based access control
  if (!isLoaded || !isSignedIn) {
    return (
      <Layout>
        <Box p={8} textAlign="center">
          {!isLoaded
            ? "Loading..."
            : "Please sign in to access the admin dashboard."}
        </Box>
      </Layout>
    );
  }

  // Check if user has admin role
  if (!user?.publicMetadata?.role || user.publicMetadata.role !== "admin") {
    return (
      <Layout>
        <Box p={8} textAlign="center">
          You do not have permission to access this page.
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>McMillan Design - Floor Plans Admin</title>
      </Head>

      <InstantSearch
        searchClient={searchClient}
        indexName="allPlans"
        routing={routing}
        initialUiState={initialUiState}
      >
        <Box
          display="flex"
          flexDirection={{ base: "column", md: "row" }}
          minH="calc(100vh - 4rem)"
          p={{ base: 4, md: 8 }}
          gap={8}
        >
          <Sidebar display={{ base: "none", md: "block" }} />
          <MobileFilters
            isOpen={showFilters}
            onClose={() => setShowFilters(false)}
          />

          <Box flex="1">
            <Flex
              mb={4}
              direction={{ base: "column", sm: "row" }}
              align={{ sm: "center" }}
              justify="space-between"
              gap={2}
              color="white"
            >
              <Stats
                translations={{
                  stats(nbHits) {
                    return `${nbHits.toLocaleString()} floor plans found`;
                  },
                }}
              />

              <Spacer display={{ base: "none", sm: "block" }} />

              <HStack spacing={4}>
                <Button
                  display={{ base: "inline-flex", md: "none" }}
                  onClick={() => setShowFilters(true)}
                  colorScheme="blue"
                  variant="outline"
                >
                  Filters
                </Button>
                <CustomSortBy
                  items={[
                    { label: "Default", value: "floorPlans" },
                    {
                      label: "Bedrooms (asc)",
                      value: "allPlans_bedrooms_asc",
                    },
                    {
                      label: "Bedrooms (desc)",
                      value: "allPlans_bedrooms_desc",
                    },
                    {
                      label: "Plan Width (asc)",
                      value: "allPlans_width_asc",
                    },
                    {
                      label: "Plan Width (desc)",
                      value: "allPlans_width_desc",
                    },
                    {
                      label: "Plan Depth (asc)",
                      value: "allPlans_depth_asc",
                    },
                    {
                      label: "Plan Depth (desc)",
                      value: "allPlans_depth_desc",
                    },
                  ]}
                />
              </HStack>
            </Flex>

            <CustomHits minH="calc(100vh - 16rem)" />
            <ScrollTo />
            <Box mt={8} mb={4}>
              <CustomPagination />
            </Box>
          </Box>
        </Box>
      </InstantSearch>
    </Layout>
  );
}

export default withRouter(AdminDashboard);
