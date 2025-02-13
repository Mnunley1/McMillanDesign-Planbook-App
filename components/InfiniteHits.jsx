import { Center, SimpleGrid, Spinner } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { useInfiniteHits, useInstantSearch } from "react-instantsearch";
import FloorPlanCard from "./FloorPlanCard";

const STORAGE_KEY = "algolia_infinite_state";

function InfiniteHits({ hitComponent: HitComponent = FloorPlanCard }) {
  const { hits, isLastPage, showMore, sendEvent } = useInfiniteHits();
  const { indexUiState } = useInstantSearch();
  const router = useRouter();
  const sentinel = useRef(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const restorationTimeout = useRef(null);

  // Save search state when hits change
  useEffect(() => {
    if (!isInitialLoad && hits.length > 0) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({
        hits,
        uiState: indexUiState,
        timestamp: Date.now()
      }));
    }
  }, [hits, indexUiState, isInitialLoad]);

  // Handle scroll position restoration
  useEffect(() => {
    const handleRouteChange = (url) => {
      // Save current state and position before navigating away
      if (url.includes('/plan/')) {
        sessionStorage.setItem(STORAGE_KEY + '_scroll', window.scrollY.toString());
      }
    };

    const handleRouteComplete = () => {
      // Clear any existing timeout
      if (restorationTimeout.current) {
        clearTimeout(restorationTimeout.current);
      }

      const savedPosition = sessionStorage.getItem(STORAGE_KEY + '_scroll');
      if (savedPosition) {
        restorationTimeout.current = setTimeout(() => {
          window.scrollTo({
            top: parseInt(savedPosition, 10),
            behavior: 'instant'
          });
          sessionStorage.removeItem(STORAGE_KEY + '_scroll');
        }, 100);
      }
    };

    router.events.on('routeChangeStart', handleRouteChange);
    router.events.on('routeChangeComplete', handleRouteComplete);

    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
      router.events.off('routeChangeComplete', handleRouteComplete);
      if (restorationTimeout.current) {
        clearTimeout(restorationTimeout.current);
      }
    };
  }, [router]);

  // Restore previous hits state
  useEffect(() => {
    const savedState = sessionStorage.getItem(STORAGE_KEY);
    if (savedState) {
      const { hits: savedHits, timestamp } = JSON.parse(savedState);
      // Only restore if within last 30 minutes
      if (Date.now() - timestamp < 30 * 60 * 1000) {
        const loadSavedHits = async () => {
          while (hits.length < savedHits.length && !isLastPage) {
            await showMore();
          }
          setIsInitialLoad(false);
        };
        loadSavedHits();
      } else {
        sessionStorage.removeItem(STORAGE_KEY);
        setIsInitialLoad(false);
      }
    } else {
      setIsInitialLoad(false);
    }
  }, []);

  // Handle infinite scrolling
  useEffect(() => {
    if (sentinel.current !== null && !isInitialLoad) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isLastPage) {
            showMore();
          }
        });
      });

      observer.observe(sentinel.current);
      return () => observer.disconnect();
    }
  }, [isLastPage, showMore, isInitialLoad]);

  return (
    <div data-testid="hits-container">
      <SimpleGrid columns={[1, 1, 1, 2]} spacing={5}>
        {hits.map((hit) => (
          <HitComponent 
            key={hit.objectID} 
            hit={hit} 
            sendEvent={sendEvent}
          />
        ))}
      </SimpleGrid>
      <Center ref={sentinel} p={4}>
        {(!isLastPage || isInitialLoad) && <Spinner />}
      </Center>
    </div>
  );
}

export default InfiniteHits;
