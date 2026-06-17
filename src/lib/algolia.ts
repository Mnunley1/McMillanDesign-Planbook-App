import algoliasearch from "algoliasearch";
import type { SortItem } from "@/types/floor-plan";

export const searchClient = algoliasearch(
  import.meta.env.VITE_ALGOLIA_APP_ID,
  import.meta.env.VITE_ALGOLIA_SEARCH_API_KEY
);

// Single source-of-truth index. Every record carries `status` + a `published`
// boolean, so public surfaces filter `published:true` and admin filters per tab.
// The name is env-driven so the migration cutover (and rollback) is a config
// change rather than a code edit.
export const PLANS_INDEX = import.meta.env.VITE_PLANS_INDEX || "plans";

// Filter expression that keeps draft/unpublished plans out of public results.
export const PUBLISHED_FILTER = "published:true";

// Sort replicas are named `<index>_<sort>` and must exist in Algolia.
export const planSortItems: SortItem[] = [
  { label: "Newest", value: `${PLANS_INDEX}_dateAdded_desc` },
  { label: "Oldest", value: `${PLANS_INDEX}_dateAdded_asc` },
  { label: "Bedrooms (asc)", value: `${PLANS_INDEX}_bedrooms_asc` },
  { label: "Bedrooms (desc)", value: `${PLANS_INDEX}_bedrooms_desc` },
  { label: "Plan Width (asc)", value: `${PLANS_INDEX}_width_asc` },
  { label: "Plan Width (desc)", value: `${PLANS_INDEX}_width_desc` },
  { label: "Plan Depth (asc)", value: `${PLANS_INDEX}_depth_asc` },
  { label: "Plan Depth (desc)", value: `${PLANS_INDEX}_depth_desc` },
];
