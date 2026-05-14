import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  BookmarkPlus,
  Calendar,
  Expand,
  GitCompareArrows,
  ImageOff,
  Loader2,
  Play,
  Trash2,
  X,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import EmptyState from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogContentNoClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ZoomableImage from "@/components/ZoomableImage";
import { useComparison } from "@/hooks/use-comparison";
import { useSavedComparisons } from "@/hooks/use-saved-comparisons";
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
  const [enlarged, setEnlarged] = useState(false);

  if (imageError || !src) {
    return (
      <div className="flex h-48 w-full flex-col items-center justify-center bg-muted">
        <ImageOff className="h-10 w-10 text-muted-foreground" />
        <p className="mt-1 text-muted-foreground text-xs">Image unavailable</p>
      </div>
    );
  }

  return (
    <>
      <button
        className="group relative w-full cursor-zoom-in"
        onClick={() => setEnlarged(true)}
        type="button"
      >
        <img
          alt={alt}
          className="w-full object-contain p-2"
          onError={() => setImageError(true)}
          src={src}
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/20">
          <Expand className="h-6 w-6 text-white opacity-0 transition-opacity group-hover:opacity-100" />
        </div>
      </button>
      <Dialog onOpenChange={setEnlarged} open={enlarged}>
        <DialogContentNoClose className="flex h-[90vh] max-h-[90vh] w-[90vw] max-w-[90vw] flex-col p-4">
          <DialogHeader className="sr-only">
            <DialogTitle>{alt}</DialogTitle>
          </DialogHeader>
          <div className="mb-2 flex items-center justify-between">
            <span className="font-medium text-sm">{alt}</span>
            <DialogClose asChild>
              <Button size="icon" variant="outline">
                <X className="h-4 w-4" />
              </Button>
            </DialogClose>
          </div>
          <div className="min-h-0 flex-1">
            <ZoomableImage alt={alt} src={src} />
          </div>
        </DialogContentNoClose>
      </Dialog>
    </>
  );
}

export default function Compare() {
  const { selectedIds, clear, add } = useComparison();
  const { savedComparisons, save, remove: removeSaved } = useSavedComparisons();
  const navigate = useNavigate();
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [saveName, setSaveName] = useState("");

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

  const handleSave = () => {
    if (!saveName.trim() || selectedIds.length === 0) {
      return;
    }
    save(saveName.trim(), selectedIds);
    setSaveName("");
    setSaveDialogOpen(false);
  };

  const handleLoad = (planIds: string[]) => {
    clear();
    for (const id of planIds) {
      add(id);
    }
  };

  return (
    <Container className="max-w-6xl py-6 pb-24">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-bold text-2xl">Compare Plans</h1>
        <div className="flex gap-2">
          <Button onClick={() => navigate(-1)} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          {plans.length > 0 && (
            <>
              <Button onClick={() => setSaveDialogOpen(true)} variant="outline">
                <BookmarkPlus className="mr-2 h-4 w-4" />
                Save Comparison
              </Button>
              <Button onClick={clear} variant="ghost">
                Clear All
              </Button>
            </>
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

      {/* Saved Comparisons */}
      {savedComparisons.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-4 font-semibold text-lg">Saved Comparisons</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {savedComparisons.map((comparison) => (
              <div
                className="flex flex-col gap-3 rounded-lg border p-4"
                key={comparison._id}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium">{comparison.name}</p>
                    <p className="text-muted-foreground text-sm">
                      {comparison.planIds.length} plan
                      {comparison.planIds.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground text-xs">
                    <Calendar className="h-3 w-3" />
                    {new Date(comparison.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    className="flex-1"
                    onClick={() => handleLoad(comparison.planIds)}
                    size="sm"
                    variant="outline"
                  >
                    <Play className="mr-1.5 h-3.5 w-3.5" />
                    Load
                  </Button>
                  <Button
                    onClick={() => removeSaved(comparison._id)}
                    size="sm"
                    variant="ghost"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Save Dialog */}
      <Dialog onOpenChange={setSaveDialogOpen} open={saveDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Save Comparison</DialogTitle>
            <DialogDescription>
              Give this comparison a name so you can find it later.
            </DialogDescription>
          </DialogHeader>
          <Input
            onChange={(e) => setSaveName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSave();
              }
            }}
            placeholder="e.g. Ranch plans under 2000 sqft"
            value={saveName}
          />
          <DialogFooter>
            <Button disabled={!saveName.trim()} onClick={handleSave}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Container>
  );
}
