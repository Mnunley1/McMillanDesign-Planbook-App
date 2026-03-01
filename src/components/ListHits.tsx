import { ImageOff } from "lucide-react";
import { useState } from "react";
import { useHits, useInstantSearch } from "react-instantsearch";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import type { FloorPlanHit } from "@/types/floor-plan";
import SearchEmptyState from "./SearchEmptyState";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

function ListThumbnail({ src, alt }: { src?: string; alt: string }) {
  const [imageError, setImageError] = useState(false);

  if (imageError || !src) {
    return (
      <div className="flex h-12 w-16 items-center justify-center rounded bg-muted">
        <ImageOff className="h-4 w-4 text-muted-foreground" />
      </div>
    );
  }

  return (
    <img
      alt={alt}
      className="h-12 w-16 rounded object-cover"
      loading="lazy"
      onError={() => setImageError(true)}
      src={src}
    />
  );
}

interface ListHitsProps {
  className?: string;
}

export default function ListHits({ className }: ListHitsProps) {
  const { hits } = useHits<FloorPlanHit>();
  const { status } = useInstantSearch();
  const location = useLocation();
  const navigate = useNavigate();
  const isMasterRoute = location.pathname.startsWith("/master");
  const isSearching = status === "loading" || status === "stalled";

  if (!isSearching && hits.length === 0) {
    return <SearchEmptyState />;
  }

  if (isSearching) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div className="h-16 animate-pulse rounded bg-muted" key={idx} />
        ))}
      </div>
    );
  }

  return (
    <div className={cn("rounded-md border", className)}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16" />
            <TableHead>Plan #</TableHead>
            <TableHead className="hidden md:table-cell">Description</TableHead>
            <TableHead>Beds</TableHead>
            <TableHead>Sq Ft</TableHead>
            <TableHead className="hidden md:table-cell">Width</TableHead>
            <TableHead className="hidden md:table-cell">Depth</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {hits.map((hit) => {
            const squareFootage = hit.squareFeet || hit.sqft || 0;
            const targetUrl = isMasterRoute
              ? `/master/plan/${hit.objectID}`
              : `/plan/${hit.objectID}`;
            return (
              <TableRow
                className="cursor-pointer focus-visible:bg-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
                key={hit.objectID}
                onClick={() => navigate(targetUrl)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    navigate(targetUrl);
                  }
                }}
                role="link"
                tabIndex={0}
              >
                <TableCell className="p-1">
                  <RouterLink to={targetUrl}>
                    <ListThumbnail alt={hit.planNumber} src={hit.image} />
                  </RouterLink>
                </TableCell>
                <TableCell className="font-medium">
                  <RouterLink className="hover:text-primary" to={targetUrl}>
                    {hit.planNumber}
                  </RouterLink>
                </TableCell>
                <TableCell className="hidden max-w-[200px] truncate md:table-cell">
                  {hit.description}
                </TableCell>
                <TableCell>{hit.bedrooms}</TableCell>
                <TableCell>{squareFootage.toLocaleString()}</TableCell>
                <TableCell className="hidden md:table-cell">
                  {hit.planWidth ? `${hit.planWidth}'` : "—"}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {hit.planDepth ? `${hit.planDepth}'` : "—"}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
