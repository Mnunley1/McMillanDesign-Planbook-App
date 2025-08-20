import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn, isRecentlyAdded } from "@/lib/utils";
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

interface FloorPlanHit {
  objectID: string;
  planNumber: string;
  description: string;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  planDepth?: number;
  planWidth?: number;
  sqft?: number;
  planType?: string;
  numberOfLevels?: number;
  primarySuite?: string;
  garageOrientation?: string;
  basement?: boolean;
  walkupAttic?: boolean;
  vehicleSpaces?: number;
  image?: string;
  planPdf?: Array<{ url: string }>;
  createdAt?: string; // ISO date string for when the plan was created
}

interface FloorPlanInfoProps {
  hit: FloorPlanHit;
  className?: string;
}

function FloorPlanInfo({ hit, className }: FloorPlanInfoProps) {
  // Use either squareFeet or sqft, preferring squareFeet
  const squareFootage = hit.squareFeet || hit.sqft || 0;

  return (
    <div className={cn("space-y-6", className)}>
      {/* Plan Image */}
      <Card className="overflow-hidden">
        <div className="relative aspect-[21/9]">
          <img
            src={hit.planPdf?.[0]?.url || "/no-image.jpg"}
            alt={hit.planNumber}
            className="h-full w-full object-contain bg-muted/10"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/no-image.jpg";
            }}
          />
          <Badge
            variant="secondary"
            className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm text-foreground shadow-sm"
          >
            {squareFootage.toLocaleString()} sqft
          </Badge>

          {/* Recently added pill */}
          {hit.createdAt && isRecentlyAdded(hit.createdAt) && (
            <Badge
              variant="default"
              className="absolute top-4 left-4 bg-green-600 hover:bg-green-700 text-white shadow-sm"
            >
              Recently Added
            </Badge>
          )}
        </div>
      </Card>

      {/* Plan Details */}
      <Card>
        <CardHeader className="border-b">
          <h2 className="text-3xl font-semibold tracking-tight">
            {hit.planNumber}
          </h2>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            {/* Primary Features */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
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
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
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
    </div>
  );
}

export default FloorPlanInfo;
