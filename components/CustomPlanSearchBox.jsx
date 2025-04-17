import {
  Button,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputLeftAddon,
  Stack,
} from "@chakra-ui/react";
import React, { useCallback, useEffect, useState } from "react";
import { FiX } from "react-icons/fi";
import { useInstantSearch, useSearchBox } from "react-instantsearch";

function CustomPlanSearchBox({ attribute }) {
  const { refine, query } = useSearchBox({
    attribute,
  });

  const { indexUiState, setIndexUiState } = useInstantSearch();
  const storageKey = `plan_search_${attribute}`;

  const [searchValue, setSearchValue] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);

  // Save search value to session storage
  const saveToSessionStorage = useCallback(
    (value) => {
      if (value) {
        const searchState = {
          value,
          timestamp: Date.now(),
        };
        sessionStorage.setItem(storageKey, JSON.stringify(searchState));
      } else {
        sessionStorage.removeItem(storageKey);
      }
    },
    [storageKey]
  );

  // Initialize from URL state, session storage, or default values
  useEffect(() => {
    // Only run initialization once
    if (isInitialized) return;

    // First check URL state (highest priority)
    const currentValue = indexUiState.query;

    if (currentValue) {
      setSearchValue(currentValue);
      saveToSessionStorage(currentValue);
      refine(currentValue);
      setIsInitialized(true);
      return;
    }

    // Then check session storage (second priority)
    try {
      const savedState = sessionStorage.getItem(storageKey);
      if (savedState) {
        const { value: savedValue, timestamp } = JSON.parse(savedState);

        // Only use saved state if it's less than 30 minutes old
        if (Date.now() - timestamp < 30 * 60 * 1000) {
          setSearchValue(savedValue);
          refine(savedValue);
          setIndexUiState((prevState) => ({
            ...prevState,
            query: savedValue,
          }));
          setIsInitialized(true);
          return;
        } else {
          // Clear expired state
          sessionStorage.removeItem(storageKey);
        }
      }
    } catch (e) {
      console.error(`Error restoring search state for ${attribute}:`, e);
    }

    // Finally, use default values or clear (lowest priority)
    setSearchValue("");
    refine("");
    setIsInitialized(true);
  }, [
    indexUiState.query,
    attribute,
    saveToSessionStorage,
    refine,
    storageKey,
    isInitialized,
    setIndexUiState,
  ]);

  // Handle URL state changes (e.g., when filters are cleared)
  useEffect(() => {
    if (!isInitialized) return;

    const currentValue = indexUiState.query;

    if (!currentValue) {
      // Clear input when there's no value (including after reset)
      setSearchValue("");
      saveToSessionStorage("");
      refine("");
      setIndexUiState((prevState) => ({
        ...prevState,
        query: "",
      }));
      return;
    }

    setSearchValue(currentValue);
    saveToSessionStorage(currentValue);
    refine(currentValue);
  }, [
    indexUiState.query,
    attribute,
    saveToSessionStorage,
    isInitialized,
    refine,
    setIndexUiState,
  ]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (searchValue) {
      refine(searchValue);
      saveToSessionStorage(searchValue);
      setIndexUiState((prevState) => ({
        ...prevState,
        query: searchValue,
      }));
    } else {
      refine("");
      saveToSessionStorage("");
      setIndexUiState((prevState) => ({
        ...prevState,
        query: "",
      }));
    }
  };

  const handleClear = () => {
    // Clear the local state
    setSearchValue("");

    // Clear the refinement
    refine("");

    // Clear the session storage
    saveToSessionStorage("");

    // Clear the URL state
    setIndexUiState((prevState) => ({
      ...prevState,
      query: "",
    }));
  };

  return (
    <Stack spacing={4}>
      <form onSubmit={handleSubmit}>
        <HStack spacing={2} align="center">
          <InputGroup size="sm">
            <InputLeftAddon
              bg="gray.700"
              color="gray.300"
              border="1px solid"
              borderColor="gray.600"
            >
              Plan #
            </InputLeftAddon>
            <Input
              variant="filled"
              bg="gray.800"
              color="white"
              borderColor="gray.600"
              type="text"
              value={searchValue}
              placeholder="Search plan numbers..."
              onChange={({ currentTarget }) => {
                setSearchValue(currentTarget.value);
              }}
              _hover={{ bg: "gray.700" }}
              _focus={{ bg: "gray.700", borderColor: "yellow.400" }}
            />
          </InputGroup>

          <Button
            type="submit"
            colorScheme="yellow"
            size="sm"
            isDisabled={!searchValue}
          >
            Search
          </Button>

          {searchValue && (
            <IconButton
              aria-label="Clear search"
              icon={<FiX />}
              size="sm"
              colorScheme="red"
              variant="ghost"
              onClick={handleClear}
            />
          )}
        </HStack>
      </form>
    </Stack>
  );
}

export default CustomPlanSearchBox;
