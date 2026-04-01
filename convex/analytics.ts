import { v } from "convex/values";
import type { QueryCtx } from "./_generated/server";
import { mutation, query } from "./_generated/server";
import { rateLimiter } from "./rateLimits";

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

/** Query planViews using the by_timestamp index with optional range bounds. */
function getViewsInRange(ctx: QueryCtx, startTime?: number, endTime?: number) {
  if (startTime !== undefined && endTime !== undefined) {
    return ctx.db
      .query("planViews")
      .withIndex("by_timestamp", (q) =>
        q.gte("timestamp", startTime).lte("timestamp", endTime)
      )
      .collect();
  }
  if (startTime !== undefined) {
    return ctx.db
      .query("planViews")
      .withIndex("by_timestamp", (q) => q.gte("timestamp", startTime))
      .collect();
  }
  if (endTime !== undefined) {
    return ctx.db
      .query("planViews")
      .withIndex("by_timestamp", (q) => q.lte("timestamp", endTime))
      .collect();
  }
  return ctx.db.query("planViews").withIndex("by_timestamp").collect();
}

/** Generic time-range filter for tables without a timestamp index. */
function filterByTime<T extends Record<string, unknown>>(
  items: T[],
  field: keyof T & string,
  startTime?: number,
  endTime?: number
): T[] {
  let result = items;
  if (startTime !== undefined) {
    result = result.filter((item) => (item[field] as number) >= startTime);
  }
  if (endTime !== undefined) {
    result = result.filter((item) => (item[field] as number) <= endTime);
  }
  return result;
}

// ---------------------------------------------------------------------------
// Mutations
// ---------------------------------------------------------------------------

export const trackView = mutation({
  args: {
    planId: v.string(),
    planNumber: v.string(),
    userId: v.string(),
  },
  handler: async (ctx, { planId, planNumber, userId }) => {
    await rateLimiter.limit(ctx, "trackView", { key: userId, throws: true });
    await ctx.db.insert("planViews", {
      planId,
      planNumber,
      userId,
      timestamp: Date.now(),
    });
  },
});

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

export const getViewCounts = query({
  args: { planIds: v.array(v.string()) },
  handler: async (ctx, { planIds }) => {
    const counts: Record<string, number> = {};
    for (const planId of planIds) {
      const views = await ctx.db
        .query("planViews")
        .withIndex("by_plan", (q) => q.eq("planId", planId))
        .collect();
      counts[planId] = views.length;
    }
    return counts;
  },
});

export const getStats = query({
  args: {
    startTime: v.optional(v.number()),
    endTime: v.optional(v.number()),
  },
  handler: async (ctx, { startTime, endTime }) => {
    const views = await getViewsInRange(ctx, startTime, endTime);

    const totalViews = views.length;
    const planCounts: Record<
      string,
      { planId: string; planNumber: string; count: number }
    > = {};
    const userSet = new Set<string>();

    for (const view of views) {
      userSet.add(view.userId);
      if (!planCounts[view.planId]) {
        planCounts[view.planId] = {
          planId: view.planId,
          planNumber: view.planNumber,
          count: 0,
        };
      }
      planCounts[view.planId].count++;
    }

    const sorted = Object.values(planCounts).sort((a, b) => b.count - a.count);
    const mostPopular = sorted[0] ?? null;

    return {
      totalViews,
      uniquePlans: sorted.length,
      uniqueUsers: userSet.size,
      mostPopular,
    };
  },
});

export const getTopViewed = query({
  args: {
    limit: v.optional(v.number()),
    startTime: v.optional(v.number()),
    endTime: v.optional(v.number()),
  },
  handler: async (ctx, { limit, startTime, endTime }) => {
    const maxResults = limit ?? 10;
    const views = await getViewsInRange(ctx, startTime, endTime);

    const counts: Record<
      string,
      { planId: string; planNumber: string; count: number }
    > = {};
    for (const view of views) {
      if (!counts[view.planId]) {
        counts[view.planId] = {
          planId: view.planId,
          planNumber: view.planNumber,
          count: 0,
        };
      }
      counts[view.planId].count++;
    }

    return Object.values(counts)
      .sort((a, b) => b.count - a.count)
      .slice(0, maxResults);
  },
});

export const getTimeSeries = query({
  args: {
    startTime: v.number(),
    endTime: v.number(),
    bucketMs: v.optional(v.number()),
  },
  handler: async (ctx, { startTime, endTime, bucketMs }) => {
    const bucket = bucketMs ?? 86_400_000; // default 1 day
    const views = await getViewsInRange(ctx, startTime, endTime);

    const buckets: Record<number, { views: number; users: Set<string> }> = {};
    for (const view of views) {
      const key = Math.floor(view.timestamp / bucket) * bucket;
      if (!buckets[key]) {
        buckets[key] = { views: 0, users: new Set() };
      }
      buckets[key].views++;
      buckets[key].users.add(view.userId);
    }

    // Fill empty buckets
    for (
      let t = Math.floor(startTime / bucket) * bucket;
      t <= endTime;
      t += bucket
    ) {
      if (!buckets[t]) {
        buckets[t] = { views: 0, users: new Set() };
      }
    }

    return Object.entries(buckets)
      .map(([ts, data]) => ({
        timestamp: Number(ts),
        views: data.views,
        uniqueUsers: data.users.size,
      }))
      .sort((a, b) => a.timestamp - b.timestamp);
  },
});

