/* eslint-disable react-hooks/rules-of-hooks */
import { Button, Container, Flex } from "@chakra-ui/react";
import { createClient } from "contentful";
import FloorPlanInfo from "../../components/FloorPlanIfo";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

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
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Flex bgColor="#030303" height="calc(100vh - 4rem)">
        <Container maxW="container.lg" mt="10">
          <Button
            variant="link"
            color="white"
            mb="5"
            onClick={() => {
              router.push("/");
            }}
          >
            &#129060; Back To Plans
          </Button>
          <FloorPlanInfo data={data} />
        </Container>
      </Flex>
    </>
  );
}