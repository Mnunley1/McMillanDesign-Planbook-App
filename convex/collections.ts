import { v } from "convex/values";
import type { MutationCtx, QueryCtx } from "./_generated/server";
import { mutation, query } from "./_generated/server";
import { rateLimiter } from "./rateLimits";

// Collections are a shared admin curation library: every admin sees and manages
// every collection, whoever created it. `userId` is kept only as created-by
// attribution. Non-admins only ever see collections with status "public".
//
// The `role` claim comes from the Clerk `convex` JWT template
// (`{{user.public_metadata.role}}`) — the same publicMetadata.role the client
// gates admin UI on, but verified server-side here.
async function isAdmin(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  return identity?.role === "admin";
}

async function requireAdmin(ctx: MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Not signed in");
  }
  if (identity.role !== "admin") {
    throw new Error("Admin access required");
  }
  return identity;
}

// `userId` is accepted-and-ignored on the read paths purely for back-compat:
// a cached/older frontend bundle still passes it, and Convex rejects unknown
// args, which takes the live Collections page down. Identity comes from the
// token. Safe to drop once every client is on the current build.
const LEGACY_USER_ID = v.optional(v.string());

// The full admin library. Returns nothing to non-admins rather than throwing,
// so the Collections page renders its public view for them without erroring.
export const list = query({
  args: { userId: LEGACY_USER_ID },
  handler: async (ctx) => {
    if (!(await isAdmin(ctx))) {
      return [];
    }
    return await ctx.db.query("collections").order("desc").collect();
  },
});

export const get = query({
  args: { id: v.id("collections"), userId: LEGACY_USER_ID },
  handler: async (ctx, { id }) => {
    const collection = await ctx.db.get(id);
    if (!collection) {
      return null;
    }
    // Drafts are visible to any admin; the public only sees public collections.
    if (collection.status !== "public" && !(await isAdmin(ctx))) {
      return null;
    }
    return collection;
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
    name: v.string(),
    description: v.string(),
    planIds: v.array(v.string()),
    status: v.optional(v.string()),
    // Ignored — the creator is taken from the verified token, never the client.
    userId: LEGACY_USER_ID,
  },
  handler: async (ctx, { name, description, planIds, status }) => {
    const identity = await requireAdmin(ctx);
    await rateLimiter.limit(ctx, "createCollection", {
      key: identity.subject,
      throws: true,
    });
    return await ctx.db.insert("collections", {
      userId: identity.subject,
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
    const identity = await requireAdmin(ctx);
    // Rate limit the editor, not the creator — any admin may edit any collection.
    await rateLimiter.limit(ctx, "updateCollection", {
      key: identity.subject,
      throws: true,
    });

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
    const identity = await requireAdmin(ctx);
    await rateLimiter.limit(ctx, "updateCollection", {
      key: identity.subject,
      throws: true,
    });
    await ctx.db.delete(id);
  },
});
