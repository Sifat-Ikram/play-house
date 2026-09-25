"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { FiPackage } from "react-icons/fi";

const ProductImageGallery = ({ images = [] }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const hasImages = images && images.length > 0;
  const activeImage = hasImages ? images[activeIndex] : null;

  return (
    <div className="w-full">
      {/* Main image */}
      <div
        className="relative w-full aspect-square rounded-[24px] sm:rounded-[28px] overflow-hidden border border-[var(--ph-border)] shadow-sm"
        style={{
          background:
            "linear-gradient(to bottom, var(--ph-accent-soft), var(--ph-surface))",
        }}
      >
        <AnimatePresence mode="wait">
          {hasImages ? (
            <motion.div
              key={activeImage.image_url}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              className="relative h-full w-full"
            >
              <Image
                src={activeImage.image_url}
                alt="Product image"
                fill
                sizes="(max-width: 1024px) 90vw, 45vw"
                className="object-cover"
                priority
              />
            </motion.div>
          ) : (
            <motion.div
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex h-full w-full flex-col items-center justify-center gap-2"
            >
              <div
                className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full"
                style={{ backgroundColor: "var(--ph-primary-soft)" }}
              >
                <FiPackage
                  className="text-2xl sm:text-3xl"
                  style={{ color: "var(--ph-primary-dark)" }}
                />
              </div>
              <p
                className="text-xs sm:text-sm font-medium text-[var(--ph-text-faint)]"
                style={{ fontFamily: "var(--font-body)" }}
              >
                No image available
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Thumbnails */}
      {hasImages && images.length > 1 && (
        <div className="mt-3 sm:mt-4 flex gap-2 sm:gap-2.5 overflow-x-auto pb-1">
          {images.map((img, index) => (
            <button
              key={img.id || index}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`relative h-14 w-14 sm:h-16 sm:w-16 shrink-0 overflow-hidden rounded-xl border-2 transition-colors duration-200`}
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
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;
