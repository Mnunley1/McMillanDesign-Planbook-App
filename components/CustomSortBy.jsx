import {
  Button,
  Select,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuIcon,
  MenuCommand,
  MenuDivider,
} from "@chakra-ui/react";
import { useSortBy } from "react-instantsearch";

function CustomSortBy(props) {
  const { initialIndex, currentRefinement, options, refine, canRefine } =
    useSortBy(props);
  return (
    <Menu>
      <MenuButton as={Button} variant="link" color="white">
        Sort By
      </MenuButton>
      <MenuList minWidth="150px" type="radio" zIndex="9999">
        <MenuOptionGroup>
          {options.map((item) => (
            <MenuItemOption
              key={item.label}
              value={item.label}
              onClick={(event) => {
                event.preventDefault();
                refine(item.value);
              }}
              color="black"
            >
              {item.label}
            </MenuItemOption>
          ))}
        </MenuOptionGroup>
      </MenuList>
    </Menu>
  );
}

export default CustomSortBy;
