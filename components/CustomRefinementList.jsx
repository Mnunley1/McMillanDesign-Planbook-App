import { Checkbox, CheckboxGroup, Heading, Stack } from "@chakra-ui/react";
import React from "react";
import { useRefinementList } from "react-instantsearch";

function CustomRefinementList(props) {
  const {
    items,
    refine,
    searchForItems,
    canToggleShowMore,
    isShowingMore,
    toggleShowMore,
  } = useRefinementList(props);

  return (
    <CheckboxGroup>
      <Stack>
        {items.map((item) => (
          <Checkbox
            key={item.label}
            checked={item.isRefined}
            onChange={() => refine(item.value)}
            color="white"
            colorScheme="yellow"
          >
            <span>
              {item.label} ({item.count})
            </span>
          </Checkbox>
        ))}
      </Stack>
    </CheckboxGroup>
  );
}

export default CustomRefinementList;
