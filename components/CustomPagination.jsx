import { Button, Center, HStack, Skeleton, VStack } from "@chakra-ui/react";
import React from "react";
import { usePagination, useInstantSearch } from "react-instantsearch";

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
  const { status } = useInstantSearch();
  const isSearching = status === 'loading' || status === 'stalled';

  const firstPageIndex = 1;
  const previousPageIndex = currentRefinement;
  const nextPageIndex = currentRefinement + 2;
  const lastPageIndex = nbPages;

  if (isSearching) {
    return (
      <Center>
        <HStack spacing={2}>
          <Skeleton>
            <Button>First</Button>
          </Skeleton>
          <Skeleton>
            <Button>Previous</Button>
          </Skeleton>
          <Skeleton>
            <Button>Next</Button>
          </Skeleton>
          <Skeleton>
            <Button>Last</Button>
          </Skeleton>
        </HStack>
      </Center>
    );
  }

  return (
    <Center>
      <VStack>
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
        <HStack>
          {pages.map((page) => {
            const label = page + 1;

            return (
              <PaginationItem
                key={page}
                isDisabled={false}
                aria-label={`Page ${label}`}
                href={createURL(page)}
                onClick={() => refine(page)}
                bgColor={currentRefinement === page ? "gold" : ""}
              >
                {label}
              </PaginationItem>
            );
          })}
        </HStack>
      </VStack>
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
