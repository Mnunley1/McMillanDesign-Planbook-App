import { useUser } from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";
import {
  AlertCircle,
  ArrowLeft,
  Eye,
  EyeOff,
  FolderOpen,
  Trash2,
  X,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import EmptyState from "@/components/EmptyState";
import FloorPlanCard from "@/components/FloorPlanCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Skeleton } from "@/components/ui/skeleton";
import { useCollection, useCollections } from "@/hooks/use-collections";
import { PLANS_INDEX, searchClient } from "@/lib/algolia";
import type { FloorPlanHit } from "@/types/floor-plan";

function SkeletonCard() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="h-48 w-full rounded-none" />
      <div className="space-y-3 p-4">
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-4 w-3/4" />
        <div className="grid grid-cols-2 gap-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
    </Card>
  );
}

export default function CollectionDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useUser();
  const isAdmin = user?.publicMetadata?.role === "admin";
  const collection = useCollection(id);
  const { update, remove } = useCollections();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const planIds = collection?.planIds ?? [];
  const status = collection?.status ?? "draft";

  const { data: plans = [], isLoading: plansLoading } = useQuery({
    queryKey: ["collection-plans", id, planIds, isAdmin],
    queryFn: async () => {
      if (planIds.length === 0) {
        return [];
      }
      const index = searchClient.initIndex(PLANS_INDEX);
      const { results } = await index.getObjects<FloorPlanHit>(planIds);
      return results.filter(
        // Admins curate from the full catalog, so they must still see the
        // unpublished plans they added (flagged as such on the card). Only the
        // public-facing view hides them.
        (r): r is FloorPlanHit =>
          r !== null && (isAdmin || r.published !== false)
      );
    },
    enabled: planIds.length > 0,
    staleTime: 2 * 60 * 1000,
  });

  // Plans can be in the collection yet resolve to nothing renderable — every
  // one unpublished (non-admin view) or deleted from the index.
  const allPlansHidden =
    !plansLoading && planIds.length > 0 && plans.length === 0;

  const handleRemovePlan = (planId: string) => {
    if (!collection) {
      return;
    }
    const updatedPlanIds = collection.planIds.filter((pid) => pid !== planId);
    update(collection._id, { planIds: updatedPlanIds });
  };

  const handleDeleteCollection = () => {
    if (!collection) {
      return;
    }
    remove(collection._id);
    navigate("/collections");
  };

  const handleToggleStatus = () => {
    if (!collection) {
      return;
    }
    const newStatus = status === "public" ? "draft" : "public";
    update(collection._id, { status: newStatus });
  };

  // Loading state - collection is undefined while Convex is loading
  if (collection === undefined) {
    return (
      <Container className="max-w-5xl py-6">
        <div className="mb-6 flex items-center gap-4">
          <Skeleton className="h-9 w-9 rounded-md" />
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </Container>
    );
  }

  // Error state - collection is null (not found)
  if (collection === null) {
    return (
      <Container className="max-w-5xl py-6">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <AlertCircle className="h-12 w-12 text-destructive" />
          <h3 className="mt-4 font-semibold text-lg">Collection not found</h3>
          <p className="mt-2 text-muted-foreground text-sm">
            This collection may have been deleted or you don't have access to
            it.
          </p>
          <div className="mt-4 flex gap-2">
            <Button asChild variant="outline">
              <Link to="/collections">Back to Collections</Link>
            </Button>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container className="max-w-5xl py-6">
      {/* Header */}
      <div className="mb-6 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button asChild size="icon" variant="ghost">
              <Link to="/collections">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <h1 className="flex items-center gap-2 font-bold text-2xl">
              <FolderOpen className="h-6 w-6 text-primary" />
              {collection.name}
            </h1>
            <Badge variant="secondary">
              {planIds.length} plan{planIds.length !== 1 ? "s" : ""}
            </Badge>
            {isAdmin && (
              <Badge variant={status === "public" ? "default" : "secondary"}>
                {status === "public" ? "Public" : "Draft"}
              </Badge>
            )}
          </div>

          {isAdmin && (
            <div className="flex items-center gap-2">
              <Button onClick={handleToggleStatus} size="sm" variant="outline">
                {status === "public" ? (
                  <>
                    <EyeOff className="mr-1.5 h-4 w-4" />
                    Make Draft
                  </>
                ) : (
                  <>
                    <Eye className="mr-1.5 h-4 w-4" />
                    Make Public
                  </>
                )}
              </Button>

              {confirmDelete ? (
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground text-sm">Delete?</span>
                  <Button
                    onClick={handleDeleteCollection}
                    size="sm"
                    variant="destructive"
                  >
                    Confirm
                  </Button>
                  <Button
                    onClick={() => setConfirmDelete(false)}
                    size="sm"
                    variant="outline"
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button
                  className="text-muted-foreground hover:text-destructive"
                  onClick={() => setConfirmDelete(true)}
                  size="icon"
                  variant="outline"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </div>

        {collection.description && (
          <p className="ml-12 text-muted-foreground text-sm">
            {collection.description}
          </p>
        )}
      </div>

      {/* Plans loading */}
      {plansLoading && planIds.length > 0 && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {planIds.map((pid) => (
            <SkeletonCard key={pid} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!plansLoading && planIds.length === 0 && (
        <EmptyState
          actionHref="/"
          actionLabel="Browse Plans"
          description="Browse plans and add them to this collection"
          icon={FolderOpen}
          title="This collection is empty"
        />
      )}

      {allPlansHidden && (
        <EmptyState
          description={
            isAdmin
              ? "The plans in this collection are no longer in the search index."
              : "The plans in this collection aren't published yet. Check back soon."
          }
          icon={FolderOpen}
          title="Nothing to show yet"
        />
      )}

      {/* Plan grid */}
      {!plansLoading && plans.length > 0 && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((hit) => (
            <div className="group/remove relative h-full" key={hit.objectID}>
              <FloorPlanCard hit={hit} />
              {isAdmin && (
                <Button
                  className="absolute top-2 left-2 z-10 bg-background/80 text-muted-foreground opacity-0 backdrop-blur-sm transition-opacity hover:bg-background/90 hover:text-destructive group-hover/remove:opacity-100"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleRemovePlan(hit.objectID);
                  }}
                  size="icon"
                  variant="ghost"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </Container>
  );
}
