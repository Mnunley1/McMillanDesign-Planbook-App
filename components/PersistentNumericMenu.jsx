import {
  Badge,
  Flex,
  HStack,
  Radio,
  RadioGroup,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useEffect, useRef } from "react";
import { useNumericMenu } from "react-instantsearch";

function PersistentNumericMenu({ attribute, items }) {
  // Create a unique storage key for this filter
  const STORAGE_KEY = `persistent_${attribute}`;

  // Get the InstantSearch hook
  const { items: instantSearchItems, refine } = useNumericMenu({
    attribute,
    items,
  });

  // Find the currently selected item
  const selectedItem = instantSearchItems.find((item) => item.isRefined);
  const currentValue = selectedItem ? selectedItem.value : "";

  // Reference to track if we've loaded from localStorage
  const hasLoadedFromStorage = useRef(false);

  // Load saved selection from localStorage on mount
  useEffect(() => {
    if (hasLoadedFromStorage.current) return;

    try {
      const savedValue = localStorage.getItem(STORAGE_KEY);
      if (savedValue && savedValue !== currentValue) {
        const item = items.find((item) => item.value === savedValue);
        if (item) {
          refine(item.value);
        }
      }
      hasLoadedFromStorage.current = true;
    } catch (error) {
      console.error(`Error loading saved selection for ${attribute}:`, error);
    }
  }, []);

  // Save selection to localStorage when it changes
  useEffect(() => {
    if (!hasLoadedFromStorage.current) return;

    try {
      if (currentValue) {
        localStorage.setItem(STORAGE_KEY, currentValue);
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (error) {
      console.error(`Error saving selection for ${attribute}:`, error);
    }
  }, [currentValue]);

  // Handle selection change
  const handleChange = (value) => {
    const item = instantSearchItems.find((item) => item.value === value);
    if (item) {
      refine(item.value);
    }
  };

  return (
    <RadioGroup value={currentValue} onChange={handleChange}>
      <Stack spacing={2} direction="column">
        {instantSearchItems.map((item) => (
          <Flex
            key={item.value || "all"}
            p={1}
            borderRadius="md"
            _hover={{ bg: "whiteAlpha.100" }}
            transition="background 0.2s"
            align="center"
          >
            <Radio
              value={item.value}
              isChecked={item.isRefined}
              name={attribute}
              colorScheme="yellow"
              size="md"
            >
              <HStack spacing={2}>
                <Text
                  color="white"
                  fontSize="sm"
                  fontWeight={item.isRefined ? "medium" : "normal"}
                >
                  {item.label}
                </Text>
                {item.isRefined && (
                  <Badge colorScheme="yellow" variant="solid" fontSize="xs">
                    Selected
                  </Badge>
                )}
              </HStack>
            </Radio>
          </Flex>
        ))}
      </Stack>
    </RadioGroup>
  );
}

export default PersistentNumericMenu;
