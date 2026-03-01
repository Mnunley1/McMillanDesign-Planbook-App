import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const MAX_COMPARE = 5;

interface ComparisonContextValue {
  add: (planId: string) => void;
  clear: () => void;
  count: number;
  isFull: boolean;
  isSelected: (planId: string) => boolean;
  remove: (planId: string) => void;
  selectedIds: string[];
}

export const ComparisonContext = createContext<ComparisonContextValue>({
  selectedIds: [],
  add: () => {
    /* noop */
  },
  remove: () => {
    /* noop */
  },
  clear: () => {
    /* noop */
  },
  isSelected: () => false,
  isFull: false,
  count: 0,
});

export function useComparison() {
  return useContext(ComparisonContext);
}

export function useComparisonState(): ComparisonContextValue {
  const [selectedIds, setSelectedIds] = useState<string[]>(() => {
    try {
      const stored = sessionStorage.getItem("planbook-compare");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    sessionStorage.setItem("planbook-compare", JSON.stringify(selectedIds));
  }, [selectedIds]);

  const add = useCallback((planId: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(planId) || prev.length >= MAX_COMPARE) {
        return prev;
      }
      return [...prev, planId];
    });
  }, []);

  const remove = useCallback((planId: string) => {
    setSelectedIds((prev) => prev.filter((id) => id !== planId));
  }, []);

  const clear = useCallback(() => {
    setSelectedIds([]);
  }, []);

  const isSelected = useCallback(
    (planId: string) => selectedIds.includes(planId),
    [selectedIds]
  );

  return {
    selectedIds,
    add,
    remove,
    clear,
    isSelected,
    isFull: selectedIds.length >= MAX_COMPARE,
    count: selectedIds.length,
  };
}
