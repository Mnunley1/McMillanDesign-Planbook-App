import PlanSearch from "@/components/PlanSearch";
import { PLANS_INDEX, PUBLISHED_FILTER, planSortItems } from "@/lib/algolia";

function Home() {
  return (
    <PlanSearch
      filters={PUBLISHED_FILTER}
      indexName={PLANS_INDEX}
      sortItems={planSortItems}
    />
  );
}

export default Home;
