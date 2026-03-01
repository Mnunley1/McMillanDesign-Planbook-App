import { ArrowRight, BedDouble, ImageOff, Ruler, Square } from "lucide-react";
import { useState } from "react";
import type { useHits } from "react-instantsearch";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn, isRecentlyAdded } from "@/lib/utils";
import type { FloorPlanHit } from "@/types/floor-plan";
import CompareButton from "./CompareButton";
import FavoriteButton from "./FavoriteButton";

type SendEventForHits = ReturnType<typeof useHits>["sendEvent"];

interface FloorPlanCardProps {
  className?: string;
  hit: FloorPlanHit;
  sendEvent?: SendEventForHits;
}

function FloorPlanCard({ hit, sendEvent, className }: FloorPlanCardProps) {
  const location = useLocation();
  const isMasterRoute = location.pathname.startsWith("/master");
  const [imageError, setImageError] = useState(false);

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

  // Only show tooltip on hover-capable devices
  const supportsHover =
    typeof window !== "undefined" &&
    window.matchMedia("(hover: hover)").matches;

  const cardContent = (
    <RouterLink
      className="group block h-full hover:no-underline"
      onClick={handleClick}
      to={
        isMasterRoute ? `/master/plan/${hit.objectID}` : `/plan/${hit.objectID}`
      }
    >
      <Card
        className={cn(
          "h-full overflow-hidden transition-all duration-300",
          "hover:-translate-y-1 hover:scale-[1.01] hover:shadow-lg",
          "border-border/50 hover:border-border",
          "bg-card hover:bg-accent/5",
          "cursor-pointer",
          "flex flex-col",
          className
        )}
        id={hit.objectID}
      >
        <div className="relative h-auto overflow-hidden">
          {imageError || !hit.image ? (
            <div className="flex h-48 w-full flex-col items-center justify-center bg-muted">
              <ImageOff className="h-12 w-12 text-muted-foreground" />
              <p className="mt-2 text-muted-foreground text-sm">Image unavailable</p>
            </div>
          ) : (
            <img
              alt={`Floor plan ${hit.planNumber} - ${hit.bedrooms} bed, ${squareFootage.toLocaleString()} sqft`}
              className="h-auto w-full object-cover"
              loading="lazy"
              onError={() => setImageError(true)}
              src={hit.image}
            />
          )}

          {/* Square footage badge */}
          <Badge
            className="absolute top-2 right-2 bg-background/90 text-foreground shadow-sm backdrop-blur-sm"
            variant="secondary"
          >
            {squareFootage.toLocaleString()} sqft
          </Badge>

          {/* Recently added pill */}
          {hit.createdAt && isRecentlyAdded(hit.createdAt) && (
            <Badge
              className="absolute top-2 left-2 bg-emerald-500/90 text-white text-xs shadow-sm hover:bg-emerald-500"
              variant="default"
            >
              Recently Added
            </Badge>
          )}

          {/* Action buttons */}
          <div className="absolute right-2 bottom-2 flex gap-1">
            <CompareButton
              className="bg-background/80 backdrop-blur-sm"
              planId={hit.objectID}
            />
            <FavoriteButton
              className="bg-background/80 backdrop-blur-sm"
              planId={hit.objectID}
            />
          </div>
        </div>
        <CardContent className="space-y-1.5 px-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-2xl text-foreground">
              {hit.planNumber}
            </h3>
            <ArrowRight className="h-4 w-4 -translate-x-2 text-muted-foreground opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
          </div>
          <p className="line-clamp-2 text-muted-foreground text-sm transition-colors group-hover:text-foreground/80">
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
                  <span className="flex h-4 flex-none items-center justify-center font-medium text-md">
                    Plan Width
                  </span>
                  <span>{hit.planWidth}'</span>
                </div>
                <div className="flex items-center gap-1.5 text-lg text-muted-foreground">
                  <Ruler className="h-4 w-4 flex-none" />
                  <span className="flex h-4 flex-none items-center justify-center font-medium text-md">
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

  if (!supportsHover) {
    return cardContent;
  }

  return (
    <TooltipProvider>
      <Tooltip delayDuration={500}>
        <TooltipTrigger asChild>{cardContent}</TooltipTrigger>
        <TooltipContent className="max-w-xs" side="right">
          <div className="space-y-1 text-xs">
            {hit.planType && <p>Type: {hit.planType}</p>}
            <p>Bedrooms: {hit.bedrooms}</p>
            <p>Sq Ft: {squareFootage.toLocaleString()}</p>
            {hit.planWidth && hit.planDepth && (
              <p>
                Dimensions: {hit.planWidth}' x {hit.planDepth}'
              </p>
            )}
            {hit.garageOrientation && <p>Garage: {hit.garageOrientation}</p>}
            {hit.primarySuite && <p>Suite: {hit.primarySuite}</p>}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
export default FloorPlanCard;
