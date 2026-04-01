import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const MAX_COMPARE = 5;

interface ComparisonContextValue {
  add: (planId: string, planNumber?: string) => void;
  clear: () => void;
  count: number;
  isFull: boolean;
  isSelected: (planId: string) => boolean;
  planNumberMap: Record<string, string>;
  remove: (planId: string) => void;
  selectedIds: string[];
}

export const ComparisonContext = createContext<ComparisonContextValue>({
  selectedIds: [],
  planNumberMap: {},
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
      if (!stored) {
        return [];
      }
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed)
        ? parsed.filter((id: unknown): id is string => typeof id === "string")
        : [];
    } catch {
      return [];
    }
  });

  const [planNumberMap, setPlanNumberMap] = useState<Record<string, string>>(
    () => {
      try {
        const stored = sessionStorage.getItem("planbook-compare-numbers");
        if (!stored) {
          return {};
        }
        return JSON.parse(stored) ?? {};
      } catch {
        return {};
      }
    }
  );

  useEffect(() => {
    sessionStorage.setItem("planbook-compare", JSON.stringify(selectedIds));
  }, [selectedIds]);

  useEffect(() => {
    sessionStorage.setItem(
      "planbook-compare-numbers",
      JSON.stringify(planNumberMap)
    );
  }, [planNumberMap]);

  const add = useCallback((planId: string, planNumber?: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(planId) || prev.length >= MAX_COMPARE) {
        return prev;
      }
      return [...prev, planId];
    });
    if (planNumber) {
      setPlanNumberMap((prev) => ({ ...prev, [planId]: planNumber }));
    }
  }, []);

  const remove = useCallback((planId: string) => {
    setSelectedIds((prev) => prev.filter((id) => id !== planId));
    setPlanNumberMap((prev) => {
      const next = { ...prev };
      delete next[planId];
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    setSelectedIds([]);
    setPlanNumberMap({});
  }, []);

  const isSelected = useCallback(
    (planId: string) => selectedIds.includes(planId),
    [selectedIds]
  );

  return {
    selectedIds,
    planNumberMap,
    add,
    remove,
    clear,
    isSelected,
    isFull: selectedIds.length >= MAX_COMPARE,
    count: selectedIds.length,
  };
}
