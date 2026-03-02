import { useUser } from "@clerk/clerk-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

export function useSavedSearches() {
  const { user } = useUser();
  const userId = user?.id ?? "";

  const savedSearches = useQuery(
    api.savedSearches.list,
    userId ? { userId } : "skip"
  );

  const saveMutation = useMutation(api.savedSearches.save);
  const removeMutation = useMutation(api.savedSearches.remove);

  const save = (name: string, uiState: string) => {
    if (!userId) {
      return;
    }
    saveMutation({ userId, name, uiState });
  };

  const remove = (id: string) => {
    removeMutation({ id: id as Id<"savedSearches"> });
  };

  return {
    savedSearches: savedSearches ?? [],
    save,
    remove,
  };
}
