import { useState } from "react";
import PlanSearch from "@/components/PlanSearch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { SortItem } from "@/types/floor-plan";

const allPlansSortItems: SortItem[] = [
  { label: "Default", value: "allPlans" },
  { label: "Newest", value: "allPlans_dateAdded_desc" },
  { label: "Oldest", value: "allPlans_dateAdded_asc" },
  { label: "Bedrooms (asc)", value: "allPlans_bedrooms_asc" },
  { label: "Bedrooms (desc)", value: "allPlans_bedrooms_desc" },
  { label: "Plan Width (asc)", value: "allPlans_width_asc" },
  { label: "Plan Width (desc)", value: "allPlans_width_desc" },
  { label: "Plan Depth (asc)", value: "allPlans_depth_asc" },
  { label: "Plan Depth (desc)", value: "allPlans_depth_desc" },
];

const publishedSortItems: SortItem[] = [
  { label: "Default", value: "floorPlans" },
  { label: "Newest", value: "floorPlans_dateAdded_desc" },
  { label: "Oldest", value: "floorPlans_dateAdded_asc" },
  { label: "Bedrooms (asc)", value: "floorPlans_bedrooms_asc" },
  { label: "Bedrooms (desc)", value: "floorPlans_bedrooms_desc" },
  { label: "Plan Width (asc)", value: "floorPlans_width_asc" },
  { label: "Plan Width (desc)", value: "floorPlans_width_desc" },
  { label: "Plan Depth (asc)", value: "floorPlans_depth_asc" },
  { label: "Plan Depth (desc)", value: "floorPlans_depth_desc" },
];

type IndexMode = "all" | "published";

function Master() {
  const [mode, setMode] = useState<IndexMode>("all");

  const indexName = mode === "all" ? "allPlans" : "floorPlans";
  const sortItems = mode === "all" ? allPlansSortItems : publishedSortItems;

  return (
    <div>
      <div className="flex justify-center pt-6">
        <Tabs
          value={mode}
          onValueChange={(value) => setMode(value as IndexMode)}
        >
          <TabsList>
            <TabsTrigger value="all">All Plans</TabsTrigger>
            <TabsTrigger value="published">Published Only</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <PlanSearch key={mode} indexName={indexName} sortItems={sortItems} />
    </div>
  );
}

export default Master;
