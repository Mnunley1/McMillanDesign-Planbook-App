import { CSSReset, ChakraProvider } from "@chakra-ui/react";
import { ClerkProvider } from "@clerk/nextjs";
import "@fontsource/ibm-plex-sans/400.css";
import "@fontsource/inter/400.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import theme from "../theme";

// Create a client
const queryClient = new QueryClient();

function MyApp({ Component, pageProps }) {
  return (
    <ClerkProvider {...pageProps} afterSignOutUrl="/sign-in">
      <QueryClientProvider client={queryClient}>
        <ChakraProvider theme={theme}>
          <CSSReset />
          <Component {...pageProps} />
        </ChakraProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

export default MyApp;
