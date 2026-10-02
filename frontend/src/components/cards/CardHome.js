"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const FALLBACK_IMAGE = "https://i.ibb.co.com/dsNfjCKm/download-14.jpg";

const CardHome = ({ product, type }) => {
  const price = Number(product?.selling_price || 0);
  const rating = Number(product?.average_rating || 0);

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 280, damping: 22 }}
      className="
  group relative flex h-full w-full min-w-0 flex-col overflow-hidden
  rounded-tl-3xl rounded-tr-xl
  rounded-bl-xl rounded-br-3xl
  border border-[var(--ph-border)]
  bg-[var(--ph-surface)]
  text-[var(--ph-text)]
  shadow-sm
  transition-shadow duration-300
  hover:shadow-xl
"
    >
      <div
        className="
    relative w-full
    h-[200px]
    sm:h-[220px]
    md:h-[270px]
    xl:h-[300px]
    overflow-hidden
  "
        style={{
          background:
            "linear-gradient(145deg, var(--ph-accent-soft), var(--ph-primary-soft))",
        }}
      >
        <Image
          src={product?.display_image_url || FALLBACK_IMAGE}
          alt={product?.name || "Product"}
          fill
          sizes="
      (max-width: 640px) 50vw,
      (max-width: 768px) 33vw,
      (max-width: 1024px) 25vw,
      (max-width: 1280px) 20vw,
      16vw
    "
          className="
      object-cover
      transition-transform duration-500
      group-hover:scale-105
    "
        />

        {/* Brand */}
        {(product?.interest || product?.brand_name) && (
          <div
            className="
        absolute bottom-3 left-3
        max-w-[85%]
        truncate
        rounded-full
        bg-[var(--ph-primary-dark)]
        px-3 py-1.5
        text-[10px] font-semibold
        text-white
        backdrop-blur-md
      "
            style={{ fontFamily: "var(--font-body)" }}
          >
            {product?.brand_name && (
              <span className="font-bold">{product.brand_name}</span>
            )}
          </div>
        )}
      </div>

      <div
  className={`
    flex shrink-0 flex-col
    gap-1 p-1.5
    md:p-2
    xl:p-3
    ${type === "featured" ? "h-[120px] md:h-[124px] xl:h-[130px]" : "h-[100px] md:h-[104px] xl:h-[110px]"}
  `}
>
        {/* Featured → Rating */}
        {type === "featured" && (
          <div
            className="flex items-center gap-0.5"
            style={{
              color: "var(--ph-primary-dark)",
              fontFamily: "var(--font-body)",
            }}
          >
            {[...Array(5)].map((_, i) => {
              const fillPercentage = Math.min(Math.max(rating - i, 0), 1) * 100;

              return (
                <span
                  key={i}
                  className="relative inline-block text-sm sm:text-base"
                >
                  {/* Empty star */}
                  <span>★</span>

                  {/* Filled portion */}
                  <span
                    className="absolute left-0 top-0 overflow-hidden"
                    style={{ width: `${fillPercentage}%` }}
                  >
                    ★
                  </span>
                </span>
              );
            })}
          </div>
        )}

        {/* Name */}
        <h3
          className="
      min-w-0 w-full
      truncate
      whitespace-nowrap
      text-sm
      font-semibold
      leading-5
      sm:text-base
    "
          style={{
            fontFamily: "var(--font-display)",
          }}
        >
          {product?.name || "No Name Available"}
        </h3>

        {type === "featured" && (
          <p
            className="line-clamp-2 text-xs leading-4"
            style={{
              color: "var(--ph-text-soft)",
              fontFamily: "var(--font-body)",
            }}
          >
            {product?.category_name || "No category name available"}
          </p>
        )}

        {type === "new" && (
          <p
            className="line-clamp-2 text-xs leading-4"
            style={{
              color: "var(--ph-text-soft)",
              fontFamily: "var(--font-body)",
            }}
          >
            {product?.summary || "No summary available"}
          </p>
        )}
        {/* Price */}
        <span
          className="
      whitespace-nowrap
      text-sm
      font-bold
      sm:text-base
    "
          style={{
            color: "var(--ph-accent-dark)",
            fontFamily: "var(--font-display)",
          }}
        >
          BDT {price.toLocaleString()}
        </span>
      </div>
    </motion.div>
  );
};

export default CardHome;
