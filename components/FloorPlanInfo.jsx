import { Box, Heading, Image, SimpleGrid, Stack, Text } from "@chakra-ui/react";
import { Cloudinary } from "@cloudinary/url-gen";
import noImage from "../public/no-image.jpg";

export default function FloorPlanInfo({ data }) {
  const image = data?.planPdf[0]?.url;

  // Create and configure your Cloudinary instance.
  const cld = new Cloudinary({
    cloud: {
      cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    },
  });

  return (
    <>
      <Box width="100%" bgColor="#1e1e1e" borderRadius="lg">
        <Stack align="stretch">
          <Image
            src={data?.planPdf[0].url || noImage.src}
            width="100%"
            borderTopRadius="lg"
            alt="plan image"
          />
          <Stack p="8" spacing={8}>
            <Box borderBottom="2px solid" borderColor="whiteAlpha.200" pb={6}>
              <Heading size="lg" color="white" mb={2}>
                {data?.planNumber || "Floor Plan Details"}
              </Heading>
              <Text color="whiteAlpha.800" fontSize="lg">
                {data?.planType}
              </Text>
            </Box>

            <SimpleGrid
              columns={{ base: 1, sm: 2, lg: 3 }}
              spacing={8}
              sx={{
                "& > div": {
                  position: "relative",
                  p: 4,
                  bg: "whiteAlpha.100",
                  borderRadius: "md",
                  transition: "all 0.2s",
                  _hover: {
                    bg: "whiteAlpha.200",
                    transform: "translateY(-2px)",
                  },
                },
              }}
            >
              <Box>
                <Heading
                  size="sm"
                  color="whiteAlpha.600"
                  mb={2}
                  textTransform="uppercase"
                  letterSpacing="wide"
                >
                  Bedrooms
                </Heading>
                <Text color="white" fontSize="xl" fontWeight="bold">
                  {data?.bedrooms}
                </Text>
              </Box>

              <Box>
                <Heading
                  size="sm"
                  color="whiteAlpha.600"
                  mb={2}
                  textTransform="uppercase"
                  letterSpacing="wide"
                >
                  Plan Width
                </Heading>
                <Text color="white" fontSize="xl" fontWeight="bold">
                  {data?.overallWidth}
                </Text>
              </Box>

              <Box>
                <Heading
                  size="sm"
                  color="whiteAlpha.600"
                  mb={2}
                  textTransform="uppercase"
                  letterSpacing="wide"
                >
                  Plan Depth
                </Heading>
                <Text color="white" fontSize="xl" fontWeight="bold">
                  {data?.overallDepth}
                </Text>
              </Box>

              <Box>
                <Heading
                  size="sm"
                  color="whiteAlpha.600"
                  mb={2}
                  textTransform="uppercase"
                  letterSpacing="wide"
                >
                  Number of Levels
                </Heading>
                <Text color="white" fontSize="xl" fontWeight="bold">
                  {data?.numberOfLevels}
                </Text>
              </Box>

              <Box>
                <Heading
                  size="sm"
                  color="whiteAlpha.600"
                  mb={2}
                  textTransform="uppercase"
                  letterSpacing="wide"
                >
                  Garage Layout
                </Heading>
                <Text color="white" fontSize="xl" fontWeight="bold">
                  {data?.garageOrientation}
                </Text>
              </Box>

              <Box>
                <Heading
                  size="sm"
                  color="whiteAlpha.600"
                  mb={2}
                  textTransform="uppercase"
                  letterSpacing="wide"
                >
                  First Floor Master
                </Heading>
                <Text color="white" fontSize="xl" fontWeight="bold">
                  {data?.firstFloorMaster === true ? "Yes" : "No"}
                </Text>
              </Box>

              <Box>
                <Heading
                  size="sm"
                  color="whiteAlpha.600"
                  mb={2}
                  textTransform="uppercase"
                  letterSpacing="wide"
                >
                  Basement
                </Heading>
                <Text color="white" fontSize="xl" fontWeight="bold">
                  {data?.basement === true ? "Yes" : "No"}
                </Text>
              </Box>

              <Box>
                <Heading
                  size="sm"
                  color="whiteAlpha.600"
                  mb={2}
                  textTransform="uppercase"
                  letterSpacing="wide"
                >
                  Walkup Attic
                </Heading>
                <Text color="white" fontSize="xl" fontWeight="bold">
                  {data?.walkupAttic === true ? "Yes" : "No"}
                </Text>
              </Box>
            </SimpleGrid>
          </Stack>
        </Stack>
      </Box>
    </>
  );
}
