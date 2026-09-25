"use client";

import { useState } from "react";
import Link from "next/link";
import { FiChevronRight } from "react-icons/fi";
import ProductInfo from "./ProductInfo";
import ProductDetailsTabs from "./ProductDetailsTabs";
import ProductReviews from "./ProductReviews";
import SimilarProducts from "./SimilarProducts";
import ProductImageGallery from "./ProductImageGallery";

const ProductDetailsContent = ({
  product,
  reviews = [],
  similarProducts = [],
}) => {
  const [selectedInventory, setSelectedInventory] = useState(
    product?.inventory?.[0] || null,
  );

  if (!product) {
    return (
      <div className="w-11/12 max-w-[1400px] mx-auto py-20 text-center">
        <p
          className="text-lg font-semibold text-[var(--ph-text)]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Product not found
        </p>
      </div>
    );
  }

  return (
    <div className="w-11/12 max-w-[1400px] mx-auto py-5 sm:py-7 md:py-10">
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-1.5 text-[11px] sm:text-xs mb-4 sm:mb-6"
        style={{ fontFamily: "var(--font-body)" }}
      >
        <Link
          href="/"
          className="text-[var(--ph-text-faint)] hover:text-[var(--ph-text)]"
        >
          Home
        </Link>
        <FiChevronRight className="text-[var(--ph-text-faint)] text-[10px]" />
        <Link
          href="/product"
          className="text-[var(--ph-text-faint)] hover:text-[var(--ph-text)]"
        >
          Products
        </Link>
        <FiChevronRight className="text-[var(--ph-text-faint)] text-[10px]" />
        <Link
          href={`/product?category=${encodeURIComponent(product.category_name || "")}`}
          className="text-[var(--ph-text-faint)] hover:text-[var(--ph-text)]"
        >
          {product.category_name}
        </Link>
        <FiChevronRight className="text-[var(--ph-text-faint)] text-[10px]" />
        <span className="font-semibold text-[var(--ph-text)] truncate max-w-[140px] sm:max-w-none">
          {product.name}
        </span>
      </nav>

      {/* Left (image) + Right (info) — always side by side on desktop, stacked on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
        <div>
          <ProductImageGallery images={selectedInventory?.images || []} />
        </div>
        <div>
          <ProductInfo
            product={product}
            selectedInventory={selectedInventory}
            onSelectInventory={setSelectedInventory}
          />
        </div>
      </div>

      {/* Description + Specifications */}
      <div className="mt-8 sm:mt-10 md:mt-12">
        <ProductDetailsTabs product={product} sku={selectedInventory?.sku} />
      </div>

      {/* Reviews */}
      <div className="mt-6 sm:mt-8">
        <ProductReviews reviews={reviews} />
      </div>

      {/* Similar products */}
      {similarProducts.length > 0 && (
        <div className="mt-8 sm:mt-10 md:mt-12">
          <SimilarProducts
            products={similarProducts}
            brandName={product.brand_name}
          />
        </div>
      )}
    </div>
  );
};

export default ProductDetailsContent;
