import { FilterIcon, SearchIcon } from "lucide-react";
import { useInstantSearch } from "react-instantsearch";
import { Drawer } from "vaul";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";

interface BottomSheetFiltersProps {
  activeFiltersCount: number;
  filterContent: React.ReactNode;
}

export default function BottomSheetFilters({
  filterContent,
  activeFiltersCount,
}: BottomSheetFiltersProps) {
  const { setIndexUiState } = useInstantSearch();

  const handleReset = () => {
    setIndexUiState((uiState) => ({
      ...uiState,
      refinementList: {},
      range: {},
      toggle: {},
      numericMenu: {},
    }));
  };

  return (
    <Drawer.Root>
      <Drawer.Trigger asChild>
        <Button className="w-full" size="sm" variant="outline">
          <FilterIcon className="mr-2 h-4 w-4" />
          Filters
          {activeFiltersCount > 0 && (
            <Badge
              className="ml-2 rounded-sm px-1 font-normal"
              variant="secondary"
            >
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-50 bg-black/40" />
        <Drawer.Content className="fixed right-0 bottom-0 left-0 z-50 flex max-h-[85vh] flex-col rounded-t-xl bg-background">
          <div className="mx-auto mt-2 h-1.5 w-12 rounded-full bg-muted" />
          <Drawer.Title className="p-4 pb-2 font-semibold text-lg">
            Filters
            {activeFiltersCount > 0 && (
              <Badge
                className="ml-2 rounded-sm px-1 font-normal"
                variant="secondary"
              >
                {activeFiltersCount}
              </Badge>
            )}
          </Drawer.Title>
          <ScrollArea className="flex-1 px-4">
            <div className="pb-4">{filterContent}</div>
          </ScrollArea>
          <div className="border-t p-4">
            <div className="flex gap-2">
              {activeFiltersCount > 0 && (
                <Drawer.Close asChild>
                  <Button
                    className="flex-1"
                    onClick={handleReset}
                    variant="outline"
                  >
                    Reset All
                  </Button>
                </Drawer.Close>
              )}
              <Drawer.Close asChild>
                <Button className="flex-1">
                  <SearchIcon className="mr-2 h-4 w-4" />
                  View Results
                </Button>
              </Drawer.Close>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
