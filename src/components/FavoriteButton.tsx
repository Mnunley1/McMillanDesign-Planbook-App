import { useState } from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useFavorites } from "@/hooks/use-favorites";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

interface FavoriteButtonProps {
  className?: string;
  planId: string;
  size?: "sm" | "default";
}

export default function FavoriteButton({
  planId,
  className,
  size = "sm",
}: FavoriteButtonProps) {
  const { isFavorite, toggle } = useFavorites();
  const favorited = isFavorite(planId);
  const [animationKey, setAnimationKey] = useState(0);

  return (
    <Button
      className={cn(
        "text-muted-foreground hover:text-red-500",
        favorited && "text-red-500",
        className
      )}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!favorited) {
          setAnimationKey((k) => k + 1);
        }
        toggle(planId);
      }}
      size={size === "sm" ? "icon" : "default"}
      variant="ghost"
    >
      <motion.div
        key={animationKey}
        animate={animationKey > 0 ? { scale: [1, 1.3, 1] } : undefined}
        transition={{ duration: 0.3 }}
      >
        <Heart className={cn("h-4 w-4", favorited && "fill-current")} />
      </motion.div>
      {size === "default" && (
        <span className="ml-2">{favorited ? "Favorited" : "Favorite"}</span>
      )}
      <span className="sr-only">
        {favorited ? "Remove from favorites" : "Add to favorites"}
      </span>
    </Button>
  );
}
