"use client";

import ProductCard from "@/components/cards/ProductCard";
import Link from "next/link";

const SimilarProducts = ({ products = [], brandName }) => {
  if (!products || products.length === 0) return null;

  return (
    <div>
      <h3
        className="text-lg sm:text-xl font-semibold text-[var(--ph-text)] mb-4 sm:mb-5"
        style={{ fontFamily: "var(--font-display)" }}
      >
        You may also like
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
        {products.map((product) => (
          <Link
            key={product.inventory_id || product.product_id}
            href={`/productDetails/${encodeURIComponent(product.product_name)}`}
          >
            <ProductCard product={product} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SimilarProducts;
