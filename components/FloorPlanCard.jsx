import {
  Box,
  Heading,
  HStack,
  Image,
  Spacer,
  Stack,
  Text,
} from "@chakra-ui/react";
import Link from "next/link";
import React from "react";

function FloorPlanCard({ hit, sendEvent }) {
  const handleClick = () => {
    if (sendEvent) {
      sendEvent("click", hit, "Product Clicked");
    }
  };

  return (
    <Link href={`/plan/${hit.entityId}`} onClick={handleClick}>
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
          <Image
            h="auto"
            w="100%"
            src="../public/no-image.jpg"
            alt="No Image"
          />
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
            </HStack>
            <HStack>
              <Text color="#E4E6EB" fontWeight="light" fontSize="md">
                Width: {hit.planWidth} ft.
              </Text>
              <Text color="white">|</Text>
              <Text color="#E4E6EB" fontWeight="light" fontSize="md">
                Depth: {hit.planDepth} ft.
              </Text>
              <Spacer />
            </HStack>
          </Stack>
        </Box>
      </Box>
    </Link>
  );
}

export default FloorPlanCard;
