import PlanSearch from "@/components/PlanSearch";
import type { SortItem } from "@/types/floor-plan";

const sortItems: SortItem[] = [
  { label: "Newest", value: "floorPlans_dateAdded_desc" },
  { label: "Oldest", value: "floorPlans_dateAdded_asc" },
  { label: "Bedrooms (asc)", value: "floorPlans_bedrooms_asc" },
  { label: "Bedrooms (desc)", value: "floorPlans_bedrooms_desc" },
  { label: "Plan Width (asc)", value: "floorPlans_width_asc" },
  { label: "Plan Width (desc)", value: "floorPlans_width_desc" },
  { label: "Plan Depth (asc)", value: "floorPlans_depth_asc" },
  { label: "Plan Depth (desc)", value: "floorPlans_depth_desc" },
];

function Home() {
  return <PlanSearch indexName="floorPlans" sortItems={sortItems} />;
}

export default Home;
