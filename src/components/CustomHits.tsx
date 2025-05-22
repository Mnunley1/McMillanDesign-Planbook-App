import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useHits, useInstantSearch } from "react-instantsearch";
import FloorPlanCard from "./FloorPlanCard";

interface FloorPlanHit {
  objectID: string;
  image?: string;
  planNumber: string;
  description: string;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  sqft?: number;
  planDepth?: number;
  planWidth?: number;
}

interface CustomHitsProps {
  className?: string;
}

function CustomHits({ className }: CustomHitsProps) {
  const { hits, sendEvent } = useHits<FloorPlanHit>();
  const { status } = useInstantSearch();
  const isSearching = status === "loading" || status === "stalled";

  return (
    <div className={cn("grid grid-cols-1 gap-5 md:grid-cols-2", className)}>
      {isSearching
        ? // Loading skeletons
          Array.from({ length: 6 }).map((_, idx) => (
            <Card key={idx} className="animate-pulse h-full">
              <div className="h-[200px] w-full bg-muted" />
              <CardContent className="space-y-3 p-4">
                <div className="h-6 w-1/3 rounded bg-muted" />
                <div className="space-y-2">
                  <div className="h-4 w-full rounded bg-muted" />
                  <div className="h-4 w-2/3 rounded bg-muted" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="h-4 w-16 rounded bg-muted" />
                  <div className="h-4 w-16 rounded bg-muted" />
                  <div className="h-4 w-20 rounded bg-muted" />
                  <div className="h-4 w-20 rounded bg-muted" />
                </div>
              </CardContent>
            </Card>
          ))
        : // Actual hits
          hits.map((hit) => (
            <div key={hit.objectID} className="h-full">
              <FloorPlanCard hit={hit} sendEvent={sendEvent} />
            </div>
          ))}
    </div>
  );
}

export default CustomHits;
