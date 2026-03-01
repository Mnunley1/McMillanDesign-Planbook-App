import { useMemo } from "react";
import { useQuery } from "convex/react";
import { BarChart3, Eye, LayoutGrid, Loader2, TrendingUp, Trophy } from "lucide-react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import EmptyState from "@/components/EmptyState";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { api } from "../../convex/_generated/api";

export default function Analytics() {
  const topViewed = useQuery(api.analytics.getTopViewed, { limit: 10 });

  const stats = useMemo(() => {
    if (!topViewed || topViewed.length === 0) return null;
    const totalViews = topViewed.reduce((sum, p) => sum + p.count, 0);
    const uniquePlans = topViewed.length;
    const mostPopular = topViewed[0];
    return { totalViews, uniquePlans, mostPopular };
  }, [topViewed]);

  // All plans sorted by views for distribution list
  const allPlansSorted = useMemo(() => {
    if (!topViewed || topViewed.length === 0) return [];
    return [...topViewed].sort((a, b) => b.count - a.count);
  }, [topViewed]);

  const maxCount = allPlansSorted.length > 0 ? allPlansSorted[0].count : 1;

  return (
    <Container className="max-w-5xl py-6">
      <h1 className="mb-6 flex items-center gap-2 font-bold text-2xl">
        <BarChart3 className="h-6 w-6 text-primary" />
        Analytics
      </h1>

      <div className="grid gap-6">
        {/* Stats Summary Row */}
        {topViewed && stats ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-0">
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Eye className="h-4 w-4" />
                  Total Views
                </div>
              </CardHeader>
              <CardContent>
                <p className="font-bold text-2xl">{stats.totalViews.toLocaleString()}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-0">
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <LayoutGrid className="h-4 w-4" />
                  Unique Plans Viewed
                </div>
              </CardHeader>
              <CardContent>
                <p className="font-bold text-2xl">{stats.uniquePlans}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-0">
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Trophy className="h-4 w-4" />
                  Most Popular
                </div>
              </CardHeader>
              <CardContent>
                <p className="font-bold text-2xl">{stats.mostPopular.planNumber}</p>
                <p className="text-muted-foreground text-sm">
                  {stats.mostPopular.count.toLocaleString()} views
                </p>
              </CardContent>
            </Card>
          </div>
        ) : topViewed === undefined ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader className="pb-0">
                  <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                </CardHeader>
                <CardContent>
                  <div className="h-8 w-16 animate-pulse rounded bg-muted" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : null}

        {/* Most Viewed Plans - Bar Chart */}
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
                      <linearGradient id="barGradient" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="var(--primary)" stopOpacity={1} />
                        <stop offset="100%" stopColor="var(--primary)" stopOpacity={0.4} />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="planNumber"
                      fontSize={12}
                      label={{
                        value: "Plan Number",
                        position: "insideBottom",
                        offset: -2,
                        fontSize: 12,
                        fill: "var(--muted-foreground)",
                      }}
                      stroke="currentColor"
                      strokeOpacity={0.3}
                      tickLine={false}
                    />
                    <YAxis
                      allowDecimals={false}
                      fontSize={12}
                      label={{
                        value: "Views",
                        angle: -90,
                        position: "insideLeft",
                        offset: 10,
                        fontSize: 12,
                        fill: "var(--muted-foreground)",
                      }}
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

        {/* Views Distribution List */}
        {topViewed && allPlansSorted.length > 0 && (
          <Card>
            <CardHeader>
              <h2 className="font-semibold text-lg">All Plan Views</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {allPlansSorted.map((plan) => {
                  const percentage = (plan.count / maxCount) * 100;
                  return (
                    <div key={plan.planId} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{plan.planNumber}</span>
                        <span className="text-muted-foreground">
                          {plan.count.toLocaleString()} {plan.count === 1 ? "view" : "views"}
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
    </Container>
  );
}
