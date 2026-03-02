import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { rateLimiter } from "./rateLimits";

export const track = mutation({
  args: {
    userId: v.string(),
    query: v.string(),
    filters: v.string(),
    resultsCount: v.number(),
  },
  handler: async (ctx, args) => {
    await rateLimiter.limit(ctx, "trackSearch", {
      key: args.userId,
      throws: true,
    });
    await ctx.db.insert("searchEvents", {
      ...args,
      timestamp: Date.now(),
    });
  },
});

export const getPopularSearches = query({
  args: {
    startTime: v.optional(v.number()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { startTime, limit }) => {
    const maxResults = limit ?? 10;
    let events = await ctx.db
      .query("searchEvents")
      .withIndex("by_timestamp")
      .collect();

    if (startTime !== undefined) {
      events = events.filter((e) => e.timestamp >= startTime);
    }

    const totalSearches = events.length;
    const zeroResultCount = events.filter((e) => e.resultsCount === 0).length;
    const zeroResultRate =
      totalSearches > 0 ? zeroResultCount / totalSearches : 0;

    // Top queries (ignore empty queries)
    const queryCounts: Record<string, number> = {};
    for (const e of events) {
      if (e.query.trim()) {
        queryCounts[e.query.trim()] = (queryCounts[e.query.trim()] ?? 0) + 1;
      }
    }
    const topQueries = Object.entries(queryCounts)
      .map(([query, count]) => ({ query, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, maxResults);

    // Top filters
    const filterCounts: Record<string, number> = {};
    for (const e of events) {
      if (e.filters && e.filters !== "{}") {
        try {
          const parsed = JSON.parse(e.filters);
          for (const key of Object.keys(parsed)) {
            const val = parsed[key];
            if (
              val &&
              (Array.isArray(val)
                ? val.length > 0
                : Object.keys(val).length > 0)
            ) {
              filterCounts[key] = (filterCounts[key] ?? 0) + 1;
            }
          }
        } catch {
          // ignore malformed filter JSON
        }
      }
    }
    const topFilters = Object.entries(filterCounts)
      .map(([filter, count]) => ({ filter, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, maxResults);

    return {
      totalSearches,
      zeroResultCount,
      zeroResultRate,
      topQueries,
      topFilters,
    };
  },
});
