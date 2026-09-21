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
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-[#F4C900] dark:border-slate-700 dark:border-t-[#FFDE59]" />
        </div>
    );
}

function EmptyState({ label }) {
    return (
        <li className="col-span-full py-8 text-center text-sm text-slate-400 dark:text-slate-500">
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
      font-semibold
      tracking-[-0.01em]
      transition-colors duration-200
      ${isActive(href)
            ? "text-slate-950 dark:text-white"
            : "text-slate-800 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white"
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
            ? "bg-[#FFF4B8] text-slate-950 dark:bg-[#3A351C] dark:text-white"
            : "text-slate-800 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-white/[0.05]"
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
              hover:bg-[#FFF9DB]
              hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)]
              dark:hover:bg-white/[0.05]
              dark:hover:shadow-none
            "
                    >
                        <div
                            className="
                relative overflow-hidden rounded-full
                bg-slate-100 p-0.5
                ring-1 ring-slate-200/70
                transition-all duration-300
                group-hover:scale-105
                group-hover:ring-[#F4C900]/50
                dark:bg-slate-800
                dark:ring-slate-700
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

                        <span className="line-clamp-2 max-w-[90px] text-[11px] font-semibold leading-tight text-slate-700 dark:text-slate-300 sm:text-xs">
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
              hover:bg-[#FFF9DB]
              hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)]
              dark:hover:bg-white/[0.05]
              dark:hover:shadow-none
            "
                    >
                        <div
                            className="
                relative overflow-hidden rounded-full
                bg-white p-1
                ring-1 ring-slate-200
                transition-all duration-300
                group-hover:scale-105
                group-hover:ring-[#F4C900]/50
                dark:bg-slate-800
                dark:ring-slate-700
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

                        <span className="line-clamp-2 max-w-[90px] text-[11px] font-semibold leading-tight text-slate-700 dark:text-slate-300 sm:text-xs">
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
              hover:bg-[#FFF9DB]
              hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)]
              dark:hover:bg-white/[0.05]
              dark:hover:shadow-none
            "
                    >
                        <div
                            className="
                relative overflow-hidden rounded-2xl
                bg-slate-100
                ring-1 ring-slate-200/70
                transition-all duration-300
                group-hover:scale-105
                group-hover:ring-[#F4C900]/50
                dark:bg-slate-800
                dark:ring-slate-700
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

                        <span className="line-clamp-2 max-w-[95px] text-[11px] font-semibold leading-tight text-slate-700 dark:text-slate-300 sm:text-xs">
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
              border border-slate-200/80
              bg-white/95
              p-3
              shadow-[0_25px_70px_rgba(15,23,42,0.14)]
              backdrop-blur-xl
              dark:border-white/10
              dark:bg-[#171B1D]/95
              dark:shadow-[0_25px_70px_rgba(0,0,0,0.45)]
              ${align === "right"
                                ? "right-0"
                                : "left-1/2 -translate-x-1/2 lg:left-0 lg:translate-x-0"
                            }
            `}
                    >
                        <div className="mb-2 flex items-center justify-between px-3 pt-2">
                            <div>
                                <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#D4A900] dark:text-[#FFDE59]">
                                    Explore
                                </p>

                                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                                    {DRILL_TITLES[type]}
                                </h3>
                            </div>

                            <IoSparklesOutline className="text-xl text-[#E6C529] dark:text-[#FFDE59]" />
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
                )} group rounded-full px-2.5 py-2 hover:bg-black/[0.04] dark:hover:bg-white/[0.06]`}
            >
                <span>{label}</span>

                <IoChevronDown
                    className={`text-[14px] transition-transform duration-200 ${openDropdown === type ? "rotate-180" : ""
                        }`}
                />
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
                <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#C99E00] dark:text-[#FFDE59]">
                    Play House
                </p>

                <p className="mt-0.5 text-lg font-extrabold text-slate-900 dark:text-white">
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
                text-slate-800
                transition-all duration-200
                hover:bg-[#FFF9DB]
                dark:text-slate-200
                dark:hover:bg-white/[0.05]
              "
                        >
                            <span>{label}</span>
                            <IoChevronForward className="text-slate-400" />
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

            <div className="mt-3 rounded-2xl bg-[#FFF8D7] p-3 dark:bg-[#292617]">
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
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
            <div className="flex items-center gap-2 border-b border-slate-100 px-3 py-3 dark:border-white/10">
                <button
                    type="button"
                    onClick={() => setMobileDrill(null)}
                    className="
            flex h-9 w-9 items-center justify-center
            rounded-full
            text-slate-700
            transition-all
            hover:bg-slate-100
            dark:text-slate-200
            dark:hover:bg-white/[0.06]
          "
                    aria-label="Back to main menu"
                >
                    <IoChevronBack className="text-xl" />
                </button>

                <div>
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-[#C99E00] dark:text-[#FFDE59]">
                        Explore
                    </p>

                    <span className="text-sm font-extrabold text-slate-900 dark:text-white">
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
        border-b border-black/[0.04]
        bg-[#FFDE59]/95
        shadow-[0_4px_24px_rgba(15,23,42,0.06)]
        backdrop-blur-xl
        dark:border-white/[0.06]
        dark:bg-[#171A1C]/95
        dark:shadow-[0_4px_24px_rgba(0,0,0,0.25)]
      "
        >
            <div className="mx-auto flex min-h-[64px] w-full max-w-[1500px] items-center gap-2 px-3 sm:px-5 md:min-h-[72px] md:px-7 lg:px-10 xl:px-12">

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
              text-slate-900
              transition-colors
              hover:bg-black/[0.06]
              dark:text-white
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
                  w-[calc(100vw-24px)]
                  max-w-[390px]
                  overflow-hidden
                  rounded-[26px]
                  border border-slate-200/80
                  bg-white/95
                  shadow-[0_25px_70px_rgba(15,23,42,0.16)]
                  backdrop-blur-xl
                  dark:border-white/10
                  dark:bg-[#171B1D]/95
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

                {/* Logo */}
                <Link
                    href="/"
                    onClick={handleLinkClick}
                    className="
            group flex shrink-0 items-center
            rounded-xl
            transition-transform duration-200
            hover:scale-[1.03]
          "
                >
                    <Image
                        src={logo}
                        alt="Toy House Logo"
                        width={110}
                        height={80}
                        priority
                        className="
              h-[52px] w-auto object-contain
              sm:h-[58px]
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
                                <span className="rounded-full px-2.5 py-2 transition-colors hover:bg-black/[0.04] dark:hover:bg-white/[0.06]">
                                    Wholesale
                                </span>
                            </Link>
                        </li>

                        <li>
                            <Link
                                href="/aboutUs"
                                className={desktopLinkClass("/aboutUs")}
                            >
                                <span className="rounded-full px-2.5 py-2 transition-colors hover:bg-black/[0.04] dark:hover:bg-white/[0.06]">
                                    About Us
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
                        bg-white/90
                        px-4 py-2.5 pr-10
                        text-sm font-semibold
                        text-slate-800
                        outline-none
                        placeholder:text-slate-400
                        transition-all
                        focus:border-black/20
                        focus:bg-white
                        focus:ring-4
                        focus:ring-white/40
                        dark:border-white/10
                        dark:bg-[#252A2C]
                        dark:text-white
                        dark:placeholder:text-slate-500
                        dark:focus:bg-[#292E30]
                        dark:focus:ring-white/10
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
                        text-slate-500
                        transition-colors
                        hover:bg-slate-100
                        hover:text-slate-900
                        dark:hover:bg-white/10
                        dark:hover:text-white
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
              text-slate-900
              transition-colors
              hover:bg-black/[0.06]
              dark:text-white
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
              text-slate-900
              transition-colors
              hover:bg-black/[0.06]
              dark:text-white
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
                    bg-[#F04F5F]
                    px-1
                    text-[9px]
                    font-extrabold
                    text-white
                    ring-2 ring-[#FFDE59]
                    dark:ring-[#171A1C]
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
                text-slate-900
                transition-colors
                hover:bg-black/[0.05]
                sm:flex
                dark:text-white
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
                hidden rounded-full
                px-3 py-2
                text-sm font-bold
                text-slate-900
                transition-colors
                hover:bg-black/[0.05]
                sm:block
                dark:text-white
                dark:hover:bg-white/[0.06]
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
              border-t border-black/[0.05]
              md:hidden
              dark:border-white/[0.06]
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
                    bg-white
                    px-5 py-3
                    pr-12
                    text-sm font-semibold
                    text-slate-800
                    outline-none
                    placeholder:text-slate-400
                    focus:border-black/20
                    focus:ring-4 focus:ring-white/40
                    dark:border-white/10
                    dark:bg-[#252A2C]
                    dark:text-white
                    dark:placeholder:text-slate-500
                    dark:focus:ring-white/10
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
                    bg-[#FFDE59]
                    text-slate-900
                    transition-transform
                    hover:scale-105
                    dark:bg-[#FFDE59]
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