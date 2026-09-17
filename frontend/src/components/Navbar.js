"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
    IoCartOutline,
    IoSearchOutline,
    IoMenu,
    IoClose,
    IoChevronDown,
    IoChevronForward,
    IoChevronBack,
    IoPersonCircleOutline,
} from "react-icons/io5";

import logo from "@/assets/image-removebg-preview_6.webp";
import useCategory from "@/hooks/useCategory";
import useBrand from "@/hooks/useBrand";
import useCombo from "@/hooks/useCombo";
import Image from "next/image";

const dropdownVariants = {
    hidden: { opacity: 0, y: -8, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.2, ease: "easeOut" } },
    exit: { opacity: 0, y: -6, scale: 0.98, transition: { duration: 0.15, ease: "easeIn" } },
};

const mobileMenuVariants = {
    hidden: { opacity: 0, x: -15 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.25, ease: "easeOut" } },
    exit: { opacity: 0, x: -15, transition: { duration: 0.2, ease: "easeIn" } },
};

const iconMotion = {
    whileHover: { scale: 1.1 },
    whileTap: { scale: 0.92 },
    transition: { duration: 0.2 },
};

function LoadingSpinner({ size = "h-6 w-6" }) {
    return (
        <div className="flex items-center justify-center py-4">
            <div className={`${size} animate-spin rounded-full border-2 border-gray-300 border-t-gray-800`} />
        </div>
    );
}

function EmptyState({ label = "No items found" }) {
    return (
        <li className="col-span-full py-6 text-center font-poppins text-xs text-gray-400">
            {label}
        </li>
    );
}

const DRILL_TITLES = {
    category: "Categories",
    brand: "Brands",
    combo: "Combo Offers",
};

