import { useUser } from "@clerk/clerk-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export function useRecentlyViewed() {
  const { user } = useUser();
  const userId = user?.id ?? "";

  const recentlyViewed = useQuery(
    api.recentlyViewed.list,
    userId ? { userId } : "skip"
  );

  const addMutation = useMutation(api.recentlyViewed.add);

  const trackView = (planId: string, planNumber: string) => {
    if (!userId) {
      return;
    }
    addMutation({ userId, planId, planNumber });
  };

  return {
    recentlyViewed: recentlyViewed ?? [],
    trackView,
  };
}
