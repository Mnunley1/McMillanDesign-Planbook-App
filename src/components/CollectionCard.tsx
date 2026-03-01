import { FolderOpen, Trash2 } from "lucide-react";
import { Link as RouterLink } from "react-router-dom";
import { useCollections } from "@/hooks/use-collections";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";

interface CollectionCardProps {
  description: string;
  id: string;
  name: string;
  planCount: number;
}

export default function CollectionCard({
  id,
  name,
  description,
  planCount,
}: CollectionCardProps) {
  const { remove } = useCollections();

  return (
    <Card className="transition-all hover:shadow-md">
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <RouterLink className="hover:text-primary" to={`/collections/${id}`}>
          <div className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-lg">{name}</h3>
          </div>
        </RouterLink>
        <Button
          className="text-muted-foreground hover:text-destructive"
          onClick={() => remove(id)}
          size="icon"
          variant="ghost"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        {description && (
          <p className="mb-2 text-muted-foreground text-sm">{description}</p>
        )}
        <p className="text-muted-foreground text-xs">
          {planCount} plan{planCount !== 1 ? "s" : ""}
        </p>
      </CardContent>
    </Card>
  );
}
