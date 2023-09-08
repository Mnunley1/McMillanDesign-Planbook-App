import {
  Box,
  ButtonGroup,
  HStack,
  Heading,
  IconButton,
} from "@chakra-ui/react";
import { FiBell, FiSearch } from "react-icons/fi";

function Navbar() {
  return (
    <Box width="100%" height="4rem" bg="#1e1e1e">
      <HStack justify="space-between" px="5" py="3">
        <Heading fontWeight="sm" color="white">
          McMillan Design
        </Heading>
        <HStack spacing={{ base: "2", md: "4" }}>
          <ButtonGroup variant="tertiary.accent" spacing="1">
            <IconButton
              icon={<FiSearch />}
              aria-label="Search"
              display={{ base: "flex", md: "none" }}
              isRound
            />
            <IconButton
              icon={<FiBell />}
              aria-label="Show notification"
              isRound
            />
          </ButtonGroup>
        </HStack>
      </HStack>
    </Box>
  );
}

export default Navbar;
