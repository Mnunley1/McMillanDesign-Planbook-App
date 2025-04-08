/* eslint-disable react-hooks/rules-of-hooks */
import { Box, Button, Container, HStack, Spacer } from "@chakra-ui/react";
import { createClient } from "contentful";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import FloorPlanInfo from "../../components/FloorPlanInfo";
import Layout from "../../components/Layout";

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

  const printImage = () => {
    if (!data?.planPdf?.[0]?.url) {
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
            src="${data.planPdf[0].url}" 
            alt="Floor Plan ${data?.planNumber || ""}" 
            onload="setTimeout(() => { window.print(); window.close(); }, 500);">
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const downloadFile = async (fileName = `${data?.planNumber}.pdf`) => {
    if (!data?.planPdf?.[0]?.url) {
      console.error("No PDF URL available");
      return;
    }

    try {
      const response = await fetch("/api/download-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: data.planPdf[0].url }),
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
    }
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
                onClick={() => downloadFile()}
                leftIcon={<Box as="span" className="fas fa-download" />}
                colorScheme="blue"
              >
                Download PDF
              </Button>
              <Button
                onClick={printImage}
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
