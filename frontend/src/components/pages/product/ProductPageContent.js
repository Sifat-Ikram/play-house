"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { FiX } from "react-icons/fi";
import ProductPageHeader from "./ProductPageHeader";
import FilterSidebar from "./FilterSidebar";
import FilterDrawer from "./FilterDrawer";
import ProductGrid from "./ProductGrid";
import ProductPagination, { LOAD_STEP, SWITCH_THRESHOLD, PAGE_SIZE } from "./ProductPagination";

const FILTER_GROUP_LABELS = {
    category: "Category",
    brand: "Brand",
    interest: "Interest",
    occasion: "Occasion",
    age: "Age",
};

const AGE_RANGES = {
    "0-2 years": [0, 2],
    "3-5 years": [3, 5],
    "6-11 years": [6, 11],
    "12 and above": [12, Infinity],
};

const ProductPageContent = ({
    brand,
    category,
    combo,
    interest,
    occasion,
    minAge,
    maxAge,
    search,
    products = [],
}) => {
    const searchParams = useSearchParams();
    const currentSort = searchParams.get("sort") || "default";

    // Desktop sidebar defaults OPEN; mobile drawer defaults CLOSED — independent states
    const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);
    const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

    const [selectedFilters, setSelectedFilters] = useState({});
    const [visibleCount, setVisibleCount] = useState(LOAD_STEP);
    const [paginationMode, setPaginationMode] = useState("loadMore");
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        setSelectedFilters({});
        setVisibleCount(LOAD_STEP);
        setPaginationMode("loadMore");
        setCurrentPage(1);
    }, [brand, category, combo, interest, occasion, minAge, maxAge, search]);

    const activeFilterCount = Object.values(selectedFilters).reduce(
        (sum, arr) => sum + (arr?.length || 0),
        0
    );

    const handleFilterChange = (groupKey, values) => {
        setSelectedFilters((prev) => ({ ...prev, [groupKey]: values }));
        setVisibleCount(LOAD_STEP);
        setPaginationMode("loadMore");
        setCurrentPage(1);
    };

    const handleClearAll = () => {
        setSelectedFilters({});
        setVisibleCount(LOAD_STEP);
        setPaginationMode("loadMore");
        setCurrentPage(1);
    };

    const handleRemoveChip = (groupKey, value) => {
        setSelectedFilters((prev) => ({
            ...prev,
            [groupKey]: (prev[groupKey] || []).filter((v) => v !== value),
        }));
    };

    const handleToggleFilters = () => {
        setIsDesktopSidebarOpen((prev) => !prev);
        setIsMobileDrawerOpen((prev) => !prev);
    };

   
    const filteredProducts = useMemo(() => {
        let list = [...products];

        const categoryFilters = selectedFilters.category || [];
        const brandFilters = selectedFilters.brand || [];
        const interestFilters = selectedFilters.interest || [];
        const occasionFilters = selectedFilters.occasion || [];
        const ageFilters = selectedFilters.age || [];

        if (categoryFilters.length > 0) {
            list = list.filter((p) => categoryFilters.includes(p.category_name));
        }

        if (brandFilters.length > 0) {
            list = list.filter((p) => brandFilters.includes(p.brand_name));
        }

        if (interestFilters.length > 0) {
            list = list.filter((p) => interestFilters.includes(p.interest));
        }

        if (occasionFilters.length > 0) {
            list = list.filter((p) => occasionFilters.includes(p.occasion));
        }

        if (ageFilters.length > 0) {
            list = list.filter((p) => {
                const pMin = p.minimum_age_range;
                const pMax = p.maximum_age_range;

                // No age data on the product — treat as "suitable for all ages"
                if (pMin === null && pMax === null) return true;

                return ageFilters.some((label) => {
                    const [fMin, fMax] = AGE_RANGES[label] || [0, Infinity];
                    const min = pMin ?? 0;
                    const max = pMax ?? Infinity;
                    return min <= fMax && max >= fMin;
                });
            });
        }

        return list;
    }, [products, selectedFilters]);

    // ---- Apply sorting ----
    const sortedProducts = useMemo(() => {
        const list = [...filteredProducts];

        if (currentSort === "price_asc") {
            list.sort((a, b) => Number(a.selling_price) - Number(b.selling_price));
        } else if (currentSort === "price_desc") {
            list.sort((a, b) => Number(b.selling_price) - Number(a.selling_price));
        } else if (currentSort === "newest") {
            // No created_at exposed by the API yet; product_id (auto-increment) is
            // used as a proxy for recency until the backend adds a real timestamp.
            list.sort((a, b) => b.product_id - a.product_id);
        }

        return list;
    }, [filteredProducts, currentSort]);

    const totalPages = Math.ceil(sortedProducts.length / PAGE_SIZE);

    const visibleProducts = useMemo(() => {
        if (paginationMode === "paginated") {
            const start = (currentPage - 1) * PAGE_SIZE;
            return sortedProducts.slice(start, start + PAGE_SIZE);
        }
        return sortedProducts.slice(0, visibleCount);
    }, [sortedProducts, paginationMode, currentPage, visibleCount]);

    const handleLoadMore = () => {
        const next = visibleCount + LOAD_STEP;
        if (next >= SWITCH_THRESHOLD && next < sortedProducts.length) {
            setPaginationMode("paginated");
            setCurrentPage(1);
        } else {
            setVisibleCount(next);
        }
    };

    const sidebarProps = {
        selectedFilters,
        onFilterChange: handleFilterChange,
        onClearAll: handleClearAll,
    };

    return (
        <div>
            <ProductPageHeader
                brand={brand}
                category={category}
                combo={combo}
                interest={interest}
                occasion={occasion}
                minAge={minAge}
                maxAge={maxAge}
                search={search}
                productCount={sortedProducts.length}
                activeFilterCount={activeFilterCount}
                isFiltersOpen={isDesktopSidebarOpen || isMobileDrawerOpen}
                onToggleFilters={handleToggleFilters}
            />

            {/* Mobile/Tablet drawer */}
            <FilterDrawer
                isOpen={isMobileDrawerOpen}
                onClose={() => setIsMobileDrawerOpen(false)}
                {...sidebarProps}
            />

            <div className="w-11/12 max-w-[1900px] mx-auto py-6 sm:py-8">
                <div className="flex items-start gap-5 lg:gap-7">

                    {/* Desktop sidebar — push/reflow, default OPEN */}
                    <motion.div
                        initial={false}
                        animate={{
                            width: isDesktopSidebarOpen ? 280 : 0,
                            opacity: isDesktopSidebarOpen ? 1 : 0,
                        }}
                        transition={{ type: "spring", stiffness: 260, damping: 30 }}
                        className="hidden lg:block shrink-0 overflow-hidden"
                    >
                        <div className="w-[280px] rounded-3xl border border-[var(--ph-border)] bg-[var(--ph-surface)] shadow-sm sticky top-[90px] max-h-[calc(100vh-110px)]">
                            <FilterSidebar {...sidebarProps} />
                        </div>
                    </motion.div>

                    {/* Grid + Chips + Pagination */}
                    <div className="flex-1 min-w-0">

                        {/* Active filter chips + Clear All — above the grid */}
                        {activeFilterCount > 0 && (
                            <div className="flex flex-wrap items-center gap-2 mb-4 sm:mb-5">
                                {Object.entries(selectedFilters).map(([groupKey, values]) =>
                                    (values || []).map((value) => (
                                        <span
                                            key={`${groupKey}-${value}`}
                                            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold"
                                            style={{
                                                backgroundColor: "var(--ph-primary-soft)",
                                                color: "var(--ph-primary-dark)",
                                                fontFamily: "var(--font-body)",
                                            }}
                                        >
                                            {FILTER_GROUP_LABELS[groupKey] || groupKey}: {value}
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveChip(groupKey, value)}
                                                aria-label={`Remove ${value} filter`}
                                                className="rounded-full hover:bg-black/10 p-0.5"
                                            >
                                                <FiX className="text-xs" />
                                            </button>
                                        </span>
                                    ))
                                )}

                                <button
                                    type="button"
                                    onClick={handleClearAll}
                                    className="text-xs font-semibold text-[var(--ph-coral)] hover:underline ml-1"
                                    style={{ fontFamily: "var(--font-body)" }}
                                >
                                    Clear All
                                </button>
                            </div>
                        )}

                        <ProductGrid products={visibleProducts} />

                        <ProductPagination
                            totalCount={sortedProducts.length}
                            visibleCount={visibleCount}
                            onLoadMore={handleLoadMore}
                            mode={paginationMode}
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductPageContent;