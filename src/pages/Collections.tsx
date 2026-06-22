import { useUser } from "@clerk/clerk-react";
import { FolderOpen } from "lucide-react";
import { useState } from "react";
import CollectionCard from "@/components/CollectionCard";
import CollectionManager from "@/components/CollectionManager";
import EmptyState from "@/components/EmptyState";
import { Container } from "@/components/ui/container";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCollections, usePublicCollections } from "@/hooks/use-collections";

type CollectionsView = "mine" | "public";

export default function Collections() {
  const { user } = useUser();
  const isAdmin = user?.publicMetadata?.role === "admin";
  const { collections: myCollections } = useCollections();
  const { collections: publicCollections } = usePublicCollections();
  const [view, setView] = useState<CollectionsView>("mine");

  // Admins can switch between managing their own collections and previewing
  // the public-facing view exactly as a non-admin sees it.
  const showingPublicView = !isAdmin || view === "public";
  const collections = showingPublicView ? publicCollections : myCollections;

  return (
    <Container className="max-w-6xl py-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h1 className="flex items-center gap-2.5 font-bold text-3xl tracking-tight">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <FolderOpen className="h-5 w-5 text-primary" />
            </span>
            Collections
          </h1>
          <p className="text-muted-foreground">
            {isAdmin
              ? "Curate and organize floor plans into shareable groups."
              : "Explore curated groups of floor plans."}
          </p>
        </div>
        {isAdmin && <CollectionManager />}
      </div>

      {isAdmin && (
        <Tabs
          className="mb-6"
          onValueChange={(v) => setView(v as CollectionsView)}
          value={view}
        >
          <TabsList>
            <TabsTrigger value="mine">My Collections</TabsTrigger>
            <TabsTrigger value="public">Public Preview</TabsTrigger>
          </TabsList>
        </Tabs>
      )}

      {collections.length === 0 && (
        <EmptyState
          description={
            showingPublicView
              ? "No public collections are available yet."
              : "Create a collection to organize plans into groups."
          }
          icon={FolderOpen}
          title={
            showingPublicView ? "No public collections" : "No collections yet"
          }
        />
      )}

      {collections.length > 0 && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((collection) => (
            <CollectionCard
              description={collection.description}
              id={collection._id}
              // In public preview, render exactly as a non-admin would see it.
              isAdmin={isAdmin && !showingPublicView}
              key={collection._id}
              name={collection.name}
              planIds={collection.planIds}
              status={collection.status ?? "draft"}
            />
          ))}
        </div>
      )}
    </Container>
  );
}
