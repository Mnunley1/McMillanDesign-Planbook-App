import {
  Box,
  Container,
  Flex,
  Stack,
  useBreakpointValue,
} from "@chakra-ui/react";
import Head from "next/head";
import * as React from "react";

import Navbar from "./Navbar";

const Layout = ({
  children,
  head,
  sub,
  link,
  tabs,
  btnPrimary: BtnPrimary,
  btnSecondary: BtnSecondary,
}) => {
  const isDesktop = useBreakpointValue({
    base: false,
    lg: true,
  });

  return (
    <>
      <Head>
        <title>McMillan Design Plan Book</title>
        {/* <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        /> */}
      </Head>
      <Box
        height="100vh"
        overflow="hidden"
        position="relative"
        minWidth="100%"
        bgColor="#030303"
        p="0"
      >
        <Navbar />
        {children}
      </Box>
    </>
  );
};

export default Layout;
