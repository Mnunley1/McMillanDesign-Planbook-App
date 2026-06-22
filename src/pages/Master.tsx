import { useState } from "react";
import PlanSearch from "@/components/PlanSearch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PLANS_INDEX, planSortItems } from "@/lib/algolia";

type IndexMode = "all" | "published" | "unpublished";

const TAB_STORAGE_KEY = "planbook-master-tab";
const MODES: IndexMode[] = ["all", "published", "unpublished"];

// All tabs query the single `plans` index; they differ only by publish filter.
const FILTER_BY_MODE: Record<IndexMode, string | undefined> = {
  all: undefined,
  published: "published:true",
  unpublished: "published:false",
};

function Master() {
  const [mode, setMode] = useState<IndexMode>(() => {
    const saved = localStorage.getItem(TAB_STORAGE_KEY) as IndexMode | null;
    return saved && MODES.includes(saved) ? saved : "all";
  });

  const handleModeChange = (value: string) => {
    const next = value as IndexMode;
    setMode(next);
    localStorage.setItem(TAB_STORAGE_KEY, next);
  };

  return (
    <div>
      <div className="flex justify-center pt-6">
        <Tabs onValueChange={handleModeChange} value={mode}>
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
