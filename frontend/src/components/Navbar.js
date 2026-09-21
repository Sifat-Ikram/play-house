"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
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
    IoSparklesOutline,
} from "react-icons/io5";

import logo from "@/assets/image-removebg-preview_6.webp";
import useCategory from "@/hooks/useCategory";
import useBrand from "@/hooks/useBrand";
import useCombo from "@/hooks/useCombo";

const PLACEHOLDER =
    "https://i.ibb.co.com/rKyYKgDT/multimedia-communication-image-placeholder-photography-landscape-image-comics-picture-photo-gallery.webp";

const dropdownVariants = {
    hidden: { opacity: 0, y: 10, scale: 0.97 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.2, ease: "easeOut" } },
    exit: { opacity: 0, y: 6, scale: 0.98, transition: { duration: 0.15, ease: "easeIn" } },
};

const mobileVariants = {
    hidden: { opacity: 0, x: -15 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.22, ease: "easeOut" } },
    exit: { opacity: 0, x: -15, transition: { duration: 0.18, ease: "easeIn" } },
};

const itemVariants = {
    hidden: { opacity: 0, y: 5 },
    visible: (index) => ({
        opacity: 1,
        y: 0,
        transition: { delay: index * 0.025, duration: 0.18 },
    }),
};

const DRILL_TITLES = {
    category: "Categories",
    brand: "Brands",
    combo: "Combo Offers",
};

function LoadingSpinner() {
    return (
        <div className="col-span-full flex items-center justify-center py-8">
            <div
                className="h-6 w-6 animate-spin rounded-full border-2"
                style={{ borderColor: "var(--ph-border)", borderTopColor: "var(--ph-primary)" }}
            />
        </div>
    );
}

function EmptyState({ label }) {
    return (
        <li
            className="col-span-full py-8 text-center text-sm"
            style={{ color: "var(--ph-text-faint)" }}
        >
            {label}
        </li>
    );
}

