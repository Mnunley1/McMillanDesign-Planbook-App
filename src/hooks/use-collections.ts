import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

// Collections are a shared admin library — the server derives the caller's
// identity and role from the Clerk token, so nothing here passes a userId.
// Non-admins get an empty list from `list` and use `usePublicCollections`.
export function useCollections() {
  const collections = useQuery(api.collections.list, {});

  const createMutation = useMutation(api.collections.create);
  const updateMutation = useMutation(api.collections.update);
  const removeMutation = useMutation(api.collections.remove);

  const create = (
    name: string,
    description: string,
    planIds: string[] = [],
    status = "draft"
  ) => {
    createMutation({ name, description, planIds, status });
  };

  const update = (
    id: string,
    fields: {
      name?: string;
      description?: string;
      planIds?: string[];
      status?: string;
    }
  ) => {
    updateMutation({ id: id as Id<"collections">, ...fields });
  };

  const remove = (id: string) => {
    removeMutation({ id: id as Id<"collections"> });
  };

  return {
    collections: collections ?? [],
    create,
    update,
    remove,
  };
}

export function usePublicCollections() {
  const collections = useQuery(api.collections.listPublic);

  return {
    collections: collections ?? [],
  };
}

export function useCollection(id: string | undefined) {
  const collection = useQuery(
    api.collections.get,
    id ? { id: id as Id<"collections"> } : "skip"
  );

  return collection;
}
