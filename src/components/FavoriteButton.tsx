import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useState } from "react";
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
        animate={
          animationKey > 0
            ? { scale: [1, 1.4, 0.9, 1.1, 1], rotate: [0, -10, 10, -5, 0] }
            : undefined
        }
        key={animationKey}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <Heart
          className={cn(
            "h-4 w-4 transition-colors duration-200",
            favorited && "fill-current"
          )}
        />
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
