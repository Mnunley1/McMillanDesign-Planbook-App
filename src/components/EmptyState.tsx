import type { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  actionHref?: string;
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  actionHref,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Icon className="h-12 w-12 text-muted-foreground" />
      <h3 className="mt-4 font-medium text-lg">{title}</h3>
      <p className="mt-2 max-w-sm text-muted-foreground text-sm">
        {description}
      </p>
      {actionLabel && actionHref && (
        <Button asChild className="mt-4" variant="outline">
          <Link to={actionHref}>{actionLabel}</Link>
        </Button>
      )}
      {actionLabel && onAction && !actionHref && (
        <Button className="mt-4" onClick={onAction} variant="outline">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
