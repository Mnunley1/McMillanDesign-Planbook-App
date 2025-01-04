/* eslint-disable react-hooks/rules-of-hooks */
import { Box, Button, Container } from "@chakra-ui/react";
import { createClient } from "contentful";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import FloorPlanInfo from "../../components/FloorPlanInfo";
import Layout from "../../components/Layout";
export default function Plan() {
  const router = useRouter();
  const [data, setData] = useState();

  const client = createClient({
    space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID,
    accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN,
  });

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
        </Head>
        <Box bgColor="#030303">
          <Container maxW="container.xl" mt="10" mb="10">
            <Button
              variant="link"
              color="white"
              mb="5"
              leftIcon={<FaArrowLeft />}
              onClick={() => {
                const referrer = document.referrer;
                if (referrer && referrer.includes(window.location.origin)) {
                  router.back();
                } else {
                  router.back();
                }
              }}
            >
              Back To Plans
            </Button>
            <FloorPlanInfo data={data} />
          </Container>
        </Box>
      </Layout>
    </>
  );
}
