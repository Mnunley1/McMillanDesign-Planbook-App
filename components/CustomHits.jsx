import React, { btnRef, Transformation } from "react";
import Link from "next/link";
import { useHits } from "react-instantsearch";
import {
  Badge,
  Box,
  Center,
  IconButton,
  Icon,
  Image,
  Skeleton,
  Spacer,
  Text,
  WrapItem,
  Heading,
  Stack,
  HStack,
  Divider,
  useDisclosure,
} from "@chakra-ui/react";
//import noImage from "../../public/images/TALIS-IMAGES-COMING-SOON.png";

function CustomHits(props) {
  const { hits, results, sendEvent } = useHits(props);
  return (
    <>
      {hits.map((hit, id) => (
        <Link key={id} href={`/plan/${hit.entityId}`}>
          <Box
            width="100%"
            borderRadius="lg"
            overflow="hidden"
            marginBottom={5}
            transition="all ease-in-out .2s"
            _hover={{
              transform: "scale(1.03)",
            }}
            zIndex="1"
            cursor="pointer"
          >
            {!hit.image ? (
              <Image h="auto" w="100%" src={noImage} alt="No Image" />
            ) : (
              <Image h="auto" w="100%" src={hit.image} alt={hit.image} />
            )}

            <Box p="4" bgColor="#1e1e1e">
              <Stack alignItems="baseline" spacing="0">
                <Heading size="md" color="#E4E6EB">
                  {hit.planNumber}
                </Heading>
                <HStack>
                  <Text color="#E4E6EB" fontWeight="light" fontSize="lg">
                    {hit.bedrooms} Bedrooms
                  </Text>
                  <Text color="white">|</Text>
                  <Text color="#E4E6EB" fontWeight="light" fontSize="md">
                    {hit.sqft} sqft.
                  </Text>
                  <Text color="white">|</Text>
                  <Text color="#E4E6EB" fontWeight="light" fontSize="md">
                    Width: {hit.planWidth} ft.
                  </Text>
                  <Text color="white">|</Text>
                  <Text color="#E4E6EB" fontWeight="light" fontSize="md">
                    Depth: {hit.planWidth} ft.
                  </Text>
                  <Spacer />
                </HStack>
              </Stack>
            </Box>
          </Box>
        </Link>
      ))}
    </>
  );
}

export default CustomHits;
