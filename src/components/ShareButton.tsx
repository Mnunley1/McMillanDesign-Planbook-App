import { useState } from "react";
import { Check, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

interface ShareButtonProps {
  planNumber: string;
  className?: string;
}

export default function ShareButton({
  planNumber,
  className,
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const url = window.location.href;
    const shareData = {
      title: `Floor Plan ${planNumber} - McMillan Design`,
      url,
    };

    if (navigator.share && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch {
        // User dismissed the share sheet
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard write failed silently
    }
  };

  return (
    <Button
      className={cn("text-muted-foreground hover:text-primary", className)}
      onClick={handleShare}
      size="icon"
      variant="outline"
    >
      {copied ? (
        <Check className="h-4 w-4 text-emerald-500" />
      ) : (
        <Share2 className="h-4 w-4" />
      )}
      <span className="sr-only">{copied ? "Link copied" : "Share plan"}</span>
    </Button>
  );
}