const Navbar = ({ handleShowDrawer, cartCount = 0, user = null }) => {
    const router = useRouter();
    const pathname = usePathname();

    const searchWrapRef = useRef(null);
    const searchInputRef = useRef(null);
    const mobileSearchRef = useRef(null);

    const { categories, isLoading: categoriesLoading } = useCategory();
    const { brands, isLoading: brandsLoading } = useBrand();
    const { combos, isLoading: combosLoading } = useCombo();

    const activeCombos = useMemo(
        () => combos?.filter((combo) => combo.is_active) || [],
        [combos]
    );

    const [searchQuery, setSearchQuery] = useState("");
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [mobileDrill, setMobileDrill] = useState(null);

    const isActive = (href) => pathname === href;

    const closeEverything = () => {
        setIsMobileMenuOpen(false);
        setMobileDrill(null);
        setOpenDropdown(null);
    };

    const handleSearchSubmit = (e) => {
        e?.preventDefault();
        const query = searchQuery.trim();
        if (!query) return;
        router.push(`/searchResult/${encodeURIComponent(query.toLowerCase())}`);
        setSearchQuery("");
        setIsSearchOpen(false);
    };

    const toggleSearch = () => {
        setIsSearchOpen((prev) => !prev);
        setOpenDropdown(null);
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen((prev) => {
            if (prev) setMobileDrill(null);
            return !prev;
        });
        setOpenDropdown(null);
    };

    const handleLinkClick = () => {
        closeEverything();
        setIsSearchOpen(false);
        setSearchQuery("");
    };

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (searchWrapRef.current && !searchWrapRef.current.contains(event.target)) {
                setIsSearchOpen(false);
                setSearchQuery("");
            }
        };

        const handleEscape = (event) => {
            if (event.key === "Escape") {
                setIsSearchOpen(false);
                setSearchQuery("");
                setOpenDropdown(null);
                setIsMobileMenuOpen(false);
                setMobileDrill(null);
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);
        document.addEventListener("keydown", handleEscape);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
            document.removeEventListener("keydown", handleEscape);
        };
    }, []);

    useEffect(() => {
        if (isSearchOpen) {
            const timer = setTimeout(() => searchInputRef.current?.focus(), 100);
            return () => clearTimeout(timer);
        }
    }, [isSearchOpen]);

    useEffect(() => {
        setIsMobileMenuOpen(false);
        setMobileDrill(null);
        setOpenDropdown(null);
        setIsSearchOpen(false);
        setSearchQuery("");
    }, [pathname]);

    const desktopLinkClass = (href) =>
        `group relative flex items-center gap-1.5 whitespace-nowrap text-[13px] lg:text-sm xl:text-[15px] font-semibold tracking-[-0.01em] transition-colors duration-200 ${isActive(href) ? "" : ""
        }`;

    const desktopLinkStyle = (href) => ({
        color: isActive(href) ? "var(--ph-text)" : "var(--ph-text-soft)",
    });

    const mobileLinkClass = "flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm sm:text-base font-semibold transition-all duration-200";

    const mobileLinkStyle = (href) =>
        isActive(href)
            ? { backgroundColor: "var(--ph-primary-soft)", color: "var(--ph-primary)" }
            : { color: "var(--ph-text-soft)" };

    const renderDropdownItems = (type) => {
        if (type === "category") {
            if (categoriesLoading) return <LoadingSpinner />;
            if (!categories?.length) return <EmptyState label="No categories found" />;

            return categories.map((category, index) => (
                <motion.li key={category.category_id} custom={index} variants={itemVariants} initial="hidden" animate="visible">
                    <Link
                        href={`/categoryDetail/${category.category_id}`}
                        onClick={handleLinkClick}
                        className="group flex h-full flex-col items-center gap-2 rounded-2xl p-3 text-center transition-all duration-200 hover:-translate-y-1 hover:bg-[var(--ph-primary-soft)]"
                    >
                        <div
                            className="relative overflow-hidden rounded-full p-0.5 transition-all duration-300 group-hover:scale-105"
                            style={{ backgroundColor: "var(--ph-bg-soft)", boxShadow: `0 0 0 1px var(--ph-border)` }}
                        >
                            <Image
                                src={category?.category_image || PLACEHOLDER}
                                alt={category.category_name}
                                width={68}
                                height={68}
                                className="h-12 w-12 rounded-full object-cover sm:h-14 sm:w-14"
                            />
                        </div>
                        <span
                            className="line-clamp-2 max-w-[90px] text-[11px] font-semibold leading-tight sm:text-xs"
                            style={{ color: "var(--ph-text-soft)" }}
                        >
                            {category.category_name}
                        </span>
                    </Link>
                </motion.li>
            ));
        }

        if (type === "brand") {
            if (brandsLoading) return <LoadingSpinner />;
            if (!brands?.length) return <EmptyState label="No brands found" />;

            return brands.map((brand, index) => (
                <motion.li key={brand.brand_id} custom={index} variants={itemVariants} initial="hidden" animate="visible">
                    <Link
                        href={`/brandDetail/${brand.brand_id}`}
                        onClick={handleLinkClick}
                        className="group flex h-full flex-col items-center gap-2 rounded-2xl p-3 text-center transition-all duration-200 hover:-translate-y-1 hover:bg-[var(--ph-primary-soft)]"
                    >
                        <div
                            className="relative overflow-hidden rounded-full p-1 transition-all duration-300 group-hover:scale-105"
                            style={{ backgroundColor: "var(--ph-surface)", boxShadow: `0 0 0 1px var(--ph-border)` }}
                        >
                            <Image
                                src={brand?.brand_image || PLACEHOLDER}
                                alt={brand?.brand_name}
                                width={68}
                                height={68}
                                className="h-12 w-12 rounded-full object-cover sm:h-14 sm:w-14"
                            />
                        </div>
                        <span
                            className="line-clamp-2 max-w-[90px] text-[11px] font-semibold leading-tight sm:text-xs"
                            style={{ color: "var(--ph-text-soft)" }}
                        >
                            {brand.brand_name}
                        </span>
                    </Link>
                </motion.li>
            ));
        }

        if (type === "combo") {
            if (combosLoading) return <LoadingSpinner />;
            if (!activeCombos.length) return <EmptyState label="No combo offers found" />;

            return activeCombos.map((combo, index) => (
                <motion.li key={combo.combo_id} custom={index} variants={itemVariants} initial="hidden" animate="visible">
                    <Link
                        href={`/comboDetail/${combo.combo_id}`}
                        onClick={handleLinkClick}
                        className="group flex h-full flex-col items-center gap-2 rounded-2xl p-3 text-center transition-all duration-200 hover:-translate-y-1 hover:bg-[var(--ph-primary-soft)]"
                    >
                        <div
                            className="relative overflow-hidden rounded-2xl transition-all duration-300 group-hover:scale-105"
                            style={{ backgroundColor: "var(--ph-bg-soft)", boxShadow: `0 0 0 1px var(--ph-border)` }}
                        >
                            <Image
                                src={combo?.banner_image || PLACEHOLDER}
                                alt={combo.title}
                                width={76}
                                height={64}
                                className="h-14 w-16 object-cover sm:h-16 sm:w-[72px]"
                            />
                        </div>
                        <span
                            className="line-clamp-2 max-w-[95px] text-[11px] font-semibold leading-tight sm:text-xs"
                            style={{ color: "var(--ph-text-soft)" }}
                        >
                            {combo.title}
                        </span>
                    </Link>
                </motion.li>
            ));
        }

        return null;
    };

    const DesktopDropdown = ({ type, align = "left" }) => {
        const isOpen = openDropdown === type;

        return (
            <AnimatePresence>
                {isOpen && (
                    <div
                        onMouseEnter={() => setOpenDropdown(type)}
                        onMouseLeave={() => setOpenDropdown(null)}
                        className={`absolute top-full z-[70] pt-3 ${align === "right"
                            ? "right-0"
                            : "left-1/2 -translate-x-1/2 lg:left-0 lg:translate-x-0"
                            }`}
                    >
                        <motion.div
                            variants={dropdownVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="w-[min(560px,calc(100vw-32px))] overflow-hidden rounded-[26px] p-3 backdrop-blur-xl"
                            style={{
                                backgroundColor: "var(--ph-surface)",
                                border: "1px solid var(--ph-border)",
                                boxShadow: "0 25px 70px -20px rgba(15,23,42,0.18)",
                            }}
                        >
                            <div className="mb-2 flex items-center justify-between px-3 pt-2">
                                <div>
                                    <p className="eyebrow" style={{ fontSize: "0.68rem" }}>
                                        Explore
                                    </p>
                                    <h3 className="h3" style={{ color: "var(--ph-text)" }}>
                                        {DRILL_TITLES[type]}
                                    </h3>
                                </div>
                                <IoSparklesOutline className="text-xl" style={{ color: "var(--ph-accent-dark)" }} />
                            </div>

                            <ul className="grid max-h-[420px] grid-cols-3 gap-1 overflow-y-auto p-1 sm:grid-cols-4 lg:grid-cols-5">
                                {renderDropdownItems(type)}
                            </ul>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        );
    };

    const navDropdownButton = (type, label) => (
        <li
            className="relative"
            onMouseEnter={() => setOpenDropdown(type)}
            onMouseLeave={() => setOpenDropdown(null)}
        >
            <button
                type="button"
                className={`${desktopLinkClass("")} rounded-full px-2.5 py-2 transition-colors hover:bg-[var(--ph-bg-soft)]`}
                style={desktopLinkStyle("")}
            >
                <span>{label}</span>
                <IoChevronDown
                    className={`text-[14px] transition-transform duration-200 ${openDropdown === type ? "rotate-180" : ""}`}
                />
            </button>

            <DesktopDropdown type={type} align={type === "combo" ? "right" : "left"} />
        </li>
    );

    const mobileMainList = (
        <motion.div variants={mobileVariants} initial="hidden" animate="visible" exit="exit" className="p-3">
            <div className="mb-2 px-3 pb-2">
                <p className="eyebrow">Play House</p>
                <p className="h3 mt-0.5" style={{ color: "var(--ph-text)" }}>
                    Explore the fun ✨
                </p>
            </div>

            <ul className="space-y-1">
                {[
                    ["category", "Categories"],
                    ["brand", "Brands"],
                    ["combo", "Combo Offers"],
                ].map(([type, label]) => (
                    <li key={type}>
                        <button
                            type="button"
                            onClick={() => setMobileDrill(type)}
                            className="flex w-full items-center justify-between rounded-2xl px-4 py-3.5 text-left text-sm font-bold transition-all duration-200 hover:bg-[var(--ph-primary-soft)]"
                            style={{ color: "var(--ph-text-soft)" }}
                        >
                            <span>{label}</span>
                            <IoChevronForward style={{ color: "var(--ph-text-faint)" }} />
                        </button>
                    </li>
                ))}

                <li>
                    <Link
                        href="/categoryDetail/36"
                        onClick={handleLinkClick}
                        className={mobileLinkClass}
                        style={mobileLinkStyle("/categoryDetail/36")}
                    >
                        Wholesale
                    </Link>
                </li>

                <li>
                    <Link href="/aboutUs" onClick={handleLinkClick} className={mobileLinkClass} style={mobileLinkStyle("/aboutUs")}>
                        About Us
                    </Link>
                </li>
            </ul>

            <div className="mt-3 rounded-2xl p-3" style={{ backgroundColor: "var(--ph-primary-soft)" }}>
                <p className="text-xs font-semibold" style={{ color: "var(--ph-primary)" }}>
                    Little toys. Big adventures. ✨
                </p>
            </div>
        </motion.div>
    );

    const mobileDrillPanel = (
        <motion.div key={mobileDrill} variants={mobileVariants} initial="hidden" animate="visible" exit="exit" className="w-full">
            <div className="flex items-center gap-2 px-3 py-3" style={{ borderBottom: "1px solid var(--ph-border)" }}>
                <button
                    type="button"
                    onClick={() => setMobileDrill(null)}
                    className="flex h-9 w-9 items-center justify-center rounded-full transition-all hover:bg-[var(--ph-bg-soft)]"
                    style={{ color: "var(--ph-text-soft)" }}
                    aria-label="Back to main menu"
                >
                    <IoChevronBack className="text-xl" />
                </button>

                <div>
                    <p className="eyebrow">Explore</p>
                    <span className="text-sm font-bold" style={{ color: "var(--ph-text)", fontFamily: "var(--font-display)" }}>
                        {DRILL_TITLES[mobileDrill]}
                    </span>
                </div>
            </div>

            <ul className="grid max-h-[60vh] grid-cols-3 gap-2 overflow-y-auto p-3">{renderDropdownItems(mobileDrill)}</ul>
        </motion.div>
    );

    return (
        <header
            className="sticky top-0 z-50 w-full backdrop-blur-xl"
            style={{
                backgroundColor: "color-mix(in srgb, var(--ph-bg) 92%, transparent)",
                borderBottom: "1px solid var(--ph-border)",
                boxShadow: "0 4px 24px -8px rgba(15,23,42,0.06)",
            }}
        >
            <div className="mx-auto flex min-h-[64px] w-full max-w-[1500px] items-center gap-2 px-3 sm:px-5 md:min-h-[72px] md:px-7 lg:px-10 xl:px-12">

                {/* Mobile menu */}
                <div className="relative md:hidden">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.92 }}
                        type="button"
                        onClick={toggleMobileMenu}
                        className="flex h-10 w-10 items-center justify-center rounded-full transition-colors"
                        style={{ color: "var(--ph-text)" }}
                        aria-label="Toggle navigation menu"
                        aria-expanded={isMobileMenuOpen}
                    >
                        {isMobileMenuOpen ? <IoClose className="text-[25px]" /> : <IoMenu className="text-[25px]" />}
                    </motion.button>

                    <AnimatePresence mode="wait">
                        {isMobileMenuOpen && (
                            <motion.div
                                key={mobileDrill || "main"}
                                variants={mobileVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="absolute left-0 top-[calc(100%+12px)] z-[80] w-[calc(100vw-24px)] max-w-[390px] overflow-hidden rounded-[26px] backdrop-blur-xl sm:w-[370px]"
                                style={{
                                    backgroundColor: "var(--ph-surface)",
                                    border: "1px solid var(--ph-border)",
                                    boxShadow: "0 25px 70px -20px rgba(15,23,42,0.2)",
                                }}
                            >
                                <AnimatePresence mode="wait">
                                    {mobileDrill ? mobileDrillPanel : mobileMainList}
                                </AnimatePresence>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Logo */}
                <Link href="/" onClick={handleLinkClick} className="group flex shrink-0 items-center rounded-xl transition-transform duration-200 hover:scale-[1.03]">
                    <Image
                        src={logo}
                        alt="Play House Logo"
                        width={110}
                        height={80}
                        priority
                        className="h-[46px] w-auto object-contain sm:h-[52px] md:h-[56px] lg:h-[60px] xl:h-[64px]"
                    />
                </Link>

                {/* Desktop navigation */}
                <nav className="hidden flex-1 justify-center md:flex">
                    <ul className="flex items-center gap-1 lg:gap-2 xl:gap-3">
                        {navDropdownButton("category", "Categories")}
                        {navDropdownButton("brand", "Brands")}
                        {navDropdownButton("combo", "Combo Offers")}

                        <li>
                            <Link href="/categoryDetail/36" className={desktopLinkClass("/categoryDetail/36")} style={desktopLinkStyle("/categoryDetail/36")}>
                                <span
                                    className="rounded-full px-2.5 py-2 transition-colors"
                                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--ph-bg-soft)")}
                                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                                >
                                    Wholesale
                                </span>
                            </Link>
                        </li>

                        <li>
                            <Link href="/aboutUs" className={desktopLinkClass("/aboutUs")} style={desktopLinkStyle("/aboutUs")}>
                                <span
                                    className="rounded-full px-2.5 py-2 transition-colors"
                                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--ph-bg-soft)")}
                                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                                >
                                    About Us
                                </span>
                            </Link>
                        </li>
                    </ul>
                </nav>

                {/* Right controls */}
                <div ref={searchWrapRef} className="ml-auto flex shrink-0 items-center gap-0.5 sm:gap-0.5 md:gap-0.5 lg:gap-3">

                    {/* Desktop/tablet search */}
                    <div className="hidden md:block">
                        <AnimatePresence initial={false}>
                            {isSearchOpen && (
                                <motion.form
                                    onSubmit={handleSearchSubmit}
                                    initial={{ width: 0, opacity: 0 }}
                                    animate={{ width: "clamp(180px, 20vw, 290px)", opacity: 1 }}
                                    exit={{ width: 0, opacity: 0 }}
                                    transition={{ duration: 0.25, ease: "easeOut" }}
                                    className="overflow-hidden"
                                >
                                    <div className="relative">
                                        <input
                                            ref={searchInputRef}
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Search toys..."
                                            className="w-full rounded-full px-4 py-2.5 pr-10 text-sm font-semibold outline-none transition-all focus:ring-4"
                                            style={{
                                                border: "1px solid var(--ph-border)",
                                                backgroundColor: "var(--ph-bg-soft)",
                                                color: "var(--ph-text)",
                                            }}
                                        />
                                        <button
                                            type="submit"
                                            aria-label="Submit search"
                                            className="absolute right-1.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full transition-colors"
                                            style={{ color: "var(--ph-text-soft)" }}
                                        >
                                            <IoSearchOutline className="text-lg" />
                                        </button>
                                    </div>
                                </motion.form>
                            )}
                        </AnimatePresence>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={toggleSearch}
                        className="flex h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9 items-center justify-center rounded-full transition-colors"
                        style={{ color: "var(--ph-text)" }}
                        aria-label={isSearchOpen ? "Close search" : "Search"}
                    >
                        {isSearchOpen ? <IoClose className="text-[16px] sm:text-[18px] md:text-[20px]" /> : <IoSearchOutline className="text-[16px] sm:text-[18px] md:text-[20px]" />}
                    </motion.button>

                    {/* Cart */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={handleShowDrawer}
                        className="relative flex h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9 items-center justify-center rounded-full transition-colors"
                        style={{ color: "var(--ph-text)" }}
                        aria-label="Open cart"
                    >
                        <IoCartOutline className="text-[17px] sm:text-[19px] md:text-[21px]" />
                        <AnimatePresence>
                            {cartCount > 0 && (
                                <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    exit={{ scale: 0 }}
                                    className="absolute -right-0.5 -top-0.5 flex h-[14px] min-w-[14px] sm:h-[16px] sm:min-w-[16px] items-center justify-center rounded-full px-1 text-[7.5px] sm:text-[8.5px] font-extrabold"
                                    style={{ backgroundColor: "var(--ph-coral)", color: "#fff", boxShadow: "0 0 0 1.5px var(--ph-bg)" }}
                                >
                                    {cartCount > 99 ? "99+" : cartCount}
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </motion.button>

                    {/* Login / Account */}
                    {user ? (
                        <Link
                            href="/account"
                            onClick={handleLinkClick}
                            className="flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[11px] sm:px-2 sm:py-1 sm:text-xs md:text-sm font-semibold transition-colors shrink-0"
                            style={{ color: "var(--ph-text)" }}
                        >
                            <IoPersonCircleOutline className="text-[16px] sm:text-[18px] md:text-[20px]" />
                            <span className="max-w-[60px] sm:max-w-[80px] truncate">{user.name || "Account"}</span>
                        </Link>
                    ) : (
                        <Link
                            href="/logIn"
                            onClick={handleLinkClick}
                            className="px-2 py-0.5 text-[11px] font-medium sm:px-2.5 sm:py-1 sm:text-xs md:px-3 md:py-1.5 md:text-sm shrink-0"
                        >
                            Login
                        </Link>
                    )}
                </div>
            </div>

            {/* Mobile search */}
            <AnimatePresence>
                {isSearchOpen && (
                    <motion.div
                        ref={mobileSearchRef}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.22 }}
                        className="overflow-hidden md:hidden"
                        style={{ borderTop: "1px solid var(--ph-border)" }}
                    >
                        <form onSubmit={handleSearchSubmit} className="mx-auto w-full max-w-2xl px-4 pb-4 pt-3 sm:px-6">
                            <div className="relative">
                                <input
                                    autoFocus
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search for toys, brands, gifts..."
                                    className="w-full rounded-full px-5 py-3 pr-12 text-sm font-semibold outline-none focus:ring-4"
                                    style={{
                                        border: "1px solid var(--ph-border)",
                                        backgroundColor: "var(--ph-surface)",
                                        color: "var(--ph-text)",
                                    }}
                                />
                                <button
                                    type="submit"
                                    aria-label="Submit search"
                                    className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full transition-transform hover:scale-105"
                                    style={{ backgroundColor: "var(--ph-primary)", color: "#fff" }}
                                >
                                    <IoSearchOutline className="text-xl" />
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