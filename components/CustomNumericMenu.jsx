import { Radio, RadioGroup, Stack, Text } from "@chakra-ui/react";
import React from "react";
import { useNumericMenu } from "react-instantsearch";

function CustomNumericMenu(props) {
  const { items, refine } = useNumericMenu(props);

  // Find the currently selected item
  const selectedItem = items.find((item) => item.isRefined);
  const currentValue = selectedItem ? selectedItem.value : "";

  return (
    <RadioGroup value={currentValue}>
      <Stack spacing={1} direction="column">
        {items.map((item) => (
          <Radio
            key={item.value}
            isChecked={item.isRefined}
            name={props.attribute}
            value={item.value}
            colorScheme="yellow"
            onChange={(event) => {
              event.preventDefault();
              refine(item.value);
            }}
          >
            <Text color="white">{item.label}</Text>
          </Radio>
        ))}
      </Stack>
    </RadioGroup>
  );
}

export default CustomNumericMenu;
