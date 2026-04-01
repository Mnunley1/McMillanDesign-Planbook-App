import { useQuery } from "convex/react";
import { AlertTriangle, Loader2, Search } from "lucide-react";
import EmptyState from "@/components/EmptyState";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { api } from "../../../convex/_generated/api";
import StatCard from "./StatCard";

const FILTER_LABELS: Record<string, string> = {
  planType: "Plan Type",
  numberOfLevels: "Number of Levels",
  primarySuite: "Primary Suite",
  sqft: "Square Feet",
  planWidth: "Plan Width",
  planDepth: "Plan Depth",
  bedrooms: "Bedrooms",
  vehicleSpaces: "Vehicle Spaces",
  basement: "Basement",
  walkupAttic: "Walk-up Attic",
  garageOrientation: "Garage Orientation",
  refinementList: "Refinement List",
  range: "Range",
  toggle: "Toggle",
  numericMenu: "Numeric Menu",
};

interface SearchAnalyticsTabProps {
  startTime: number | undefined;
}

export default function SearchAnalyticsTab({
  startTime,
}: SearchAnalyticsTabProps) {
  const data = useQuery(api.searchEvents.getPopularSearches, { startTime });

  if (data === undefined) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (data.totalSearches === 0) {
    return (
      <EmptyState
        description="Search events will appear here as users search and filter plans."
        icon={Search}
        title="No search data yet"
      />
    );
  }

  return (
    <div className="grid gap-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatCard
          icon={Search}
          label="Total Searches"
          value={data.totalSearches}
        />
        <StatCard
          icon={AlertTriangle}
          label="Zero-Result Rate"
          subtitle={`${data.zeroResultCount} searches with no results`}
          value={`${(data.zeroResultRate * 100).toFixed(1)}%`}
        />
      </div>

      {/* Top Queries + Top Filters */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <h2 className="font-semibold text-lg">Popular Searches</h2>
          </CardHeader>
          <CardContent>
            {data.topQueries.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                No text searches recorded.
              </p>
            ) : (
              <ol className="space-y-2">
                {data.topQueries.map((item, i) => (
                  <li
                    className="flex items-center justify-between text-sm"
                    key={item.query}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-muted-foreground">{i + 1}.</span>
                      <span className="font-medium">"{item.query}"</span>
                    </span>
                    <span className="text-muted-foreground">
                      {item.count} {item.count === 1 ? "search" : "searches"}
                    </span>
                  </li>
                ))}
              </ol>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="font-semibold text-lg">Most Used Filters</h2>
          </CardHeader>
          <CardContent>
            {data.topFilters.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                No filter usage recorded.
              </p>
            ) : (
              <ol className="space-y-2">
                {data.topFilters.map((item, i) => (
                  <li
                    className="flex items-center justify-between text-sm"
                    key={item.filter}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-muted-foreground">{i + 1}.</span>
                      <span className="font-medium">
                        {FILTER_LABELS[item.filter] ?? item.filter}
                      </span>
                    </span>
                    <span className="text-muted-foreground">
                      {item.count} {item.count === 1 ? "use" : "uses"}
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
