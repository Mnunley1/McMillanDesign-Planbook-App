import { Box, Heading, HStack, Link } from "@chakra-ui/react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import NextLink from "next/link";

function Navbar() {
  const { user } = useUser();
  const isAdmin = user?.publicMetadata?.role === "admin";
  console.log("User metadata:", user?.publicMetadata);

  return (
    <Box width="100%" height="4rem" bg="#1e1e1e">
      <HStack justify="space-between" alignItems="center" px="5" py="3">
        <Link as={NextLink} href="/" _hover={{ textDecoration: "none" }}>
          <Heading fontSize={["2xl", "3xl"]} fontWeight="md" color="white">
            McMillan Design
          </Heading>
        </Link>
        <HStack spacing={4}>
          <SignedIn>
            {isAdmin && (
              <>
                <Link
                  as={NextLink}
                  href="/"
                  color="white"
                  _hover={{ color: "yellow.400" }}
                >
                  Public
                </Link>
                <Link
                  as={NextLink}
                  href="/admin"
                  color="white"
                  _hover={{ color: "yellow.400" }}
                >
                  Master View
                </Link>
              </>
            )}
            <UserButton />
          </SignedIn>
          <SignedOut>
            <SignInButton />
          </SignedOut>
        </HStack>
      </HStack>
    </Box>
  );
}

export default Navbar;
