import { useQuery } from "convex/react";
import {
  FolderHeart,
  GitCompare,
  Heart,
  Loader2,
  Percent,
  StickyNote,
  Users,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { api } from "../../../convex/_generated/api";
import PlanLink from "./PlanLink";
import StatCard from "./StatCard";

interface EngagementTabProps {
  endTime: number | undefined;
  startTime: number | undefined;
}

export default function EngagementTab({
  startTime,
  endTime,
}: EngagementTabProps) {
  const data = useQuery(api.analytics.getEngagementStats, {
    startTime,
    endTime,
  });

  if (data === undefined) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard icon={Users} label="Active Users" value={data.activeUsers} />
        <StatCard
          icon={Heart}
          label="Total Favorites"
          value={data.totalFavorites}
        />
        <StatCard
          icon={FolderHeart}
          label="Total Collections"
          value={data.totalCollections}
        />
        <StatCard
          icon={GitCompare}
          label="Comparisons"
          value={data.totalComparisons}
        />
        <StatCard
          icon={Percent}
          label="Fav/View Ratio"
          value={`${(data.favoritesToViewsRatio * 100).toFixed(1)}%`}
        />
      </div>

      {/* Notes count */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatCard
          icon={StickyNote}
          label="Total Notes"
          value={data.totalNotes}
        />
      </div>

      {/* Top Favorited + Top Collected */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <h2 className="font-semibold text-lg">Most Favorited Plans</h2>
          </CardHeader>
          <CardContent>
            {data.topFavorited.length === 0 ? (
              <p className="text-muted-foreground text-sm">No favorites yet.</p>
            ) : (
              <ol className="space-y-2">
                {data.topFavorited.map((item, i) => (
                  <li
                    className="flex items-center justify-between text-sm"
                    key={item.planId}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-muted-foreground">{i + 1}.</span>
                      <PlanLink planId={item.planId} planNumber={item.planId} />
                    </span>
                    <span className="text-muted-foreground">
                      {item.count} {item.count === 1 ? "favorite" : "favorites"}
                    </span>
                  </li>
                ))}
              </ol>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="font-semibold text-lg">Most Collected Plans</h2>
          </CardHeader>
          <CardContent>
            {data.topCollected.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                No collections yet.
              </p>
            ) : (
              <ol className="space-y-2">
                {data.topCollected.map((item, i) => (
                  <li
                    className="flex items-center justify-between text-sm"
                    key={item.planId}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-muted-foreground">{i + 1}.</span>
                      <PlanLink planId={item.planId} planNumber={item.planId} />
                    </span>
                    <span className="text-muted-foreground">
                      {item.count}{" "}
                      {item.count === 1 ? "collection" : "collections"}
                    </span>
                  </li>
                ))}
              </ol>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
