import {
  Box,
  Button,
  Flex,
  HStack,
  SimpleGrid,
  Spacer,
} from "@chakra-ui/react";
import algoliasearch from "algoliasearch/lite";
import Head from "next/head";
import { withRouter } from "next/router";
import { useState } from "react";
import { InstantSearch, Stats } from "react-instantsearch";
import { createInstantSearchRouterNext } from "react-instantsearch-router-nextjs";
import CustomHits from "../components/CustomHits";
import CustomPagination from "../components/CustomPagination";
import CustomSortBy from "../components/CustomSortBy";
import Layout from "../components/Layout";
import MobileFilters from "../components/MobileFilters";
import Sidebar from "../components/Sidebar";

const searchClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY
);

function Home({ router }) {
  const [showFilters, setShowFilters] = useState(false);

  const routing = {
    stateMapping: {
      stateToRoute(uiState) {
        const indexUiState = uiState.floorPlans || {};
        const route = {};

        // Handle refinement lists
        if (indexUiState.refinementList) {
          Object.entries(indexUiState.refinementList).forEach(([key, values]) => {
            if (Array.isArray(values) && values.length > 0) {
              route[key] = values;
            }
          });
        }

        // Handle range refinements
        if (indexUiState.range) {
          Object.entries(indexUiState.range).forEach(([key, value]) => {
            if (value.min !== undefined || value.max !== undefined) {
              route[key] = `${value.min || ""}-${value.max || ""}`;
            }
          });
        }

        // Handle numeric menu
        if (indexUiState.numericMenu) {
          Object.entries(indexUiState.numericMenu).forEach(([key, value]) => {
            route[key] = value;
          });
        }

        // Handle toggle refinements
        if (indexUiState.toggle) {
          Object.entries(indexUiState.toggle).forEach(([key, value]) => {
            route[key] = value;
          });
        }

        return Object.fromEntries(
          Object.entries(route).filter(([_, value]) => 
            value !== undefined && 
            value !== null &&
            !(Array.isArray(value) && value.length === 0)
          )
        );
      },

      routeToState(routeState) {
        const refinementList = {};
        const range = {};
        const toggle = {};
        const numericMenu = {};

        Object.entries(routeState).forEach(([key, value]) => {
          if (value === undefined) return;

          if (typeof value === "string" && value.includes("-")) {
            const [min, max] = value.split("-");
            range[key] = {
              min: min ? Number(min) : undefined,
              max: max ? Number(max) : undefined,
            };
          } else if (
            ["numberOfLevels", "planType", "garageOrientation", "primarySuite"].includes(key)
          ) {
            refinementList[key] = Array.isArray(value) ? value : [value];
          } else if (["bedrooms", "vehicleSpaces"].includes(key)) {
            numericMenu[key] = value;
          } else if (["basement", "walkupAttic"].includes(key)) {
            toggle[key] = value === true || value === "true";
          } else if (["price", "size"].includes(key)) {
            numericMenu[key] = value;
          }
        });

        return {
          floorPlans: {
            refinementList: Object.keys(refinementList).length > 0 ? refinementList : undefined,
            range: Object.keys(range).length > 0 ? range : undefined,
            toggle: Object.keys(toggle).length > 0 ? toggle : undefined,
            numericMenu: Object.keys(numericMenu).length > 0 ? numericMenu : undefined,
          },
        };
      },
    },
    router: createInstantSearchRouterNext({
      serverUrl: typeof window !== "undefined" ? window.location.origin : "https://your-website.com",
      routerOptions: {
        shallow: true,
      },
      singletonRouter: router,
      cleanUrlOnDispose: true,
      writeDelay: 400,
      parseURL: ({ qsModule, location }) => {
        const queryString = location.search || "";
        const parsed = qsModule.parse(queryString.slice(1), {
          arrayFormat: "comma",
          comma: true,
          parseBooleans: true
        });

        // Handle arrays and toggle values
        Object.entries(parsed).forEach(([key, value]) => {
          if (typeof value === "string") {
            if (value.includes(",")) {
              parsed[key] = value.split(",");
            } else if (["basement", "walkupAttic"].includes(key)) {
              parsed[key] = value === "true";
            }
          }
        });

        return parsed;
      },
      createURL: ({ qsModule, routeState, location }) => {
        const processedState = Object.fromEntries(
          Object.entries(routeState).map(([key, value]) => {
            if (Array.isArray(value)) {
              return [key, value.join(",")];
            }
            return [key, value];
          })
        );

        const baseUrl = location.origin + location.pathname;
        const queryString = qsModule.stringify(processedState, {
          arrayFormat: "comma",
          encode: true,
          skipNulls: true
        });
        return queryString ? `${baseUrl}?${queryString}` : baseUrl;
      }
    }),
  };

  const displayFilters = () => {
    setShowFilters(true);
  };

  const hideFilters = () => {
    setShowFilters(false);
  };

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <InstantSearch
        searchClient={searchClient}
        indexName="floorPlans"
        routing={routing}
        stalledSearchDelay={500}
        initialUiState={{
          floorPlans: {
            refinementList: {},
            range: {},
            menu: {},
            toggle: {},
            numericMenu: {},
          },
        }}
      >
        <Layout>
          <Flex overflowX="hidden">
            <Box
              bgColor="#1e1e1e"
              minWidth="30%"
              height="100%"
              p="5"
              m="5"
              borderRadius="lg"
              display={["none", "none", "block"]}
            >
              <Sidebar />
            </Box>
            <Box w="100%" h="100%" p={5}>
              <HStack mb="5" color="white">
                <Stats
                  translations={{
                    stats(nbHits) {
                      return `${nbHits} results found`;
                    },
                  }}
                />

                <Spacer />
                <Button
                  onClick={displayFilters}
                  display={["block", "block", "none"]}
                  variant="link"
                  colorScheme="yellow"
                >
                  Filters
                </Button>
                <CustomSortBy
                  items={[
                    { label: "Default", value: "floorPlans" },
                    {
                      label: "Bedrooms (asc)",
                      value: "bedrooms_asc",
                    },
                    {
                      label: "Bedrooms (desc)",
                      value: "bedrooms_desc",
                    },
                    {
                      label: "Plan Width (asc)",
                      value: "width_asc",
                    },
                    {
                      label: "Plan Width (desc)",
                      value: "width_desc",
                    },
                    {
                      label: "Plan Depth (asc)",
                      value: "depth_asc",
                    },
                    {
                      label: "Plan Depth (desc)",
                      value: "depth_desc",
                    },
                  ]}
                />
              </HStack>
              <SimpleGrid columns={[1, 1, 1, 2]} spacing={5}>
                <CustomHits />
              </SimpleGrid>
              <CustomPagination padding={2} />
            </Box>
            <MobileFilters
              onClick={hideFilters}
              setDisplay={setShowFilters}
              filters={showFilters}
            />
          </Flex>
        </Layout>
      </InstantSearch>
    </>
  );
}

export default withRouter(Home);
