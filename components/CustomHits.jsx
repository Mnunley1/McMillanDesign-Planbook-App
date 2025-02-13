import { Box, SimpleGrid, Skeleton } from "@chakra-ui/react";
import React from "react";
import { useHits, useInstantSearch } from "react-instantsearch";
import FloorPlanCard from "./FloorPlanCard";

function CustomHits(props) {
  const { hits, sendEvent } = useHits(props);
  const { status } = useInstantSearch();
  const isSearching = status === 'loading' || status === 'stalled';
  
  return (
    <SimpleGrid columns={[1, 1, 1, 2]} spacing={5}>
      {isSearching ? (
        // Loading skeletons
        Array.from({ length: 6 }).map((_, idx) => (
          <Skeleton key={idx} borderRadius="lg" isLoaded={false}>
            <Box height="300px" />
          </Skeleton>
        ))
      ) : (
        // Actual hits
        hits.map((hit) => (
          <FloorPlanCard 
            key={hit.objectID} 
            hit={hit} 
            sendEvent={sendEvent}
          />
        ))
      )}
    </SimpleGrid>
  );
}

export default CustomHits;
