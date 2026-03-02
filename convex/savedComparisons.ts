import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { rateLimiter } from "./rateLimits";

export const list = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query("savedComparisons")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

export const save = mutation({
  args: { userId: v.string(), name: v.string(), planIds: v.array(v.string()) },
  handler: async (ctx, { userId, name, planIds }) => {
    await rateLimiter.limit(ctx, "saveComparison", {
      key: userId,
      throws: true,
    });
    return await ctx.db.insert("savedComparisons", {
      userId,
      name,
      planIds,
      createdAt: Date.now(),
    });
  },
});

export const remove = mutation({
  args: { id: v.id("savedComparisons") },
  handler: async (ctx, { id }) => {
    const doc = await ctx.db.get(id);
    if (doc) {
      await rateLimiter.limit(ctx, "saveComparison", {
        key: doc.userId,
        throws: true,
      });
    }
    await ctx.db.delete(id);
  },
});
