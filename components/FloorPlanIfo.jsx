import {
  Box,
  Button,
  HStack,
  Heading,
  Image,
  Stack,
  Text,
} from "@chakra-ui/react";

import { Cloudinary } from "@cloudinary/url-gen";

export default function FloorPlanInfo({ data }) {
  const image = data?.planPdf[0].url;
  const file = image?.split("/").pop();

  // Create and configure your Cloudinary instance.
  const cld = new Cloudinary({
    cloud: {
      cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    },
  });

  // Use the image with public ID, 'front_face'.
  const myImage = cld.image(file);

  // Apply the transformation.
  const url = myImage.toURL();

  const downloadFile = (fileName = `${data?.planNumber}.pdf`) => {
    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/pdf",
      },
    })
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]));

        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;

        document.body.appendChild(link);

        link.click();

        link.parentNode.removeChild(link);
      });
  };

  return (
    <Box width="100%" bgColor="#1e1e1e" borderRadius="lg">
      <HStack align="stretch">
        <Image
          src={data?.planPdf[0].url}
          width="75%"
          borderLeftRadius="lg"
          alt="plan image"
        />
        <Stack p="3">
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

          <Button onClick={() => downloadFile()}>Download .pdf file</Button>
        </Stack>
      </HStack>
    </Box>
  );
}
