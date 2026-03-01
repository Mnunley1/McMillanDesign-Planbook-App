import { useUser } from "@clerk/clerk-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export function useFavorites() {
  const { user } = useUser();
  const userId = user?.id ?? "";

  const favorites = useQuery(api.favorites.list, userId ? { userId } : "skip");

  const addMutation = useMutation(api.favorites.add);
  const removeMutation = useMutation(api.favorites.remove);

  const add = (planId: string) => {
    if (!userId) {
      return;
    }
    addMutation({ userId, planId });
  };

  const remove = (planId: string) => {
    if (!userId) {
      return;
    }
    removeMutation({ userId, planId });
  };

  const isFavorite = (planId: string) => {
    return favorites?.some((f) => f.planId === planId) ?? false;
  };

  const toggle = (planId: string) => {
    if (isFavorite(planId)) {
      remove(planId);
    } else {
      add(planId);
    }
  };

  return {
    favorites: favorites ?? [],
    isFavorite,
    toggle,
    add,
    remove,
    count: favorites?.length ?? 0,
  };
}
