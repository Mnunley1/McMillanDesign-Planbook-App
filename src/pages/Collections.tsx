import { useUser } from "@clerk/clerk-react";
import { FolderOpen } from "lucide-react";
import CollectionCard from "@/components/CollectionCard";
import CollectionManager from "@/components/CollectionManager";
import EmptyState from "@/components/EmptyState";
import { Container } from "@/components/ui/container";
import { useCollections, usePublicCollections } from "@/hooks/use-collections";

export default function Collections() {
  const { user } = useUser();
  const isAdmin = user?.publicMetadata?.role === "admin";
  const { collections: myCollections } = useCollections();
  const { collections: publicCollections } = usePublicCollections();

  const collections = isAdmin ? myCollections : publicCollections;

  return (
    <Container className="max-w-5xl py-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="flex items-center gap-2 font-bold text-2xl">
          <FolderOpen className="h-6 w-6 text-primary" />
          Collections
        </h1>
        {isAdmin && <CollectionManager />}
      </div>

      {collections.length === 0 && (
        <EmptyState
          description={
            isAdmin
              ? "Create a collection to organize plans into groups."
              : "No public collections are available yet."
          }
          icon={FolderOpen}
          title="No collections yet"
        />
      )}

      {collections.length > 0 && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {collections.map((collection) => (
            <CollectionCard
              description={collection.description}
              id={collection._id}
              isAdmin={isAdmin}
              key={collection._id}
              name={collection.name}
              planCount={collection.planIds.length}
              status={collection.status ?? "draft"}
            />
          ))}
        </div>
      )}
    </Container>
  );
}
