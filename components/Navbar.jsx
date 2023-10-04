import {
  Box,
  ButtonGroup,
  HStack,
  Heading,
  IconButton,
  Spacer,
} from "@chakra-ui/react";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";
import { FiBell, FiSearch } from "react-icons/fi";

function Navbar() {
  return (
    <Box width="100%" height="4rem" bg="#1e1e1e">
      <HStack justify="space-between" px="5" py="3">
        <Heading fontWeight="sm" color="white">
          McMillan Design
        </Heading>
        <Spacer />
        <SignedIn>
          {/* Mount the UserButton component */}
          <UserButton afterSignOutUrl="/sign-in" />
        </SignedIn>
        <SignedOut>
          {/* Signed out users get sign in button */}
          <SignInButton />
        </SignedOut>
      </HStack>
    </Box>
  );
}

export default Navbar;
