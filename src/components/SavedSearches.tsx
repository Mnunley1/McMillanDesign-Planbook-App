import { Bookmark, Trash2 } from "lucide-react";
import { useInstantSearch } from "react-instantsearch";
import { useSavedSearches } from "@/hooks/use-saved-searches";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export default function SavedSearches() {
  const { savedSearches, remove } = useSavedSearches();
  const { setIndexUiState } = useInstantSearch();

  if (savedSearches.length === 0) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" variant="ghost">
          <Bookmark className="mr-2 h-4 w-4" />
          Saved ({savedSearches.length})
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Saved Searches</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {savedSearches.map((search) => (
          <DropdownMenuItem
            className="flex items-center justify-between"
            key={search._id}
            onSelect={() => {
              try {
                const uiState = JSON.parse(search.uiState);
                setIndexUiState(uiState);
              } catch {
                // Invalid JSON, ignore
              }
            }}
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
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
