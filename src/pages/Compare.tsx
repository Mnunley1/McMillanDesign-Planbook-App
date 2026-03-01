import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, GitCompareArrows, ImageOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import EmptyState from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useComparison } from "@/hooks/use-comparison";
import { searchClient } from "@/lib/algolia";
import { cn } from "@/lib/utils";
import type { FloorPlanHit } from "@/types/floor-plan";

const ATTRIBUTES: Array<{
  key: keyof FloorPlanHit;
  label: string;
  format?: (val: unknown) => string;
}> = [
  { key: "planNumber", label: "Plan Number" },
  { key: "planType", label: "Plan Type" },
  {
    key: "bedrooms",
    label: "Bedrooms",
  },
  {
    key: "squareFeet",
    label: "Square Feet",
    format: (v) => (v ? Number(v).toLocaleString() : "—"),
  },
  {
    key: "planWidth",
    label: "Width (ft)",
    format: (v) => (v ? `${v}'` : "—"),
  },
  {
    key: "planDepth",
    label: "Depth (ft)",
    format: (v) => (v ? `${v}'` : "—"),
  },
  { key: "numberOfLevels", label: "Levels" },
  { key: "garageOrientation", label: "Garage" },
  { key: "vehicleSpaces", label: "Vehicle Spaces" },
  { key: "primarySuite", label: "Primary Suite" },
  {
    key: "basement",
    label: "Basement",
    format: (v) => (v ? "Yes" : "No"),
  },
  {
    key: "walkupAttic",
    label: "Walk-up Attic",
    format: (v) => (v ? "Yes" : "No"),
  },
];

function ComparePlanImage({ src, alt }: { src?: string; alt: string }) {
  const [imageError, setImageError] = useState(false);

  if (imageError || !src) {
    return (
      <div className="flex h-40 w-full flex-col items-center justify-center bg-muted">
        <ImageOff className="h-10 w-10 text-muted-foreground" />
        <p className="mt-1 text-muted-foreground text-xs">Image unavailable</p>
      </div>
    );
  }

  return (
    <img
      alt={alt}
      className="h-40 w-full object-cover"
      onError={() => setImageError(true)}
      src={src}
    />
  );
}

export default function Compare() {
  const { selectedIds, clear } = useComparison();
  const navigate = useNavigate();

  const { data: plans = [], isLoading } = useQuery({
    queryKey: ["compare-plans", selectedIds],
    queryFn: async () => {
      if (selectedIds.length === 0) {
        return [];
      }
      const index = searchClient.initIndex("floorPlans");
      const { results } = await index.getObjects<FloorPlanHit>(selectedIds);
      return results.filter((r): r is FloorPlanHit => r !== null);
    },
    enabled: selectedIds.length > 0,
    staleTime: 5 * 60 * 1000,
  });

  return (
    <Container className="max-w-6xl py-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-bold text-2xl">Compare Plans</h1>
        <div className="flex gap-2">
          <Button onClick={() => navigate(-1)} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          {plans.length > 0 && (
            <Button onClick={clear} variant="ghost">
              Clear All
            </Button>
          )}
        </div>
      </div>

      {isLoading && (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )}

      {!isLoading && plans.length === 0 && (
        <EmptyState
          actionHref="/"
          actionLabel="Browse Plans"
          description="Add plans from the search results to compare them side by side."
          icon={GitCompareArrows}
          title="No plans selected"
        />
      )}

      {plans.length > 0 && (
        <>
          {/* Plan images row */}
          <div className="mb-6 overflow-x-auto">
            <div
              className="flex gap-4"
              style={{ minWidth: `${plans.length * 180}px` }}
            >
              {plans.map((plan) => (
                <div
                  className="min-w-[160px] flex-1 overflow-hidden rounded-lg border"
                  key={plan.objectID}
                >
                  <ComparePlanImage alt={plan.planNumber} src={plan.image} />
                </div>
              ))}
            </div>
          </div>

          {/* Comparison table */}
          <div className="overflow-x-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="sticky left-0 z-10 w-40 bg-background">
                    Attribute
                  </TableHead>
                  {plans.map((plan) => (
                    <TableHead className="min-w-[120px]" key={plan.objectID}>
                      {plan.planNumber}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {ATTRIBUTES.map((attr) => {
                  const values = plans.map((p) => p[attr.key]);
                  const allSame = values.every(
                    (v) => String(v) === String(values[0])
                  );
                  return (
                    <TableRow key={attr.key}>
                      <TableCell className="sticky left-0 z-10 bg-background font-medium">
                        {attr.label}
                      </TableCell>
                      {plans.map((plan) => {
                        const val = plan[attr.key];
                        const display = attr.format
                          ? attr.format(val)
                          : val != null
                            ? String(val)
                            : "—";
                        return (
                          <TableCell
                            className={cn(
                              "min-w-[120px]",
                              !allSame && "bg-primary/5 font-medium"
                            )}
                            key={plan.objectID}
                          >
                            {display}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </Container>
  );
}
