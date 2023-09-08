import { Radio, RadioGroup, Select, Stack, Text } from "@chakra-ui/react";
import React from "react";
import { useNumericMenu } from "react-instantsearch";

function CustomNumericMenu(props) {
  const { items, refine } = useNumericMenu(props);

  return (
    <RadioGroup>
      <Stack spacing={1} direction="column">
        {items.map((item) => (
          <Radio
            key={item.value}
            name={item.attribute}
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
