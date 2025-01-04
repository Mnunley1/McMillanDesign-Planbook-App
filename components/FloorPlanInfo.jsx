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

  // Create and configure your Cloudinary instance.
  const cld = new Cloudinary({
    cloud: {
      cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    },
  });

  // Function to get the Cloudinary PDF URL
  const getPdfUrl = (url) => {
    if (!url) return null;

    // Extract the public ID from the URL
    const matches = url.match(/\/v\d+\/(.+?)$/);
    if (!matches || !matches[1]) return url;

    const publicId = matches[1].replace(/\.[^/.]+$/, ""); // Remove file extension

    // Construct a direct PDF URL
    return `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/fl_attachment/${publicId}.pdf`;
  };

  const downloadFile = async (fileName = `${data?.planNumber}.pdf`) => {
    if (!image) {
      console.error("No PDF URL available");
      return;
    }

    const pdfUrl = getPdfUrl(image);

    try {
      const response = await fetch("/api/download-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: pdfUrl }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      // Check if we received a PDF
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("pdf")) {
        throw new Error("Received invalid content type");
      }

      const blob = await response.blob();
      if (blob.size === 0) {
        throw new Error("Received empty PDF");
      }

      const downloadUrl = window.URL.createObjectURL(
        new Blob([blob], { type: "application/pdf" })
      );

      // Create download link
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();

      // Cleanup
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);
      }, 100);
    } catch (error) {
      console.error("Error downloading PDF:", error);
      // You might want to show this error to the user through your UI
    }
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
