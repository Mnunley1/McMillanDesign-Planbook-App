import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import React from "react";
import { useToggleRefinement } from "react-instantsearch";

interface CustomToggleRefinementProps {
  attribute: string;
  label: string;
  defaultRefinement?: boolean;
  className?: string;
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
          id={`toggle-${attribute}`}
          checked={value.isRefined}
          onCheckedChange={(checked: boolean) => {
            refine({ isRefined: !checked });
          }}
          className="border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
        />
        <label
          htmlFor={`toggle-${attribute}`}
          className={cn(
            "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
            value.isRefined && "font-semibold"
          )}
        >
          {label}
        </label>
      </div>

      {value.isRefined && (
        <Badge
          variant="default"
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          Active
        </Badge>
      )}
    </div>
  );
}

export default CustomToggleRefinement;
