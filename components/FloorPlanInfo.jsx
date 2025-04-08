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

  const printImage = () => {
    if (!image) {
      console.error("No image URL available");
      return;
    }

    // Create a new window for printing
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>${data?.planNumber || "Floor Plan"}</title>
          <style>
            body {
              margin: 0;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              background: white;
            }
            img {
              max-width: 100%;
              max-height: 100vh;
              width: auto;
              height: auto;
              object-fit: contain;
            }
            @media print {
              @page {
                size: auto;
                margin: 0.5cm;
              }
              body {
                margin: 0;
              }
              img {
                max-height: none;
              }
            }
          </style>
        </head>
        <body>
          <img 
            src="${image}" 
            alt="Floor Plan ${data?.planNumber || ""}" 
            onload="setTimeout(() => { window.print(); window.close(); }, 500);">
        </body>
      </html>
    `);
    printWindow.document.close();
  };

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

            <Box className="no-print">
              <Button
                onClick={() => downloadFile()}
                leftIcon={<Box as="span" className="fas fa-download" />}
                colorScheme="blue"
              >
                Download PDF
              </Button>
            </Box>
            <Box className="no-print">
              <Button
                onClick={printImage}
                leftIcon={<Box as="span" className="fas fa-print" />}
                colorScheme="gray"
              >
                Print Plan
              </Button>
            </Box>
          </Stack>
        </Stack>
      </Box>
    </>
  );
}
