import { Scale, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useComparison } from "@/hooks/use-comparison";
import { Button } from "./ui/button";

export default function CompareBar() {
  const { selectedIds, remove, clear, count } = useComparison();
  const navigate = useNavigate();

  if (count === 0) {
    return null;
  }

  return (
    <div className="fixed right-0 bottom-0 left-0 z-40 border-t bg-background p-3 shadow-lg">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Scale className="h-5 w-5 text-primary" />
          <span className="font-medium text-sm">
            {count} plan{count !== 1 ? "s" : ""} selected
          </span>
          <div className="flex gap-1">
            {selectedIds.filter(Boolean).map((id) => (
              <button
                className="flex items-center gap-1 rounded bg-muted px-2 py-1 text-xs"
                key={id}
                onClick={() => remove(id)}
                type="button"
              >
                {id.slice(0, 8)}...
                <X className="h-3 w-3" />
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={clear} size="sm" variant="ghost">
            Clear
          </Button>
          <Button
            disabled={count < 2}
            onClick={() => navigate("/compare")}
            size="sm"
          >
            Compare Now
          </Button>
        </div>
      </div>
    </div>
  );
}
