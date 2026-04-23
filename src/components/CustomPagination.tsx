import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { useInstantSearch, usePagination } from "react-instantsearch";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PaginationItemProps extends React.ComponentProps<typeof Button> {
  href?: string;
  isActive?: boolean;
  isDisabled?: boolean;
  onClick?: (event: React.MouseEvent) => void;
}

function PaginationItem({
  isActive,
  isDisabled,
  href,
  onClick,
  className,
  ...props
}: PaginationItemProps) {
  const variant = isActive ? "default" : "outline";
  const buttonClasses = cn(
    "min-w-[2.5rem] transition-colors",
    !isActive && "hover:bg-accent hover:text-accent-foreground",
    className
  );

  if (isDisabled) {
    return (
      <Button
        className={buttonClasses}
        disabled
        size="sm"
        variant={variant}
        {...props}
      />
    );
  }

  if (href) {
    return (
      <Button
        asChild
        className={buttonClasses}
        size="sm"
        variant={variant}
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
      className={buttonClasses}
      onClick={onClick}
      size="sm"
      variant={variant}
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
    const layoutContainer = document.querySelector("[data-scroll-container]");
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
            className="min-w-[2.5rem] animate-pulse bg-muted"
            disabled
            key={idx}
            size="sm"
            variant="outline"
          />
        ))}
      </div>
    );
  }

  return (
    <nav
      aria-label="Pagination"
      className={cn("flex flex-col items-center gap-4", className)}
    >
      <div className="flex items-center gap-2">
        <PaginationItem
          aria-label="First page"
          href={createURL(firstPageIndex)}
          isDisabled={isFirstPage}
          onClick={() => handlePageChange(firstPageIndex)}
        >
          <ChevronsLeft className="h-4 w-4" />
        </PaginationItem>
        <PaginationItem
          aria-label="Previous page"
          href={createURL(previousPageIndex)}
          isDisabled={isFirstPage}
          onClick={() => handlePageChange(previousPageIndex)}
        >
          <ChevronLeft className="h-4 w-4" />
        </PaginationItem>
        <PaginationItem
          aria-label="Next page"
          href={createURL(nextPageIndex)}
          isDisabled={isLastPage}
          onClick={() => handlePageChange(nextPageIndex)}
        >
          <ChevronRight className="h-4 w-4" />
        </PaginationItem>
        <PaginationItem
          aria-label="Last page"
          href={createURL(lastPageIndex)}
          isDisabled={isLastPage}
          onClick={() => handlePageChange(lastPageIndex)}
        >
          <ChevronsRight className="h-4 w-4" />
        </PaginationItem>
      </div>

      <div className="flex items-center gap-2">
        {pages.map((page) => {
          const label = page + 1;
          const isActive = currentRefinement === page;
          return (
            <PaginationItem
              aria-current={isActive ? "page" : undefined}
              aria-label={`Page ${label}`}
              href={createURL(page)}
              isActive={isActive}
              isDisabled={false}
              key={page}
              onClick={() => handlePageChange(page)}
            >
              {label}
            </PaginationItem>
          );
        })}
      </div>
    </nav>
  );
}

export default CustomPagination;
