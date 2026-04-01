import { motion } from "framer-motion";
import { Scale } from "lucide-react";
import { useState } from "react";
import { useComparison } from "@/hooks/use-comparison";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

interface CompareButtonProps {
  className?: string;
  planId: string;
  planNumber?: string;
}

export default function CompareButton({
  planId,
  planNumber,
  className,
}: CompareButtonProps) {
  const { isSelected, add, remove, isFull } = useComparison();
  const selected = isSelected(planId);
  const [animationKey, setAnimationKey] = useState(0);

  return (
    <div
      className="relative inline-flex"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <Button
        className={cn(
          "text-muted-foreground hover:text-primary",
          selected && "text-primary",
          isFull && !selected && "cursor-not-allowed opacity-40",
          className
        )}
        disabled={!selected && isFull}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (selected) {
            remove(planId);
          } else {
            setAnimationKey((k) => k + 1);
            add(planId, planNumber);
          }
        }}
        size="icon"
        title={
          selected
            ? "Remove from comparison"
            : isFull
              ? "Max 5 plans"
              : "Add to comparison"
        }
        variant="ghost"
      >
        <motion.div
          animate={animationKey > 0 ? { scale: [1, 1.3, 1] } : undefined}
          key={animationKey}
          transition={{ duration: 0.3 }}
        >
          <Scale className={cn("h-4 w-4", selected && "fill-current")} />
        </motion.div>
        <span className="sr-only">
          {selected ? "Remove from comparison" : "Add to comparison"}
        </span>
      </Button>
      {selected && (
        <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-primary" />
      )}
    </div>
  );
}
