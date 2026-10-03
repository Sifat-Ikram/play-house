"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const FALLBACK_IMAGE = "https://i.ibb.co.com/dsNfjCKm/download-14.jpg";

const ProductCard = ({ product, isWholesale = false }) => {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="
group relative overflow-hidden
bg-[var(--ph-surface)]
border border-[var(--ph-border)]
shadow-sm hover:shadow-xl
transition-all duration-300
rounded-tl-2xl sm:rounded-tl-3xl
rounded-tr-md sm:rounded-tr-lg
rounded-bl-md sm:rounded-bl-lg
rounded-br-2xl sm:rounded-br-3xl
"
    >
      <div
        className="relative w-full h-[90px] sm:h-[150px] md:h-[170px] lg:h-[210px] xl:h-[170px] overflow-hidden"
        style={{
          background:
            "linear-gradient(to bottom, var(--ph-accent-soft), var(--ph-surface))",
        }}
      >
        <Image
          src={product?.display_image_url || FALLBACK_IMAGE}
          alt={product?.product_name || "Product"}
          fill
          sizes="(max-width: 640px) 33vw, (max-width: 1280px) 33vw, 20vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />{" "}
      </div>
      <div className="p-1.5 sm:p-3 md:p-3.5 lg:p-4 space-y-0.5 sm:space-y-1">
        <p
          className="text-[7px] sm:text-[10px] md:text-[11px] font-semibold text-[var(--ph-primary-dark)] uppercase tracking-wider truncate"
          style={{ fontFamily: "var(--font-body)" }}
        >
          {product?.brand_name || "Toy Store"}
        </p>

        <h3
          className="text-[10px] sm:text-sm md:text-[15px] font-semibold text-[var(--ph-text)] truncate"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {product?.product_name || "No Name Available"}
        </h3>

        <p
          className="hidden sm:block text-[11px] text-[var(--ph-text-faint)] truncate"
          style={{ fontFamily: "var(--font-body)" }}
        >
          {product?.category_name}
        </p>

        {isWholesale && product?.min_wholesale_qty ? (
          <>
            <p
              className="pt-0.5 sm:pt-1 text-[10px] sm:text-sm md:text-base font-bold"
              style={{
                color: "var(--ph-primary-dark)",
                fontFamily: "var(--font-display)",
              }}
            >
              BDT {Number(product.wholesale_price || 0).toLocaleString()}
              <span className="text-[9px] sm:text-xs font-medium text-[var(--ph-text-faint)]">
                {" "}
                /unit
              </span>
            </p>

            <p
              className="text-[8px] sm:text-[11px] text-[var(--ph-text-faint)]"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Min. order: {product.min_wholesale_qty} units
            </p>
          </>
        ) : (
          <p
            className="pt-0.5 sm:pt-1 text-[10px] sm:text-sm md:text-base font-bold text-[var(--ph-text)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            BDT{" "}
            {product?.selling_price
              ? Number(product.selling_price).toLocaleString()
              : "0"}
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default ProductCard;
