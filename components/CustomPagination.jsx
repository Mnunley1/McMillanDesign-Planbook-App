import { Button, Center, HStack } from "@chakra-ui/react";
import React from "react";
import { usePagination } from "react-instantsearch";

function CustomPagination(props) {
  const {
    pages,
    currentRefinement,
    nbPages,
    isFirstPage,
    isLastPage,
    refine,
    createURL,
  } = usePagination(props);
  const firstPageIndex = 0;
  const previousPageIndex = currentRefinement - 1;
  const nextPageIndex = currentRefinement + 1;
  const lastPageIndex = nbPages - 1;

  return (
    <Center>
      <HStack>
        <PaginationItem
          isDisabled={isFirstPage}
          href={createURL(firstPageIndex)}
          onClick={() => refine(firstPageIndex)}
        >
          First
        </PaginationItem>
        <PaginationItem
          isDisabled={isFirstPage}
          href={createURL(previousPageIndex)}
          onClick={() => refine(previousPageIndex)}
        >
          Previous
        </PaginationItem>
        {pages.map((page) => {
          const label = page + 1;

          return (
            <PaginationItem
              key={page}
              isDisabled={false}
              aria-label={`Page ${label}`}
              href={createURL(page)}
              onClick={() => refine(page)}
            >
              {label}
            </PaginationItem>
          );
        })}
        <PaginationItem
          isDisabled={isLastPage}
          href={createURL(nextPageIndex)}
          onClick={() => refine(nextPageIndex)}
        >
          Next
        </PaginationItem>
        <PaginationItem
          isDisabled={isLastPage}
          href={createURL(lastPageIndex)}
          onClick={() => refine(lastPageIndex)}
        >
          Last
        </PaginationItem>
      </HStack>
    </Center>
  );
}

export default CustomPagination;

function PaginationItem({ isDisabled, href, onClick, ...props }) {
  if (isDisabled) {
    return (
      <>
        <Button isDisabled {...props} />
      </>
    );
  }

  return (
    <>
      <Button
        href={href}
        onClick={(event) => {
          if (isModifierClick(event)) {
            return;
          }

          event.preventDefault();

          onClick(event);
        }}
        {...props}
        _hover={{ bgColor: "gold" }}
      ></Button>
    </>
  );
}

function isModifierClick(event) {
  const isMiddleClick = event.button === 1;

  return Boolean(
    isMiddleClick ||
      event.altKey ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey
  );
}
