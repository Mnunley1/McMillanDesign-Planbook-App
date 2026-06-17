import { useState } from "react";
import PlanSearch from "@/components/PlanSearch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PLANS_INDEX, planSortItems } from "@/lib/algolia";

type IndexMode = "all" | "published" | "unpublished";

// All tabs query the single `plans` index; they differ only by publish filter.
const FILTER_BY_MODE: Record<IndexMode, string | undefined> = {
  all: undefined,
  published: "published:true",
  unpublished: "published:false",
};

function Master() {
  const [mode, setMode] = useState<IndexMode>("all");

  return (
    <div>
      <div className="flex justify-center pt-6">
        <Tabs
          onValueChange={(value) => setMode(value as IndexMode)}
          value={mode}
        >
          <TabsList>
            <TabsTrigger value="all">All Plans</TabsTrigger>
            <TabsTrigger value="published">Published Only</TabsTrigger>
            <TabsTrigger value="unpublished">Unpublished</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <PlanSearch
        filters={FILTER_BY_MODE[mode]}
        indexName={PLANS_INDEX}
        key={mode}
        sortItems={planSortItems}
      />
    </div>
  );
}

export default Master;
