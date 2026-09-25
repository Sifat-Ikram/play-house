"use client";

import ProductDescription from "./ProductDescription";
import ProductSpecifications from "./ProductSpecifications";

const ProductDetailsTabs = ({ product, sku }) => {
  return (
    <div className="rounded-[24px] border border-[var(--ph-border)] bg-[var(--ph-surface)] p-4 sm:p-6 md:p-8">
      {/* Description */}
      <h3
        className="text-lg sm:text-xl font-semibold text-[var(--ph-text)] mb-4"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Description
      </h3>
      <ProductDescription description={product?.description} />

      {/* Specifications — directly below description */}
      <div className="mt-8 pt-6 border-t border-[var(--ph-border)]">
        <h3
          className="text-lg sm:text-xl font-semibold text-[var(--ph-text)] mb-4"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Specifications
        </h3>
        <ProductSpecifications product={product} sku={sku} />
      </div>
    </div>
  );
};

export default ProductDetailsTabs;
