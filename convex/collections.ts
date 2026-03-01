import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { rateLimiter } from "./rateLimits";

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

export const listPublic = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("collections")
      .withIndex("by_status", (q) => q.eq("status", "public"))
      .order("desc")
      .collect();
  },
});

export const create = mutation({
  args: {
    userId: v.string(),
    name: v.string(),
    description: v.string(),
    planIds: v.array(v.string()),
    status: v.optional(v.string()),
  },
  handler: async (ctx, { userId, name, description, planIds, status }) => {
    await rateLimiter.limit(ctx, "createCollection", {
      key: userId,
      throws: true,
    });
    return await ctx.db.insert("collections", {
      userId,
      name,
      description,
      planIds,
      status: status ?? "draft",
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
    status: v.optional(v.string()),
  },
  handler: async (ctx, { id, ...fields }) => {
    const doc = await ctx.db.get(id);
    if (doc) {
      await rateLimiter.limit(ctx, "updateCollection", {
        key: doc.userId,
        throws: true,
      });
    }
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
    if (fields.status !== undefined) {
      updates.status = fields.status;
    }

    await ctx.db.patch(id, updates);
  },
});

export const remove = mutation({
  args: { id: v.id("collections") },
  handler: async (ctx, { id }) => {
    const doc = await ctx.db.get(id);
    if (doc) {
      await rateLimiter.limit(ctx, "updateCollection", {
        key: doc.userId,
        throws: true,
      });
    }
    await ctx.db.delete(id);
  },
});
