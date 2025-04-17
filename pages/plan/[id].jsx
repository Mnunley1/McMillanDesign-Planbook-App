/* eslint-disable react-hooks/rules-of-hooks */
import { Box, Button, Container, HStack, Spacer } from "@chakra-ui/react";
import { createClient } from "contentful";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import FloorPlanInfo from "../../components/FloorPlanInfo";
import Layout from "../../components/Layout";
import { downloadFile, printImage } from "../../utils/planUtils";

// Storage key for scroll position
const SCROLL_POSITION_KEY = "planbook_scroll_position";

export default function Plan() {
  const router = useRouter();
  const [data, setData] = useState();

  const client = createClient({
    space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID,
    accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN,
  });

  // Handle back navigation
  const handleBackClick = () => {
    // Navigate back to the previous page
    router.back();
  };

  useEffect(() => {
    if (router.isReady) {
      const getPlan = async (id) => {
        try {
          await client.getEntry(id).then((res) => {
            setData(res.fields);
          });
        } catch (error) {
          console.log(error);
        }
      };
      getPlan(router?.query.id);
    }
  }, [router.isReady]);

  return (
    <>
      <Layout>
        <Head>
          <title>McMillan Design - Floor Plan Details</title>
          <meta name="description" content="Floor plan details" />
          <link rel="icon" href="/favicon.ico" />
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
            integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA=="
            crossOrigin="anonymous"
            referrerPolicy="no-referrer"
          />
        </Head>
        <Box bgColor="#030303">
          <Container maxW="container.xl" mt="10" mb="10">
            <HStack spacing={4} mb={5}>
              <Button
                leftIcon={<FaArrowLeft />}
                colorScheme="yellow"
                variant="outline"
                onClick={handleBackClick}
              >
                Back to Search Results
              </Button>
              <Spacer />
              <Button
                onClick={() =>
                  downloadFile(
                    data?.planPdf?.[0]?.url,
                    `${data?.planNumber}.pdf`
                  )
                }
                leftIcon={<Box as="span" className="fas fa-download" />}
                colorScheme="blue"
              >
                Download PDF
              </Button>
              <Button
                onClick={() =>
                  printImage(data?.planPdf?.[0]?.url, data?.planNumber)
                }
                leftIcon={<Box as="span" className="fas fa-print" />}
                colorScheme="gray"
              >
                Print Plan
              </Button>
            </HStack>
            {data && <FloorPlanInfo data={data} />}
          </Container>
        </Box>
      </Layout>
    </>
  );
}
