// Function to get the Cloudinary PDF URL
export const getPdfUrl = (url) => {
  if (!url) return null;

  // Extract the public ID from the URL
  const matches = url.match(/\/v\d+\/(.+?)$/);
  if (!matches || !matches[1]) return url;

  const publicId = matches[1].replace(/\.[^/.]+$/, ""); // Remove file extension

  // Construct a direct PDF URL
  return `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/fl_attachment/${publicId}.pdf`;
};

export const downloadFile = async (image, fileName) => {
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
  }
};

export const printImage = (image, planNumber) => {
  if (!image) {
    console.error("No image URL available");
    return;
  }

  // Create a new window for printing
  const printWindow = window.open("", "_blank");
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
