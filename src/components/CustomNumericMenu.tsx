import { useNumericMenu } from "react-instantsearch";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

interface NumericMenuItem {
  end?: number;
  label: string;
  start?: number;
  value: string;
}

interface CustomNumericMenuProps {
  attribute: string;
  className?: string;
  items: NumericMenuItem[];
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
      className={cn("space-y-2", className)}
      onValueChange={(value) => refine(value)}
      value={instantSearchItems.find((item) => item.isRefined)?.value || ""}
    >
      {instantSearchItems.map((item) => (
        <div
          className={cn(
            "flex items-center space-x-3 rounded-md p-2 transition-colors hover:bg-accent",
            item.isRefined && "bg-accent"
          )}
          key={item.value || "all"}
        >
          <RadioGroupItem
            className="border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
            id={`${attribute}-${item.value || "all"}`}
            value={item.value}
          />
          <label
            className={cn(
              "flex flex-1 items-center justify-between font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
              item.isRefined && "font-semibold"
            )}
            htmlFor={`${attribute}-${item.value || "all"}`}
          >
            <span>{item.label}</span>
            {item.isRefined && (
              <Badge
                className="ml-2 bg-primary text-primary-foreground hover:bg-primary/90"
                variant="default"
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
