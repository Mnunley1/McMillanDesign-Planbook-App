import type { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  subtitle?: string;
  value: string | number;
}

export default function StatCard({
  icon: Icon,
  label,
  value,
  subtitle,
}: StatCardProps) {
  return (
    <Card>
      <CardHeader className="pb-0">
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <Icon className="h-4 w-4" />
          {label}
        </div>
      </CardHeader>
      <CardContent>
        <p className="font-bold text-2xl">
          {typeof value === "number" ? value.toLocaleString() : value}
        </p>
        {subtitle && (
          <p className="text-muted-foreground text-sm">{subtitle}</p>
        )}
      </CardContent>
    </Card>
  );
}
