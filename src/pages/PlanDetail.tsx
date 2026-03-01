import {
  AlertCircle,
  ArrowLeft,
  Download,
  Loader2,
  Printer,
} from "lucide-react";
import { useState } from "react";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import FloorPlanInfo from "@/components/FloorPlanInfo";
import SimilarPlans from "@/components/SimilarPlans";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { usePlanData } from "@/hooks/use-plan-data";
import { downloadFile, printImage } from "@/utils/planUtils";

export default function PlanDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading, error, refetch } = usePlanData(id);
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    if (!data?.planPdf?.[0]?.url) {
      return;
    }
    try {
      setDownloading(true);
      await downloadFile(data.planPdf[0].url, `${data.planNumber}.pdf`);
    } catch {
      // Silent fail — user sees the button state reset
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Container className="max-w-5xl py-6">
      {/* Breadcrumb */}
      <nav className="mb-4 text-muted-foreground text-sm">
        <RouterLink className="hover:text-foreground" to="/">
          Home
        </RouterLink>
        <span className="mx-2">/</span>
        <span className="text-foreground">{data?.planNumber || "Plan"}</span>
      </nav>

      {/* Action bar */}
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <Button onClick={() => navigate(-1)} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div className="flex gap-2">
          <Button
            className="bg-blue-600 hover:bg-blue-700"
            disabled={!data?.planPdf?.[0]?.url || downloading}
            onClick={handleDownload}
            variant="default"
          >
            {downloading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Download className="mr-2 h-4 w-4" />
            )}
            {downloading ? "Downloading..." : "Download PDF"}
          </Button>
          <Button
            disabled={!data?.planPdf?.[0]?.url}
            onClick={() =>
              printImage(data?.planPdf?.[0]?.url || "", data?.planNumber || "")
            }
            variant="outline"
          >
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
        </div>
      </div>

      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="mt-4 text-muted-foreground text-sm">
            Loading floor plan...
          </p>
        </div>
      )}

      {error && !isLoading && (
        <div className="flex flex-col items-center justify-center py-20">
          <AlertCircle className="h-8 w-8 text-destructive" />
          <p className="mt-4 text-destructive text-sm">{error.message}</p>
          <Button
            className="mt-4"
            onClick={() => refetch()}
            size="sm"
            variant="outline"
          >
            Try Again
          </Button>
        </div>
      )}

      {data && !isLoading && !error && (
        <>
          <FloorPlanInfo hit={data} />
          <div className="mt-8">
            <SimilarPlans
              bedrooms={data.bedrooms}
              currentPlanId={id!}
              planType={data.planType}
            />
          </div>
        </>
      )}
    </Container>
  );
}
