import {
  ArrowUpDown,
  BedDouble,
  Car,
  DoorOpen,
  Home,
  Layers,
  Ruler,
  Square,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn, isRecentlyAdded } from "@/lib/utils";
import type { FloorPlanHit } from "@/types/floor-plan";
import ImageGallery from "./ImageGallery";
import PlanNotes from "./PlanNotes";

interface FloorPlanInfoProps {
  className?: string;
  hit: FloorPlanHit;
}

function FloorPlanInfo({ hit, className }: FloorPlanInfoProps) {
  // Use either squareFeet or sqft, preferring squareFeet
  const squareFootage = hit.squareFeet || hit.sqft || 0;

  return (
    <div className={cn("space-y-6", className)}>
      {/* Plan Image */}
      <Card className="overflow-hidden">
        <div className="relative">
          <ImageGallery
            images={hit.planPdf || []}
            planNumber={hit.planNumber}
          />
          <Badge
            className="absolute top-4 right-4 z-10 bg-background/90 text-foreground shadow-sm backdrop-blur-sm"
            variant="secondary"
          >
            {squareFootage.toLocaleString()} sqft
          </Badge>

          {/* Recently added pill */}
          {hit.createdAt && isRecentlyAdded(hit.createdAt) && (
            <Badge
              className="absolute top-4 left-4 z-10 bg-emerald-500/90 text-white shadow-sm hover:bg-emerald-500"
              variant="default"
            >
              Recently Added
            </Badge>
          )}
        </div>
      </Card>

      {/* Plan Details */}
      <Card>
        <CardHeader className="border-b">
          <h2 className="font-semibold text-3xl tracking-tight">
            {hit.planNumber}
          </h2>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 gap-x-12 gap-y-8 md:grid-cols-2">
            {/* Primary Features */}
            <div className="space-y-6">
              <div>
                <h3 className="mb-4 flex items-center gap-2 font-semibold text-lg">
                  <Home className="h-5 w-5 text-primary" />
                  Primary Features
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-base">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
                      <BedDouble className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <span className="font-medium">{hit.bedrooms}</span>
                      <span className="text-muted-foreground"> Bedrooms</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-base">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
                      <Square className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <span className="font-medium">
                        {squareFootage.toLocaleString()}
                      </span>
                      <span className="text-muted-foreground"> sqft</span>
                    </div>
                  </div>
                  {hit.planType && (
                    <div className="flex items-center gap-3 text-base">
                      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
                        <Home className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <span className="font-medium">{hit.planType}</span>
                      </div>
                    </div>
                  )}
                  {hit.numberOfLevels && (
                    <div className="flex items-center gap-3 text-base">
                      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
                        <Layers className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <span className="font-medium">
                          {hit.numberOfLevels}
                        </span>
                        <span className="text-muted-foreground"> Levels</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Dimensions & Features */}
            <div className="space-y-6">
              <div>
                <h3 className="mb-4 flex items-center gap-2 font-semibold text-lg">
                  <Ruler className="h-5 w-5 text-primary" />
                  Dimensions & Features
                </h3>
                <div className="space-y-4">
                  {hit.planWidth && hit.planDepth && (
                    <>
                      <div className="flex items-center gap-3 text-base">
                        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
                          <Ruler className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <span className="font-medium">{hit.planWidth}'</span>
                          <span className="text-muted-foreground"> Width</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-base">
                        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
                          <Ruler className="h-4 w-4 rotate-90 text-primary" />
                        </div>
                        <div>
                          <span className="font-medium">{hit.planDepth}'</span>
                          <span className="text-muted-foreground"> Depth</span>
                        </div>
                      </div>
                    </>
                  )}
                  {hit.vehicleSpaces && (
                    <div className="flex items-center gap-3 text-base">
                      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
                        <Car className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <span className="font-medium">{hit.vehicleSpaces}</span>
                        <span className="text-muted-foreground">
                          {" "}
                          Vehicle Spaces
                        </span>
                      </div>
                    </div>
                  )}
                  {hit.garageOrientation && (
                    <div className="flex items-center gap-3 text-base">
                      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
                        <Car className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <span className="font-medium">
                          {hit.garageOrientation}
                        </span>
                        <span className="text-muted-foreground"> Garage</span>
                      </div>
                    </div>
                  )}
                  {hit.primarySuite && (
                    <div className="flex items-center gap-3 text-base">
                      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
                        <DoorOpen className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <span className="font-medium">
                          {hit.primarySuite} Primary Suite
                        </span>
                      </div>
                    </div>
                  )}
                  {hit.basement && (
                    <div className="flex items-center gap-3 text-base">
                      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
                        <ArrowUpDown className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <span className="font-medium">Basement</span>
                      </div>
                    </div>
                  )}
                  {hit.walkupAttic && (
                    <div className="flex items-center gap-3 text-base">
                      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
                        <ArrowUpDown className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <span className="font-medium">Walk-up Attic</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Notes */}
      {hit.objectID && (
        <Card>
          <CardContent className="pt-6">
            <PlanNotes planId={hit.objectID} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default FloorPlanInfo;