export const getTrending = query({
  args: { periodMs: v.number() },
  handler: async (ctx, { periodMs }) => {
    const now = Date.now();
    const currentStart = now - periodMs;
    const previousStart = currentStart - periodMs;

    const filtered = await getViewsInRange(ctx, previousStart);

    const current: Record<
      string,
      { planId: string; planNumber: string; count: number }
    > = {};
    const previous: Record<
      string,
      { planId: string; planNumber: string; count: number }
    > = {};

    for (const view of filtered) {
      const bucket = view.timestamp >= currentStart ? current : previous;
      if (!bucket[view.planId]) {
        bucket[view.planId] = {
          planId: view.planId,
          planNumber: view.planNumber,
          count: 0,
        };
      }
      bucket[view.planId].count++;
    }

    const allPlanIds = new Set([
      ...Object.keys(current),
      ...Object.keys(previous),
    ]);
    const results: Array<{
      planId: string;
      planNumber: string;
      currentViews: number;
      previousViews: number;
      changePercent: number | null;
    }> = [];

    for (const planId of allPlanIds) {
      const cur = current[planId]?.count ?? 0;
      const prev = previous[planId]?.count ?? 0;
      const planNumber =
        current[planId]?.planNumber ?? previous[planId]?.planNumber ?? planId;
      const changePercent =
        prev > 0 ? ((cur - prev) / prev) * 100 : cur > 0 ? 100 : null;

      if (cur > 0 || prev > 0) {
        results.push({
          planId,
          planNumber,
          currentViews: cur,
          previousViews: prev,
          changePercent,
        });
      }
    }

    return results.sort((a, b) => b.currentViews - a.currentViews).slice(0, 10);
  },
});

export const getEngagementStats = query({
  args: {
    startTime: v.optional(v.number()),
    endTime: v.optional(v.number()),
  },
  handler: async (ctx, { startTime, endTime }) => {
    const views = await getViewsInRange(ctx, startTime, endTime);

    const activeUsers = new Set(views.map((v) => v.userId)).size;
    const totalViews = views.length;

    // Tables without timestamp indexes — filter in JS
    const allFavorites = await ctx.db.query("favorites").collect();
    const favorites = filterByTime(
      allFavorites,
      "createdAt",
      startTime,
      endTime
    );

    const allCollections = await ctx.db.query("collections").collect();
    const collections = filterByTime(
      allCollections,
      "createdAt",
      startTime,
      endTime
    );

    const allComparisons = await ctx.db.query("savedComparisons").collect();
    const comparisons = filterByTime(
      allComparisons,
      "createdAt",
      startTime,
      endTime
    );

    const allNotes = await ctx.db.query("notes").collect();
    const notes = filterByTime(allNotes, "updatedAt", startTime, endTime);

    // Build planId → planNumber lookup from ALL views (not just filtered range)
    const allViews = await ctx.db.query("planViews").collect();
    const planNumberMap: Record<string, string> = {};
    for (const v of allViews) {
      if (!planNumberMap[v.planId]) {
        planNumberMap[v.planId] = v.planNumber;
      }
    }

    // Top favorited plans
    const favCounts: Record<string, number> = {};
    for (const f of favorites) {
      favCounts[f.planId] = (favCounts[f.planId] ?? 0) + 1;
    }
    const topFavorited = Object.entries(favCounts)
      .map(([planId, count]) => ({
        planId,
        planNumber: planNumberMap[planId] ?? planId,
        count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Top collected plans (count how many collections include each planId)
    const collectCounts: Record<string, number> = {};
    for (const c of collections) {
      for (const planId of c.planIds) {
        collectCounts[planId] = (collectCounts[planId] ?? 0) + 1;
      }
    }
    const topCollected = Object.entries(collectCounts)
      .map(([planId, count]) => ({
        planId,
        planNumber: planNumberMap[planId] ?? planId,
        count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const favoritesToViewsRatio =
      totalViews > 0 ? favorites.length / totalViews : 0;

    return {
      activeUsers,
      totalFavorites: favorites.length,
      totalCollections: collections.length,
      totalComparisons: comparisons.length,
      totalNotes: notes.length,
      topFavorited,
      topCollected,
      favoritesToViewsRatio,
    };
  },
});

export const getExportData = query({
  args: {
    startTime: v.optional(v.number()),
    endTime: v.optional(v.number()),
  },
  handler: async (ctx, { startTime, endTime }) => {
    const views = await getViewsInRange(ctx, startTime, endTime);

    return views.map((v) => ({
      planId: v.planId,
      planNumber: v.planNumber,
      userId: v.userId,
      date: new Date(v.timestamp).toISOString(),
    }));
  },
});
