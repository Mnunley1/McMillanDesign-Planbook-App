import {
  Box,
  Button,
  Heading,
  Image,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Cloudinary } from "@cloudinary/url-gen";
import noImage from "../public/no-image.jpg";

export default function FloorPlanInfo({ data }) {
  const image = data?.planPdf[0]?.url;
  const file = image ? image.split("/").pop() : null;
  // Create and configure your Cloudinary instance.
  const cld = new Cloudinary({
    cloud: {
      cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    },
  });

  // Only create Cloudinary URL if we have a file
  const url = file ? cld.image(file).toURL() : null;

  const downloadFile = (fileName = `${data?.planNumber}.pdf`) => {
    if (!url) {
      console.error("No PDF URL available");
      return;
    }

    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/pdf",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.blob();
      })
      .then((blob) => {
        const downloadUrl = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl); // Clean up the URL object
      })
      .catch((error) => {
        console.error("Error downloading PDF:", error);
      });
  };

  return (
    <Box width="100%" bgColor="#1e1e1e" borderRadius="lg">
      <Stack align="stretch">
        <Image
          src={data?.planPdf[0].url || noImage.src}
          width="100%"
          borderTopRadius="lg"
          alt="plan image"
        />
        <Stack p="8">
          <SimpleGrid columns={2} spacing={5}>
            <Box>
              <Heading size="md" color="#E4E6EB">
                Plan Type
              </Heading>
              <Text color="#E4E6EB">{data?.planType}</Text>
            </Box>
            <Box>
              <Heading size="md" color="#E4E6EB">
                Bedrooms
              </Heading>
              <Text color="#E4E6EB">{data?.bedrooms}</Text>
            </Box>
            <Box>
              <Heading size="md" color="#E4E6EB">
                Plan Width
              </Heading>
              <Text color="#E4E6EB">{data?.overallWidth}</Text>
            </Box>
            <Box>
              <Heading size="md" color="#E4E6EB">
                Plan Depth
              </Heading>
              <Text color="#E4E6EB">{data?.overallDepth}</Text>
            </Box>
            <Box>
              <Heading size="md" color="#E4E6EB">
                Number of Levels
              </Heading>
              <Text color="#E4E6EB">{data?.numberOfLevels}</Text>
            </Box>
            <Box>
              <Heading size="md" color="#E4E6EB">
                Garage Layout
              </Heading>
              <Text color="#E4E6EB">{data?.garageOrientation}</Text>
            </Box>
            <Box>
              <Heading size="md" color="#E4E6EB">
                First Floor Master
              </Heading>
              <Text color="#E4E6EB">
                {data?.firstFloorMaster === true ? "Yes" : "No"}
              </Text>
            </Box>
            <Box>
              <Heading size="md" color="#E4E6EB">
                Basement
              </Heading>
              <Text color="#E4E6EB">
                {data?.basement === true ? "Yes" : "No"}
              </Text>
            </Box>
            <Box>
              <Heading size="md" color="#E4E6EB">
                Walkup Attic
              </Heading>
              <Text color="#E4E6EB">
                {data?.walkupAttic === true ? "Yes" : "No"}
              </Text>
            </Box>
          </SimpleGrid>

          <Button mt={6} onClick={() => downloadFile()}>
            Download .pdf file
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
