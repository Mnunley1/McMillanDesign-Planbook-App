import { useQuery } from "@tanstack/react-query";
import { Heart, Loader2 } from "lucide-react";
import EmptyState from "@/components/EmptyState";
import FloorPlanCard from "@/components/FloorPlanCard";
import { Container } from "@/components/ui/container";
import { useFavorites } from "@/hooks/use-favorites";
import { searchClient } from "@/lib/algolia";
import type { FloorPlanHit } from "@/types/floor-plan";

export default function Favorites() {
  const { favorites } = useFavorites();
  const planIds = favorites.map((f) => f.planId);

  const { data: plans = [], isLoading } = useQuery({
    queryKey: ["favorite-plans", planIds],
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

  return (
    <Container className="max-w-5xl py-6">
      <h1 className="mb-6 flex items-center gap-2 font-bold text-2xl">
        <Heart className="h-6 w-6 text-red-500" />
        Favorites
      </h1>

      {isLoading && (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )}

      {!isLoading && plans.length === 0 && (
        <EmptyState
          actionHref="/"
          actionLabel="Browse Plans"
          description="Click the heart icon on any plan to save it here."
          icon={Heart}
          title="No favorites yet"
        />
      )}

      {plans.length > 0 && (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {plans.map((hit) => (
            <div className="h-full" key={hit.objectID}>
              <FloorPlanCard hit={hit} />
            </div>
          ))}
        </div>
      )}
    </Container>
  );
}
