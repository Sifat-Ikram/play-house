"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { FiPackage, FiX, FiZoomIn } from "react-icons/fi";

const ProductImageGallery = ({ images = [] }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomOrigin, setZoomOrigin] = useState("50% 50%");
  const [isZoomed, setIsZoomed] = useState(false);
  const [lightbox, setLightbox] = useState(false);

  const hasImages = images.length > 0;
  const active = hasImages
    ? images[Math.min(activeIndex, images.length - 1)]
    : null;

  const handleMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomOrigin(`${x}% ${y}%`);
  };

  return (
    <div className="w-full">
      <div
        className="relative aspect-square w-full overflow-hidden rounded-[24px] border border-[var(--ph-border)] shadow-sm sm:rounded-[28px]"
        style={{
          background:
            "linear-gradient(to bottom, var(--ph-accent-soft), var(--ph-surface))",
        }}
      >
        {hasImages ? (
          <div
            className="relative h-full w-full cursor-zoom-in"
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
            onMouseMove={handleMove}
            onClick={() => setLightbox(true)}
          >
            <Image
              key={active.image_url}
              src={active.image_url}
              alt="Product image"
              fill
              sizes="(max-width: 1024px) 90vw, 45vw"
              priority
              className="object-contain p-4 transition-transform duration-200"
              style={{
                transform: isZoomed ? "scale(1.9)" : "scale(1)",
                transformOrigin: zoomOrigin,
              }}
            />
            <span className="pointer-events-none absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold text-[var(--ph-text)] shadow">
              <FiZoomIn /> Click to enlarge
            </span>
          </div>
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2">
            <div
              className="flex h-16 w-16 items-center justify-center rounded-full sm:h-20 sm:w-20"
              style={{ backgroundColor: "var(--ph-primary-soft)" }}
            >
              <FiPackage
                className="text-2xl sm:text-3xl"
                style={{ color: "var(--ph-primary-dark)" }}
              />
            </div>
            <p className="text-xs font-medium text-[var(--ph-text-faint)] sm:text-sm">
              No image available
            </p>
          </div>
        )}
      </div>

      {/* Scrollable thumbnails */}
      {images.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1 sm:mt-4 sm:gap-2.5">
          {images.map((img, index) => (
            <button
              key={img.id || index}
              type="button"
              onClick={() => setActiveIndex(index)}
              className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border-2 bg-white transition-colors sm:h-16 sm:w-16"
              style={{
                borderColor:
                  index === activeIndex
                    ? "var(--ph-primary)"
                    : "var(--ph-border)",
              }}
            >
              <Image
                src={img.image_url}
                alt={`Thumbnail ${index + 1}`}
                fill
                sizes="64px"
                className="object-contain p-1"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(false)}
            className="fixed inset-0 z-[150] flex items-center justify-center bg-black/80 p-4"
          >
            <button
              type="button"
              onClick={() => setLightbox(false)}
              aria-label="Close"
              className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white text-[var(--ph-text)]"
            >
              <FiX />
            </button>
            <div
              className="relative h-[80vh] w-full max-w-3xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={active.image_url}
                alt="Enlarged product"
                fill
                sizes="90vw"
                className="object-contain"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductImageGallery;
