import { Box, Heading, HStack, Spacer } from "@chakra-ui/react";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

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
          <UserButton />
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
