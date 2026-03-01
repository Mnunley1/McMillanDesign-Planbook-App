import { useUser } from "@clerk/clerk-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

export function useSavedComparisons() {
  const { user } = useUser();
  const userId = user?.id ?? "";

  const savedComparisons = useQuery(
    api.savedComparisons.list,
    userId ? { userId } : "skip"
  );

  const saveMutation = useMutation(api.savedComparisons.save);
  const removeMutation = useMutation(api.savedComparisons.remove);

  const save = (name: string, planIds: string[]) => {
    if (!userId) {
      return;
    }
    saveMutation({ userId, name, planIds });
  };

  const remove = (id: string) => {
    removeMutation({ id: id as Id<"savedComparisons"> });
  };

  return {
    savedComparisons: savedComparisons ?? [],
    save,
    remove,
  };
}
