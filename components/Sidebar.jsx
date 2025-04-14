import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Badge,
  Box,
  Button,
  Flex,
  HStack,
  Heading,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FiFilter } from "react-icons/fi";
import { useClearRefinements, useInstantSearch } from "react-instantsearch";
import CustomPlanSearchBox from "./CustomPlanSearchBox";
import CustomRangeInput from "./CustomRangeInput";
import CustomRefinementList from "./CustomRefinementList";
import CustomToggleRefinement from "./CustomToggleRefinement";
import PersistentNumericMenu from "./PersistentNumericMenu";

export const Sidebar = ({ searchState }) => {
  const { refine: clearAll } = useClearRefinements();
  const { indexUiState } = useInstantSearch();
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  // Count active filters
  useEffect(() => {
    let count = 0;

    // Count numericMenu filters
    if (indexUiState.numericMenu) {
      count += Object.keys(indexUiState.numericMenu).length;
    }

    // Count refinementList filters
    if (indexUiState.refinementList) {
      Object.values(indexUiState.refinementList).forEach((refinements) => {
        if (Array.isArray(refinements) && refinements.length > 0) {
          count += 1;
        }
      });
    }

    // Count toggle filters
    if (indexUiState.toggle) {
      count += Object.values(indexUiState.toggle).filter(Boolean).length;
    }

    // Count range inputs
    if (indexUiState.range) {
      count += Object.keys(indexUiState.range).length;
    }

    setActiveFiltersCount(count);
  }, [indexUiState]);

  const handleReset = () => {
    // Clear InstantSearch refinements
    clearAll();

    // Clear all filter selections from localStorage
    try {
      // Clear all persistent filter selections
      Object.keys(localStorage).forEach((key) => {
        if (
          key.startsWith("persistent_") ||
          key.startsWith("bedroom_filter_") ||
          key.startsWith("numeric_menu_") ||
          key.startsWith("stable_menu_") ||
          key.startsWith("plan_search_")
        ) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error("Error clearing filter selections:", error);
    }
  };

  const accentColor = "white";
  const bgColor = "#1e1e1e";
  const borderColor = "gray.700";

  return (
    <Flex as="section" minH="100%" position="sticky" top="20px">
      <Box
        width="100%"
        bg={bgColor}
        borderRadius="xl"
        overflow="hidden"
        boxShadow="lg"
        border="1px solid"
        borderColor={borderColor}
        display={["none", "none", "block"]}
      >
        <Stack width="100%" justifyContent="space-between" spacing={0}>
          <Box p={5} borderBottom="1px solid" borderColor={borderColor}>
            <HStack justify="space-between" mb={2}>
              <HStack>
                <FiFilter color={accentColor} />
                <Heading size="md" color="white">
                  Filters
                </Heading>
                {activeFiltersCount > 0 && (
                  <Badge colorScheme="yellow" borderRadius="full" ml={2}>
                    {activeFiltersCount}
                  </Badge>
                )}
              </HStack>
            </HStack>
            <Text fontSize="sm" color="gray.400">
              Refine your search with the options below
            </Text>
          </Box>

          <Box p={5}>
            <CustomPlanSearchBox
              defaultRefinement={searchState?.planNumber || ""}
            />
          </Box>

          <Accordion allowMultiple defaultIndex={[0, 1]} allowToggle>
            <AccordionItem border="none">
              <AccordionButton py={3} px={5} _hover={{ bg: "whiteAlpha.100" }}>
                <HStack flex="1" textAlign="left">
                  <FiFilter color={accentColor} />
                  <Heading size="sm" color="white">
                    Basic Filters
                  </Heading>
                </HStack>
                <AccordionIcon color="gray.400" />
              </AccordionButton>
              <AccordionPanel pb={4} px={5}>
                <Stack spacing={6}>
                  <Box>
                    <Heading
                      size="xs"
                      mb="3"
                      color="gray.300"
                      textTransform="uppercase"
                      letterSpacing="wider"
                    >
                      Bedrooms
                    </Heading>
                    <PersistentNumericMenu
                      attribute="bedrooms"
                      items={[
                        { label: "All", value: "" },
                        { label: "1+", start: 1 },
                        { label: "2+", start: 2 },
                        { label: "3+", start: 3 },
                        { label: "4+", start: 4 },
                        { label: "5+", start: 5 },
                      ]}
                    />
                  </Box>

                  <Box>
                    <Heading
                      size="xs"
                      mb="3"
                      color="gray.300"
                      textTransform="uppercase"
                      letterSpacing="wider"
                    >
                      Square Footage
                    </Heading>
                    <CustomRangeInput attribute="sqft" min={1000} max={10000} />
                  </Box>

                  <HStack spacing={4} align="flex-start">
                    <Box flex="1">
                      <Heading
                        size="xs"
                        mb="3"
                        color="gray.300"
                        textTransform="uppercase"
                        letterSpacing="wider"
                      >
                        Basement
                      </Heading>
                      <CustomToggleRefinement
                        attribute="basement"
                        label="Has Basement"
                        defaultRefinement={
                          searchState?.toggle?.basement || false
                        }
                      />
                    </Box>
                    <Box flex="1">
                      <Heading
                        size="xs"
                        mb="3"
                        color="gray.300"
                        textTransform="uppercase"
                        letterSpacing="wider"
                      >
                        Attic
                      </Heading>
                      <CustomToggleRefinement
                        attribute="walkupAttic"
                        label="Walkup Attic"
                        defaultRefinement={
                          searchState?.toggle?.walkupAttic || false
                        }
                      />
                    </Box>
                  </HStack>
                </Stack>
              </AccordionPanel>
            </AccordionItem>

            <AccordionItem border="none">
              <AccordionButton py={3} px={5} _hover={{ bg: "whiteAlpha.100" }}>
                <HStack flex="1" textAlign="left">
                  <FiFilter color={accentColor} />
                  <Heading size="sm" color="white">
                    Dimensions
                  </Heading>
                </HStack>
                <AccordionIcon color="gray.400" />
              </AccordionButton>
              <AccordionPanel pb={4} px={5}>
                <Stack spacing={6}>
                  <Box>
                    <Heading
                      size="xs"
                      mb="3"
                      color="gray.300"
                      textTransform="uppercase"
                      letterSpacing="wider"
                    >
                      Plan Depth (ft.)
                    </Heading>
                    <CustomRangeInput
                      attribute="planDepth"
                      precision={2}
                      min={10}
                      max={100}
                      defaultRefinement={searchState?.planDepth}
                    />
                  </Box>

                  <Box>
                    <Heading
                      size="xs"
                      mb="3"
                      color="gray.300"
                      textTransform="uppercase"
                      letterSpacing="wider"
                    >
                      Plan Width (ft.)
                    </Heading>
                    <CustomRangeInput
                      attribute="planWidth"
                      precision={2}
                      min={10}
                      max={200}
                      defaultRefinement={searchState?.planWidth}
                    />
                  </Box>
                </Stack>
              </AccordionPanel>
            </AccordionItem>

            <AccordionItem border="none">
              <AccordionButton py={3} px={5} _hover={{ bg: "whiteAlpha.100" }}>
                <HStack flex="1" textAlign="left">
                  <FiFilter color={accentColor} />
                  <Heading size="sm" color="white">
                    Plan Details
                  </Heading>
                </HStack>
                <AccordionIcon color="gray.400" />
              </AccordionButton>
              <AccordionPanel pb={4} px={5}>
                <Stack spacing={6}>
                  <Box>
                    <Heading
                      size="xs"
                      mb="3"
                      color="gray.300"
                      textTransform="uppercase"
                      letterSpacing="wider"
                    >
                      Plan Type
                    </Heading>
                    <CustomRefinementList
                      attribute="planType"
                      defaultRefinement={searchState?.planType}
                    />
                  </Box>

                  <Box>
                    <Heading
                      size="xs"
                      mb="3"
                      color="gray.300"
                      textTransform="uppercase"
                      letterSpacing="wider"
                    >
                      Number of Levels
                    </Heading>
                    <CustomRefinementList
                      attribute="numberOfLevels"
                      defaultRefinement={searchState?.numberOfLevels}
                    />
                  </Box>

                  <Box>
                    <Heading
                      size="xs"
                      mb="3"
                      color="gray.300"
                      textTransform="uppercase"
                      letterSpacing="wider"
                    >
                      Primary Suite
                    </Heading>
                    <CustomRefinementList
                      attribute="primarySuite"
                      defaultRefinement={searchState?.primarySuite}
                    />
                  </Box>
                </Stack>
              </AccordionPanel>
            </AccordionItem>

            <AccordionItem border="none">
              <AccordionButton py={3} px={5} _hover={{ bg: "whiteAlpha.100" }}>
                <HStack flex="1" textAlign="left">
                  <FiFilter color={accentColor} />
                  <Heading size="sm" color="white">
                    Garage
                  </Heading>
                </HStack>
                <AccordionIcon color="gray.400" />
              </AccordionButton>
              <AccordionPanel pb={4} px={5}>
                <Stack spacing={6}>
                  <Box>
                    <Heading
                      size="xs"
                      mb="3"
                      color="gray.300"
                      textTransform="uppercase"
                      letterSpacing="wider"
                    >
                      Garage Orientation
                    </Heading>
                    <CustomRefinementList
                      attribute="garageOrientation"
                      defaultRefinement={searchState?.garageOrientation}
                    />
                  </Box>

                  <Box>
                    <Heading
                      size="xs"
                      mb="3"
                      color="gray.300"
                      textTransform="uppercase"
                      letterSpacing="wider"
                    >
                      Vehicle Spaces
                    </Heading>
                    <PersistentNumericMenu
                      attribute="vehicleSpaces"
                      items={[
                        { label: "All", value: "" },
                        { label: "1+", start: 1 },
                        { label: "2+", start: 2 },
                        { label: "3+", start: 3 },
                        { label: "4+", start: 4 },
                      ]}
                    />
                  </Box>
                </Stack>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>

          <Box p={5} borderTop="1px solid" borderColor={borderColor}>
            <Button
              width="full"
              colorScheme="yellow"
              onClick={handleReset}
              disabled={activeFiltersCount === 0}
            >
              Clear All Filters
            </Button>
          </Box>
        </Stack>
      </Box>
    </Flex>
  );
};

export default Sidebar;
