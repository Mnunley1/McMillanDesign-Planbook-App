import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  favorites: defineTable({
    userId: v.string(),
    planId: v.string(),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_plan", ["userId", "planId"]),

  notes: defineTable({
    userId: v.string(),
    planId: v.string(),
    text: v.string(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_plan", ["userId", "planId"]),

  savedSearches: defineTable({
    userId: v.string(),
    name: v.string(),
    uiState: v.string(),
    createdAt: v.number(),
  }).index("by_user", ["userId"]),

  recentlyViewed: defineTable({
    userId: v.string(),
    planId: v.string(),
    planNumber: v.string(),
    timestamp: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_plan", ["userId", "planId"]),

  collections: defineTable({
    userId: v.string(),
    name: v.string(),
    description: v.string(),
    planIds: v.array(v.string()),
    status: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_status", ["status"]),

  savedComparisons: defineTable({
    userId: v.string(),
    name: v.string(),
    planIds: v.array(v.string()),
    createdAt: v.number(),
  }).index("by_user", ["userId"]),

  planViews: defineTable({
    planId: v.string(),
    planNumber: v.string(),
    userId: v.string(),
    timestamp: v.number(),
  })
    .index("by_plan", ["planId"])
    .index("by_user", ["userId"])
    .index("by_timestamp", ["timestamp"]),

  searchEvents: defineTable({
    userId: v.string(),
    query: v.string(),
    filters: v.string(),
    resultsCount: v.number(),
    timestamp: v.number(),
  })
    .index("by_timestamp", ["timestamp"])
    .index("by_user", ["userId"]),
});
