/* import {
  Box,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Kbd,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import { useSearchBox } from "react-instantsearch";
// Note: react-instantsearch-nextjs is for routing only, core hooks still come from react-instantsearch

function CustomSearchBox(props) {
  const { query, refine, clear, isSearchStalled } = useSearchBox(props);
  const [inputValue, setInputValue] = useState(query);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  // Only update inputValue when query changes from outside (not from user input)
  useEffect(() => {
    if (query !== inputValue) {
      setInputValue(query);
    }
  }, [query]);

  function handleInputChange(event) {
    const newValue = event.currentTarget.value;
    // Update input immediately
    setInputValue(newValue);
    // Refine search after input is updated
    requestAnimationFrame(() => {
      refine(newValue);
    });
  }

  function handleClear() {
    setInputValue("");
    refine("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }

  // Handle keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Ctrl+K or Cmd+K to focus search
      if ((event.ctrlKey || event.metaKey) && event.key === "k") {
        event.preventDefault();
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <form
      action=""
      role="search"
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();

        if (inputRef.current) {
          inputRef.current.blur();
        }
      }}
      onReset={(event) => {
        event.preventDefault();
        event.stopPropagation();
        handleClear();
      }}
    >
      <Box width="100%" role="search" position="relative">
        <InputGroup size="lg">
          <InputLeftElement pointerEvents="none" h="100%">
            <FiSearch color="var(--chakra-colors-yellow-400)" size={20} />
          </InputLeftElement>
          <Input
            pl={12}
            pr={inputValue ? 12 : isFocused ? 20 : 4}
            aria-label="Search floor plans"
            variant="filled"
            bg="gray.800"
            color="white"
            border="1px solid"
            borderColor="gray.700"
            _placeholder={{ color: "gray.400" }}
            _hover={{
              bg: "gray.700",
              borderColor: "gray.600",
            }}
            _focus={{
              bg: "gray.700",
              borderColor: "yellow.500",
              boxShadow: "0 0 0 1px var(--chakra-colors-yellow-500)",
            }}
            ref={inputRef}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            placeholder="Search by plan number or type..."
            spellCheck={false}
            maxLength={512}
            type="search"
            value={inputValue}
            onChange={handleInputChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            fontSize="md"
            height="50px"
          />
          {inputValue && (
            <InputRightElement h="100%">
              <IconButton
                aria-label="Clear search"
                icon={<FiX />}
                size="sm"
                variant="ghost"
                colorScheme="whiteAlpha"
                onClick={handleClear}
              />
            </InputRightElement>
          )}
          {!inputValue && isFocused && (
            <Tooltip label="Press to search" placement="top">
              <HStack
                position="absolute"
                right="3"
                top="50%"
                transform="translateY(-50%)"
                spacing={1}
                opacity={0.7}
              >
                <Kbd fontSize="xs">⌘</Kbd>
                <Kbd fontSize="xs">K</Kbd>
              </HStack>
            </Tooltip>
          )}
        </InputGroup>
        {isSearchStalled && (
          <Text
            position="absolute"
            right="3"
            bottom="-5"
            fontSize="xs"
            color="gray.400"
          >
            Searching...
          </Text>
        )}
      </Box>
    </form>
  );
}

export default CustomSearchBox; */
