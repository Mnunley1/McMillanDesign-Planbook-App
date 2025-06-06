// Function to get the Cloudinary PDF URL
export const getPdfUrl = (url: string) => {
  if (!url) {
    console.log("getPdfUrl: No URL provided");
    return null;
  }

  console.log("getPdfUrl: Input URL:", url);
  console.log(
    "getPdfUrl: Cloudinary Cloud Name:",
    import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
  );

  // Extract the public ID from the URL
  const matches = url.match(/\/v\d+\/(.+?)$/);
  if (!matches || !matches[1]) {
    console.log("getPdfUrl: Could not extract public ID from URL");
    return url;
  }

  const publicId = matches[1].replace(/\.[^/.]+$/, ""); // Remove file extension
  console.log("getPdfUrl: Extracted public ID:", publicId);

  // Construct a direct PDF URL
  const pdfUrl = `https://res.cloudinary.com/${
    import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
  }/image/upload/fl_attachment/${publicId}.pdf`;
  console.log("getPdfUrl: Generated PDF URL:", pdfUrl);
  return pdfUrl;
};

export const downloadFile = async (image: string, fileName: string) => {
  if (!image) {
    console.error("downloadFile: No PDF URL available");
    return;
  }

  console.log("downloadFile: Starting download for image:", image);
  console.log("downloadFile: File name:", fileName);

  const pdfUrl = getPdfUrl(image);
  console.log("downloadFile: Generated PDF URL:", pdfUrl);

  if (!pdfUrl) {
    throw new Error("Could not generate PDF URL");
  }

  try {
    console.log("downloadFile: Fetching PDF from Cloudinary");
    const response = await fetch(pdfUrl);

    console.log("downloadFile: Response status:", response.status);
    console.log(
      "downloadFile: Response headers:",
      Object.fromEntries(response.headers.entries())
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Check if we received a PDF
    const contentType = response.headers.get("content-type");
    console.log("downloadFile: Content-Type:", contentType);

    if (!contentType || !contentType.includes("pdf")) {
      throw new Error("Received invalid content type");
    }

    const blob = await response.blob();
    console.log("downloadFile: Blob size:", blob.size);

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
    console.error("downloadFile: Error downloading PDF:", error);
    throw error; // Re-throw to allow handling by the caller
  }
};

export const printImage = (image: string, planNumber: string) => {
  if (!image) {
    console.error("No image URL available");
    return;
  }

  // Create a new window for printing
  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    console.error("No print window available");
    return;
  }

  printWindow.document.write(`
    <html>
      <head>
        <title>${planNumber || "Floor Plan"}</title>
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
          alt="Floor Plan ${planNumber || ""}" 
          onload="setTimeout(() => { window.print(); window.close(); }, 500);">
      </body>
    </html>
  `);
  printWindow.document.close();
};
