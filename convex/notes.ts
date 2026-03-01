import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { rateLimiter } from "./rateLimits";

export const get = query({
  args: { userId: v.string(), planId: v.string() },
  handler: async (ctx, { userId, planId }) => {
    return await ctx.db
      .query("notes")
      .withIndex("by_user_plan", (q) =>
        q.eq("userId", userId).eq("planId", planId)
      )
      .first();
  },
});

export const listByUser = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query("notes")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

export const upsert = mutation({
  args: { userId: v.string(), planId: v.string(), text: v.string() },
  handler: async (ctx, { userId, planId, text }) => {
    await rateLimiter.limit(ctx, "upsertNote", { key: userId, throws: true });
    const existing = await ctx.db
      .query("notes")
      .withIndex("by_user_plan", (q) =>
        q.eq("userId", userId).eq("planId", planId)
      )
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, { text, updatedAt: Date.now() });
      return existing._id;
    }

    return await ctx.db.insert("notes", {
      userId,
      planId,
      text,
      updatedAt: Date.now(),
    });
  },
});

export const remove = mutation({
  args: { userId: v.string(), planId: v.string() },
  handler: async (ctx, { userId, planId }) => {
    await rateLimiter.limit(ctx, "upsertNote", { key: userId, throws: true });
    const existing = await ctx.db
      .query("notes")
      .withIndex("by_user_plan", (q) =>
        q.eq("userId", userId).eq("planId", planId)
      )
      .first();

    if (existing) {
      await ctx.db.delete(existing._id);
    }
  },
});
