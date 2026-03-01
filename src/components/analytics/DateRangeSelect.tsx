import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type DateRange = "7d" | "30d" | "90d" | "all";

export const RANGE_MS: Record<Exclude<DateRange, "all">, number> = {
  "7d": 7 * 86_400_000,
  "30d": 30 * 86_400_000,
  "90d": 90 * 86_400_000,
};

interface DateRangeSelectProps {
  onChange: (value: DateRange) => void;
  value: DateRange;
}

const OPTIONS: { label: string; value: DateRange }[] = [
  { label: "Last 7 days", value: "7d" },
  { label: "Last 30 days", value: "30d" },
  { label: "Last 90 days", value: "90d" },
  { label: "All time", value: "all" },
];

export default function DateRangeSelect({
  value,
  onChange,
}: DateRangeSelectProps) {
  return (
    <Select onValueChange={(v) => onChange(v as DateRange)} value={value}>
      <SelectTrigger className="w-[160px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {OPTIONS.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
