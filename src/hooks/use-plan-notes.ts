import { useUser } from "@clerk/clerk-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export function usePlanNotes(planId: string) {
  const { user } = useUser();
  const userId = user?.id ?? "";

  const note = useQuery(
    api.notes.get,
    userId && planId ? { userId, planId } : "skip"
  );

  const upsertMutation = useMutation(api.notes.upsert);
  const removeMutation = useMutation(api.notes.remove);

  const save = (text: string) => {
    if (!userId) {
      return;
    }
    upsertMutation({ userId, planId, text });
  };

  const remove = () => {
    if (!userId) {
      return;
    }
    removeMutation({ userId, planId });
  };

  return {
    note,
    save,
    remove,
    hasNote: !!note?.text,
  };
}

export function useUserNotes() {
  const { user } = useUser();
  const userId = user?.id ?? "";

  const notes = useQuery(api.notes.listByUser, userId ? { userId } : "skip");

  return {
    notes: notes ?? [],
    planIdsWithNotes: new Set((notes ?? []).map((n) => n.planId)),
  };
}
