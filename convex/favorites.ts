import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { rateLimiter } from "./rateLimits";

export const list = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query("favorites")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

export const isFavorite = query({
  args: { userId: v.string(), planId: v.string() },
  handler: async (ctx, { userId, planId }) => {
    const existing = await ctx.db
      .query("favorites")
      .withIndex("by_user_plan", (q) =>
        q.eq("userId", userId).eq("planId", planId)
      )
      .first();
    return existing !== null;
  },
});

export const add = mutation({
  args: { userId: v.string(), planId: v.string() },
  handler: async (ctx, { userId, planId }) => {
    await rateLimiter.limit(ctx, "addFavorite", { key: userId, throws: true });
    const existing = await ctx.db
      .query("favorites")
      .withIndex("by_user_plan", (q) =>
        q.eq("userId", userId).eq("planId", planId)
      )
      .first();

    if (existing) {
      return existing._id;
    }

    return await ctx.db.insert("favorites", {
      userId,
      planId,
      createdAt: Date.now(),
    });
  },
});

export const remove = mutation({
  args: { userId: v.string(), planId: v.string() },
  handler: async (ctx, { userId, planId }) => {
    await rateLimiter.limit(ctx, "addFavorite", { key: userId, throws: true });
    const existing = await ctx.db
      .query("favorites")
      .withIndex("by_user_plan", (q) =>
        q.eq("userId", userId).eq("planId", planId)
      )
      .first();

    if (existing) {
      await ctx.db.delete(existing._id);
    }
  },
});
