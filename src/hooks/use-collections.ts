import { useUser } from "@clerk/clerk-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

export function useCollections() {
  const { user } = useUser();
  const userId = user?.id ?? "";

  const collections = useQuery(
    api.collections.list,
    userId ? { userId } : "skip"
  );

  const createMutation = useMutation(api.collections.create);
  const updateMutation = useMutation(api.collections.update);
  const removeMutation = useMutation(api.collections.remove);

  const create = (
    name: string,
    description: string,
    planIds: string[] = [],
    status: string = "draft"
  ) => {
    if (!userId) {
      return;
    }
    createMutation({ userId, name, description, planIds, status });
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
