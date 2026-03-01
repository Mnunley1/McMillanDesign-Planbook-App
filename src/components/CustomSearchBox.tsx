import { Loader2, Search, X } from "lucide-react";
import { useRef, useState } from "react";
import {
  type UseSearchBoxProps,
  useInstantSearch,
  useSearchBox,
} from "react-instantsearch";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

function CustomSearchBox(props: UseSearchBoxProps) {
  const { query, refine } = useSearchBox(props);
  const { status } = useInstantSearch();
  const [inputValue, setInputValue] = useState(query);
  const inputRef = useRef<HTMLInputElement>(null);

  const isSearchStalled = status === "stalled";

  function setQuery(newQuery: string) {
    setInputValue(newQuery);
    refine(newQuery);
  }

  return (
    <div>
      <form
        action=""
        noValidate
        onReset={(event) => {
          event.preventDefault();
          event.stopPropagation();
          setQuery("");
          if (inputRef.current) {
            inputRef.current.focus();
          }
        }}
        onSubmit={(event) => {
          event.preventDefault();
          event.stopPropagation();
          if (inputRef.current) {
            inputRef.current.blur();
          }
        }}
        role="search"
      >
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            aria-label="Search floor plans"
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
            className="pr-9 pl-9"
            maxLength={512}
            onChange={(event) => {
              setQuery(event.currentTarget.value);
            }}
            placeholder="Search planbook..."
            ref={inputRef}
            spellCheck={false}
            type="search"
            value={inputValue}
          />
          {isSearchStalled && (
            <Loader2 className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
          )}
          {inputValue.length > 0 && !isSearchStalled && (
            <Button
              className="absolute top-1/2 right-1 h-7 w-7 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              size="icon"
              type="button"
              variant="ghost"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Clear search</span>
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}

CustomSearchBox.displayName = "CustomSearchBox";

export default CustomSearchBox;
