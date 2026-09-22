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
    hidden: {
        opacity: 0,
        y: 10,
        scale: 0.97,
    },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.2,
            ease: "easeOut",
        },
    },
    exit: {
        opacity: 0,
        y: 6,
        scale: 0.98,
        transition: {
            duration: 0.15,
            ease: "easeIn",
        },
    },
};

const mobileVariants = {
    hidden: {
        opacity: 0,
        x: -15,
    },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.22,
            ease: "easeOut",
        },
    },
    exit: {
        opacity: 0,
        x: -15,
        transition: {
            duration: 0.18,
            ease: "easeIn",
        },
    },
};

const itemVariants = {
    hidden: {
        opacity: 0,
        y: 5,
    },
    visible: (index) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: index * 0.025,
            duration: 0.18,
        },
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
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-[var(--ph-border)] border-t-[var(--ph-primary)]" />
        </div>
    );
}

function EmptyState({ label }) {
    return (
        <li className="col-span-full py-8 text-center text-sm text-[var(--ph-text-faint)]">
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
            if (prev) {
                setMobileDrill(null);
            }

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
            if (
                searchWrapRef.current &&
                !searchWrapRef.current.contains(event.target)
            ) {
                setIsSearchOpen(false);
                setSearchQuery("");
            }

            if (
                mobileSearchRef.current &&
                !mobileSearchRef.current.contains(event.target)
            ) {
                // Search closing is intentionally handled separately.
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
            const timer = setTimeout(() => {
                searchInputRef.current?.focus();
            }, 100);

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
        `
      group relative flex items-center gap-1.5
      whitespace-nowrap
      text-[13px] lg:text-sm xl:text-[15px]
      font-bold
      tracking-[-0.01em]
      transition-colors duration-200
      ${isActive(href)
            ? "text-[#1E2B2B]"
            : "text-[#1E2B2B]/80 hover:text-[#1E2B2B]"
        }
    `;

    const mobileLinkClass = (href) =>
        `
      flex w-full items-center justify-between
      rounded-2xl px-4 py-3
      text-sm sm:text-base
      font-semibold
      transition-all duration-200
      ${isActive(href)
            ? "bg-[var(--ph-primary-soft)] text-[var(--ph-text)]"
            : "text-[var(--ph-text-soft)] hover:bg-[var(--ph-primary-soft)]"
        }
    `;

    const renderDropdownItems = (type) => {
        if (type === "category") {
            if (categoriesLoading) return <LoadingSpinner />;

            if (!categories?.length) {
                return <EmptyState label="No categories found" />;
            }

            return categories.map((category, index) => (
                <motion.li
                    key={category.category_id}
                    custom={index}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <Link
                        href={`/categoryDetail/${category.category_id}`}
                        onClick={handleLinkClick}
                        className="
              group flex h-full flex-col items-center
              gap-2 rounded-2xl p-3
              text-center
              transition-all duration-200
              hover:-translate-y-1
              hover:bg-[var(--ph-primary-soft)]
              hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)]
            "
                    >
                        <div
                            className="
                relative overflow-hidden rounded-full
                bg-[var(--ph-primary-soft)] p-0.5
                ring-1 ring-[var(--ph-border)]
                transition-all duration-300
                group-hover:scale-105
                group-hover:ring-[var(--ph-primary)]/50
              "
                        >
                            <Image
                                src={category?.category_image || PLACEHOLDER}
                                alt={category.category_name}
                                width={68}
                                height={68}
                                className="h-12 w-12 rounded-full object-cover sm:h-14 sm:w-14"
                            />
                        </div>

                        <span className="line-clamp-2 max-w-[90px] text-[11px] font-semibold leading-tight text-[var(--ph-text-soft)] sm:text-xs">
                            {category.category_name}
                        </span>
                    </Link>
                </motion.li>
            ));
        }

        if (type === "brand") {
            if (brandsLoading) return <LoadingSpinner />;

            if (!brands?.length) {
                return <EmptyState label="No brands found" />;
            }

            return brands.map((brand, index) => (
                <motion.li
                    key={brand.brand_id}
                    custom={index}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <Link
                        href={`/brandDetail/${brand.brand_id}`}
                        onClick={handleLinkClick}
                        className="
              group flex h-full flex-col items-center
              gap-2 rounded-2xl p-3
              text-center
              transition-all duration-200
              hover:-translate-y-1
              hover:bg-[var(--ph-primary-soft)]
              hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)]
            "
                    >
                        <div
                            className="
                relative overflow-hidden rounded-full
                bg-[var(--ph-surface)] p-1
                ring-1 ring-[var(--ph-border)]
                transition-all duration-300
                group-hover:scale-105
                group-hover:ring-[var(--ph-primary)]/50
              "
                        >
                            <Image
                                src={brand?.brand_image || PLACEHOLDER}
                                alt={brand?.brand_name}
                                width={68}
                                height={68}
                                className="h-12 w-12 rounded-full object-cover sm:h-14 sm:w-14"
                            />
                        </div>

                        <span className="line-clamp-2 max-w-[90px] text-[11px] font-semibold leading-tight text-[var(--ph-text-soft)] sm:text-xs">
                            {brand.brand_name}
                        </span>
                    </Link>
                </motion.li>
            ));
        }

        if (type === "combo") {
            if (combosLoading) return <LoadingSpinner />;

            if (!activeCombos.length) {
                return <EmptyState label="No combo offers found" />;
            }

            return activeCombos.map((combo, index) => (
                <motion.li
                    key={combo.combo_id}
                    custom={index}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <Link
                        href={`/comboDetail/${combo.combo_id}`}
                        onClick={handleLinkClick}
                        className="
              group flex h-full flex-col items-center
              gap-2 rounded-2xl p-3
              text-center
              transition-all duration-200
              hover:-translate-y-1
              hover:bg-[var(--ph-primary-soft)]
              hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)]
            "
                    >
                        <div
                            className="
                relative overflow-hidden rounded-2xl
                bg-[var(--ph-primary-soft)]
                ring-1 ring-[var(--ph-border)]
                transition-all duration-300
                group-hover:scale-105
                group-hover:ring-[var(--ph-primary)]/50
              "
                        >
                            <Image
                                src={combo?.banner_image || PLACEHOLDER}
                                alt={combo.title}
                                width={76}
                                height={64}
                                className="h-14 w-16 object-cover sm:h-16 sm:w-[72px]"
                            />
                        </div>

                        <span className="line-clamp-2 max-w-[95px] text-[11px] font-semibold leading-tight text-[var(--ph-text-soft)] sm:text-xs">
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
                    <motion.div
                        variants={dropdownVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onMouseEnter={() => setOpenDropdown(type)}
                        onMouseLeave={() => setOpenDropdown(null)}
                        className={`
              absolute top-[calc(100%+12px)] z-[70]
              w-[min(560px,calc(100vw-32px))]
              overflow-hidden rounded-[26px]
              border border-[var(--ph-border)]
              bg-[var(--ph-surface)]
              p-3
              shadow-[0_25px_70px_rgba(15,23,42,0.14)]
              dark:shadow-[0_25px_70px_rgba(0,0,0,0.45)]
              right-0
              ${align === "right" ? "lg:right-0" : "lg:left-0 lg:translate-x-0"}
            `}
                    >
                        <div className="mb-2 flex items-center justify-between px-3 pt-2">
                            <div>
                                <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[var(--ph-accent)]">
                                    Explore
                                </p>

                                <h3 className="text-sm font-extrabold text-[var(--ph-text)]">
                                    {DRILL_TITLES[type]}
                                </h3>
                            </div>

                            <IoSparklesOutline className="text-xl text-[var(--ph-primary)]" />
                        </div>

                        <ul
                            className="
                grid max-h-[420px]
                grid-cols-3 gap-1
                overflow-y-auto
                p-1
                sm:grid-cols-4
                lg:grid-cols-5
              "
                        >
                            {renderDropdownItems(type)}
                        </ul>
                    </motion.div>
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
                className={`${desktopLinkClass(
                    ""
                )} rounded-full px-2.5 py-2 transition-transform duration-200 hover:scale-[1.03] hover:bg-black/[0.06]`}
            >
                <span>{label}</span>

                <IoChevronDown
                    className={`text-[14px] transition-transform duration-200 ${openDropdown === type ? "rotate-180" : ""
                        }`}
                />

                <span className="pointer-events-none absolute left-1/2 -bottom-0.5 h-[2px] w-0 -translate-x-1/2 rounded-full bg-[#1E2B2B] transition-all duration-300 group-hover:w-3/5" />
            </button>

            <DesktopDropdown
                type={type}
                align={type === "combo" ? "right" : "left"}
            />
        </li>
    );

    const mobileMainList = (
        <motion.div
            variants={mobileVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="p-3"
        >
            <div className="mb-2 px-3 pb-2">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[var(--ph-accent)]">
                    Play House
                </p>

                <p className="mt-0.5 text-lg font-extrabold text-[var(--ph-text)]">
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
                            className="
                flex w-full items-center justify-between
                rounded-2xl px-4 py-3.5
                text-left text-sm font-bold
                text-[var(--ph-text-soft)]
                transition-all duration-200
                hover:bg-[var(--ph-primary-soft)]
              "
                        >
                            <span>{label}</span>
                            <IoChevronForward className="text-[var(--ph-text-faint)]" />
                        </button>
                    </li>
                ))}

                <li>
                    <Link
                        href="/categoryDetail/36"
                        onClick={handleLinkClick}
                        className={mobileLinkClass("/categoryDetail/36")}
                    >
                        Wholesale
                    </Link>
                </li>

                <li>
                    <Link
                        href="/aboutUs"
                        onClick={handleLinkClick}
                        className={mobileLinkClass("/aboutUs")}
                    >
                        About Us
                    </Link>
                </li>
            </ul>

            <div className="mt-3 rounded-2xl bg-[var(--ph-primary-soft)] p-3">
                <p className="text-xs font-semibold text-[var(--ph-text-soft)]">
                    Little toys. Big adventures. ✨
                </p>
            </div>
        </motion.div>
    );

    const mobileDrillPanel = (
        <motion.div
            key={mobileDrill}
            variants={mobileVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full"
        >
            <div className="flex items-center gap-2 border-b border-[var(--ph-border)] px-3 py-3">
                <button
                    type="button"
                    onClick={() => setMobileDrill(null)}
                    className="
            flex h-9 w-9 items-center justify-center
            rounded-full
            text-[var(--ph-text-soft)]
            transition-all
            hover:bg-[var(--ph-primary-soft)]
          "
                    aria-label="Back to main menu"
                >
                    <IoChevronBack className="text-xl" />
                </button>

                <div>
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-[var(--ph-accent)]">
                        Explore
                    </p>

                    <span className="text-sm font-extrabold text-[var(--ph-text)]">
                        {DRILL_TITLES[mobileDrill]}
                    </span>
                </div>
            </div>

            <ul className="grid max-h-[60vh] grid-cols-3 gap-2 overflow-y-auto p-3">
                {renderDropdownItems(mobileDrill)}
            </ul>
        </motion.div>
    );

    return (
        <header
            className="
        sticky top-0 z-50 w-full
        border-b border-black/[0.06]
        bg-[var(--ph-primary)]
        shadow-[0_4px_24px_rgba(15,23,42,0.08)]
        dark:border-white/[0.08]
        dark:bg-[var(--ph-surface)]
        dark:shadow-[0_4px_24px_rgba(0,0,0,0.3)]
      "
        >
            <div className="relative mx-auto flex min-h-[64px] w-full max-w-[1500px] items-center gap-2 px-3 sm:px-5 md:min-h-[72px] md:px-7 lg:px-10 xl:px-12">

                {/* Mobile menu */}
                <div className="relative md:hidden">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.92 }}
                        type="button"
                        onClick={toggleMobileMenu}
                        className="
              flex h-10 w-10 items-center justify-center
              rounded-full
              text-[#1E2B2B]
              transition-colors
              hover:bg-black/[0.08]
              dark:text-[var(--ph-text)]
              dark:hover:bg-white/[0.07]
            "
                        aria-label="Toggle navigation menu"
                        aria-expanded={isMobileMenuOpen}
                    >
                        {isMobileMenuOpen ? (
                            <IoClose className="text-[25px]" />
                        ) : (
                            <IoMenu className="text-[25px]" />
                        )}
                    </motion.button>

                    <AnimatePresence mode="wait">
                        {isMobileMenuOpen && (
                            <motion.div
                                key={mobileDrill || "main"}
                                variants={mobileVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="
                  absolute left-0 top-[calc(100%+12px)] z-[80]
                  w-[calc(100vw-40px)]
                  max-w-[390px]
                  overflow-hidden
                  rounded-[26px]
                  border border-[var(--ph-border)]
                  bg-[var(--ph-surface)]
                  shadow-[0_25px_70px_rgba(15,23,42,0.16)]
                  dark:shadow-[0_25px_70px_rgba(0,0,0,0.5)]
                  sm:w-[370px]
                "
                            >
                                <AnimatePresence mode="wait">
                                    {mobileDrill ? mobileDrillPanel : mobileMainList}
                                </AnimatePresence>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Logo — centered on mobile/tablet, inline on desktop */}
                <Link
                    href="/"
                    onClick={handleLinkClick}
                    className="
            group absolute left-1/2 top-1/2 flex shrink-0 items-center
            -translate-x-1/2 -translate-y-1/2
            rounded-xl
            transition-transform duration-200
            hover:scale-[1.03]
            md:static md:left-auto md:top-auto md:translate-x-0 md:translate-y-0
          "
                >
                    <Image
                        src={logo}
                        alt="Toy House Logo"
                        width={110}
                        height={80}
                        priority
                        className="
              h-[46px] w-auto object-contain
              sm:h-[52px]
              md:h-[64px]
              lg:h-[68px]
              xl:h-[72px]
            "
                    />
                </Link>

                {/* Desktop navigation */}
                <nav className="hidden flex-1 justify-center md:flex">
                    <ul className="flex items-center gap-1 lg:gap-2 xl:gap-3">
                        {navDropdownButton("category", "Categories")}
                        {navDropdownButton("brand", "Brands")}
                        {navDropdownButton("combo", "Combo Offers")}

                        <li>
                            <Link
                                href="/categoryDetail/36"
                                className={desktopLinkClass("/categoryDetail/36")}
                            >
                                <span className="relative rounded-full px-2.5 py-2 transition-colors hover:bg-black/[0.06]">
                                    Wholesale
                                    <span className="pointer-events-none absolute left-1/2 -bottom-0.5 h-[2px] w-0 -translate-x-1/2 rounded-full bg-[#1E2B2B] transition-all duration-300 group-hover:w-3/5" />
                                </span>
                            </Link>
                        </li>

                        <li>
                            <Link
                                href="/aboutUs"
                                className={desktopLinkClass("/aboutUs")}
                            >
                                <span className="relative rounded-full px-2.5 py-2 transition-colors hover:bg-black/[0.06]">
                                    About Us
                                    <span className="pointer-events-none absolute left-1/2 -bottom-0.5 h-[2px] w-0 -translate-x-1/2 rounded-full bg-[#1E2B2B] transition-all duration-300 group-hover:w-3/5" />
                                </span>
                            </Link>
                        </li>
                    </ul>
                </nav>

                {/* Right controls */}
                <div
                    ref={searchWrapRef}
                    className="ml-auto flex shrink-0 items-center gap-1 sm:gap-2 md:gap-2.5 lg:gap-3"
                >
                    {/* Desktop/tablet search */}
                    <div className="hidden md:block">
                        <AnimatePresence initial={false}>
                            {isSearchOpen && (
                                <motion.form
                                    onSubmit={handleSearchSubmit}
                                    initial={{ width: 0, opacity: 0 }}
                                    animate={{
                                        width: "clamp(180px, 20vw, 290px)",
                                        opacity: 1,
                                    }}
                                    exit={{ width: 0, opacity: 0 }}
                                    transition={{
                                        duration: 0.25,
                                        ease: "easeOut",
                                    }}
                                    className="overflow-hidden"
                                >
                                    <div className="relative">
                                        <input
                                            ref={searchInputRef}
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Search toys..."
                                            className="
                        w-full rounded-full
                        border border-black/10
                        bg-[var(--ph-surface)]
                        px-4 py-2.5 pr-10
                        text-sm font-semibold
                        text-[var(--ph-text)]
                        outline-none
                        placeholder:text-[var(--ph-text-faint)]
                        transition-all
                        focus:border-[#1E2B2B]/20
                        focus:ring-4
                        focus:ring-white/40
                      "
                                        />

                                        <button
                                            type="submit"
                                            aria-label="Submit search"
                                            className="
                        absolute right-1.5 top-1/2
                        flex h-8 w-8
                        -translate-y-1/2
                        items-center justify-center
                        rounded-full
                        text-[var(--ph-text-soft)]
                        transition-colors
                        hover:bg-[var(--ph-primary-soft)]
                        hover:text-[var(--ph-text)]
                      "
                                        >
                                            <IoSearchOutline className="text-lg" />
                                        </button>
                                    </div>
                                </motion.form>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Search */}
                    <motion.button
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.92 }}
                        type="button"
                        onClick={toggleSearch}
                        className="
              flex h-10 w-10 items-center justify-center
              rounded-full
              text-[#1E2B2B]
              transition-colors
              hover:bg-black/[0.08]
              dark:text-[var(--ph-text)]
              dark:hover:bg-white/[0.07]
            "
                        aria-label={isSearchOpen ? "Close search" : "Search"}
                    >
                        {isSearchOpen ? (
                            <IoClose className="text-[22px]" />
                        ) : (
                            <IoSearchOutline className="text-[22px]" />
                        )}
                    </motion.button>

                    {/* Cart */}
                    <motion.button
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.92 }}
                        type="button"
                        onClick={handleShowDrawer}
                        className="
              relative flex h-10 w-10
              items-center justify-center
              rounded-full
              text-[#1E2B2B]
              transition-colors
              hover:bg-black/[0.08]
              dark:text-[var(--ph-text)]
              dark:hover:bg-white/[0.07]
            "
                        aria-label="Open cart"
                    >
                        <IoCartOutline className="text-[23px]" />

                        <AnimatePresence>
                            {cartCount > 0 && (
                                <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    exit={{ scale: 0 }}
                                    className="
                    absolute right-0.5 top-0.5
                    flex h-[17px] min-w-[17px]
                    items-center justify-center
                    rounded-full
                    bg-[var(--ph-coral)]
                    px-1
                    text-[9px]
                    font-extrabold
                    text-white
                    ring-2 ring-[var(--ph-primary)]
                    dark:ring-[var(--ph-surface)]
                  "
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
                            className="
                hidden items-center gap-1.5
                rounded-full
                px-2.5 py-2
                text-sm font-bold
                text-[#1E2B2B]
                transition-colors
                hover:bg-black/[0.08]
                sm:flex
                dark:text-[var(--ph-text)]
                dark:hover:bg-white/[0.06]
              "
                        >
                            <IoPersonCircleOutline className="text-[22px]" />
                            <span className="max-w-[90px] truncate">
                                {user.name || "Account"}
                            </span>
                        </Link>
                    ) : (
                        <Link
                            href="/logIn"
                            onClick={handleLinkClick}
                            className="
                block rounded-full
                bg-[#1E2B2B]
                px-3.5 py-2
                text-sm font-bold
                text-[var(--ph-primary)]
                transition-transform
                hover:scale-[1.03]
                dark:bg-[var(--ph-primary)]
                dark:text-[#1E2B2B]
              "
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
                        className="
              overflow-hidden
              border-t border-black/[0.08]
              md:hidden
            "
                    >
                        <form
                            onSubmit={handleSearchSubmit}
                            className="mx-auto w-full max-w-2xl px-4 pb-4 pt-3 sm:px-6"
                        >
                            <div className="relative">
                                <input
                                    autoFocus
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search for toys, brands, gifts..."
                                    className="
                    w-full rounded-full
                    border border-black/10
                    bg-[var(--ph-surface)]
                    px-5 py-3
                    pr-12
                    text-sm font-semibold
                    text-[var(--ph-text)]
                    outline-none
                    placeholder:text-[var(--ph-text-faint)]
                    focus:border-[#1E2B2B]/20
                    focus:ring-4 focus:ring-white/40
                  "
                                />

                                <button
                                    type="submit"
                                    aria-label="Submit search"
                                    className="
                    absolute right-2 top-1/2
                    flex h-9 w-9
                    -translate-y-1/2
                    items-center justify-center
                    rounded-full
                    bg-[#1E2B2B]
                    text-[var(--ph-primary)]
                    transition-transform
                    hover:scale-105
                  "
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