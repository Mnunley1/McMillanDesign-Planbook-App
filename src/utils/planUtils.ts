// Function to get the Cloudinary PDF URL
export const getPdfUrl = (url: string) => {
  if (!url) {
    return null;
  }

  // Extract the public ID from the URL
  const matches = url.match(/\/v\d+\/(.+?)$/);
  if (!matches?.[1]) {
    return url;
  }

  const publicId = matches[1].replace(/\.[^/.]+$/, ""); // Remove file extension

  // Construct a direct PDF URL
  return `https://res.cloudinary.com/${
    import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
  }/image/upload/fl_attachment/${publicId}.pdf`;
};

export const downloadFile = async (image: string, fileName: string) => {
  if (!image) {
    throw new Error("No PDF URL available");
  }

  const pdfUrl = getPdfUrl(image);

  if (!pdfUrl) {
    throw new Error("Could not generate PDF URL");
  }

  const response = await fetch(pdfUrl);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  // Check if we received a PDF
  const contentType = response.headers.get("content-type");

  if (!contentType?.includes("pdf")) {
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
};

export const printImage = (image: string, planNumber: string) => {
  if (!image) {
    return;
  }

  // Create a new window for printing
  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    return;
  }

  const doc = printWindow.document;
  doc.open();

  // Build DOM safely without string interpolation
  const html = doc.createElement("html");
  const head = doc.createElement("head");
  const title = doc.createElement("title");
  title.textContent = planNumber || "Floor Plan";

  const style = doc.createElement("style");
  style.textContent = `
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
  `;

  head.appendChild(title);
  head.appendChild(style);

  const body = doc.createElement("body");
  const img = doc.createElement("img");
  img.src = image;
  img.alt = `Floor Plan ${planNumber || ""}`;
  img.onload = () => {
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  body.appendChild(img);
  html.appendChild(head);
  html.appendChild(body);

  doc.appendChild(html);
  doc.close();
};
