import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query("savedSearches")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

export const save = mutation({
  args: { userId: v.string(), name: v.string(), uiState: v.string() },
  handler: async (ctx, { userId, name, uiState }) => {
    return await ctx.db.insert("savedSearches", {
      userId,
      name,
      uiState,
      createdAt: Date.now(),
    });
  },
});

export const remove = mutation({
  args: { id: v.id("savedSearches") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});
