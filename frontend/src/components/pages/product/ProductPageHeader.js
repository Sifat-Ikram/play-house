"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
    FiChevronRight,
    FiChevronDown,
    FiCheck,
    FiMenu,
} from "react-icons/fi";

const FILTER_META = {
    brand: { label: "Brand", eyebrow: "Shopping By Brand" },
    category: { label: "Category", eyebrow: "Shopping By Category" },
    combo: { label: "Combo Offer", eyebrow: "Bundled Just For You" },
    interest: { label: "Interest", eyebrow: "Shopping By Interest" },
    occasion: { label: "Occasion", eyebrow: "Shopping By Occasion" },
    age: { label: "Age Group", eyebrow: "Shopping By Age" },
    search: { label: "Search Results", eyebrow: "You Searched For" },
};

const THEME_BY_TYPE = {
    brand: {
        bg: "var(--ph-primary-soft)",
        blob1: "var(--ph-primary)",
        blob2: "var(--ph-accent)",
        eyebrowColor: "var(--ph-primary-dark)",
    },
    category: {
        bg: "var(--ph-primary-soft)",
        blob1: "var(--ph-primary)",
        blob2: "var(--ph-coral)",
        eyebrowColor: "var(--ph-primary-dark)",
    },
    combo: {
        bg: "#FBE7C9",
        blob1: "var(--ph-primary-dark)",
        blob2: "var(--ph-accent)",
        eyebrowColor: "var(--ph-primary-dark)",
    },
    interest: {
        bg: "#E1F7F1",
        blob1: "var(--ph-mint)",
        blob2: "var(--ph-primary)",
        eyebrowColor: "var(--ph-accent-dark)",
    },
    occasion: {
        bg: "#FFE7E3",
        blob1: "var(--ph-coral)",
        blob2: "var(--ph-primary)",
        eyebrowColor: "var(--ph-coral)",
    },
    age: {
        bg: "var(--ph-accent-soft)",
        blob1: "var(--ph-accent)",
        blob2: "var(--ph-primary)",
        eyebrowColor: "var(--ph-accent-dark)",
    },
    search: {
        bg: "var(--ph-accent-soft)",
        blob1: "var(--ph-accent)",
        blob2: "var(--ph-coral)",
        eyebrowColor: "var(--ph-accent-dark)",
    },
    default: {
        bg: "var(--ph-primary-soft)",
        blob1: "var(--ph-primary)",
        blob2: "var(--ph-accent)",
        eyebrowColor: "var(--ph-primary-dark)",
    },
};

const TAGLINES = {
    brand: "Handpicked favorites from this brand",
    category: "Everything little hands will love",
    combo: "More fun, better value, all in one",
    interest: "Toys made for what they love most",
    occasion: "The perfect pick for the moment",
    age: "Just right for this stage of play",
    search: "Here's what we found for you",
    default: "Discover toys made for little adventures",
};

const SORT_OPTIONS = [
    { value: "default", label: "Default" },
    { value: "price_asc", label: "Price: Low to High" },
    { value: "price_desc", label: "Price: High to Low" },
    { value: "newest", label: "Newest First" },
];

const getFilterType = ({ brand, category, combo, interest, occasion, minAge, search }) => {
    if (brand) return "brand";
    if (category) return "category";
    if (combo) return "combo";
    if (interest) return "interest";
    if (occasion) return "occasion";
    if (minAge !== undefined && minAge !== null) return "age";
    if (search) return "search";
    return null;
};

const getFilterDisplayValue = ({
    filterType,
    brand,
    category,
    combo,
    interest,
    occasion,
    minAge,
    maxAge,
    search,
}) => {
    switch (filterType) {
        case "brand":
            return decodeURIComponent(brand);
        case "category":
            return decodeURIComponent(category);
        case "combo":
            return decodeURIComponent(combo);
        case "interest":
            return decodeURIComponent(interest);
        case "occasion":
            return decodeURIComponent(occasion);
        case "age":
            return maxAge
                ? `Age ${minAge} – ${maxAge} years`
                : `Age ${minAge}+ years`;
        case "search":
            return `"${decodeURIComponent(search)}"`;
        default:
            return "All Products";
    }
};

