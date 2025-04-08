import {
  Box,
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
import { useInstantSearch, useNumericMenu } from "react-instantsearch";

function CustomRangeInput({ attribute, min, max, defaultRefinement }) {
  const { refine, items } = useNumericMenu({
    attribute,
    items: [{ label: "All" }, { label: "Custom Range", start: min, end: max }],
  });

  const { indexUiState } = useInstantSearch();
  const storageKey = `range_input_${attribute}`;

  const [{ from, to }, setRange] = useState({
    from: "",
    to: "",
  });

  const [isInitialized, setIsInitialized] = useState(false);

  // Parse range values from various formats
  const parseRangeValues = useCallback(
    (currentValue) => {
      if (!currentValue || currentValue === "" || currentValue === "{}") {
        return { from: "", to: "" };
      }

      try {
        let start, end;

        if (typeof currentValue === "object") {
          // Handle object format
          start = currentValue.start;
          end = currentValue.end;
        } else if (typeof currentValue === "string") {
          // Try parsing as JSON first
          try {
            const parsed = JSON.parse(currentValue);
            start = parsed.start;
            end = parsed.end;
          } catch (e) {
            // If not JSON, try parsing as range string
            const [startStr = "", endStr = ""] = currentValue.split(":");
            start = startStr ? Number(startStr) : undefined;
            end = endStr ? Number(endStr) : undefined;
          }
        }

        return {
          from: start?.toString() || "",
          to: end?.toString() || "",
        };
      } catch (e) {
        console.error(`Error parsing range for ${attribute}:`, e);
        return { from: "", to: "" };
      }
    },
    [attribute]
  );

  // Save range values to session storage
  const saveToSessionStorage = useCallback(
    (fromValue, toValue) => {
      if (fromValue || toValue) {
        const rangeState = {
          from: fromValue,
          to: toValue,
          timestamp: Date.now(),
        };
        sessionStorage.setItem(storageKey, JSON.stringify(rangeState));
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
    const currentValue = indexUiState.numericMenu?.[attribute];

    if (currentValue) {
      const { from: newFrom, to: newTo } = parseRangeValues(currentValue);

      setRange({
        from: newFrom,
        to: newTo,
      });

      saveToSessionStorage(newFrom, newTo);
      setIsInitialized(true);
      return;
    }

    // Then check session storage (second priority)
    try {
      const savedState = sessionStorage.getItem(storageKey);
      if (savedState) {
        const {
          from: savedFrom,
          to: savedTo,
          timestamp,
        } = JSON.parse(savedState);

        // Only use saved state if it's less than 30 minutes old
        if (Date.now() - timestamp < 30 * 60 * 1000) {
          setRange({
            from: savedFrom,
            to: savedTo,
          });

          // Apply the saved refinement
          if (savedFrom || savedTo) {
            const value = JSON.stringify({
              start: savedFrom ? Number(savedFrom) : undefined,
              end: savedTo ? Number(savedTo) : undefined,
            });
            refine(value);
          }

          setIsInitialized(true);
          return;
        } else {
          // Clear expired state
          sessionStorage.removeItem(storageKey);
        }
      }
    } catch (e) {
      console.error(`Error restoring range state for ${attribute}:`, e);
    }

    // Finally, use default values or clear (lowest priority)
    setRange({ from: "", to: "" });
    setIsInitialized(true);
  }, [
    indexUiState.numericMenu,
    attribute,
    min,
    max,
    parseRangeValues,
    saveToSessionStorage,
    refine,
    storageKey,
    isInitialized,
  ]);

  // Handle URL state changes (e.g., when filters are cleared)
  useEffect(() => {
    if (!isInitialized) return;

    const currentValue = indexUiState.numericMenu?.[attribute];

    if (!currentValue) {
      // Clear inputs when there's no value (including after reset)
      setRange({ from: "", to: "" });
      saveToSessionStorage("", "");
      return;
    }

    const { from: newFrom, to: newTo } = parseRangeValues(currentValue);

    setRange({
      from: newFrom,
      to: newTo,
    });

    saveToSessionStorage(newFrom, newTo);
  }, [
    indexUiState.numericMenu,
    attribute,
    min,
    max,
    parseRangeValues,
    saveToSessionStorage,
    isInitialized,
  ]);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (from || to) {
      const start = from ? Number(from) : undefined;
      const end = to ? Number(to) : undefined;

      // Create a custom range value
      const value = JSON.stringify({ start, end });
      refine(value);
      saveToSessionStorage(from, to);
    } else {
      refine("");
      saveToSessionStorage("", "");
    }
  };

  const handleInputChange = (field, value) => {
    let numValue = value === "" ? "" : Number(value);

    const newRange = {
      ...{ from, to },
      [field]: numValue === "" ? "" : numValue.toString(),
    };

    setRange(newRange);
  };

  const handleClear = () => {
    // Clear the local state
    setRange({ from: "", to: "" });

    // Clear the refinement by setting it to an empty object
    refine(JSON.stringify({}));

    // Clear the session storage
    saveToSessionStorage("", "");
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
              Min
            </InputLeftAddon>
            <Input
              variant="filled"
              bg="gray.800"
              color="white"
              borderColor="gray.600"
              type="number"
              value={from}
              min={min}
              max={max}
              placeholder={min.toString()}
              onChange={({ currentTarget }) => {
                handleInputChange("from", currentTarget.value);
              }}
              _hover={{ bg: "gray.700" }}
              _focus={{ bg: "gray.700", borderColor: "yellow.400" }}
            />
          </InputGroup>

          <Box color="gray.400">to</Box>

          <InputGroup size="sm">
            <InputLeftAddon
              bg="gray.700"
              color="gray.300"
              border="1px solid"
              borderColor="gray.600"
            >
              Max
            </InputLeftAddon>
            <Input
              variant="filled"
              bg="gray.800"
              color="white"
              borderColor="gray.600"
              type="number"
              value={to}
              min={min}
              max={max}
              placeholder={max.toString()}
              onChange={({ currentTarget }) => {
                handleInputChange("to", currentTarget.value);
              }}
              _hover={{ bg: "gray.700" }}
              _focus={{ bg: "gray.700", borderColor: "yellow.400" }}
            />
          </InputGroup>

          <Button
            type="submit"
            colorScheme="yellow"
            size="sm"
            isDisabled={from === "" && to === ""}
          >
            Apply
          </Button>

          {(from !== "" || to !== "") && (
            <IconButton
              aria-label="Clear range"
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

export default CustomRangeInput;
