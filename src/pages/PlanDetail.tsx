import { useUser } from "@clerk/clerk-react";
import { useMutation } from "convex/react";
import { motion, useReducedMotion } from "framer-motion";
import {
  AlertCircle,
  ArrowDownToLine,
  ArrowUpFromLine,
  Car,
  ChevronRight,
  DoorOpen,
  Download,
  Layers,
  Loader2,
  Printer,
  Ruler,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import CompareButton from "@/components/CompareButton";
import FavoriteButton from "@/components/FavoriteButton";
import ImageGallery from "@/components/ImageGallery";
import PlanNotes from "@/components/PlanNotes";
import SimilarPlans from "@/components/SimilarPlans";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { usePlanData } from "@/hooks/use-plan-data";
import { cn, isRecentlyAdded } from "@/lib/utils";
import type { FloorPlanHit } from "@/types/floor-plan";
import { downloadFile, printImage } from "@/utils/planUtils";
import { api } from "../../convex/_generated/api";

// ---------------------------------------------------------------------------
// Skeleton loading state
// ---------------------------------------------------------------------------

function PlanDetailSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center gap-2">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-20" />
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-5">
        <div className="md:col-span-3">
          <Skeleton className="aspect-[4/3] w-full rounded-lg" />
          <div className="mt-2 flex gap-2">
            <Skeleton className="h-20 w-24 rounded" />
            <Skeleton className="h-20 w-24 rounded" />
            <Skeleton className="h-20 w-24 rounded" />
          </div>
        </div>

        <div className="space-y-6 md:col-span-2">
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-40" />
            <Skeleton className="h-6 w-16 rounded-md" />
          </div>

          <div className="flex items-baseline justify-around border-border border-y py-6">
            <div className="flex flex-col items-center gap-1">
              <Skeleton className="h-10 w-8" />
              <Skeleton className="h-3 w-10" />
            </div>
            <Separator className="h-12" orientation="vertical" />
            <div className="flex flex-col items-center gap-1">
              <Skeleton className="h-10 w-8" />
              <Skeleton className="h-3 w-10" />
            </div>
            <Separator className="h-12" orientation="vertical" />
            <div className="flex flex-col items-center gap-1">
              <Skeleton className="h-10 w-16" />
              <Skeleton className="h-3 w-10" />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-8 w-24 rounded-md" />
            <Skeleton className="h-8 w-28 rounded-md" />
            <Skeleton className="h-8 w-20 rounded-md" />
            <Skeleton className="h-8 w-32 rounded-md" />
          </div>

          <Skeleton className="h-10 w-full rounded-md" />
          <div className="flex gap-2">
            <Skeleton className="h-9 w-9 rounded-md" />
            <Skeleton className="h-9 w-9 rounded-md" />
            <Skeleton className="h-9 w-9 rounded-md" />
            <Skeleton className="h-9 w-9 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Feature pill helper
// ---------------------------------------------------------------------------

interface FeaturePillProps {
  icon: React.ReactNode;
  label: string;
}

function FeaturePill({ icon, label }: FeaturePillProps) {
  return (
    <Badge className="gap-1.5 px-3 py-1.5 text-sm" variant="outline">
      {icon}
      {label}
    </Badge>
  );
}

// ---------------------------------------------------------------------------
// Build feature pills from plan data
// ---------------------------------------------------------------------------

function getFeaturePills(hit: FloorPlanHit) {
  const pills: FeaturePillProps[] = [];
  const iconClass = "h-3.5 w-3.5 text-muted-foreground";

  if (hit.numberOfLevels) {
    pills.push({
      icon: <Layers className={iconClass} />,
      label: `${hit.numberOfLevels} ${hit.numberOfLevels === 1 ? "Level" : "Levels"}`,
    });
  }

  if (hit.planWidth && hit.planDepth) {
    pills.push({
      icon: <Ruler className={iconClass} />,
      label: `${hit.planWidth}' x ${hit.planDepth}'`,
    });
  }

  if (hit.garageOrientation) {
    pills.push({
      icon: <Car className={iconClass} />,
      label: `${hit.garageOrientation} Garage`,
    });
  }

  if (hit.vehicleSpaces) {
    pills.push({
      icon: <Car className={iconClass} />,
      label: `${hit.vehicleSpaces}-Car Garage`,
    });
  }

  if (hit.primarySuite) {
    pills.push({
      icon: <DoorOpen className={iconClass} />,
      label: `${hit.primarySuite} Primary Suite`,
    });
  }

  if (hit.basement) {
    pills.push({
      icon: <ArrowDownToLine className={iconClass} />,
      label: "Basement",
    });
  }

  if (hit.walkupAttic) {
    pills.push({
      icon: <ArrowUpFromLine className={iconClass} />,
      label: "Walk-up Attic",
    });
  }

  return pills;
}

// ---------------------------------------------------------------------------
// Main PlanDetail page
// ---------------------------------------------------------------------------

export default function PlanDetail() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, error, refetch } = usePlanData(id);
  const [downloading, setDownloading] = useState(false);
  const [stickyVisible, setStickyVisible] = useState(false);

  const { user } = useUser();
  const trackViewMutation = useMutation(api.analytics.trackView);
  const addRecentlyViewed = useMutation(api.recentlyViewed.add);

  // Stable refs for mutations to avoid re-firing effects
  const trackViewRef = useRef(trackViewMutation);
  trackViewRef.current = trackViewMutation;
  const addRecentlyViewedRef = useRef(addRecentlyViewed);
  addRecentlyViewedRef.current = addRecentlyViewed;

  const mainRef = useRef<HTMLElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Focus main element and scroll to top when plan changes
  // biome-ignore lint/correctness/useExhaustiveDependencies: id is intentionally used to re-run this effect on plan navigation
  useEffect(() => {
    mainRef.current?.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }, [id]);

  // Intersection observer for sticky action bar
  // biome-ignore lint/correctness/useExhaustiveDependencies: data is intentionally used to re-attach the observer after plan data loads
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setStickyVisible(!entry.isIntersecting);
      },
      { threshold: 0 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [data]);

  // Track plan view + recently viewed
  useEffect(() => {
    if (!(user?.id && id && data?.planNumber)) {
      return;
    }
    trackViewRef.current({
      planId: id,
      planNumber: data.planNumber,
      userId: user.id,
    });
    addRecentlyViewedRef.current({
      userId: user.id,
      planId: id,
      planNumber: data.planNumber,
    });
  }, [id, user?.id, data?.planNumber]);

  const handleDownload = useCallback(async () => {
    if (!data?.planPdf?.[0]?.url) {
      return;
    }
    try {
      setDownloading(true);
      await downloadFile(data.planPdf[0].url, `${data.planNumber}.pdf`);
    } catch {
      // Silent fail -- user sees button state reset
    } finally {
      setDownloading(false);
    }
  }, [data]);

  const handlePrint = useCallback(() => {
    if (!data?.planPdf?.[0]?.url) {
      return;
    }
    printImage(data.planPdf[0].url, data.planNumber);
  }, [data]);

  // Loading state
  if (isLoading) {
    return (
      <main aria-label="Loading floor plan" ref={mainRef} tabIndex={-1}>
        <PlanDetailSkeleton />
      </main>
    );
  }

  // Error state
  if (error && !isLoading) {
    return (
      <main
        aria-label="Error loading floor plan"
        className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8"
        ref={mainRef}
        tabIndex={-1}
      >
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
      </main>
    );
  }

  if (!data) {
    return null;
  }

  const squareFootage = data.squareFeet || data.sqft || 0;
  const featurePills = getFeaturePills(data);
  const hasPdf = !!data.planPdf?.[0]?.url;

  return (
    <main
      aria-label={`Floor plan ${data.planNumber}`}
      className="outline-none"
      ref={mainRef}
      tabIndex={-1}
    >
      {/* Sticky Action Bar */}
      <div
        className={cn(
          "fixed inset-x-0 top-16 z-40 border-border border-b bg-background/95 backdrop-blur-sm",
          "transform transition-transform duration-200",
          stickyVisible ? "translate-y-0" : "-translate-y-full"
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-sm">{data.planNumber}</span>
            <Badge className="text-xs" variant="secondary">
              {squareFootage.toLocaleString()} sqft
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <FavoriteButton planId={id!} size="sm" />
            <CompareButton planId={id!} planNumber={data.planNumber} />
            <Button
              disabled={!hasPdf || downloading}
              onClick={handleDownload}
              size="sm"
            >
              {downloading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              <span className="hidden sm:inline">
                {downloading ? "Downloading..." : "Download PDF"}
              </span>
            </Button>
          </div>
        </div>
      </div>

      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8"
        initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-1.5 text-muted-foreground text-sm">
            <li>
              <Link className="transition-colors hover:text-foreground" to="/">
                Home
              </Link>
            </li>
            {data.planType && (
              <>
                <li aria-hidden="true">
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50" />
                </li>
                <li>
                  <span className="text-muted-foreground">
                    {data.planType} Plans
                  </span>
                </li>
              </>
            )}
            <li aria-hidden="true">
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50" />
            </li>
            <li>
              <span aria-current="page" className="font-medium text-foreground">
                {data.planNumber}
              </span>
            </li>
          </ol>
        </nav>

        {/* Hero Section: Image Gallery + Summary Panel */}
        <section aria-label="Plan overview">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-5">
            {/* Image Gallery */}
            <div className="md:col-span-3">
              <div className="relative overflow-hidden rounded-lg border border-border">
                <ImageGallery
                  images={data.planPdf || []}
                  planNumber={data.planNumber}
                />
                {data.createdAt && isRecentlyAdded(data.createdAt) && (
                  <Badge
                    className="absolute top-4 left-4 z-10 bg-emerald-500/90 text-white shadow-sm hover:bg-emerald-500"
                    variant="default"
                  >
                    Recently Added
                  </Badge>
                )}
              </div>
            </div>

            {/* Summary Panel */}
            <div className="md:col-span-2">
              <div className="space-y-6">
                {/* Plan heading */}
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="font-semibold text-3xl tracking-tight">
                    Plan {data.planNumber}
                  </h1>
                  {data.planType && (
                    <Badge variant="secondary">{data.planType}</Badge>
                  )}
                </div>

                {/* Stat row */}
                <div className="flex items-baseline justify-center gap-12 border-border border-y py-6">
                  <div className="flex flex-col items-center">
                    <span className="font-bold text-4xl tracking-tight">
                      {data.bedrooms}
                    </span>
                    <span className="text-muted-foreground text-xs uppercase tracking-wider">
                      Beds
                    </span>
                  </div>
                  <Separator className="h-12" orientation="vertical" />
                  <div className="flex flex-col items-center">
                    <span className="font-bold text-4xl tracking-tight">
                      {squareFootage.toLocaleString()}
                    </span>
                    <span className="text-muted-foreground text-xs uppercase tracking-wider">
                      Sq Ft
                    </span>
                  </div>
                </div>

                {/* Feature pills */}
                {featurePills.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {featurePills.map((pill) => (
                      <FeaturePill
                        icon={pill.icon}
                        key={pill.label}
                        label={pill.label}
                      />
                    ))}
                  </div>
                )}

                {/* Download PDF button */}
                <Button
                  className="w-full"
                  disabled={!hasPdf || downloading}
                  onClick={handleDownload}
                >
                  {downloading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                  {downloading ? "Downloading..." : "Download PDF"}
                </Button>

                {/* Action button row */}
                <div className="flex items-center gap-2">
                  <FavoriteButton planId={id!} size="sm" />
                  <CompareButton planId={id!} planNumber={data.planNumber} />
                  <Button
                    aria-label="Print floor plan"
                    disabled={!hasPdf}
                    onClick={handlePrint}
                    size="icon"
                    variant="outline"
                  >
                    <Printer className="h-4 w-4" />
                  </Button>
                </div>

                {/* Notes section */}
                {id && (
                  <div className="border-border border-t pt-4">
                    <PlanNotes planId={id} />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sentinel for sticky bar intersection observer */}
          <div aria-hidden="true" ref={sentinelRef} />
        </section>

        {/* Description Section */}
        {data.description && (
          <section aria-label="About this plan" className="mt-10">
            <div className="border-primary/30 border-l-2 py-2 pl-6">
              <h2 className="font-semibold text-lg">About This Plan</h2>
              <p className="mt-2 max-w-prose text-base text-muted-foreground leading-relaxed">
                {data.description}
              </p>
            </div>
          </section>
        )}

        {/* Similar Plans */}
        <section aria-label="Similar plans" className="mt-10">
          <SimilarPlans
            bedrooms={data.bedrooms}
            currentPlanId={id!}
            planType={data.planType}
          />
        </section>
      </motion.div>
    </main>
  );
}
