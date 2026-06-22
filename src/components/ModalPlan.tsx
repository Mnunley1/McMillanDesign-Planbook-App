import { useUser } from "@clerk/clerk-react";
import {
  AlertCircle,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Download,
  Loader2,
  Printer,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useHits } from "react-instantsearch";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { usePlanData } from "@/hooks/use-plan-data";
import type { FloorPlanHit } from "@/types/floor-plan";
import { downloadFile, printImage } from "@/utils/planUtils";
import AddToCollectionDialog from "./AddToCollectionDialog";
import FloorPlanInfo from "./FloorPlanInfo";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContentNoClose,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

export default function ModalPlan() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const {
    data,
    isLoading: loading,
    error: queryError,
    refetch,
  } = usePlanData(id);
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const isMasterRoute = location.pathname.startsWith("/master");
  const { user } = useUser();
  const isAdmin = user?.publicMetadata?.role === "admin";

  // Swipe gesture tracking
  const touchStartRef = useRef<number | null>(null);

  // Get current hits for prev/next navigation
  const { hits } = useHits<FloorPlanHit>();

  const currentIndex = hits.findIndex((h) => h.objectID === id);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex >= 0 && currentIndex < hits.length - 1;

  const navigateToPlan = useCallback(
    (objectID: string) => {
      const base = isMasterRoute ? "/master/plan" : "/plan";
      navigate(`${base}/${objectID}`, { replace: true });
    },
    [navigate, isMasterRoute]
  );

  const goToPrev = useCallback(() => {
    if (hasPrev) {
      navigateToPlan(hits[currentIndex - 1].objectID);
    }
  }, [hasPrev, hits, currentIndex, navigateToPlan]);

  const goToNext = useCallback(() => {
    if (hasNext) {
      navigateToPlan(hits[currentIndex + 1].objectID);
    }
  }, [hasNext, hits, currentIndex, navigateToPlan]);

  // Keyboard arrow navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        goToPrev();
      }
      if (e.key === "ArrowRight") {
        goToNext();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [goToPrev, goToNext]);

  const handleClose = useCallback(() => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(isMasterRoute ? "/master" : "/");
    }
  }, [navigate, isMasterRoute]);

  const handleDownload = async () => {
    if (!data?.planPdf?.[0]?.url) {
      return;
    }
    try {
      setDownloading(true);
      setDownloadError(null);
      await downloadFile(data.planPdf[0].url, `${data.planNumber}.pdf`);
    } catch {
      setDownloadError("Failed to download PDF. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  // Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartRef.current === null) {
      return;
    }
    const delta = e.changedTouches[0].clientX - touchStartRef.current;
    touchStartRef.current = null;
    if (Math.abs(delta) > 50) {
      if (delta > 0) {
        goToPrev();
      } else {
        goToNext();
      }
    }
  };

  const error = queryError?.message || downloadError;

  return (
    <Dialog onOpenChange={handleClose} open>
      <DialogContentNoClose className="h-[98vh] max-h-[98vh] w-[95vw] overflow-hidden p-0 md:w-[65vw]">
        <DialogHeader className="sr-only">
          <DialogTitle>Floor Plan Details - {data?.planNumber}</DialogTitle>
          <DialogDescription>
            {data?.description ||
              "View floor plan details, specifications, and download options."}
          </DialogDescription>
        </DialogHeader>
        <div
          className="h-full overflow-y-auto bg-background p-4 md:p-8"
          onTouchEnd={handleTouchEnd}
          onTouchStart={handleTouchStart}
        >
          <div className="mb-3 flex justify-end">
            <Button
              className="text-muted-foreground hover:text-foreground"
              onClick={handleClose}
              size="icon"
              variant="ghost"
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
          <div className="mb-5 flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div className="flex items-center gap-2">
              <Button
                className="w-full border-yellow-500 text-yellow-500 hover:bg-yellow-500/10 md:w-auto"
                onClick={handleClose}
                variant="outline"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Search Results
              </Button>

              {/* Prev/Next navigation */}
              {hits.length > 0 && (
                <div className="hidden items-center gap-1 md:flex">
                  <Button
                    disabled={!hasPrev}
                    onClick={goToPrev}
                    size="icon"
                    variant="ghost"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    disabled={!hasNext}
                    onClick={goToNext}
                    size="icon"
                    variant="ghost"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            <div className="flex w-full flex-col items-stretch gap-2 md:w-auto md:flex-row md:items-center">
              <Button
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 md:w-auto"
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
                className="w-full border-border hover:bg-accent hover:text-accent-foreground md:w-auto"
                disabled={!data?.planPdf?.[0]?.url}
                onClick={() =>
                  printImage(
                    data?.planPdf?.[0]?.url || "",
                    data?.planNumber || ""
                  )
                }
                variant="outline"
              >
                <Printer className="mr-2 h-4 w-4" />
                Print Plan
              </Button>
              {isMasterRoute && isAdmin && id && (
                <AddToCollectionDialog planId={id} />
              )}
            </div>
          </div>

          {loading && (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <p className="mt-4 text-muted-foreground text-sm">
                Loading floor plan...
              </p>
            </div>
          )}

          {error && !loading && (
            <div className="flex flex-col items-center justify-center py-20">
              <AlertCircle className="h-8 w-8 text-destructive" />
              <p className="mt-4 text-destructive text-sm">{error}</p>
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

          {data && !loading && !error && <FloorPlanInfo hit={data} />}
        </div>
      </DialogContentNoClose>
    </Dialog>
  );
}
