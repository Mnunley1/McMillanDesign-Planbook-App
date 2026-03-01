import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { rateLimiter } from "./rateLimits";

export const list = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query("recentlyViewed")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .take(20);
  },
});

export const add = mutation({
  args: {
    userId: v.string(),
    planId: v.string(),
    planNumber: v.string(),
  },
  handler: async (ctx, { userId, planId, planNumber }) => {
    await rateLimiter.limit(ctx, "addRecentlyViewed", {
      key: userId,
      throws: true,
    });
    // Remove existing entry for this plan if it exists
    const existing = await ctx.db
      .query("recentlyViewed")
      .withIndex("by_user_plan", (q) =>
        q.eq("userId", userId).eq("planId", planId)
      )
      .first();

    if (existing) {
      await ctx.db.delete(existing._id);
    }

    // Add new entry
    await ctx.db.insert("recentlyViewed", {
      userId,
      planId,
      planNumber,
      timestamp: Date.now(),
    });

    // Cap at 20 entries — remove oldest if needed
    const all = await ctx.db
      .query("recentlyViewed")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();

    if (all.length > 20) {
      for (const item of all.slice(20)) {
        await ctx.db.delete(item._id);
      }
    }
  },
});
