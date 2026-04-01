import { Grid3x3, List } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export type ViewMode = "grid" | "list";

interface ViewToggleProps {
  onChange: (mode: ViewMode) => void;
  value: ViewMode;
}

export default function ViewToggle({ value, onChange }: ViewToggleProps) {
  return (
    <ToggleGroup
      onValueChange={(v) => {
        if (v) {
          onChange(v as ViewMode);
        }
      }}
      type="single"
      value={value}
    >
      <ToggleGroupItem aria-label="Grid view" size="sm" value="grid">
        <Grid3x3 className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem aria-label="List view" size="sm" value="list">
        <List className="h-4 w-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
