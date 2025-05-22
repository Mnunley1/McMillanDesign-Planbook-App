import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { useNumericMenu } from "react-instantsearch";

interface NumericMenuItem {
  label: string;
  value: string;
  start?: number;
  end?: number;
}

interface CustomNumericMenuProps {
  attribute: string;
  items: NumericMenuItem[];
  className?: string;
}

function CustomNumericMenu({
  attribute,
  items,
  className,
}: CustomNumericMenuProps) {
  const { items: instantSearchItems, refine } = useNumericMenu({
    attribute,
    items,
  });

  return (
    <RadioGroup
      value={instantSearchItems.find((item) => item.isRefined)?.value || ""}
      onValueChange={(value) => refine(value)}
      className={cn("space-y-2", className)}
    >
      {instantSearchItems.map((item) => (
        <div
          key={item.value || "all"}
          className={cn(
            "flex items-center space-x-3 rounded-md p-2 transition-colors hover:bg-accent",
            item.isRefined && "bg-accent"
          )}
        >
          <RadioGroupItem
            value={item.value}
            id={`${attribute}-${item.value || "all"}`}
            className="border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
          />
          <label
            htmlFor={`${attribute}-${item.value || "all"}`}
            className={cn(
              "flex flex-1 items-center justify-between text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
              item.isRefined && "font-semibold"
            )}
          >
            <span>{item.label}</span>
            {item.isRefined && (
              <Badge
                variant="default"
                className="ml-2 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Selected
              </Badge>
            )}
          </label>
        </div>
      ))}
    </RadioGroup>
  );
}

export default CustomNumericMenu;
