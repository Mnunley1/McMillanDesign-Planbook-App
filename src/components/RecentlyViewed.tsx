import { useQuery } from "@tanstack/react-query";
import { ChevronDown, ChevronUp, Clock } from "lucide-react";
import { useState } from "react";
import { useRecentlyViewed } from "@/hooks/use-recently-viewed";
import { searchClient } from "@/lib/algolia";
import type { FloorPlanHit } from "@/types/floor-plan";
import FloorPlanCard from "./FloorPlanCard";
import { Button } from "./ui/button";

const CAROUSEL_LIMIT = 4;

export default function RecentlyViewed() {
  const { recentlyViewed } = useRecentlyViewed();
  const planIds = recentlyViewed.map((rv) => rv.planId);
  const [expanded, setExpanded] = useState(false);

  const { data: plans = [] } = useQuery({
    queryKey: ["recently-viewed-plans", planIds],
    queryFn: async () => {
      if (planIds.length === 0) {
        return [];
      }
      const index = searchClient.initIndex("floorPlans");
      const { results } = await index.getObjects<FloorPlanHit>(planIds);
      return results.filter((r): r is FloorPlanHit => r !== null);
    },
    enabled: planIds.length > 0,
    staleTime: 2 * 60 * 1000,
  });

  if (plans.length === 0) {
    return null;
  }

  const showToggle = plans.length > CAROUSEL_LIMIT;
  const visiblePlans = expanded ? plans : plans.slice(0, CAROUSEL_LIMIT);

  return (
    <div className="mb-6">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="flex items-center gap-2 font-semibold text-muted-foreground text-sm">
          <Clock className="h-4 w-4" />
          Recently Viewed
        </h3>
        {showToggle && (
          <Button
            className="h-auto p-0 text-muted-foreground text-xs hover:text-primary"
            onClick={() => setExpanded((prev) => !prev)}
            variant="link"
          >
            {expanded ? (
              <>
                Show Less
                <ChevronUp className="ml-1 h-3 w-3" />
              </>
            ) : (
              <>
                View All ({plans.length})
                <ChevronDown className="ml-1 h-3 w-3" />
              </>
            )}
          </Button>
        )}
      </div>

      {expanded ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {visiblePlans.map((hit) => (
            <FloorPlanCard hit={hit} key={hit.objectID} />
          ))}
        </div>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-2">
          {visiblePlans.map((hit) => (
            <div className="w-72 flex-shrink-0" key={hit.objectID}>
              <FloorPlanCard hit={hit} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
