import { motion } from "framer-motion";
import { useHits, useInstantSearch } from "react-instantsearch";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { FloorPlanHit } from "@/types/floor-plan";
import FloorPlanCard from "./FloorPlanCard";
import SearchEmptyState from "./SearchEmptyState";

interface CustomHitsProps {
  className?: string;
}

function CustomHits({ className }: CustomHitsProps) {
  const { hits, sendEvent } = useHits<FloorPlanHit>();
  const { status } = useInstantSearch();
  const isSearching = status === "loading" || status === "stalled";

  if (!isSearching && hits.length === 0) {
    return <SearchEmptyState />;
  }

  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3",
        className
      )}
    >
      {isSearching
        ? // Loading skeletons
          Array.from({ length: 6 }).map((_, idx) => (
            <Card className="h-full overflow-hidden" key={idx}>
              {/* Image placeholder */}
              <div className="relative aspect-[4/3] w-full animate-pulse bg-muted">
                {/* Badge placeholder */}
                <div className="absolute top-3 left-3 h-5 w-16 animate-pulse rounded-full bg-muted-foreground/20" />
              </div>
              <CardContent className="space-y-3 p-4">
                {/* Plan number + arrow row */}
                <div className="flex items-center justify-between">
                  <div className="h-5 w-24 animate-pulse rounded bg-muted" />
                  <div className="h-4 w-4 animate-pulse rounded bg-muted" />
                </div>
                {/* Description lines */}
                <div className="space-y-2">
                  <div className="h-4 w-full animate-pulse rounded bg-muted" />
                  <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
                </div>
                {/* Separator */}
                <div className="border-border/50 border-t" />
                {/* Stat placeholders */}
                <div className="flex gap-4">
                  <div className="h-4 w-12 animate-pulse rounded bg-muted" />
                  <div className="h-4 w-12 animate-pulse rounded bg-muted" />
                  <div className="h-4 w-16 animate-pulse rounded bg-muted" />
                </div>
              </CardContent>
            </Card>
          ))
        : // Actual hits
          hits.map((hit, index) => (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="h-full"
              initial={{ opacity: 0, y: 12 }}
              key={hit.objectID}
              transition={{ duration: 0.2, delay: Math.min(index, 8) * 0.04 }}
            >
              <FloorPlanCard hit={hit} sendEvent={sendEvent} />
            </motion.div>
          ))}
    </div>
  );
}

export default CustomHits;
