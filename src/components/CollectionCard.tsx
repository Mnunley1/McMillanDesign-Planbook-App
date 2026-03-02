import { FolderOpen, Trash2 } from "lucide-react";
import { Link as RouterLink } from "react-router-dom";
import { useCollections } from "@/hooks/use-collections";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";

interface CollectionCardProps {
  description: string;
  id: string;
  isAdmin?: boolean;
  name: string;
  planCount: number;
  status?: string;
}

export default function CollectionCard({
  id,
  name,
  description,
  planCount,
  status,
  isAdmin,
}: CollectionCardProps) {
  const { remove } = useCollections();

  return (
    <Card className="transition-all hover:shadow-md">
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <RouterLink className="hover:text-primary" to={`/collections/${id}`}>
          <div className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-lg">{name}</h3>
            {isAdmin && (
              <Badge variant={status === "public" ? "default" : "secondary"}>
                {status === "public" ? "Public" : "Draft"}
              </Badge>
            )}
          </div>
        </RouterLink>
        {isAdmin && (
          <Button
            className="text-muted-foreground hover:text-destructive"
            onClick={() => remove(id)}
            size="icon"
            variant="ghost"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
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