const ProductPageHeader = ({
    brand,
    category,
    combo,
    interest,
    occasion,
    minAge,
    maxAge,
    search,
    productCount = 0,
    activeFilterCount = 0,
    isFiltersOpen: controlledIsOpen,
    onToggleFilters,
}) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const sortWrapRef = useRef(null);

    const [localIsOpen, setLocalIsOpen] = useState(false);
    const [isSortOpen, setIsSortOpen] = useState(false);

    const isFiltersOpen =
        controlledIsOpen !== undefined ? controlledIsOpen : localIsOpen;

    const filterType = useMemo(
        () => getFilterType({ brand, category, combo, interest, occasion, minAge, search }),
        [brand, category, combo, interest, occasion, minAge, search]
    );

    const filterValue = useMemo(
        () =>
            filterType
                ? getFilterDisplayValue({
                    filterType,
                    brand,
                    category,
                    combo,
                    interest,
                    occasion,
                    minAge,
                    maxAge,
                    search,
                })
                : "All Products",
        [filterType, brand, category, combo, interest, occasion, minAge, maxAge, search]
    );

    const meta = FILTER_META[filterType] || { label: "All Products", eyebrow: "Browse Everything" };
    const theme = THEME_BY_TYPE[filterType] || THEME_BY_TYPE.default;
    const tagline = TAGLINES[filterType] || TAGLINES.default;

    const currentSort = searchParams.get("sort") || "default";
    const currentSortLabel =
        SORT_OPTIONS.find((opt) => opt.value === currentSort)?.label || "Default";

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (
                sortWrapRef.current &&
                !sortWrapRef.current.contains(event.target)
            ) {
                setIsSortOpen(false);
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, []);

    const handleSortChange = (value) => {
        const newParams = new URLSearchParams(searchParams.toString());

        if (value === "default") {
            newParams.delete("sort");
        } else {
            newParams.set("sort", value);
        }

        router.push(`${pathname}?${newParams.toString()}`);
        setIsSortOpen(false);
    };

    const handleToggleFilters = () => {
        if (onToggleFilters) {
            onToggleFilters(!isFiltersOpen);
        } else {
            setLocalIsOpen((prev) => !prev);
        }
    };

    return (
        <div>
            {/* ---------------- Banner (with breadcrumb inside) ---------------- */}
            <section
                className="relative isolate overflow-hidden"
                style={{ backgroundColor: theme.bg }}
            >
                {/* Decorative floating blobs — subtle, secondary-banner scale */}
                <motion.div
                    animate={{ y: [0, -10, 0], scale: [1, 1.05, 1] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="pointer-events-none absolute -right-10 -top-14 h-32 w-32 rounded-full blur-2xl sm:h-44 sm:w-44"
                    style={{ backgroundColor: theme.blob1, opacity: 0.35 }}
                />

                <motion.div
                    animate={{ y: [0, 10, 0], x: [0, 6, 0] }}
                    transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                    className="pointer-events-none absolute -left-8 bottom-[-40px] h-28 w-28 rounded-full blur-2xl sm:h-36 sm:w-36"
                    style={{ backgroundColor: theme.blob2, opacity: 0.2 }}
                />

                <motion.div
                    animate={{ y: [0, -6, 0], rotate: [0, 10, 0] }}
                    transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                    className="pointer-events-none absolute right-[14%] top-6 hidden text-xl sm:block"
                    style={{ color: theme.blob1, opacity: 0.6 }}
                >
                    ✦
                </motion.div>

                <div className="relative z-10 w-11/12 max-w-[1400px] mx-auto py-6 sm:py-9 lg:py-11">

                    {/* Breadcrumb */}
                    <nav
                        aria-label="Breadcrumb"
                        className="flex items-center gap-1.5 text-[11px] sm:text-xs mb-3 sm:mb-4"
                        style={{ fontFamily: "var(--font-body)" }}
                    >
                        <Link
                            href="/"
                            className="font-medium text-[#1E2B2B]/55 hover:text-[#1E2B2B] transition-colors"
                        >
                            Home
                        </Link>
                        <FiChevronRight className="text-[#1E2B2B]/40 text-[10px]" />
                        <Link
                            href="/product"
                            className="font-medium text-[#1E2B2B]/55 hover:text-[#1E2B2B] transition-colors"
                        >
                            Products
                        </Link>
                        {filterType && (
                            <>
                                <FiChevronRight className="text-[#1E2B2B]/40 text-[10px]" />
                                <span className="font-semibold text-[#1E2B2B] truncate max-w-[140px] sm:max-w-none">
                                    {filterValue}
                                </span>
                            </>
                        )}
                    </nav>

                    {/* Eyebrow */}
                    <motion.p
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="text-[10px] sm:text-xs font-semibold tracking-[0.16em] uppercase mb-1.5"
                        style={{ fontFamily: "var(--font-body)", color: theme.eyebrowColor }}
                    >
                        {meta.eyebrow}
                    </motion.p>

                    {/* Title */}
                    <motion.h1
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.45, delay: 0.05 }}
                        className="text-2xl sm:text-3xl md:text-[2.6rem] font-semibold text-[#1E2B2B] leading-tight tracking-tight"
                        style={{ fontFamily: "var(--font-display)" }}
                    >
                        {filterValue}
                    </motion.h1>

                    {/* Tagline */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4, delay: 0.15 }}
                        className="mt-1.5 text-xs sm:text-sm font-medium text-[#1E2B2B]/65 max-w-md"
                        style={{ fontFamily: "var(--font-body)" }}
                    >
                        {tagline} ✨
                    </motion.p>
                </div>
            </section>

            {/* ---------------- Toolbar ---------------- */}
            <div className="sticky top-0 z-30 border-b border-[var(--ph-border)] bg-[var(--ph-surface)]/95 backdrop-blur-sm">
                <div className="w-11/12 max-w-[1400px] mx-auto py-3 sm:py-3.5 flex items-center justify-between gap-3">

                    {/* Left: Menu/Filter icon + count badge + product count text */}
                    <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
                        <motion.button
                            whileHover={{ scale: 1.06 }}
                            whileTap={{ scale: 0.94 }}
                            type="button"
                            onClick={handleToggleFilters}
                            aria-pressed={isFiltersOpen}
                            aria-label="Toggle filters"
                            className={`
                                relative flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center
                                rounded-full border transition-colors duration-200
                                ${isFiltersOpen
                                    ? "bg-[var(--ph-primary)] border-[var(--ph-primary)] text-[#1E2B2B]"
                                    : "bg-[var(--ph-surface)] border-[var(--ph-border)] text-[var(--ph-text)] hover:bg-[var(--ph-primary-soft)]"
                                }
                            `}
                        >
                            <FiMenu className="text-lg sm:text-xl" />

                            {activeFilterCount > 0 && (
                                <span
                                    className="absolute -top-1 -right-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-1 text-[10px] font-extrabold text-white shadow-sm"
                                    style={{ backgroundColor: "var(--ph-coral)" }}
                                >
                                    {activeFilterCount}
                                </span>
                            )}
                        </motion.button>

                        <p
                            className="text-xs sm:text-sm font-semibold text-[var(--ph-text-soft)] truncate"
                            style={{ fontFamily: "var(--font-body)" }}
                        >
                            <span className="text-[var(--ph-text)] font-bold">
                                {productCount}
                            </span>{" "}
                            {productCount === 1 ? "product" : "products"} found
                        </p>
                    </div>

                    {/* Right: Sort dropdown — custom built with framer-motion + outside-click */}
                    <div ref={sortWrapRef} className="relative shrink-0">
                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            type="button"
                            onClick={() => setIsSortOpen((prev) => !prev)}
                            className="
                                flex items-center gap-2 rounded-full
                                border border-[var(--ph-border)]
                                bg-[var(--ph-surface)]
                                pl-4 pr-3 py-2 sm:py-2.5
                                text-xs sm:text-sm font-semibold
                                text-[var(--ph-text)]
                                shadow-sm
                                transition-colors duration-200
                                hover:border-[var(--ph-primary)]/50
                            "
                            style={{ fontFamily: "var(--font-body)" }}
                            aria-haspopup="listbox"
                            aria-expanded={isSortOpen}
                        >
                            <span className="hidden sm:inline text-[var(--ph-text-faint)] font-medium">
                                Sort:
                            </span>
                            <span className="max-w-[110px] sm:max-w-none truncate">
                                {currentSortLabel}
                            </span>
                            <FiChevronDown
                                className={`text-sm text-[var(--ph-text-faint)] transition-transform duration-200 ${isSortOpen ? "rotate-180" : ""
                                    }`}
                            />
                        </motion.button>

                        <AnimatePresence>
                            {isSortOpen && (
                                <motion.ul
                                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 6, scale: 0.98 }}
                                    transition={{ duration: 0.18, ease: "easeOut" }}
                                    role="listbox"
                                    className="
                                        absolute right-0 z-40 mt-2 w-52
                                        overflow-hidden rounded-2xl
                                        border border-[var(--ph-border)]
                                        bg-[var(--ph-surface)]
                                        py-1.5 shadow-[0_20px_50px_rgba(15,23,42,0.14)]
                                    "
                                >
                                    {SORT_OPTIONS.map((option) => {
                                        const isSelected = option.value === currentSort;

                                        return (
                                            <li key={option.value} role="option" aria-selected={isSelected}>
                                                <button
                                                    type="button"
                                                    onClick={() => handleSortChange(option.value)}
                                                    className="
                                                        w-full flex items-center justify-between
                                                        px-4 py-2.5 text-xs sm:text-sm font-medium
                                                        text-left transition-colors duration-150
                                                        hover:bg-[var(--ph-primary-soft)]
                                                    "
                                                    style={{ fontFamily: "var(--font-body)" }}
                                                >
                                                    <span
                                                        className={
                                                            isSelected
                                                                ? "font-bold text-[var(--ph-text)]"
                                                                : "text-[var(--ph-text-soft)]"
                                                        }
                                                    >
                                                        {option.label}
                                                    </span>
                                                    {isSelected && (
                                                        <FiCheck
                                                            className="text-sm"
                                                            style={{ color: "var(--ph-accent)" }}
                                                        />
                                                    )}
                                                </button>
                                            </li>
                                        );
                                    })}
                                </motion.ul>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Next component (Sidebar/Drawer + Product Grid) will be imported and rendered below this in page.js */}
        </div>
    );
};

export default ProductPageHeader;