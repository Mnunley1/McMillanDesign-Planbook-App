import { Button, Input, Stack, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useInstantSearch, useNumericMenu } from "react-instantsearch";

function CustomRangeInput({ attribute, min, max }) {
  const { refine, items } = useNumericMenu({
    attribute,
    items: [{ label: "All" }, { label: "Custom Range", start: min, end: max }],
  });

  const { indexUiState } = useInstantSearch();

  const [{ from, to }, setRange] = useState({
    from: "",
    to: "",
  });

  // Initialize from URL state and handle resets
  useEffect(() => {
    const currentValue = indexUiState.numericMenu?.[attribute];
    
    if (!currentValue) {
      // Clear inputs when there's no value (including after reset)
      setRange({ from: "", to: "" });
      return;
    }

    try {
      let start, end;
      
      if (typeof currentValue === 'object') {
        // Handle object format
        start = currentValue.start;
        end = currentValue.end;
      } else if (typeof currentValue === 'string') {
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

      setRange({
        from: start?.toString() || "",
        to: end?.toString() || "",
      });
    } catch (e) {
      console.error("Error parsing range:", e);
      setRange({ from: "", to: "" });
    }
  }, [indexUiState.numericMenu, attribute]);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (from || to) {
      const start = from ? Number(from) : undefined;
      const end = to ? Number(to) : undefined;

      // Create a custom range value
      const value = JSON.stringify({ start, end });
      refine(value);
    } else {
      refine("");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack direction="row" align="center">
        <Input
          variant="outlined"
          bg="#3A3B3C"
          type="number"
          bgColor="white"
          value={from}
          min={min}
          max={max}
          placeholder="Min"
          onChange={({ currentTarget }) => {
            setRange((prev) => ({ ...prev, from: currentTarget.value }));
          }}
        />
        <Text color="white">to</Text>
        <Input
          variant="outlined"
          bg="#3A3B3C"
          type="number"
          bgColor="white"
          value={to}
          min={min}
          max={max}
          placeholder="Max"
          onChange={({ currentTarget }) => {
            setRange((prev) => ({ ...prev, to: currentTarget.value }));
          }}
        />
        <Button type="submit" colorScheme="yellow">
          Go
        </Button>
      </Stack>
    </form>
  );
}

export default CustomRangeInput;
