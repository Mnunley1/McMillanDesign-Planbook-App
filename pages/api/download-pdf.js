import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ message: "URL is required" });
  }

  try {
    const response = await axios({
      method: "get",
      url: url,
      responseType: "arraybuffer",
      headers: {
        Accept: "application/pdf",
      },
    });

    // Try to detect PDF content type
    const contentType = response.headers["content-type"];
    const isPDF =
      contentType?.includes("pdf") ||
      contentType?.includes("application/octet-stream") ||
      url.toLowerCase().endsWith(".pdf");

    if (!isPDF) {
      console.log("Content type check failed:", {
        contentType,
        urlEndsWithPdf: url.toLowerCase().endsWith(".pdf"),
        responseSize: response.data.length,
      });
      throw new Error("Response is not a PDF");
    }

    // Set appropriate headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="document.pdf"`);
    res.setHeader("Content-Length", response.data.length);

    // Send the PDF data
    return res.send(response.data);
  } catch (error) {
    console.error("Error details:", {
      message: error.message,
      responseHeaders: error.response?.headers,
      status: error.response?.status,
      url: url,
    });
    return res.status(500).json({
      message: "Error downloading PDF",
      error: error.message,
      details: {
        contentType: error.response?.headers?.["content-type"],
        status: error.response?.status,
      },
    });
  }
}
