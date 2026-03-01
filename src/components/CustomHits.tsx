import { motion } from "framer-motion";
import { useHits, useInstantSearch } from "react-instantsearch";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { FloorPlanHit } from "@/types/floor-plan";
import SearchEmptyState from "./SearchEmptyState";
import FloorPlanCard from "./FloorPlanCard";

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
    <div className={cn("grid grid-cols-1 gap-5 md:grid-cols-2", className)}>
      {isSearching
        ? // Loading skeletons
          Array.from({ length: 6 }).map((_, idx) => (
            <Card className="h-full animate-pulse" key={idx}>
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
          hits.map((hit, index) => (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="h-full"
              initial={{ opacity: 0, y: 12 }}
              key={hit.objectID}
              transition={{ duration: 0.2, delay: index * 0.05 }}
            >
              <FloorPlanCard hit={hit} sendEvent={sendEvent} />
            </motion.div>
          ))}
    </div>
  );
}

export default CustomHits;
