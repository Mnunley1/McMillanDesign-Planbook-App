import { useUser } from "@clerk/clerk-react";
import { ArrowRight, BedDouble, ImageOff, Ruler } from "lucide-react";
import { useState } from "react";
import type { useHits } from "react-instantsearch";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useComparison } from "@/hooks/use-comparison";
import { useFavorites } from "@/hooks/use-favorites";
import { cn, getTimeAgo, isRecentlyAdded } from "@/lib/utils";
import type { FloorPlanHit } from "@/types/floor-plan";
import AddToCollectionDialog from "./AddToCollectionDialog";
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
  const { user } = useUser();
  const isAdmin = user?.publicMetadata?.role === "admin";
  // Only admins are ever served unpublished plans (on /master, and in
  // collections), so flag them wherever they surface.
  const unpublished = isAdmin && hit.published === false;
  const [imageError, setImageError] = useState(false);

  const { isSelected } = useComparison();
  const { isFavorite } = useFavorites();
  const isInComparison = isSelected(hit.objectID);
  const isFavorited = isFavorite(hit.objectID);
  const buttonsAlwaysVisible = isInComparison || isFavorited;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    sessionStorage.setItem(
      "lastSearchUrl",
      window.location.pathname + window.location.search
    );
    sessionStorage.setItem("pendingScrollToPlan", hit.objectID);

    if (sendEvent) {
      sendEvent({
        eventName: "click",
        objectIDs: [hit.objectID],
        positions: [0],
      });
    }
  };

  const squareFootage = hit.squareFeet || hit.sqft || 0;

  const recentlyAddedLabel =
    hit.createdAt && isRecentlyAdded(hit.createdAt)
      ? (() => {
          const timeAgo = getTimeAgo(hit.createdAt);
          if (!timeAgo) {
            return "Recently Added";
          }
          if (timeAgo === "Today") {
            return "New Today";
          }
          return `Added ${timeAgo}`;
        })()
      : null;

  const altText = `${hit.planType ? `${hit.planType} floor plan` : "Floor plan"} ${hit.planNumber}: ${hit.bedrooms} bed, ${squareFootage.toLocaleString()} sq ft`;

  return (
    <RouterLink
      className={cn(
        "group block h-full hover:no-underline",
        "rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      )}
      onClick={handleClick}
      to={
        isMasterRoute ? `/master/plan/${hit.objectID}` : `/plan/${hit.objectID}`
      }
    >
      <Card
        className={cn(
          "h-full overflow-hidden transition-all duration-300",
          "hover:-translate-y-1 hover:shadow-lg",
          "border-border/60 hover:border-primary/30",
          "ring-1 ring-transparent hover:ring-primary/10",
          "bg-card hover:bg-accent/5",
          "cursor-pointer",
          "flex flex-col",
          "max-sm:flex-row",
          className
        )}
        id={hit.objectID}
      >
        {/* Image container */}
        <div
          className={cn(
            "relative overflow-hidden",
            "aspect-[1/1]",
            "max-sm:aspect-auto max-sm:h-36 max-sm:w-36 max-sm:flex-none"
          )}
        >
          {imageError || !hit.image ? (
            <div className="flex h-full w-full flex-col items-center justify-center bg-muted">
              <ImageOff className="h-12 w-12 text-muted-foreground" />
              <p className="mt-2 text-muted-foreground text-sm">
                Image unavailable
              </p>
            </div>
          ) : (
            <img
              alt={altText}
              className="h-full w-full object-contain transition-transform duration-500 ease-out group-hover:scale-105"
              loading="lazy"
              onError={() => setImageError(true)}
              src={hit.image}
            />
          )}

          {/* Gradient overlay for button readability */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/40 to-transparent" />

          {/* Square footage badge */}
          <Badge
            className="absolute top-2 right-2 bg-background/90 text-foreground shadow-sm backdrop-blur-sm"
            variant="secondary"
          >
            {squareFootage.toLocaleString()} sqft
          </Badge>

          {/* Unpublished/draft indicator */}
          {unpublished && (
            <Badge
              className="absolute bottom-2 left-2 bg-amber-500/90 text-white text-xs shadow-sm hover:bg-amber-500"
              variant="default"
            >
              Unpublished
            </Badge>
          )}

          {/* Recently added pill with time context */}
          {recentlyAddedLabel && (
            <Badge
              className="absolute top-2 left-2 bg-emerald-500/90 text-white text-xs shadow-sm hover:bg-emerald-500"
              variant="default"
            >
              {recentlyAddedLabel}
            </Badge>
          )}

          {/* Action buttons - hidden by default on desktop, revealed on hover */}
          <div
            className={cn(
              "absolute right-2 bottom-2 flex gap-2 transition-opacity duration-200",
              buttonsAlwaysVisible
                ? "opacity-100"
                : "md:opacity-0 md:group-hover:opacity-100 [@media(hover:none)]:opacity-100"
            )}
          >
            <CompareButton
              className="min-h-[44px] min-w-[44px] bg-background/80 shadow-sm backdrop-blur-sm"
              planId={hit.objectID}
              planNumber={hit.planNumber}
            />
            {isMasterRoute && isAdmin && (
              <AddToCollectionDialog
                className="min-h-[44px] min-w-[44px] bg-background/80 shadow-sm backdrop-blur-sm"
                compact
                planId={hit.objectID}
              />
            )}
            <FavoriteButton
              className="min-h-[44px] min-w-[44px] bg-background/80 shadow-sm backdrop-blur-sm"
              planId={hit.objectID}
            />
          </div>
        </div>

        {/* Content */}
        <CardContent className="flex min-w-0 flex-1 flex-col justify-center space-y-1.5 px-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-foreground text-lg tracking-tight">
                {hit.planNumber}
              </h3>
              {hit.planType && (
                <Badge className="px-1.5 py-0 text-[10px]" variant="outline">
                  {hit.planType}
                </Badge>
              )}
            </div>
            <ArrowRight className="h-4 w-4 flex-none -translate-x-2 text-muted-foreground opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
          </div>

          <p className="line-clamp-2 text-muted-foreground text-sm transition-colors group-hover:text-foreground/80 max-sm:hidden">
            {hit.description}
          </p>

          {/* Separator */}
          <div className="border-border/50 border-t max-sm:hidden" />

          {/* Stats row */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-muted-foreground text-sm">
            <div className="flex items-center gap-1">
              <BedDouble className="h-3.5 w-3.5 flex-none" />
              <span>{hit.bedrooms} Bed</span>
            </div>
            {hit.planDepth && hit.planWidth && (
              <div className="flex items-center gap-1">
                <Ruler className="h-3.5 w-3.5 flex-none" />
                <span>
                  {hit.planWidth}' x {hit.planDepth}'
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </RouterLink>
  );
}
export default FloorPlanCard;
