"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { FiPackage } from "react-icons/fi";
import ProductCard from "@/components/cards/ProductCard";

const FALLBACK_IMAGE = "https://i.ibb.co.com/dsNfjCKm/download-14.jpg";

const ProductGrid = ({ products = [], isWholesale = false }) => {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-14 sm:py-20 md:py-28">
        <div
          className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center mb-3 sm:mb-4"
          style={{ backgroundColor: "var(--ph-primary-soft)" }}
        >
          <FiPackage
            className="text-xl sm:text-2xl md:text-3xl"
            style={{ color: "var(--ph-primary-dark)" }}
          />
        </div>
        <h2
          className="text-base sm:text-lg md:text-xl font-semibold text-[var(--ph-text)] mb-1 sm:mb-1.5"
          style={{ fontFamily: "var(--font-display)" }}
        >
          No products found
        </h2>
        <p
          className="text-xs sm:text-sm text-[var(--ph-text-soft)] max-w-sm"
          style={{ fontFamily: "var(--font-body)" }}
        >
          Try adjusting or clearing your filters to see more toys.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 lg:grid-cols-3 xl:grid-cols-5 gap-2 sm:gap-3 md:gap-4 lg:gap-6 xl:gap-5">
      {products.map((product) => (
        <Link
          key={product.inventory_id}
          href={`/productDetails/${encodeURIComponent(product.product_name)}`}
        >
          <ProductCard product={product} isWholesale={isWholesale} />
        </Link>
      ))}
    </div>
  );
};

export default ProductGrid;
