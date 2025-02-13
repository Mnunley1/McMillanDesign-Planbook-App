import React, { useEffect, useRef } from "react";
import { useInstantSearch } from "react-instantsearch";

export function ScrollTo({ children }) {
  const { addMiddlewares } = useInstantSearch();
  const containerRef = useRef(null);

  useEffect(() => {
    const middleware = () => {
      return {
        onStateChange() {
          const isFiltering = document.body.classList.contains("filtering");
          const isTyping =
            document.activeElement?.tagName === "INPUT" &&
            document.activeElement?.getAttribute("type") === "search";

          if (isFiltering || isTyping) {
            return;
          }

          containerRef.current?.scrollIntoView({ behavior: "instant" });
        },
      };
    };

    return addMiddlewares(middleware);
  }, [addMiddlewares]);

  return (
    <div ref={containerRef} className="ais-ScrollTo">
      {children}
    </div>
  );
}
