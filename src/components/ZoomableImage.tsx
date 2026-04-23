import { Minus, Plus, RotateCcw } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

interface ZoomableImageProps {
  alt: string;
  src: string;
}

export default function ZoomableImage({ src, alt }: ZoomableImageProps) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  // Reset zoom/pan when the image source changes (multi-image galleries)
  // biome-ignore lint/correctness/useExhaustiveDependencies: src is intentionally the trigger for this reset effect
  useEffect(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, [src]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    setScale((s) => Math.min(5, Math.max(0.5, s - e.deltaY * 0.002)));
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    isDragging.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current) {
      return;
    }
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    lastPos.current = { x: e.clientX, y: e.clientY };
    setPosition((p) => ({ x: p.x + dx, y: p.y + dy }));
  }, []);

  const handlePointerUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  const reset = useCallback(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-md">
      {/* Image pan/zoom surface — fills all available space */}
      <div
        className="flex h-full w-full items-center justify-center"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onWheel={handleWheel}
        style={{ cursor: scale > 1 ? "grab" : "default" }}
      >
        <img
          alt={alt}
          className="max-h-full max-w-full select-none object-contain"
          draggable={false}
          src={src}
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transformOrigin: "center center",
            transition: isDragging.current ? "none" : "transform 0.1s ease-out",
          }}
        />
      </div>

      {/* Floating zoom controls */}
      <div className="absolute top-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full border bg-background/85 px-2 py-1.5 shadow-lg backdrop-blur-sm">
        <span className="w-12 text-center text-muted-foreground text-sm tabular-nums">
          {Math.round(scale * 100)}%
        </span>
        <div className="flex items-center gap-0.5">
          <Button
            aria-label="Zoom out"
            className="h-7 w-7"
            onClick={() => setScale((s) => Math.max(0.5, s - 0.25))}
            size="icon"
            variant="ghost"
          >
            <Minus className="h-4 w-4" />
          </Button>
          <Button
            aria-label="Zoom in"
            className="h-7 w-7"
            onClick={() => setScale((s) => Math.min(5, s + 0.25))}
            size="icon"
            variant="ghost"
          >
            <Plus className="h-4 w-4" />
          </Button>
          <Button
            aria-label="Reset zoom"
            className="h-7 w-7"
            onClick={reset}
            size="icon"
            variant="ghost"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
