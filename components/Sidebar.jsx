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

export const Sidebar = () => (
  <Flex as="section" minH="100%">
    <Stack width="100%" justifyContent="space-between">
      <Stack spacing="6">
        <CustomSearchBox />
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
          />
        </Box>
        <Box>
          <Heading size="sm" mb="1" color="white">
            Plan Type
          </Heading>
          <CustomRefinementList attribute="planType" />
        </Box>
        <Box>
          <Heading size="sm" mb="1" color="white">
            Number of Levels
          </Heading>
          <CustomRefinementList attribute="numberOfLevels" />
        </Box>
        <Box>
          <Heading size="sm" mb="1" color="white">
            Garage Orientation
          </Heading>
          <CustomRefinementList attribute="garageOrientation" />
        </Box>
        <Box>
          <Heading size="sm" mb="1" color="white">
            Master
          </Heading>
          <CustomToggleRefinement
            attribute="firstFloorMaster"
            label="First Floor Master"
          />
        </Box>
        <Box>
          <Heading size="sm" mb="1" color="white">
            Basement
          </Heading>
          <CustomToggleRefinement attribute="basement" label="Basement" />
        </Box>
        <Box>
          <Heading size="sm" mb="1" color="white">
            Attic
          </Heading>
          <CustomToggleRefinement
            attribute="walkupAttic"
            label="Walkup Attic"
          />
        </Box>
      </Stack>
    </Stack>
  </Flex>
);

export default Sidebar;
