import {
  Avatar,
  Box,
  Flex,
  HStack,
  Heading,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  StackDivider,
  Text,
} from "@chakra-ui/react";
import {
  FiBookmark,
  FiClock,
  FiGrid,
  FiHelpCircle,
  FiMoreVertical,
  FiPieChart,
  FiSearch,
  FiSettings,
} from "react-icons/fi";

import CustomRefinementList from "./CustomRefinementList";
import CustomRangeInput from "./CustomRangeInput";
import CustomToggleRefinement from "./CustomToggleRefinement";
import CustomSearchBox from "./CustomSearchBox";
import CustomNumericMenu from "./CustomNumericMenu";

export const Sidebar = ({ searchState }) => (
  <Flex as="section" minH="100%" display={["none", "none", "block"]}>
    <Stack width="100%" justifyContent="space-between">
      <Stack spacing="6">
        <CustomSearchBox defaultRefinement={searchState?.query || ""} />
        <Box>
          <Heading size="sm" mb="1" color="white">
            Bedrooms
          </Heading>
          <CustomNumericMenu
            attribute="bedrooms"
            items={[
              { label: "All" },
              { label: "1+", start: 1 },
              { label: "2+", start: 2 },
              { label: "3+", start: 3 },
              { label: "4+", start: 4 },
              { label: "5+", start: 5 },
            ]}
            defaultRefinement={searchState?.bedrooms}
          />
        </Box>
        <Box>
          <Heading size="sm" mb="1" color="white">
            SQFT.
          </Heading>
          <CustomRangeInput
            attribute="sqft"
            precision={2}
            min={1000}
            max={10000}
            defaultRefinement={searchState?.sqft}
          />
        </Box>
        <Box>
          <Heading size="sm" mb="1" color="white">
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
          <Heading size="sm" mb="1" color="white">
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
        <Box>
          <Heading size="sm" mb="1" color="white">
            Plan Type
          </Heading>
          <CustomRefinementList attribute="planType" defaultRefinement={searchState?.planType} />
        </Box>
        <Box>
          <Heading size="sm" mb="1" color="white">
            Number of Levels
          </Heading>
          <CustomRefinementList attribute="numberOfLevels" defaultRefinement={searchState?.numberOfLevels} />
        </Box>
        <Box>
          <Heading size="sm" mb="1" color="white">
            Garage Orientation
          </Heading>
          <CustomRefinementList attribute="garageOrientation" defaultRefinement={searchState?.garageOrientation} />
        </Box>
        <Box>
          <Heading size="sm" mb="1" color="white">
            Vehicle Spaces
          </Heading>
          <CustomNumericMenu
            attribute="vehicleSpaces"
            items={[
              { label: "All" },
              { label: "1+", start: 1 },
              { label: "2+", start: 2 },
              { label: "3+", start: 3 },
              { label: "4+", start: 4 },
            ]}
            defaultRefinement={searchState?.vehicleSpaces}
          />
        </Box>
        <Box>
          <Heading size="sm" mb="1" color="white">
            Primary Suite
          </Heading>
          <CustomRefinementList attribute="primarySuite" defaultRefinement={searchState?.primarySuite} />
        </Box>
        <Box>
          <Heading size="sm" mb="1" color="white">
            Basement
          </Heading>
          <CustomToggleRefinement attribute="basement" label="Basement" defaultRefinement={searchState?.basement} />
        </Box>
        <Box>
          <Heading size="sm" mb="1" color="white">
            Attic
          </Heading>
          <CustomToggleRefinement
            attribute="walkupAttic"
            label="Walkup Attic"
            defaultRefinement={searchState?.walkupAttic}
          />
        </Box>
      </Stack>
    </Stack>
  </Flex>
);

export default Sidebar;
