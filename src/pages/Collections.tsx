import { FolderOpen } from "lucide-react";
import CollectionCard from "@/components/CollectionCard";
import CollectionManager from "@/components/CollectionManager";
import EmptyState from "@/components/EmptyState";
import { Container } from "@/components/ui/container";
import { useCollections } from "@/hooks/use-collections";

export default function Collections() {
  const { collections } = useCollections();

  return (
    <Container className="max-w-5xl py-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="flex items-center gap-2 font-bold text-2xl">
          <FolderOpen className="h-6 w-6 text-primary" />
          Collections
        </h1>
        <CollectionManager />
      </div>

      {collections.length === 0 && (
        <EmptyState
          description="Create a collection to organize plans into groups."
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
              key={collection._id}
              name={collection.name}
              planCount={collection.planIds.length}
            />
          ))}
        </div>
      )}
    </Container>
  );
}
