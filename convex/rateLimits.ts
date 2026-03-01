import { RateLimiter, MINUTE, HOUR } from "@convex-dev/rate-limiter";
import { components } from "./_generated/api";

export const rateLimiter = new RateLimiter(components.rateLimiter, {
  trackView: { kind: "token bucket", rate: 30, period: MINUTE, capacity: 5 },
  trackSearch: { kind: "token bucket", rate: 60, period: MINUTE, capacity: 10 },
  addRecentlyViewed: {
    kind: "token bucket",
    rate: 30,
    period: MINUTE,
    capacity: 5,
  },
  addFavorite: { kind: "token bucket", rate: 20, period: MINUTE, capacity: 5 },
  upsertNote: { kind: "token bucket", rate: 10, period: MINUTE, capacity: 3 },
  createCollection: { kind: "fixed window", rate: 10, period: HOUR },
  updateCollection: {
    kind: "token bucket",
    rate: 20,
    period: MINUTE,
    capacity: 5,
  },
  saveSearch: { kind: "fixed window", rate: 20, period: HOUR },
  saveComparison: { kind: "fixed window", rate: 20, period: HOUR },
});
