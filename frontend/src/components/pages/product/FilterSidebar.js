"use client";

import useBrand from "@/hooks/useBrand";
import useCategory from "@/hooks/useCategory";
import { useState } from "react";
import { FiChevronDown, FiX } from "react-icons/fi";

const FilterSidebar = ({
  selectedFilters = {},
  onFilterChange,
  onClearAll,
  onClose,
  showCloseButton = false,
  priceRange,
  onPriceChange,
}) => {
  const { brands } = useBrand();
  const { categories } = useCategory();

  const filterGroups = [
    {
      key: "age",
      label: "Age Group",
      options: ["0-2 years", "3-5 years", "6-11 years", "12 and above"],
    },
    {
      key: "category",
      label: "Category",
      options: categories?.map((category) => category.category_name) || [],
    },
    {
      key: "brand",
      label: "Brand",
      options: brands?.map((brand) => brand.brand_name) || [],
    },
    {
      key: "price",
      label: "Price",
    },

    {
      key: "interest",
      label: "Interest",
      options: [
        "Cars & Vehicles",
        "Puzzles & Games",
        "Arts & Creativity",
        "Robots & Tech",
        "Building & Blocks",
        "Books & Stories",
      ],
    },
    {
      key: "occasion",
      label: "Occasion",
      options: [
        "Birthday Fun",
        "Gift for Kids",
        "Party & Fun",
        "Holiday Gifts",
        "Back to School",
        "Just Because",
      ],
    },
  ];

  const [openSections, setOpenSections] = useState(() =>
    Object.fromEntries(filterGroups.map((g, i) => [g.key, i === 0])),
  );

  const toggleSection = (key) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const isChecked = (groupKey, option) =>
    (selectedFilters[groupKey] || []).includes(option);

  const handleCheck = (groupKey, option) => {
    if (!onFilterChange) return;
    const current = selectedFilters[groupKey] || [];
    const next = current.includes(option)
      ? current.filter((o) => o !== option)
      : [...current, option];
    onFilterChange(groupKey, next);
  };

  const activeCount = Object.values(selectedFilters).reduce(
    (sum, arr) => sum + (arr?.length || 0),
    0,
  );

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--ph-border)] px-3.5 py-3 sm:px-4 sm:py-3.5 md:px-5 md:py-4">
        <div>
          <p
            className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.12em] sm:tracking-[0.14em]"
            style={{
              color: "var(--ph-accent)",
              fontFamily: "var(--font-body)",
            }}
          >
            Refine
          </p>
          <h3
            className="text-base sm:text-lg font-semibold text-[var(--ph-text)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Filters
          </h3>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {activeCount > 0 && (
            <button
              type="button"
              onClick={onClearAll}
              className="text-[11px] sm:text-xs font-semibold text-[var(--ph-coral)] hover:underline"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Clear All
            </button>
          )}

          {showCloseButton && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close filters"
              className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full text-[var(--ph-text-soft)] hover:bg-[var(--ph-primary-soft)]"
            >
              <FiX className="text-base sm:text-lg" />
            </button>
          )}
        </div>
      </div>

      {/* Scrollable filter groups */}
      <div className="px-3.5 py-2.5 sm:px-4 sm:py-3 md:px-5">
        {filterGroups.map((group) => {
          const isOpen = openSections[group.key];

          return (
            <div
              key={group.key}
              className="border-b border-[var(--ph-border)] py-3 sm:py-3.5 last:border-b-0"
            >
              <button
                type="button"
                onClick={() => toggleSection(group.key)}
                className="flex w-full items-center justify-between"
              >
                <span
                  className="text-[13px] sm:text-sm font-bold text-[var(--ph-text)]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {group.label}
                </span>
                <FiChevronDown
                  className={`text-xs sm:text-sm text-[var(--ph-text-faint)] transition-transform duration-200 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isOpen && (
                <>
                  {group.key === "price" ? (
                    <div className="mt-4">
                      <div className="mb-4 flex items-center justify-between text-xs font-semibold text-[var(--ph-text-soft)]">
                        <span>৳{priceRange.min.toLocaleString("en-BD")}</span>
                        <span>৳{priceRange.max.toLocaleString("en-BD")}</span>
                      </div>

                      <div className="relative h-5">
                        {/* Track */}
                        <div className="absolute top-1/2 left-0 right-0 h-1 -translate-y-1/2 rounded-full bg-[var(--ph-border)]" />

                        {/* Active range */}
                        <div
                          className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-[var(--ph-primary)]"
                          style={{
                            left: `${(priceRange.min / 100000) * 100}%`,
                            right: `${100 - (priceRange.max / 100000) * 100}%`,
                          }}
                        />

                        {/* Minimum handle */}
                        <input
                          type="range"
                          min="0"
                          max="100000"
                          step="100"
                          value={priceRange.min}
                          onChange={(e) => {
                            const value = Math.min(
                              Number(e.target.value),
                              priceRange.max,
                            );

                            onPriceChange({
                              ...priceRange,
                              min: value,
                            });
                          }}
                          className="absolute inset-0 h-5 w-full cursor-pointer appearance-none bg-transparent pointer-events-none
              [&::-webkit-slider-thumb]:pointer-events-auto
              [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:h-4
              [&::-webkit-slider-thumb]:w-4
              [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:bg-[var(--ph-primary)]
              [&::-webkit-slider-thumb]:border-2
              [&::-webkit-slider-thumb]:border-[var(--ph-surface)]
              [&::-webkit-slider-thumb]:shadow-md"
                        />

                        {/* Maximum handle */}
                        <input
                          type="range"
                          min="0"
                          max="100000"
                          step="100"
                          value={priceRange.max}
                          onChange={(e) => {
                            const value = Math.max(
                              Number(e.target.value),
                              priceRange.min,
                            );

                            onPriceChange({
                              ...priceRange,
                              max: value,
                            });
                          }}
                          className="absolute inset-0 h-5 w-full cursor-pointer appearance-none bg-transparent pointer-events-none
              [&::-webkit-slider-thumb]:pointer-events-auto
              [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:h-4
              [&::-webkit-slider-thumb]:w-4
              [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:bg-[var(--ph-primary)]
              [&::-webkit-slider-thumb]:border-2
              [&::-webkit-slider-thumb]:border-[var(--ph-surface)]
              [&::-webkit-slider-thumb]:shadow-md"
                        />
                      </div>

                      <div className="mt-2 flex justify-between text-[10px] text-[var(--ph-text-faint)]">
                        <span>৳0</span>
                        <span>৳100,000</span>
                      </div>
                    </div>
                  ) : (
                    <ul className="mt-2.5 sm:mt-3 space-y-2 sm:space-y-2.5">
                      {group.options.map((option) => (
                        <li key={option}>
                          <label className="flex cursor-pointer items-center gap-2 sm:gap-2.5">
                            <span className="relative flex h-4 w-4 sm:h-[18px] sm:w-[18px] shrink-0 items-center justify-center">
                              <input
                                type="checkbox"
                                checked={isChecked(group.key, option)}
                                onChange={() => handleCheck(group.key, option)}
                                className="peer absolute inset-0 h-full w-full cursor-pointer opacity-0"
                              />

                              <span
                                className="h-4 w-4 sm:h-[18px] sm:w-[18px] rounded-md border-2 transition-colors duration-150 peer-checked:border-transparent"
                                style={{
                                  borderColor: "var(--ph-border)",
                                  backgroundColor: isChecked(group.key, option)
                                    ? "var(--ph-primary)"
                                    : "transparent",
                                }}
                              />

                              {isChecked(group.key, option) && (
                                <svg
                                  className="pointer-events-none absolute h-2.5 w-2.5 sm:h-[11px] sm:w-[11px] text-[#1E2B2B]"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path d="M16.7 5.3a1 1 0 010 1.4l-7.4 7.4a1 1 0 01-1.4 0L3.3 9.5a1 1 0 111.4-1.4l3.6 3.6 6.7-6.7a1 1 0 011.4 0z" />
                                </svg>
                              )}
                            </span>

                            <span
                              className="text-[13px] sm:text-sm text-[var(--ph-text-soft)]"
                              style={{ fontFamily: "var(--font-body)" }}
                            >
                              {option}
                            </span>
                          </label>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FilterSidebar;
