import {
  Badge,
  Flex,
  HStack,
  Radio,
  RadioGroup,
  Stack,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { useNumericMenu } from "react-instantsearch";

function CustomNumericMenu(props) {
  const { items, refine, createURL } = useNumericMenu(props);

  // Find the currently selected item
  const selectedItem = items.find((item) => item.isRefined);
  const currentValue = selectedItem ? selectedItem.value : "";

  const handleChange = (value) => {
    const item = items.find((item) => item.value === value);
    if (item) {
      refine(item.value);
    }
  };

  return (
    <RadioGroup value={currentValue} onChange={handleChange}>
      <Stack spacing={2} direction="column">
        {items.map((item) => (
          <Flex
            key={item.value}
            p={1}
            borderRadius="md"
            _hover={{ bg: "whiteAlpha.100" }}
            transition="background 0.2s"
            align="center"
          >
            <Radio
              value={item.value}
              isChecked={item.isRefined}
              name={props.attribute}
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

export default CustomNumericMenu;