const Navbar = ({ handleShowDrawer, cartCount = 0, user = null }) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchWrapRef = useRef(null);
    const searchInputRef = useRef(null);

    const { categories, isLoading: categoriesLoading } = useCategory();
    const { brands, isLoading: brandsLoading } = useBrand();
    const { combos, isLoading: combosLoading } = useCombo();

    const activeCombos = useMemo(
        () => combos?.filter((combo) => combo.is_active) || [],
        [combos]
    );

    const [searchQuery, setSearchQuery] = useState("");
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(null); // desktop hover: 'category' | 'brand' | 'combo' | null
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [mobileDrill, setMobileDrill] = useState(null); // mobile drill-down: 'category' | 'brand' | 'combo' | null

    const isActive = (href) => pathname === href;

    // ---- Search ----
    const handleSearchSubmit = (e) => {
        if (e) e.preventDefault();
        const query = searchQuery.trim();
        if (!query) return;
        router.push(`/searchResult/${query.toLowerCase()}`);
        setSearchQuery("");
        setIsSearchOpen(false);
    };

    const handleSearchToggle = () => {
        setIsSearchOpen((prev) => !prev);
        setOpenDropdown(null);
    };

    // Close search on outside click / Escape
    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (searchWrapRef.current && !searchWrapRef.current.contains(e.target)) {
                setIsSearchOpen(false);
                setSearchQuery("");
            }
        };
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                setIsSearchOpen(false);
                setSearchQuery("");
            }
        };
        if (isSearchOpen) {
            document.addEventListener("mousedown", handleOutsideClick);
            document.addEventListener("keydown", handleKeyDown);
        }
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isSearchOpen]);

    // Focus input whenever search opens
    useEffect(() => {
        if (isSearchOpen) searchInputRef.current?.focus();
    }, [isSearchOpen]);

    // Close mobile menu (and reset its drill state) when clicking outside
    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (!e.target.closest("#mobile-menu")) {
                setIsMobileMenuOpen(false);
                setMobileDrill(null);
            }
        };
        if (isMobileMenuOpen) document.addEventListener("mousedown", handleOutsideClick);
        return () => document.removeEventListener("mousedown", handleOutsideClick);
    }, [isMobileMenuOpen]);

    const handleLinkClick = () => {
        setIsMobileMenuOpen(false);
        setMobileDrill(null);
        setOpenDropdown(null);
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen((prev) => {
            if (prev) setMobileDrill(null); // reset when closing
            return !prev;
        });
    };

    // Desktop: hover opens/closes (only one at a time)
    const openDesktopDropdown = (name) => setOpenDropdown(name);
    const closeDesktopDropdown = () => setOpenDropdown(null);

    const plainLinkClass = (href) =>
        `whitespace-nowrap font-poppins text-sm font-medium transition-colors duration-200 hover:text-gray-700 lg:text-base ${isActive(href) ? "text-gray-900 font-semibold underline underline-offset-4" : ""
        }`;

    const mobileLinkClass = (href) =>
        `block rounded-lg px-3 py-2 font-poppins text-sm font-medium uppercase transition-colors duration-200 hover:bg-gray-50 sm:text-base ${isActive(href) ? "bg-gray-100 font-semibold" : ""
        }`;

    // --------------------------------------------------
    // Desktop navigation
    // --------------------------------------------------

    const navLinks = (
        <>
            {/* Categories */}
            <li
                className="relative"
                onMouseEnter={() => openDesktopDropdown("category")}
                onMouseLeave={closeDesktopDropdown}
            >
                <button
                    type="button"
                    className="flex items-center gap-1 whitespace-nowrap font-poppins text-sm font-medium transition-colors duration-200 hover:text-gray-700 lg:text-base"
                >
                    Categories
                    <IoChevronDown
                        className={`text-sm transition-transform duration-200 ${openDropdown === "category" ? "rotate-180" : ""
                            }`}
                    />
                </button>

                <AnimatePresence>
                    {openDropdown === "category" && (
                        <motion.ul
                            variants={dropdownVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="absolute left-0 top-full z-50 grid max-h-[420px] w-max max-w-[92vw] grid-cols-4 gap-2 overflow-y-auto rounded-xl bg-white p-3 shadow-xl md:gap-3 md:p-4 lg:grid-cols-5 lg:gap-4 lg:p-5"
                        >
                            {categoriesLoading ? (
                                <LoadingSpinner />
                            ) : categories?.length ? (
                                categories.map((category) => (
                                    <li
                                        key={category.category_id}
                                        className="rounded-lg transition-all duration-200 hover:bg-gray-50 hover:shadow-sm"
                                    >
                                        <Link
                                            href={`/categoryDetail/${category.category_id}`}
                                            onClick={handleLinkClick}
                                            className="flex flex-col items-center gap-1.5 p-2 text-center md:gap-2 md:p-2.5 lg:p-3"
                                        >
                                            <Image
                                                src={
                                                    category?.category_image ||
                                                    "https://i.ibb.co.com/rKyYKgDT/multimedia-communication-image-placeholder-photography-landscape-image-comics-picture-photo-gallery.webp"
                                                }
                                                alt={category.category_name}
                                                width={64}
                                                height={64}
                                                className="h-12 w-12 rounded-full bg-gray-100 object-cover md:h-14 md:w-14 lg:h-16 lg:w-16"
                                            />
                                            <span className="line-clamp-2 w-14 text-center font-poppins text-xs font-medium text-gray-800 md:w-16 lg:w-20 lg:text-sm">
                                                {category.category_name}
                                            </span>
                                        </Link>
                                    </li>
                                ))
                            ) : (
                                <EmptyState label="No categories found" />
                            )}
                        </motion.ul>
                    )}
                </AnimatePresence>
            </li>

            {/* Brands */}
            <li
                className="relative"
                onMouseEnter={() => openDesktopDropdown("brand")}
                onMouseLeave={closeDesktopDropdown}
            >
                <button
                    type="button"
                    className="flex items-center gap-1 whitespace-nowrap font-poppins text-sm font-medium transition-colors duration-200 hover:text-gray-700 lg:text-base"
                >
                    Brands
                    <IoChevronDown
                        className={`text-sm transition-transform duration-200 ${openDropdown === "brand" ? "rotate-180" : ""
                            }`}
                    />
                </button>

                <AnimatePresence>
                    {openDropdown === "brand" && (
                        <motion.ul
                            variants={dropdownVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="absolute left-0 top-full z-50 grid max-h-[420px] w-max max-w-[92vw] grid-cols-4 gap-2 overflow-y-auto rounded-xl bg-white p-3 shadow-xl md:gap-3 md:p-4 lg:grid-cols-5 lg:gap-4 lg:p-5"
                        >
                            {brandsLoading ? (
                                <LoadingSpinner />
                            ) : brands?.length ? (
                                brands.map((brand) => (
                                    <li
                                        key={brand.brand_id}
                                        className="rounded-lg transition-all duration-200 hover:bg-gray-50 hover:shadow-sm"
                                    >
                                        <Link
                                            href={`/brandDetail/${brand.brand_id}`}
                                            onClick={handleLinkClick}
                                            className="flex flex-col items-center gap-1.5 p-2 text-center md:gap-2 md:p-2.5 lg:p-3"
                                        >
                                            <Image
                                                src={
                                                    brand?.brand_image ||
                                                    "https://i.ibb.co.com/rKyYKgDT/multimedia-communication-image-placeholder-photography-landscape-image-comics-picture-photo-gallery.webp"
                                                }
                                                alt={brand?.brand_name}
                                                width={64}
                                                height={64}
                                                className="h-12 w-12 rounded-full bg-gray-100 object-cover md:h-14 md:w-14 lg:h-16 lg:w-16"
                                            />
                                            <span className="line-clamp-2 w-14 text-center font-poppins text-xs font-medium text-gray-800 md:w-16 lg:w-20 lg:text-sm">
                                                {brand.brand_name}
                                            </span>
                                        </Link>
                                    </li>
                                ))
                            ) : (
                                <EmptyState label="No brands found" />
                            )}
                        </motion.ul>
                    )}
                </AnimatePresence>
            </li>

            {/* Combo Offers */}
            <li
                className="relative"
                onMouseEnter={() => openDesktopDropdown("combo")}
                onMouseLeave={closeDesktopDropdown}
            >
                <button
                    type="button"
                    className="flex items-center gap-1 whitespace-nowrap font-poppins text-sm font-medium transition-colors duration-200 hover:text-gray-700 lg:text-base"
                >
                    Combo Offers
                    <IoChevronDown
                        className={`text-sm transition-transform duration-200 ${openDropdown === "combo" ? "rotate-180" : ""
                            }`}
                    />
                </button>

                <AnimatePresence>
                    {openDropdown === "combo" && (
                        <motion.ul
                            variants={dropdownVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="absolute right-0 top-full z-50 grid max-h-[420px] w-max max-w-[92vw] grid-cols-4 gap-2 overflow-y-auto rounded-xl bg-white p-3 shadow-xl md:gap-3 md:p-4 lg:grid-cols-5 lg:gap-4 lg:p-5"
                        >
                            {combosLoading ? (
                                <LoadingSpinner />
                            ) : activeCombos.length ? (
                                activeCombos.map((combo) => (
                                    <li
                                        key={combo.combo_id}
                                        className="rounded-lg transition-all duration-200 hover:bg-gray-50 hover:shadow-sm"
                                    >
                                        <Link
                                            href={`/comboDetail/${combo.combo_id}`}
                                            onClick={handleLinkClick}
                                            className="flex flex-col items-center gap-1.5 p-2 text-center md:gap-2 md:p-2.5 lg:p-3"
                                        >
                                            <Image
                                                src={
                                                    combo?.banner_image ||
                                                    "https://i.ibb.co.com/rKyYKgDT/multimedia-communication-image-placeholder-photography-landscape-image-comics-picture-photo-gallery.webp"
                                                }
                                                alt={combo.title}
                                                width={64}
                                                height={64}
                                                className="h-12 w-12 rounded-full bg-gray-100 object-cover md:h-14 md:w-14 lg:h-16 lg:w-16"
                                            />
                                            <span className="line-clamp-2 w-14 text-center font-poppins text-xs font-medium text-gray-800 md:w-16 lg:w-20 lg:text-sm">
                                                {combo.title}
                                            </span>
                                        </Link>
                                    </li>
                                ))
                            ) : (
                                <EmptyState label="No combo offers found" />
                            )}
                        </motion.ul>
                    )}
                </AnimatePresence>
            </li>

            <li>
                <Link href="/categoryDetail/36" className={plainLinkClass("/categoryDetail/36")}>
                    Wholesale
                </Link>
            </li>

            <li>
                <Link href="/aboutUs" className={plainLinkClass("/aboutUs")}>
                    About Us
                </Link>
            </li>
        </>
    );

    // --------------------------------------------------
    // Mobile: drill-down grid content for each section
    // --------------------------------------------------

    const renderMobileGrid = (drillKey) => {
        if (drillKey === "category") {
            if (categoriesLoading) return <LoadingSpinner size="h-5 w-5" />;
            if (!categories?.length) return <EmptyState label="No categories found" />;
            return categories.map((category) => (
                <li key={category.category_id}>
                    <Link
                        href={`/categoryDetail/${category.category_id}`}
                        onClick={handleLinkClick}
                        className="flex flex-col items-center gap-0.5 rounded-full p-1 text-center transition-colors duration-200"
                    >
                        <Image
                            src={
                                category?.category_image ||
                                "https://i.ibb.co.com/rKyYKgDT/multimedia-communication-image-placeholder-photography-landscape-image-comics-picture-photo-gallery.webp"
                            }
                            alt={category.category_name}
                            width={40}
                            height={40}
                            className="h-8 w-8 rounded-full object-cover"
                        />
                        <span className="line-clamp-1 w-14 font-poppins text-[9px] font-medium text-gray-800">
                            {category.category_name}
                        </span>
                    </Link>
                </li>
            ));
        }

        if (drillKey === "brand") {
            if (brandsLoading) return <LoadingSpinner size="h-5 w-5" />;
            if (!brands?.length) return <EmptyState label="No brands found" />;
            return brands.map((brand) => (
                <li key={brand.brand_id}>
                    <Link
                        href={`/brandDetail/${brand.brand_id}`}
                        onClick={handleLinkClick}
                        className="flex flex-col items-center gap-0.5 rounded-full p-1 text-center transition-colors duration-200 hover:bg-gray-50"
                    >
                        <Image
                            src={
                                brand?.brand_image ||
                                "https://i.ibb.co.com/rKyYKgDT/multimedia-communication-image-placeholder-photography-landscape-image-comics-picture-photo-gallery.webp"
                            }
                            alt={brand?.brand_name}
                            width={40}
                            height={40}
                            className="h-8 w-8 rounded-full object-cover"
                        />
                        <span className="line-clamp-1 w-14 font-poppins text-[9px] font-medium text-gray-800">
                            {brand.brand_name}
                        </span>
                    </Link>
                </li>
            ));
        }

        if (drillKey === "combo") {
            if (combosLoading) return <LoadingSpinner size="h-5 w-5" />;
            if (!activeCombos.length) return <EmptyState label="No combo offers found" />;
            return activeCombos.map((combo) => (
                <li key={combo.combo_id}>
                    <Link
                        href={`/comboDetail/${combo.combo_id}`}
                        onClick={handleLinkClick}
                        className="flex flex-col items-center gap-0.5 rounded-full p-1 text-center transition-colors duration-200 hover:bg-gray-50"
                    >
                        <Image
                            src={
                                combo?.banner_image ||
                                "https://i.ibb.co.com/rKyYKgDT/multimedia-communication-image-placeholder-photography-landscape-image-comics-picture-photo-gallery.webp"
                            }
                            alt={combo.title}
                            width={40}
                            height={40}
                            className="h-8 w-8 rounded-full object-cover"
                        />
                        <span className="line-clamp-1 w-14 font-poppins text-[9px] font-medium text-gray-800">
                            {combo.title}
                        </span>
                    </Link>
                </li>
            ));
        }

        return null;
    };

    // Main mobile menu list (Categories / Brands / Combo trigger drill-down; Wholesale / About Us are plain links)
    const mobileMainList = (
        <ul className="flex flex-col gap-1 p-3">
            <li>
                <button
                    type="button"
                    onClick={() => setMobileDrill("category")}
                    className="flex w-full items-center justify-between rounded-lg px-3 py-2 font-poppins text-left text-sm font-medium uppercase transition-colors duration-200 hover:bg-gray-50 sm:text-base"
                >
                    Categories
                    <IoChevronForward className="text-gray-500" />
                </button>
            </li>

            <li>
                <button
                    type="button"
                    onClick={() => setMobileDrill("brand")}
                    className="flex w-full items-center justify-between rounded-lg px-3 py-2 font-poppins text-left text-sm font-medium uppercase transition-colors duration-200 hover:bg-gray-50 sm:text-base"
                >
                    Brands
                    <IoChevronForward className="text-gray-500" />
                </button>
            </li>

            <li>
                <button
                    type="button"
                    onClick={() => setMobileDrill("combo")}
                    className="flex w-full items-center justify-between rounded-lg px-3 py-2 font-poppins text-left text-sm font-medium uppercase transition-colors duration-200 hover:bg-gray-50 sm:text-base"
                >
                    Combo Offers
                    <IoChevronForward className="text-gray-500" />
                </button>
            </li>

            <li>
                <Link href="/categoryDetail/36" onClick={handleLinkClick} className={mobileLinkClass("/categoryDetail/36")}>
                    Wholesale
                </Link>
            </li>

            <li>
                <Link href="/aboutUs" onClick={handleLinkClick} className={mobileLinkClass("/aboutUs")}>
                    About Us
                </Link>
            </li>
        </ul>
    );

    const mobileDrillPanel = mobileDrill && (
        <motion.div
            key={mobileDrill}
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full"
        >
            {/* Back Header */}
            <div className="flex items-center gap-2 border-b border-gray-100 px-4 py-3">
                <button
                    type="button"
                    onClick={() => setMobileDrill(null)}
                    className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-gray-100"
                    aria-label="Back to main menu"
                >
                    <IoChevronBack className="text-xl text-gray-700" />
                </button>

                <span className="font-poppins text-sm font-semibold uppercase text-gray-800">
                    {DRILL_TITLES[mobileDrill]}
                </span>
            </div>

            {/* Items */}
            <ul className="grid max-h-[60vh] grid-cols-3 gap-2 overflow-y-auto p-3">
                {renderMobileGrid(mobileDrill)}
            </ul>
        </motion.div>
    );


    return (
        <header className="sticky top-0 z-40 w-full bg-[#FEF987] shadow-sm">
            <div className="mx-auto flex min-h-[64px] w-full max-w-[1440px] items-center justify-between gap-3 px-3 sm:px-5 md:min-h-[76px] md:px-8 lg:px-10">
                {/* Left: Mobile menu + Logo */}
                <div className="flex items-center gap-3 md:gap-5">
                    {/* Mobile menu */}
                    {/* Mobile menu */}
                    <div id="mobile-menu" className="relative md:hidden">
                        <motion.button
                            {...iconMotion}
                            type="button"
                            onClick={toggleMobileMenu}
                            className="flex h-10 w-10 items-center justify-center rounded-full transition-colors duration-200 hover:bg-black/5"
                            aria-label="Toggle navigation menu"
                        >
                            {isMobileMenuOpen ? <IoClose className="text-2xl" /> : <IoMenu className="text-2xl" />}
                        </motion.button>

                        <AnimatePresence mode="wait">
                            {isMobileMenuOpen &&
                                (<motion.div key={mobileDrill || "main-menu"} variants={mobileMenuVariants} initial="hidden" animate="visible" exit="exit" className="absolute left-0 top-full z-50 mt-3 w-[280px] max-w-[92vw] overflow-hidden rounded-xl bg-white shadow-xl sm:w-[360px]" >
                                    <AnimatePresence mode="wait"> {mobileDrill ? mobileDrillPanel : mobileMainList}
                                    </AnimatePresence>
                                </motion.div>
                                )
                            }
                        </AnimatePresence>
                    </div>

                    {/* Logo */}
                    <Link href="/" onClick={handleLinkClick} className="flex-shrink-0">
                        <Image
                            src={logo}
                            alt="Toy House Logo"
                            width={100}
                            height={80}
                            priority
                            className="h-[52px] w-auto object-contain sm:h-[60px] md:h-[68px] lg:h-[76px]"
                        />
                    </Link>
                </div>

                {/* Middle: main nav — shifts left when search opens, never vanishes (desktop/tablet only) */}
                <motion.nav
                    layout
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="hidden flex-1 justify-center overflow-visible md:flex lg:ml-8"
                >
                    <ul className="flex items-center gap-4 lg:gap-7">{navLinks}</ul>
                </motion.nav>

                {/* Right: search field (tablet/PC only) + search icon + cart + login */}
                <div ref={searchWrapRef} className="flex items-center gap-3 sm:gap-4 md:gap-5">
                    {/* Inline expanding search — ONLY on tablet and up */}
                    <div className="hidden md:block">
                        <AnimatePresence initial={false}>
                            {isSearchOpen && (
                                <motion.form
                                    key="search-field"
                                    onSubmit={handleSearchSubmit}
                                    initial={{ width: 0, opacity: 0 }}
                                    animate={{ width: "auto", opacity: 1 }}
                                    exit={{ width: 0, opacity: 0 }}
                                    transition={{ duration: 0.3, ease: "easeOut" }}
                                    className="overflow-hidden"
                                >
                                    <input
                                        ref={searchInputRef}
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search products..."
                                        className="w-52 rounded-full border border-gray-300 bg-white px-4 py-2 font-poppins text-sm outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-gray-500 focus:ring-2 focus:ring-black/5 md:w-60 lg:w-72"
                                    />
                                </motion.form>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Search toggle */}
                    <motion.button
                        {...iconMotion}
                        type="button"
                        onClick={handleSearchToggle}
                        className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full transition-colors duration-200 hover:bg-black/5"
                        aria-label={isSearchOpen ? "Close search" : "Search"}
                    >
                        {isSearchOpen ? (
                            <IoClose className="text-xl sm:text-[22px]" />
                        ) : (
                            <IoSearchOutline className="text-xl sm:text-[22px]" />
                        )}
                    </motion.button>

                    {/* Cart — unaffected by search open/close */}
                    <motion.button
                        {...iconMotion}
                        type="button"
                        onClick={handleShowDrawer}
                        className="relative flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full transition-colors duration-200 hover:bg-black/5"
                        aria-label="Open cart"
                    >
                        <IoCartOutline className="text-xl sm:text-[22px]" />
                        {cartCount > 0 && (
                            <span className="absolute -right-1 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
                                {cartCount > 99 ? "99+" : cartCount}
                            </span>
                        )}
                    </motion.button>

                    {/* Login / Account — unaffected by search open/close */}
                    {user ? (
                        <Link
                            href="/account"
                            className="flex flex-shrink-0 items-center gap-1.5 whitespace-nowrap font-poppins text-xs font-medium transition-colors duration-200 hover:text-gray-700 sm:text-sm lg:text-base"
                        >
                            <IoPersonCircleOutline className="text-xl" />
                            <span className="hidden sm:inline">{user.name || "Account"}</span>
                        </Link>
                    ) : (
                        <Link
                            href="/logIn"
                            className={`flex-shrink-0 whitespace-nowrap font-poppins text-xs font-medium transition-colors duration-200 hover:text-gray-700 sm:text-sm lg:text-base ${isActive("/logIn") ? "font-semibold text-gray-900 underline underline-offset-4" : ""
                                }`}
                        >
                            Login
                        </Link>
                    )}
                </div>
            </div>

            {/* Mobile search — slide-down under header, ONLY below md */}
            <AnimatePresence>
                {isSearchOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className="overflow-hidden md:hidden"
                    >
                        <form onSubmit={handleSearchSubmit} className="mx-auto w-full max-w-2xl px-4 pb-4 sm:px-6">
                            <div className="relative">
                                <input
                                    autoFocus
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search products..."
                                    className="w-full rounded-full border border-gray-300 bg-white px-5 py-3 pr-12 font-poppins text-sm outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-gray-500 focus:ring-2 focus:ring-black/5"
                                />
                                <button
                                    type="submit"
                                    className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full transition-colors duration-200 hover:bg-gray-100"
                                    aria-label="Submit search"
                                >
                                    <IoSearchOutline className="text-xl text-gray-700" />
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Navbar;