import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const trackView = mutation({
  args: {
    planId: v.string(),
    planNumber: v.string(),
    userId: v.string(),
  },
  handler: async (ctx, { planId, planNumber, userId }) => {
    await ctx.db.insert("planViews", {
      planId,
      planNumber,
      userId,
      timestamp: Date.now(),
    });
  },
});

export const getTopViewed = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, { limit }) => {
    const maxResults = limit ?? 10;
    const views = await ctx.db.query("planViews").collect();

    // Aggregate view counts by planId
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
