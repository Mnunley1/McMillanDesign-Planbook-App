import { Button, Input, Stack, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { useRange } from "react-instantsearch";

const unsetNumberInputValue = "";

function CustomRangeInput(props) {
  const { start, range, canRefine, refine } = useRange(props);
  const step = 1 / Math.pow(10, props.precision || 0);
  const values = {
    min:
      start[0] !== -Infinity && start[0] !== range.min
        ? start[0]
        : unsetNumberInputValue,
    max:
      start[1] !== Infinity && start[1] !== range.max
        ? start[1]
        : unsetNumberInputValue,
  };
  const [prevValues, setPrevValues] = useState(values);

  const [{ from, to }, setRange] = useState({
    from: values.min?.toString(),
    to: values.max?.toString(),
  });

  if (values.min !== prevValues.min || values.max !== prevValues.max) {
    setRange({ from: values.min?.toString(), to: values.max?.toString() });
    setPrevValues(values);
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();

        refine([from ? Number(from) : undefined, to ? Number(to) : undefined]);
      }}
    >
      <Stack direction="row" align="center">
        <Input
          variant="outlined"
          bg="#3A3B3C"
          type="number"
          bgColor="white"
          min={range.min}
          max={range.max}
          value={stripLeadingZeroFromInput(from || unsetNumberInputValue)}
          step={step}
          placeholder={range.min?.toString()}
          disabled={!canRefine}
          onInput={({ currentTarget }) => {
            const value = currentTarget.value;

            setRange({ from: value || unsetNumberInputValue, to });
          }}
        />
        <Text color="white">to</Text>
        <Input
          variant="outlined"
          bg="#3A3B3C"
          type="number"
          bgColor="white"
          min={range.min}
          max={range.max}
          value={stripLeadingZeroFromInput(to || unsetNumberInputValue)}
          step={step}
          placeholder={range.max?.toString()}
          disabled={!canRefine}
          onInput={({ currentTarget }) => {
            const value = currentTarget.value;

            setRange({ from, to: value || unsetNumberInputValue });
          }}
        />
        <Button type="submit" colorScheme="yellow">
          Go
        </Button>
      </Stack>
    </form>
  );
}

export default CustomRangeInput;

function stripLeadingZeroFromInput(value) {
  return value.replace(/^(0+)\d/, (part) => Number(part).toString());
}
