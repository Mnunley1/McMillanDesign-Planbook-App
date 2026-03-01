import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query("collections")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

export const get = query({
  args: { id: v.id("collections") },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id);
  },
});

export const create = mutation({
  args: {
    userId: v.string(),
    name: v.string(),
    description: v.string(),
    planIds: v.array(v.string()),
  },
  handler: async (ctx, { userId, name, description, planIds }) => {
    return await ctx.db.insert("collections", {
      userId,
      name,
      description,
      planIds,
      createdAt: Date.now(),
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("collections"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    planIds: v.optional(v.array(v.string())),
  },
  handler: async (ctx, { id, ...fields }) => {
    const updates: Record<string, unknown> = {};
    if (fields.name !== undefined) {
      updates.name = fields.name;
    }
    if (fields.description !== undefined) {
      updates.description = fields.description;
    }
    if (fields.planIds !== undefined) {
      updates.planIds = fields.planIds;
    }

    await ctx.db.patch(id, updates);
  },
});

export const remove = mutation({
  args: { id: v.id("collections") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});
