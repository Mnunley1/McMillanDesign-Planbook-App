import { Checkbox } from "@chakra-ui/react";
import React from "react";
import { useToggleRefinement } from "react-instantsearch";

function CustomToggleRefinement(props) {
  const { value, refine } = useToggleRefinement(props);

  return (
    <>
      <Checkbox
        color="white"
        checked={value.isRefined}
        onChange={(event) => {
          refine({ isRefined: !event.target.checked });
        }}
      >
        <span>{props.label}</span>
      </Checkbox>
    </>
  );
}

export default CustomToggleRefinement;
