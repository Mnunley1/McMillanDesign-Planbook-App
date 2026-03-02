import PlanSearch from "@/components/PlanSearch";
import type { SortItem } from "@/types/floor-plan";

const sortItems: SortItem[] = [
  { label: "Default", value: "allPlans" },
  { label: "Newest", value: "allPlans_dateAdded_desc" },
  { label: "Bedrooms (asc)", value: "allPlans_bedrooms_asc" },
  { label: "Bedrooms (desc)", value: "allPlans_bedrooms_desc" },
  { label: "Plan Width (asc)", value: "allPlans_width_asc" },
  { label: "Plan Width (desc)", value: "allPlans_width_desc" },
  { label: "Plan Depth (asc)", value: "allPlans_depth_asc" },
  { label: "Plan Depth (desc)", value: "allPlans_depth_desc" },
];

function Master() {
  return <PlanSearch indexName="allPlans" sortItems={sortItems} />;
}

export default Master;
