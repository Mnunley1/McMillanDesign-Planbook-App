import { Badge, Checkbox, Flex, HStack, Text } from "@chakra-ui/react";
import React from "react";
import { useToggleRefinement } from "react-instantsearch";

function CustomToggleRefinement({ attribute, label, defaultRefinement }) {
  const { value, refine } = useToggleRefinement({
    attribute,
    on: true,
    off: undefined,
    defaultRefinement: defaultRefinement || false,
  });

  return (
    <Flex
      p={1}
      borderRadius="md"
      _hover={{ bg: "whiteAlpha.100" }}
      transition="background 0.2s"
      align="center"
      justify="space-between"
    >
      <HStack spacing={3}>
        <Checkbox
          isChecked={value.isRefined}
          onChange={(event) => {
            refine({ isRefined: !event.target.checked });
          }}
          color="white"
          colorScheme="yellow"
          size="md"
        >
          <Text
            color="white"
            fontSize="sm"
            fontWeight={value.isRefined ? "medium" : "normal"}
          >
            {label}
          </Text>
        </Checkbox>
      </HStack>

      {value.isRefined && (
        <Badge colorScheme="yellow" variant="solid" fontSize="xs">
          Active
        </Badge>
      )}
    </Flex>
  );
}

export default CustomToggleRefinement;
