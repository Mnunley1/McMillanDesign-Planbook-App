import { useQuery } from "@tanstack/react-query";
import { searchClient } from "@/lib/algolia";
import type { FloorPlanHit } from "@/types/floor-plan";
import FloorPlanCard from "./FloorPlanCard";

interface SimilarPlansProps {
  bedrooms?: number;
  currentPlanId: string;
  planType?: string;
}

export default function SimilarPlans({
  currentPlanId,
  bedrooms,
  planType,
}: SimilarPlansProps) {
  const { data: similarPlans = [], isLoading } = useQuery({
    queryKey: ["similar-plans", currentPlanId, bedrooms, planType],
    queryFn: async () => {
      const index = searchClient.initIndex("floorPlans");
      const filters: string[] = [`NOT objectID:${currentPlanId}`];

      if (planType) {
        filters.push(`planType:${planType}`);
      }
      if (bedrooms) {
        filters.push(`bedrooms:${bedrooms}`);
      }

      const { hits } = await index.search<FloorPlanHit>("", {
        filters: filters.join(" AND "),
        hitsPerPage: 4,
      });

      return hits;
    },
    enabled: !!(bedrooms || planType),
    staleTime: 10 * 60 * 1000,
  });

  if (isLoading || similarPlans.length === 0) {
    return null;
  }

  return (
    <div>
      <h3 className="mb-4 font-semibold text-lg">Similar Plans</h3>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {similarPlans.map((hit) => (
          <div className="w-72 flex-shrink-0" key={hit.objectID}>
            <FloorPlanCard hit={hit} />
          </div>
        ))}
      </div>
    </div>
  );
}
