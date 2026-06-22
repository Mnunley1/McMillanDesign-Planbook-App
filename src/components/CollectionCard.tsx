import { useQuery } from "@tanstack/react-query";
import { FolderOpen, Layers, Trash2 } from "lucide-react";
import { Link as RouterLink } from "react-router-dom";
import { useCollections } from "@/hooks/use-collections";
import { PLANS_INDEX, searchClient } from "@/lib/algolia";
import { cn } from "@/lib/utils";
import type { FloorPlanHit } from "@/types/floor-plan";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

interface CollectionCardProps {
  description: string;
  id: string;
  isAdmin?: boolean;
  name: string;
  planIds: string[];
  status?: string;
}

export default function CollectionCard({
  id,
  name,
  description,
  planIds,
  status,
  isAdmin,
}: CollectionCardProps) {
  const { remove } = useCollections();
  const planCount = planIds.length;
  const previewIds = planIds.slice(0, 4);

  const { data: images = [] } = useQuery({
    queryKey: ["collection-cover", id, previewIds],
    queryFn: async () => {
      if (previewIds.length === 0) {
        return [] as string[];
      }
      const index = searchClient.initIndex(PLANS_INDEX);
      const { results } = await index.getObjects<FloorPlanHit>(previewIds);
      return results
        .filter((r): r is FloorPlanHit => r !== null && r.published !== false)
        .map((r) => r.image)
        .filter((src): src is string => Boolean(src));
    },
    enabled: previewIds.length > 0,
    staleTime: 5 * 60 * 1000,
  });

  const coverImages = images.slice(0, 4);

  return (
    <RouterLink
      className="group block hover:no-underline"
      to={`/collections/${id}`}
    >
      <Card className="h-full overflow-hidden border-border/60 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg">
        {/* Cover */}
        <div className="relative aspect-[16/10] overflow-hidden bg-muted">
          {coverImages.length > 0 ? (
            <div
              className={cn(
                "grid h-full w-full gap-0.5",
                coverImages.length === 1 ? "grid-cols-1" : "grid-cols-2",
                coverImages.length > 2 ? "grid-rows-2" : "grid-rows-1"
              )}
            >
              {coverImages.map((src, i) => (
                <div className="overflow-hidden bg-muted" key={`${src}-${i}`}>
                  <img
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    src={src}
                  />
                </div>
              ))}
              {coverImages.length === 3 && (
                <div className="flex items-center justify-center bg-gradient-to-br from-primary/10 to-muted">
                  <FolderOpen className="h-8 w-8 text-primary/30" />
                </div>
              )}
            </div>
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/10 via-muted to-background">
              <FolderOpen className="h-12 w-12 text-primary/40" />
            </div>
          )}

          {/* Plan count pill */}
          <div className="absolute right-2 bottom-2 flex items-center gap-1 rounded-full bg-background/85 px-2.5 py-1 font-medium text-foreground text-xs shadow-sm backdrop-blur-sm">
            <Layers className="h-3.5 w-3.5 text-primary" />
            {planCount} plan{planCount !== 1 ? "s" : ""}
          </div>

          {/* Status badge (admin) */}
          {isAdmin && status && (
            <Badge
              className="absolute top-2 left-2"
              variant={status === "public" ? "default" : "secondary"}
            >
              {status === "public" ? "Public" : "Draft"}
            </Badge>
          )}

          {/* Delete (admin) */}
          {isAdmin && (
            <Button
              className="absolute top-2 right-2 bg-background/85 text-muted-foreground opacity-0 backdrop-blur-sm transition-opacity hover:text-destructive group-hover:opacity-100"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                remove(id);
              }}
              size="icon"
              variant="ghost"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>

        <CardContent className="p-4">
          <h3 className="font-semibold text-lg leading-tight tracking-tight transition-colors group-hover:text-primary">
            {name}
          </h3>
          {description && (
            <p className="mt-1 line-clamp-2 text-muted-foreground text-sm">
              {description}
            </p>
          )}
        </CardContent>
      </Card>
    </RouterLink>
  );
}
