import React from "react";
import { useToggleRefinement } from "react-instantsearch";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface CustomToggleRefinementProps {
  attribute: string;
  className?: string;
  defaultRefinement?: boolean;
  label: string;
}

function CustomToggleRefinement({
  attribute,
  label,
  defaultRefinement = false,
  className,
}: CustomToggleRefinementProps) {
  const { value, refine } = useToggleRefinement({
    attribute,
    on: true,
    off: undefined,
  });

  // Initialize with defaultRefinement if provided
  React.useEffect(() => {
    if (defaultRefinement && !value.isRefined) {
      refine({ isRefined: true });
    }
  }, [defaultRefinement, refine, value.isRefined]);

  return (
    <div
      className={cn(
        "flex items-center justify-between rounded-md p-2 transition-colors hover:bg-accent",
        className
      )}
    >
      <div className="flex items-center space-x-3">
        <Checkbox
          checked={value.isRefined}
          className="border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
          id={`toggle-${attribute}`}
          onCheckedChange={() => {
            refine({ isRefined: value.isRefined });
          }}
        />
        <label
          className={cn(
            "font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
            value.isRefined && "font-semibold"
          )}
          htmlFor={`toggle-${attribute}`}
        >
          {label}
        </label>
      </div>

      {value.isRefined && (
        <Badge
          className="bg-primary text-primary-foreground hover:bg-primary/90"
          variant="default"
        >
          Active
        </Badge>
      )}
    </div>
  );
}

export default CustomToggleRefinement;
