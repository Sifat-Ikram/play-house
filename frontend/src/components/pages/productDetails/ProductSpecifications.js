"use client";

const SPEC_FIELDS = [
  { key: "number_of_pieces", label: "Number of Pieces" },
  { key: "materials", label: "Materials" },
  { key: "interest", label: "Interest" },
  { key: "occasion", label: "Occasion" },
  { key: "warranty_info", label: "Warranty" },
  { key: "in_the_box", label: "In the Box" },
];

const formatAgeRange = (min, max) => {
  if (min === null && max === null) return null;
  if (min !== null && max !== null) return `${min} - ${max} years`;
  if (min !== null) return `${min}+ years`;
  return `Up to ${max} years`;
};

const ProductSpecifications = ({ product, sku }) => {
  if (!product) return null;

  const ageRange = formatAgeRange(
    product.minimum_age_range,
    product.maximum_age_range,
  );

  const rows = [
    ...(ageRange ? [{ label: "Age Range", value: ageRange }] : []),
    ...SPEC_FIELDS.filter(
      (f) =>
        product[f.key] !== null &&
        product[f.key] !== undefined &&
        product[f.key] !== "",
    ).map((f) => ({ label: f.label, value: product[f.key] })),
    ...(sku ? [{ label: "SKU", value: sku }] : []),
  ];

  if (rows.length === 0 && !product.return_and_refund_policy) return null;

  return (
    <div>
      {rows.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
          {rows.map((row) => (
            <div
              key={row.label}
              className="flex items-start gap-2 border-b border-[var(--ph-border)] pb-2.5"
            >
              <span
                className="text-xs sm:text-sm font-bold text-[var(--ph-text)] min-w-[120px]"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {row.label}
              </span>
              <span
                className="text-xs sm:text-sm text-[var(--ph-text-soft)]"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {row.value}
              </span>
            </div>
          ))}
        </div>
      )}

      {product.return_and_refund_policy && (
        <div className="mt-5">
          <h4
            className="text-sm font-bold text-[var(--ph-text)] mb-1.5"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Return & Refund Policy
          </h4>
          <p
            className="text-xs sm:text-sm text-[var(--ph-text-soft)] leading-relaxed"
            style={{ fontFamily: "var(--font-body)" }}
          >
            {product.return_and_refund_policy}
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductSpecifications;
