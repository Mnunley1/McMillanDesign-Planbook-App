import {
  Dialog,
  DialogContentNoClose,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { downloadFile, printImage } from "@/utils/planUtils";
import { createClient } from "contentful";
import { ArrowLeft, Download, Printer } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import FloorPlanInfo from "./FloorPlanInfo";
import { Button } from "./ui/button";

// Types
interface PlanData {
  objectID: string;
  planNumber: string;
  description: string;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  planPdf: Array<{ url: string }>;
  image?: string;
  [key: string]: any; // for other fields
}

// Initialize Contentful clients
const previewClient = createClient({
  space: import.meta.env.VITE_CONTENTFUL_SPACE_ID,
  accessToken: import.meta.env.VITE_CONTENTFUL_PREVIEW_TOKEN,
  host: "preview.contentful.com",
});

const productionClient = createClient({
  space: import.meta.env.VITE_CONTENTFUL_SPACE_ID,
  accessToken: import.meta.env.VITE_CONTENTFUL_ACCESS_TOKEN,
});

export default function ModalPlan() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<PlanData | null>(null);
  const isMasterRoute = location.pathname.startsWith("/master");

  const handleClose = () => {
    navigate(-1);
  };

  useEffect(() => {
    const getPlan = async (planId: string) => {
      try {
        // Use preview client for master route, production client otherwise
        const client = isMasterRoute ? previewClient : productionClient;
        const response = await client.getEntry(planId);
        setData(response.fields as PlanData);
      } catch (error) {
        console.error("Error fetching plan:", error);
      }
    };

    if (id) {
      getPlan(id);
    }
  }, [id, isMasterRoute]);

  return (
    <Dialog open onOpenChange={handleClose}>
      <DialogContentNoClose className="w-[95vw] md:w-[65vw] h-[98vh] max-h-[98vh] p-0 overflow-hidden">
        <DialogHeader className="sr-only">
          <DialogTitle>Floor Plan Details - {data?.planNumber}</DialogTitle>
          <DialogDescription>
            {data?.description ||
              "View floor plan details, specifications, and download options."}
          </DialogDescription>
        </DialogHeader>
        <div className="h-full overflow-y-auto bg-background p-4 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
            <Button
              variant="outline"
              onClick={handleClose}
              className="border-yellow-500 text-yellow-500 hover:bg-yellow-500/10 w-full md:w-auto"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Search Results
            </Button>

            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2 w-full md:w-auto">
              <Button
                variant="default"
                onClick={() =>
                  downloadFile(
                    data?.planPdf?.[0]?.url || "",
                    `${data?.planNumber}.pdf`
                  )
                }
                disabled={!data?.planPdf?.[0]?.url}
                className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto"
              >
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  printImage(
                    data?.planPdf?.[0]?.url || "",
                    data?.planNumber || ""
                  )
                }
                disabled={!data?.planPdf?.[0]?.url}
                className="border-gray-300 hover:bg-gray-100 w-full md:w-auto"
              >
                <Printer className="mr-2 h-4 w-4" />
                Print Plan
              </Button>
            </div>
          </div>

          {data && <FloorPlanInfo hit={data} />}
        </div>
      </DialogContentNoClose>
    </Dialog>
  );
}
