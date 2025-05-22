import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { useInstantSearch, usePagination } from "react-instantsearch";

interface PaginationItemProps extends React.ComponentProps<typeof Button> {
  isDisabled?: boolean;
  href?: string;
  onClick?: (event: React.MouseEvent) => void;
}

function PaginationItem({
  isDisabled,
  href,
  onClick,
  className,
  ...props
}: PaginationItemProps) {
  const buttonClasses = cn(
    "min-w-[2.5rem] transition-colors hover:bg-accent hover:text-accent-foreground",
    className
  );

  if (isDisabled) {
    return (
      <Button
        variant="outline"
        size="sm"
        disabled
        className={buttonClasses}
        {...props}
      />
    );
  }

  if (href) {
    return (
      <Button
        variant="outline"
        size="sm"
        asChild
        className={buttonClasses}
        {...props}
      >
        <a
          href={href}
          onClick={(event) => {
            if (isModifierClick(event)) {
              return;
            }

            event.preventDefault();
            onClick?.(event);
          }}
        >
          {props.children}
        </a>
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      className={buttonClasses}
      {...props}
    />
  );
}

function isModifierClick(event: React.MouseEvent): boolean {
  const isMiddleClick = event.button === 1;
  return Boolean(
    isMiddleClick ||
      event.altKey ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey
  );
}

interface CustomPaginationProps {
  className?: string;
}

function CustomPagination({ className }: CustomPaginationProps) {
  const {
    pages,
    currentRefinement,
    nbPages,
    isFirstPage,
    isLastPage,
    refine,
    createURL,
  } = usePagination();
  const { status } = useInstantSearch();
  const isSearching = status === "loading" || status === "stalled";

  // Handle page changes with scroll to top
  const handlePageChange = (page: number) => {
    refine(page);
    // Find the layout container and scroll it to top
    const layoutContainer = document.querySelector(
      ".h-\\[calc\\(100vh-4rem\\)\\]"
    );
    if (layoutContainer instanceof HTMLElement) {
      layoutContainer.scrollTo({ top: 0, behavior: "instant" });
    }
  };

  // Convert from 0-based to 1-based for display
  const firstPageIndex = 0;
  const previousPageIndex = Math.max(0, currentRefinement - 1);
  const nextPageIndex = Math.min(nbPages - 1, currentRefinement + 1);
  const lastPageIndex = nbPages - 1;

  if (isSearching) {
    return (
      <div className="flex justify-center space-x-2">
        {Array.from({ length: 4 }).map((_, idx) => (
          <Button
            key={idx}
            variant="outline"
            size="sm"
            disabled
            className="min-w-[2.5rem] animate-pulse bg-muted"
          />
        ))}
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      <div className="flex items-center gap-2">
        <PaginationItem
          isDisabled={isFirstPage}
          href={createURL(firstPageIndex)}
          onClick={() => handlePageChange(firstPageIndex)}
          aria-label="First page"
        >
          <ChevronsLeft className="h-4 w-4" />
        </PaginationItem>
        <PaginationItem
          isDisabled={isFirstPage}
          href={createURL(previousPageIndex)}
          onClick={() => handlePageChange(previousPageIndex)}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </PaginationItem>
        <PaginationItem
          isDisabled={isLastPage}
          href={createURL(nextPageIndex)}
          onClick={() => handlePageChange(nextPageIndex)}
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </PaginationItem>
        <PaginationItem
          isDisabled={isLastPage}
          href={createURL(lastPageIndex)}
          onClick={() => handlePageChange(lastPageIndex)}
          aria-label="Last page"
        >
          <ChevronsRight className="h-4 w-4" />
        </PaginationItem>
      </div>

      <div className="flex items-center gap-2">
        {pages.map((page) => {
          const label = page + 1;
          return (
            <PaginationItem
              key={page}
              isDisabled={false}
              aria-label={`Page ${label}`}
              href={createURL(page)}
              onClick={() => handlePageChange(page)}
              className={cn(
                currentRefinement === page && "bg-primary text-primary"
              )}
            >
              {label}
            </PaginationItem>
          );
        })}
      </div>
    </div>
  );
}

export default CustomPagination;
