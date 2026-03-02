import { useQuery } from "convex/react";
import { Loader2, TrendingUp } from "lucide-react";
import {
  type DateRange,
  RANGE_MS,
} from "@/components/analytics/DateRangeSelect";
import EmptyState from "@/components/EmptyState";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { api } from "../../../convex/_generated/api";
import PlanLink from "./PlanLink";

interface TrendingTabProps {
  dateRange: DateRange;
}

export default function TrendingTab({ dateRange }: TrendingTabProps) {
  const periodMs = dateRange === "all" ? undefined : RANGE_MS[dateRange];

  const data = useQuery(
    api.analytics.getTrending,
    periodMs !== undefined ? { periodMs } : "skip"
  );

  if (dateRange === "all") {
    return (
      <EmptyState
        description="Select a specific time period (7d, 30d, or 90d) to see trending plans."
        icon={TrendingUp}
        title="Select a time period"
      />
    );
  }

  if (data === undefined) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <EmptyState
        actionHref="/"
        actionLabel="Browse Plans"
        description="No view data to calculate trends."
        icon={TrendingUp}
        title="No trending data"
      />
    );
  }

  return (
    <Card>
      <CardHeader>
        <h2 className="font-semibold text-lg">Trending Plans</h2>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.map((plan) => (
            <div
              className="flex items-center justify-between rounded-lg border p-3"
              key={plan.planId}
            >
              <div className="flex items-center gap-3">
                <PlanLink planId={plan.planId} planNumber={plan.planNumber} />
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-muted-foreground">
                  {plan.currentViews} views (prev: {plan.previousViews})
                </span>
                {plan.changePercent !== null ? (
                  <Badge
                    variant={
                      plan.changePercent > 0
                        ? "default"
                        : plan.changePercent < 0
                          ? "destructive"
                          : "secondary"
                    }
                  >
                    {plan.changePercent > 0 ? "+" : ""}
                    {plan.changePercent.toFixed(0)}%
                  </Badge>
                ) : (
                  <Badge variant="secondary">New</Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
