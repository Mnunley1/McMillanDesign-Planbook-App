import { Checkbox, Stack } from "@chakra-ui/react";
import React from "react";
import { useRefinementList } from "react-instantsearch";

function CustomRefinementList(props) {
  const { items, refine, searchForItems, createURL } = useRefinementList(props);

  const handleRefine = (value) => {
    console.log("Refining:", props.attribute, value);
    refine(value);
  };

  return (
    <Stack spacing={2}>
      {items.map((item) => (
        <Checkbox
          key={item.value}
          isChecked={item.isRefined}
          onChange={() => handleRefine(item.value)}
          color="white"
          colorScheme="yellow"
        >
          {item.label} ({item.count})
        </Checkbox>
      ))}
    </Stack>
  );
}

export default CustomRefinementList;
