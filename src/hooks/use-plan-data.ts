import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import { previewClient, productionClient } from "@/lib/contentful";
import type { FloorPlanHit } from "@/types/floor-plan";

export function usePlanData(planId: string | undefined) {
  const location = useLocation();
  const isMasterRoute = location.pathname.startsWith("/master");

  return useQuery({
    queryKey: ["plan", planId, isMasterRoute],
    queryFn: async () => {
      if (!planId) {
        throw new Error("No plan ID");
      }
      const client = isMasterRoute ? previewClient : productionClient;
      const response = await client.getEntry(planId);
      return response.fields as unknown as FloorPlanHit;
    },
    enabled: !!planId,
    staleTime: 5 * 60 * 1000,
  });
}
