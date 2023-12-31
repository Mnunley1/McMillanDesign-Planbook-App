import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Flex,
  HStack,
  Heading,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Stack,
  StackDivider,
  Text,
  useDisclosure,
  CloseButton,
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
import { useEffect } from "react";

export const MobileFilters = ({ filters, onClick, searchState }) => {
  return (
    <Box
      bgColor="#1e1e1e"
      color="black"
      zIndex="2000"
      position="fixed"
      top="0"
      left="0"
      h="100%"
      w="100%"
      p="15px 25px"
      overflowY="scroll"
      display={filters ? "block" : "none"}
    >
      <CloseButton ml="auto" mb={3} size="lg" color="#fff" onClick={onClick} />
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
            />
          </Box>
          <Box>
            <Heading size="sm" mb="1" color="white">
              Primary Suite
            </Heading>
            <CustomRefinementList attribute="primarySuite" />
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
      <ButtonGroup width="100%" spacing="6" mt="5">
        <Button w="full" onClick={onClick}>
          Close
        </Button>
        <Button w="full" colorScheme="yellow" onClick={onClick}>
          Search
        </Button>
      </ButtonGroup>
    </Box>
  );
};

export default MobileFilters;
