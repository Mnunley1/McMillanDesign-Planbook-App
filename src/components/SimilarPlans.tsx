import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { searchClient } from "@/lib/algolia";
import { cn } from "@/lib/utils";
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
  const scrollRef = useRef<HTMLDivElement>(null);

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

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) {
      return;
    }
    const cardWidth = scrollRef.current.firstElementChild?.clientWidth ?? 288;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -cardWidth : cardWidth,
      behavior: "smooth",
    });
  };

  const hasSubtitle = planType || bedrooms;

  return (
    <div className="mt-12 border-border border-t pt-8">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h2 className="font-semibold text-xl tracking-tight">
            Similar Plans
          </h2>
          {hasSubtitle && (
            <p className="mt-1 text-muted-foreground text-sm">
              More
              {planType ? ` ${planType}` : ""}
              {bedrooms ? ` plans with ${bedrooms} bedrooms` : " plans"}
            </p>
          )}
        </div>
        <div className="flex gap-1">
          <Button
            aria-label="Scroll left"
            className="h-8 w-8"
            onClick={() => scroll("left")}
            size="icon"
            variant="outline"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            aria-label="Scroll right"
            className="h-8 w-8"
            onClick={() => scroll("right")}
            size="icon"
            variant="outline"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-background to-transparent" />

        <div
          className={cn(
            "flex gap-4 overflow-x-auto pb-2",
            "snap-x snap-mandatory scroll-smooth",
            "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          )}
          ref={scrollRef}
        >
          {similarPlans.map((hit) => (
            <div className="w-72 flex-shrink-0 snap-start" key={hit.objectID}>
              <FloorPlanCard hit={hit} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
