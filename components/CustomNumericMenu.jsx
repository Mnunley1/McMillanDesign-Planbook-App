import { Radio, RadioGroup, Stack, Text } from "@chakra-ui/react";
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
      <Stack spacing={1} direction="column">
        {items.map((item) => (
          <Radio
            key={item.value}
            value={item.value}
            isChecked={item.isRefined}
            name={props.attribute}
            colorScheme="yellow"
          >
            <Text color="white">{item.label}</Text>
          </Radio>
        ))}
      </Stack>
    </RadioGroup>
  );
}

export default CustomNumericMenu;
