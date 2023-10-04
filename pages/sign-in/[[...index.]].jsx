import { useState } from "react";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/router";
import {
  Button,
  Checkbox,
  Container,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Link,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";

export default function SignIn() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const toast = useToast();
  // start the sign In process.
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLoaded) {
      return;
    }

    try {
      const result = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (result.status === "complete") {
        console.log(result);
        await setActive({ session: result.createdSessionId });
        router.push("/");
      } else {
        /*Investigate why the login hasn't completed */
        console.log(result);
      }
    } catch (err) {
      console.error("error", err.errors[0].message);
      toast({
        title: "Login Error",
        description: err.errors[0].message,
        status: "error",
        variant: "solid",
        position: "top",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Container maxW="md" py={{ base: "12", md: "24" }}>
      <Stack spacing="8">
        <Stack spacing="6">
          <Stack spacing={{ base: "2", md: "3" }} textAlign="center">
            <Heading
              size={{ base: "md", md: "lg" }}
              fontWeight="sm"
              color="white"
            >
              McMillan Design Planbooks
            </Heading>
            <Text color="white">Login to view our plans</Text>
          </Stack>
        </Stack>
        <Stack spacing="8">
          <Stack spacing="4">
            <FormControl>
              <FormLabel htmlFor="email" color="white">
                Email
              </FormLabel>
              <Input
                onChange={(e) => setEmailAddress(e.target.value)}
                id="email"
                name="email"
                type="email"
                variant="outline"
                bgColor="white"
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password" color="white">
                Password
              </FormLabel>
              <Input
                onChange={(e) => setPassword(e.target.value)}
                id="password"
                name="password"
                type="password"
                variant="outline"
                bgColor="white"
              />
            </FormControl>
          </Stack>
          <Stack spacing="4">
            <Button colorScheme="yellow" onClick={handleSubmit}>
              Sign in
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Container>
  );
}
