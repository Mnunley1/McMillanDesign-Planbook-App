import { useQuery } from "convex/react";
import {
  Eye,
  LayoutGrid,
  Loader2,
  TrendingUp,
  Trophy,
  Users,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import EmptyState from "@/components/EmptyState";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { api } from "../../../convex/_generated/api";
import PlanLink from "./PlanLink";
import StatCard from "./StatCard";

interface OverviewTabProps {
  endTime: number | undefined;
  startTime: number | undefined;
}

function LoadingSkeleton({ count }: { count: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={`skeleton-${i.toString()}`}>
          <CardHeader className="pb-0">
            <div className="h-4 w-24 animate-pulse rounded bg-muted" />
          </CardHeader>
          <CardContent>
            <div className="h-8 w-16 animate-pulse rounded bg-muted" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function OverviewTab({ startTime, endTime }: OverviewTabProps) {
  const stats = useQuery(api.analytics.getStats, { startTime, endTime });
  const topViewed = useQuery(api.analytics.getTopViewed, {
    limit: 10,
    startTime,
    endTime,
  });
  const timeSeries = useQuery(
    api.analytics.getTimeSeries,
    startTime !== undefined && endTime !== undefined
      ? { startTime, endTime }
      : "skip"
  );

  return (
    <div className="grid gap-6">
      {/* Stats Summary */}
      {stats === undefined ? (
        <LoadingSkeleton count={4} />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={Eye} label="Total Views" value={stats.totalViews} />
          <StatCard
            icon={LayoutGrid}
            label="Unique Plans"
            value={stats.uniquePlans}
          />
          <StatCard
            icon={Users}
            label="Active Users"
            value={stats.uniqueUsers}
          />
          <StatCard
            icon={Trophy}
            label="Most Popular"
            subtitle={
              stats.mostPopular
                ? `${stats.mostPopular.count.toLocaleString()} views`
                : undefined
            }
            value={stats.mostPopular?.planNumber ?? "—"}
          />
        </div>
      )}

      {/* Time Series Chart */}
      {timeSeries !== undefined && timeSeries.length > 0 && (
        <Card>
          <CardHeader>
            <h2 className="font-semibold text-lg">Views Over Time</h2>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer height={300} width="100%">
              <AreaChart data={timeSeries}>
                <defs>
                  <linearGradient id="areaGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor="var(--primary)"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="100%"
                      stopColor="var(--primary)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="timestamp"
                  fontSize={12}
                  stroke="currentColor"
                  strokeOpacity={0.3}
                  tickFormatter={(ts: number) =>
                    new Date(ts).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }
                  tickLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  fontSize={12}
                  stroke="currentColor"
                  strokeOpacity={0.3}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius)",
                    color: "var(--popover-foreground)",
                  }}
                  labelFormatter={(label) =>
                    new Date(Number(label)).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })
                  }
                />
                <Area
                  dataKey="views"
                  fill="url(#areaGradient)"
                  name="Views"
                  stroke="var(--primary)"
                  strokeWidth={2}
                  type="monotone"
                />
                <Area
                  dataKey="uniqueUsers"
                  fill="none"
                  name="Unique Users"
                  stroke="var(--muted-foreground)"
                  strokeDasharray="4 4"
                  strokeWidth={1.5}
                  type="monotone"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Top 10 Bar Chart */}
      <Card>
        <CardHeader>
          <h2 className="font-semibold text-lg">Most Viewed Plans</h2>
        </CardHeader>
        <CardContent>
          {topViewed ? (
            topViewed.length === 0 ? (
              <EmptyState
                actionHref="/"
                actionLabel="Browse Plans"
                description="Views will be tracked as users browse plans."
                icon={TrendingUp}
                title="No view data yet"
              />
            ) : (
              <ResponsiveContainer height={300} width="100%">
                <BarChart data={topViewed}>
                  <defs>
                    <linearGradient
                      id="barGradient"
                      x1="0"
                      x2="0"
                      y1="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="var(--primary)"
                        stopOpacity={1}
                      />
                      <stop
                        offset="100%"
                        stopColor="var(--primary)"
                        stopOpacity={0.4}
                      />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="planNumber"
                    fontSize={12}
                    stroke="currentColor"
                    strokeOpacity={0.3}
                    tickLine={false}
                  />
                  <YAxis
                    allowDecimals={false}
                    fontSize={12}
                    stroke="currentColor"
                    strokeOpacity={0.3}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--popover)",
                      border: "1px solid var(--border)",
                      borderRadius: "var(--radius)",
                      color: "var(--popover-foreground)",
                    }}
                  />
                  <Bar
                    dataKey="count"
                    fill="url(#barGradient)"
                    name="Views"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )
          ) : (
            <div className="flex justify-center py-10">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Distribution List */}
      {topViewed && topViewed.length > 0 && (
        <Card>
          <CardHeader>
            <h2 className="font-semibold text-lg">All Plan Views</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topViewed.map((plan) => {
                const maxCount = topViewed[0].count || 1;
                const percentage = (plan.count / maxCount) * 100;
                return (
                  <div className="space-y-1" key={plan.planId}>
                    <div className="flex items-center justify-between text-sm">
                      <PlanLink
                        planId={plan.planId}
                        planNumber={plan.planNumber}
                      />
                      <span className="text-muted-foreground">
                        {plan.count.toLocaleString()}{" "}
                        {plan.count === 1 ? "view" : "views"}
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
