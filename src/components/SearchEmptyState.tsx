import { SearchX } from "lucide-react";
import { useInstantSearch } from "react-instantsearch";
import EmptyState from "./EmptyState";

export default function SearchEmptyState() {
  const { setIndexUiState } = useInstantSearch();

  const handleClearAll = () => {
    setIndexUiState((prev) => ({
      ...prev,
      query: "",
      refinementList: {},
      range: undefined,
      toggle: {},
      numericMenu: {},
    }));
  };

  return (
    <EmptyState
      actionLabel="Clear all filters"
      description="Try adjusting your search terms or removing some filters to see more results."
      icon={SearchX}
      onAction={handleClearAll}
      title="No plans found"
    />
  );
}
