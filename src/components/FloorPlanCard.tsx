import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn, isRecentlyAdded } from "@/lib/utils";
import { ArrowRight, BedDouble, Ruler, Square } from "lucide-react";
import { useHits } from "react-instantsearch";
import { Link as RouterLink, useLocation } from "react-router-dom";

interface FloorPlanHit {
  objectID: string;
  image?: string;
  planNumber: string;
  description: string;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  planDepth?: number;
  planWidth?: number;
  sqft?: number; // Handle both squareFeet and sqft
  createdAt?: string; // ISO date string for when the plan was created
}

type SendEventForHits = ReturnType<typeof useHits>["sendEvent"];

interface FloorPlanCardProps {
  hit: FloorPlanHit;
  sendEvent?: SendEventForHits;
  className?: string;
}

function FloorPlanCard({ hit, sendEvent, className }: FloorPlanCardProps) {
  const location = useLocation();
  const isMasterRoute = location.pathname.startsWith("/master");

  const handleClick = (e: React.MouseEvent) => {
    // Prevent event propagation to ensure RouterLink works
    e.stopPropagation();

    if (sendEvent) {
      sendEvent({
        eventName: "click",
        objectIDs: [hit.objectID],
        positions: [0],
      });
    }
  };

  // Use either squareFeet or sqft, preferring squareFeet
  const squareFootage = hit.squareFeet || hit.sqft || 0;

  return (
    <RouterLink
      to={
        isMasterRoute ? `/master/plan/${hit.objectID}` : `/plan/${hit.objectID}`
      }
      className="block hover:no-underline group h-full"
      onClick={handleClick}
    >
      <Card
        className={cn(
          "overflow-hidden transition-all duration-300 h-full",
          "hover:-translate-y-1 hover:shadow-lg",
          "border-border/50 hover:border-border",
          "bg-card hover:bg-accent/5",
          "cursor-pointer",
          "flex flex-col",
          className
        )}
        id={hit.objectID}
      >
        <div className="relative h-auto overflow-hidden">
          <img
            src={hit.image || "/no-image.jpg"}
            alt={hit.planNumber}
            className="h-auto w-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/no-image.jpg";
            }}
          />

          {/* Square footage badge */}
          <Badge
            variant="secondary"
            className="absolute top-2 right-2 bg-background/90 backdrop-blur-sm text-foreground shadow-sm"
          >
            {squareFootage.toLocaleString()} sqft
          </Badge>

          {/* Recently added pill */}
          {hit.createdAt && isRecentlyAdded(hit.createdAt) && (
            <Badge
              variant="default"
              className="absolute top-2 left-2 bg-green-600 hover:bg-green-700 text-white shadow-sm text-xs"
            >
              Recently Added
            </Badge>
          )}
        </div>
        <CardContent className="px-4 space-y-1.5">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-semibold text-foreground">
              {hit.planNumber}
            </h3>
            <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
          </div>
          <p className="line-clamp-2 text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors">
            {hit.description}
          </p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-1.5 text-lg text-muted-foreground">
              <BedDouble className="h-4 w-4 flex-none" />
              <span>{hit.bedrooms} Bedrooms</span>
            </div>
            <div className="flex items-center gap-1.5 text-lg text-muted-foreground">
              <Square className="h-4 w-4 flex-none" />
              <span>{squareFootage.toLocaleString()} SQFT</span>
            </div>
            {hit.planDepth && hit.planWidth && (
              <>
                <div className="flex items-center gap-1.5 text-lg text-muted-foreground">
                  <Ruler className="h-4 w-4 flex-none" />
                  <span className="h-4 flex items-center justify-center text-md font-medium flex-none">
                    Plan Width
                  </span>
                  <span>{hit.planWidth}'</span>
                </div>
                <div className="flex items-center gap-1.5 text-lg text-muted-foreground">
                  <Ruler className="h-4 w-4 flex-none" />
                  <span className="h-4 flex items-center justify-center text-md font-medium flex-none">
                    Plan Depth
                  </span>
                  <span>{hit.planDepth}'</span>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </RouterLink>
  );
}
export default FloorPlanCard;
