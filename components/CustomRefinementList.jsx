import {
  Badge,
  Box,
  Button,
  Checkbox,
  Flex,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import { useRefinementList } from "react-instantsearch";

function CustomRefinementList(props) {
  const { items, refine, searchForItems, createURL } = useRefinementList(props);
  const [searchValue, setSearchValue] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [displayCount, setDisplayCount] = useState(5);

  // Reset search when attribute changes
  useEffect(() => {
    setSearchValue("");
    setShowSearch(false);
    setDisplayCount(5);
  }, [props.attribute]);

  const handleRefine = (value) => {
    refine(value);
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    searchForItems(value);
  };

  const clearSearch = () => {
    setSearchValue("");
    searchForItems("");
  };

  const showMore = () => {
    setDisplayCount(items.length);
  };

  const showLess = () => {
    setDisplayCount(5);
  };

  const filteredItems = items;
  const hasMoreItems = items.length > displayCount;
  const visibleItems = filteredItems.slice(0, displayCount);

  return (
    <Stack spacing={3}>
      {props.searchable !== false && (
        <Box mb={2}>
          {showSearch ? (
            <InputGroup size="sm">
              <InputLeftElement pointerEvents="none">
                <FiSearch color="var(--chakra-colors-gray-400)" />
              </InputLeftElement>
              <Input
                placeholder="Search..."
                value={searchValue}
                onChange={handleSearch}
                variant="filled"
                bg="gray.800"
                color="white"
                borderColor="gray.600"
                _hover={{ bg: "gray.700" }}
                _focus={{ bg: "gray.700", borderColor: "yellow.400" }}
                autoFocus
              />
              {searchValue && (
                <Button
                  size="sm"
                  position="absolute"
                  right="0"
                  zIndex="2"
                  variant="ghost"
                  color="gray.400"
                  onClick={clearSearch}
                >
                  <FiX />
                </Button>
              )}
            </InputGroup>
          ) : (
            <Button
              size="xs"
              leftIcon={<FiSearch />}
              variant="outline"
              onClick={() => setShowSearch(true)}
              color="gray.400"
              borderColor="gray.600"
              _hover={{ bg: "whiteAlpha.100", borderColor: "yellow.400" }}
            >
              Search options
            </Button>
          )}
        </Box>
      )}

      {visibleItems.length === 0 ? (
        <Text color="gray.400" fontSize="sm">
          No options found
        </Text>
      ) : (
        <Stack spacing={2}>
          {visibleItems.map((item) => (
            <HStack
              key={item.value}
              spacing={2}
              p={1}
              borderRadius="md"
              _hover={{ bg: "whiteAlpha.100" }}
              transition="background 0.2s"
            >
              <Checkbox
                isChecked={item.isRefined}
                onChange={() => handleRefine(item.value)}
                color="white"
                colorScheme="yellow"
              />
              <Box flex="1">
                <Text color="white" fontSize="sm">
                  {item.label}
                </Text>
              </Box>
              <Badge
                colorScheme={item.isRefined ? "yellow" : "gray"}
                variant={item.isRefined ? "solid" : "outline"}
                fontSize="xs"
              >
                {item.count}
              </Badge>
            </HStack>
          ))}
        </Stack>
      )}

      {hasMoreItems && (
        <Flex justify="center" mt={1}>
          <Button
            size="xs"
            variant="link"
            onClick={displayCount === 5 ? showMore : showLess}
            color="yellow.400"
          >
            {displayCount === 5 ? "Show more" : "Show less"}
          </Button>
        </Flex>
      )}
    </Stack>
  );
}

export default CustomRefinementList;
