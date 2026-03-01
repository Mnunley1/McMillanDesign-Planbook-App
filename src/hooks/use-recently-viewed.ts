import { useUser } from "@clerk/clerk-react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export function useRecentlyViewed() {
  const { user } = useUser();
  const userId = user?.id ?? "";

  const recentlyViewed = useQuery(
    api.recentlyViewed.list,
    userId ? { userId } : "skip"
  );

  return {
    recentlyViewed: recentlyViewed ?? [],
  };
}
