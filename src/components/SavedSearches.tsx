import { Bookmark, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useInstantSearch } from "react-instantsearch";
import { useSavedSearches } from "@/hooks/use-saved-searches";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

export default function SavedSearches() {
  const { savedSearches, remove } = useSavedSearches();
  const { setIndexUiState } = useInstantSearch();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    if (!open) {
      return;
    }
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  if (savedSearches.length === 0) {
    return null;
  }

  const applySavedSearch = (uiStateJson: string) => {
    setOpen(false);
    try {
      const saved = JSON.parse(uiStateJson);
      setIndexUiState((prev) => ({
        ...prev,
        query: saved.query ?? "",
        refinementList: saved.refinementList ?? {},
        range: saved.range ?? {},
        toggle: saved.toggle ?? {},
        numericMenu: saved.numericMenu ?? {},
        page: 1,
      }));
    } catch {
      // Invalid JSON, ignore
    }
  };

  return (
    <div className="relative" ref={ref}>
      <Button
        onClick={() => setOpen((prev) => !prev)}
        size="sm"
        variant="outline"
      >
        <Bookmark className="mr-2 h-4 w-4" />
        Saved ({savedSearches.length})
      </Button>

      {open && (
        <div className="absolute top-full right-0 z-[100] mt-1 w-56 rounded-md border bg-popover p-1 text-popover-foreground shadow-md">
          <p className="px-2 py-1.5 font-medium text-sm">Saved Searches</p>
          <div className="-mx-1 my-1 h-px bg-border" />
          {savedSearches.map((search) => (
            <button
              className={cn(
                "flex w-full items-center justify-between rounded-sm px-2 py-1.5 text-sm",
                "hover:bg-accent hover:text-accent-foreground"
              )}
              key={search._id}
              onClick={() => applySavedSearch(search.uiState)}
              type="button"
            >
              <span className="truncate">{search.name}</span>
              <button
                className="ml-2 rounded p-1 text-muted-foreground hover:text-destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  remove(search._id);
                }}
                type="button"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
