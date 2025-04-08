import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Badge,
  Box,
  Button,
  ButtonGroup,
  Heading,
  HStack,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FiFilter, FiSearch } from "react-icons/fi";
import { useClearRefinements, useInstantSearch } from "react-instantsearch";

import CustomRangeInput from "./CustomRangeInput";
import CustomRefinementList from "./CustomRefinementList";
import CustomSearchBox from "./CustomSearchBox";
import CustomToggleRefinement from "./CustomToggleRefinement";
import PersistentNumericMenu from "./PersistentNumericMenu";

export const MobileFilters = ({ filters, onClick, searchState }) => {
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
          key.startsWith("stable_menu_")
        ) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error("Error clearing filter selections:", error);
    }
  };

  const accentColor = "yellow.400";
  const bgColor = "#1e1e1e";
  const borderColor = "gray.700";

  return (
    <Box
      position="fixed"
      top={0}
      right={0}
      bottom={0}
      width="100%"
      bg={bgColor}
      zIndex={1400}
      display={filters ? "block" : "none"}
      overflowY="auto"
    >
      <Box p={4} borderBottomWidth="1px" borderColor={borderColor}>
        <HStack justify="space-between">
          <HStack>
            <FiFilter color="white" />
            <Heading size="md" color="white">
              Filters
            </Heading>
            {activeFiltersCount > 0 && (
              <Badge colorScheme="yellow" borderRadius="full" ml={2}>
                {activeFiltersCount}
              </Badge>
            )}
          </HStack>
          <Button
            variant="ghost"
            color="white"
            onClick={onClick}
            _hover={{ bg: "whiteAlpha.200" }}
          >
            <FiSearch size={20} />
          </Button>
        </HStack>
        <Text fontSize="sm" color="gray.400" mt={1}>
          Refine your search with the options below
        </Text>
      </Box>

      <Box px={4} py={4}>
        <CustomSearchBox defaultRefinement={searchState?.q || ""} />
      </Box>

      <Accordion allowMultiple defaultIndex={[0]} allowToggle>
        <AccordionItem border="none">
          <AccordionButton py={3} px={4} _hover={{ bg: "whiteAlpha.100" }}>
            <HStack flex="1" textAlign="left">
              <FiFilter color="white" />
              <Heading size="sm" color="white">
                Basic Filters
              </Heading>
            </HStack>
            <AccordionIcon color="gray.400" />
          </AccordionButton>
          <AccordionPanel pb={4} px={4}>
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
                <CustomRangeInput
                  attribute="sqft"
                  min={1000}
                  max={10000}
                  defaultRefinement={searchState?.sqft}
                />
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
                    defaultRefinement={false}
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
                    defaultRefinement={false}
                  />
                </Box>
              </HStack>
            </Stack>
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem border="none">
          <AccordionButton py={3} px={4} _hover={{ bg: "whiteAlpha.100" }}>
            <HStack flex="1" textAlign="left">
              <FiFilter color="white" />
              <Heading size="sm" color="white">
                Dimensions
              </Heading>
            </HStack>
            <AccordionIcon color="gray.400" />
          </AccordionButton>
          <AccordionPanel pb={4} px={4}>
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
          <AccordionButton py={3} px={4} _hover={{ bg: "whiteAlpha.100" }}>
            <HStack flex="1" textAlign="left">
              <FiFilter color="white" />
              <Heading size="sm" color="white">
                Plan Details
              </Heading>
            </HStack>
            <AccordionIcon color="gray.400" />
          </AccordionButton>
          <AccordionPanel pb={4} px={4}>
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
          <AccordionButton py={3} px={4} _hover={{ bg: "whiteAlpha.100" }}>
            <HStack flex="1" textAlign="left">
              <FiFilter color="white" />
              <Heading size="sm" color="white">
                Garage
              </Heading>
            </HStack>
            <AccordionIcon color="gray.400" />
          </AccordionButton>
          <AccordionPanel pb={4} px={4}>
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

      <Box p={4} borderTopWidth="1px" borderColor={borderColor}>
        <ButtonGroup width="100%" spacing={3}>
          {activeFiltersCount > 0 && (
            <Button
              colorScheme="red"
              variant="outline"
              onClick={handleReset}
              flex="1"
            >
              Reset All
            </Button>
          )}
          <Button
            colorScheme="yellow"
            onClick={onClick}
            flex="1"
            leftIcon={<FiSearch />}
          >
            Apply Filters
          </Button>
        </ButtonGroup>
      </Box>
    </Box>
  );
};

export default MobileFilters;
