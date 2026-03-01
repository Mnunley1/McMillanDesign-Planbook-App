import {
  ChevronLeft,
  ChevronRight,
  ImageOff,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface ImageGalleryProps {
  images: Array<{ url: string }>;
  planNumber: string;
}

export default function ImageGallery({
  images,
  planNumber,
}: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const [errorImages, setErrorImages] = useState<Set<string>>(new Set());

  const hasMultiple = images.length > 1;
  const currentImage = images[selectedIndex]?.url;
  const currentImageHasError = !currentImage || errorImages.has(currentImage);

  const handleImageError = (url: string) => {
    setErrorImages((prev) => new Set(prev).add(url));
  };

  const goToPrev = useCallback(() => {
    setSelectedIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  }, [images.length]);

  const goToNext = useCallback(() => {
    setSelectedIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  }, [images.length]);

  // Keyboard navigation in lightbox
  useEffect(() => {
    if (!lightboxOpen) {
      return;
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        goToPrev();
      }
      if (e.key === "ArrowRight") {
        goToNext();
      }
      if (e.key === "Escape") {
        setLightboxOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen, goToPrev, goToNext]);

  if (images.length === 0) {
    return (
      <div className="relative flex aspect-[21/9] flex-col items-center justify-center bg-muted">
        <ImageOff className="h-12 w-12 text-muted-foreground" />
        <p className="mt-2 text-muted-foreground text-sm">Image unavailable</p>
      </div>
    );
  }

  return (
    <>
      {/* Main image */}
      <div className="relative aspect-[21/9]">
        {currentImageHasError ? (
          <div className="flex h-full w-full flex-col items-center justify-center bg-muted">
            <ImageOff className="h-12 w-12 text-muted-foreground" />
            <p className="mt-2 text-muted-foreground text-sm">Image unavailable</p>
          </div>
        ) : (
          <button
            className="h-full w-full cursor-zoom-in"
            onClick={() => setLightboxOpen(true)}
            type="button"
          >
            <img
              alt={`${planNumber} - ${selectedIndex + 1} of ${images.length}`}
              className="h-full w-full bg-muted/10 object-contain"
              onError={() => handleImageError(currentImage)}
              src={currentImage}
            />
          </button>
        )}

        {/* Prev/Next arrows on main image */}
        {hasMultiple && (
          <>
            <Button
              className="absolute top-1/2 left-2 -translate-y-1/2 bg-background/80 backdrop-blur-sm"
              onClick={goToPrev}
              size="icon"
              variant="ghost"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              className="absolute top-1/2 right-2 -translate-y-1/2 bg-background/80 backdrop-blur-sm"
              onClick={goToNext}
              size="icon"
              variant="ghost"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </>
        )}
      </div>

      {/* Thumbnail row */}
      {hasMultiple && (
        <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
          {images.map((img, idx) => (
            <button
              className={cn(
                "h-16 w-20 flex-shrink-0 overflow-hidden rounded border-2 transition-colors",
                idx === selectedIndex
                  ? "border-primary"
                  : "border-transparent hover:border-muted-foreground/50"
              )}
              key={img.url}
              onClick={() => setSelectedIndex(idx)}
              type="button"
            >
              {errorImages.has(img.url) ? (
                <div className="flex h-full w-full items-center justify-center bg-muted">
                  <ImageOff className="h-4 w-4 text-muted-foreground" />
                </div>
              ) : (
                <img
                  alt={`${planNumber} thumbnail ${idx + 1}`}
                  className="h-full w-full object-cover"
                  loading="lazy"
                  onError={() => handleImageError(img.url)}
                  src={img.url}
                />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      <Dialog onOpenChange={setLightboxOpen} open={lightboxOpen}>
        <DialogContent className="flex h-[95vh] max-h-[95vh] w-[95vw] max-w-[95vw] flex-col items-center justify-center bg-black/95 p-0">
          <DialogTitle className="sr-only">
            {planNumber} - Image {selectedIndex + 1}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Full-screen view of floor plan image
          </DialogDescription>

          {/* Zoom toggle */}
          <div className="absolute top-4 right-14 z-10">
            <Button
              onClick={() => setZoomed((z) => !z)}
              size="icon"
              variant="ghost"
            >
              {zoomed ? (
                <ZoomOut className="h-5 w-5 text-white" />
              ) : (
                <ZoomIn className="h-5 w-5 text-white" />
              )}
            </Button>
          </div>

          {/* Image */}
          {currentImageHasError ? (
            <div className="flex h-full w-full flex-col items-center justify-center">
              <ImageOff className="h-16 w-16 text-muted-foreground" />
              <p className="mt-3 text-muted-foreground text-sm">Image unavailable</p>
            </div>
          ) : (
            <button
              className="flex h-full w-full items-center justify-center overflow-auto border-none bg-transparent p-0"
              onClick={() => setZoomed((z) => !z)}
              type="button"
            >
              <img
                alt={`${planNumber} - ${selectedIndex + 1} of ${images.length}`}
                className={cn(
                  "max-h-full transition-transform duration-200",
                  zoomed
                    ? "scale-150 cursor-zoom-out"
                    : "scale-100 cursor-zoom-in"
                )}
                onError={() => handleImageError(currentImage)}
                src={currentImage}
              />
            </button>
          )}

          {/* Navigation arrows */}
          {hasMultiple && (
            <>
              <Button
                className="absolute top-1/2 left-4 -translate-y-1/2 text-white"
                onClick={goToPrev}
                size="icon"
                variant="ghost"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button
                className="absolute top-1/2 right-4 -translate-y-1/2 text-white"
                onClick={goToNext}
                size="icon"
                variant="ghost"
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </>
          )}

          {/* Image counter */}
          {hasMultiple && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-background/80 px-3 py-1 text-sm backdrop-blur-sm">
              {selectedIndex + 1} / {images.length}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
