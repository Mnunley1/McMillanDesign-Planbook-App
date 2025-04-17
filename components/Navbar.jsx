import { Box, Heading, HStack, Link } from "@chakra-ui/react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import NextLink from "next/link";
import { useRouter } from "next/router";

function Navbar() {
  const { user } = useUser();
  const router = useRouter();
  const isAdmin = user?.publicMetadata?.role === "admin";
  const currentPath = router.pathname;

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
                  color={currentPath === "/" ? "yellow.400" : "white"}
                  _hover={{ color: "yellow.400" }}
                  fontWeight={currentPath === "/" ? "bold" : "normal"}
                >
                  Public
                </Link>
                <Link
                  as={NextLink}
                  href="/admin"
                  color={currentPath === "/admin" ? "yellow.400" : "white"}
                  _hover={{ color: "yellow.400" }}
                  fontWeight={currentPath === "/admin" ? "bold" : "normal"}
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
