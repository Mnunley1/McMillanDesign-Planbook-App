import { Checkbox } from "@chakra-ui/react";
import React from "react";
import { useToggleRefinement } from "react-instantsearch";

function CustomToggleRefinement({ attribute, label, defaultRefinement }) {
  const { value, refine } = useToggleRefinement({
    attribute,
    on: true,
    off: undefined,
    defaultRefinement
  });

  const handleChange = (event) => {
    event.preventDefault();
    refine(!value.isRefined);
  };

  return (
    <Checkbox
      isChecked={value.isRefined}
      onChange={handleChange}
      color="white"
      colorScheme="yellow"
    >
      {label}
    </Checkbox>
  );
}

export default CustomToggleRefinement;
