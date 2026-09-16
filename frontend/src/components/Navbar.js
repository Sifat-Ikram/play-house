"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
    IoCartOutline,
    IoSearchOutline,
    IoMenu,
    IoClose,
    IoChevronDown,
} from "react-icons/io5";

import logo from '@/assets/image-removebg-preview_6.webp';
import useCategory from "@/hooks/useCategory";
import useBrand from "@/hooks/useBrand";
import Image from "next/image";

const dropdownVariants = {
    hidden: {
        opacity: 0,
        y: -8,
        scale: 0.98,
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
        y: -6,
        scale: 0.98,
        transition: {
            duration: 0.15,
            ease: "easeIn",
        },
    },
};

const mobileMenuVariants = {
    hidden: {
        opacity: 0,
        x: -15,
    },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.25,
            ease: "easeOut",
        },
    },
    exit: {
        opacity: 0,
        x: -15,
        transition: {
            duration: 0.2,
            ease: "easeIn",
        },
    },
};

const iconMotion = {
    whileHover: {
        scale: 1.1,
    },
    whileTap: {
        scale: 0.92,
    },
    transition: {
        duration: 0.2,
    },
};

function LoadingSpinner({ size = "h-6 w-6" }) {
    return (
        <div className="flex items-center justify-center py-4">
            <div
                className={`${size} animate-spin rounded-full border-2 border-gray-300 border-t-gray-800`}
            />
        </div>
    );
}

const Navbar = ({ handleShowDrawer }) => {
    const router = useRouter();

    const searchRef = useRef(null);

    const { categories } = useCategory();
    const { brands } = useBrand();

    const [searchQuery, setSearchQuery] = useState("");
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const [isHoveredCategory, setIsHoveredCategory] = useState(false);
    const [isHoveredBrand, setIsHoveredBrand] = useState(false);

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Search submit
    const handleSearchSubmit = useCallback(
        (e) => {
            if (e) e.preventDefault();

            const query = searchQuery.trim();

            if (!query) return;

            router.push(`/searchResult/${query.toLowerCase()}`);

            setSearchQuery("");
            setIsSearchOpen(false);
        },
        [searchQuery, router]
    );

    // Close search when clicking outside
    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (
                searchRef.current &&
                !searchRef.current.contains(e.target)
            ) {
                setIsSearchOpen(false);
                setSearchQuery("");
            }
        };

        if (isSearchOpen) {
            document.addEventListener("mousedown", handleOutsideClick);
        }

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, [isSearchOpen]);

    // Close mobile menu when clicking outside
    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (!e.target.closest("#mobile-menu")) {
                setIsMobileMenuOpen(false);
            }
        };

        if (isMobileMenuOpen) {
            document.addEventListener("mousedown", handleOutsideClick);
        }

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, [isMobileMenuOpen]);

    const handleLinkClick = () => {
        setIsMobileMenuOpen(false);
        setIsHoveredCategory(false);
        setIsHoveredBrand(false);
    };

    const handleSearchClick = () => {
        setIsSearchOpen((prev) => !prev);
    };

    const closeDropdownCategory = () => {
        setIsHoveredCategory(false);
    };

    const closeDropdownBrand = () => {
        setIsHoveredBrand(false);
    };

    // --------------------------------------------------
    // Desktop navigation
    // --------------------------------------------------

    const navLinks = (
        <>
            {/* Categories */}
            <li
                className="relative"
                onMouseEnter={() => setIsHoveredCategory(true)}
                onMouseLeave={() => setIsHoveredCategory(false)}
            >
                <button
                    type="button"
                    className="flex items-center gap-1 whitespace-nowrap font-poppins text-sm font-medium transition-colors duration-200 hover:text-gray-700 lg:text-base"
                >
                    Categories
                    <IoChevronDown
                        className={`text-sm transition-transform duration-200 ${isHoveredCategory ? "rotate-180" : ""
                            }`}
                    />
                </button>

                <AnimatePresence>
                    {isHoveredCategory && (
                        <motion.ul
                            variants={dropdownVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="absolute left-0 top-full z-50 mt-4 grid max-h-[420px] min-w-[650px] grid-cols-4 gap-3 overflow-y-auto rounded-xl bg-white p-5 shadow-xl lg:grid-cols-5"
                        >
                            {categories?.length ? (
                                categories.map((category) => (
                                    <li
                                        key={category.category_id}
                                        className="rounded-lg transition-all duration-200 hover:bg-gray-50 hover:shadow-sm"
                                    >
                                        <Link
                                            href={`/categoryDetail/${category.category_id}`}
                                            onClick={closeDropdownCategory}
                                            className="flex flex-col items-center gap-2 p-3 text-center"
                                        >
                                            <Image
                                                src={category?.category_image || 'https://i.ibb.co.com/rKyYKgDT/multimedia-communication-image-placeholder-photography-landscape-image-comics-picture-photo-gallery.webp'}
                                                alt={category.category_name}
                                                width={64}
                                                height={64}
                                                className="h-16 w-16 rounded-full bg-gray-100 object-cover"
                                            />

                                            <span className="font-poppins text-xs font-medium text-gray-800 lg:text-sm">
                                                {category.category_name}
                                            </span>
                                        </Link>
                                    </li>
                                ))
                            ) : (
                                <li className="col-span-full">
                                    <LoadingSpinner />
                                </li>
                            )}
                        </motion.ul>
                    )}
                </AnimatePresence>
            </li>

            {/* Brands */}
            <li
                className="relative"
                onMouseEnter={() => setIsHoveredBrand(true)}
                onMouseLeave={() => setIsHoveredBrand(false)}
            >
                <button
                    type="button"
                    className="flex items-center gap-1 whitespace-nowrap font-poppins text-sm font-medium transition-colors duration-200 hover:text-gray-700 lg:text-base"
                >
                    Brands
                    <IoChevronDown
                        className={`text-sm transition-transform duration-200 ${isHoveredBrand ? "rotate-180" : ""
                            }`}
                    />
                </button>

                <AnimatePresence>
                    {isHoveredBrand && (
                        <motion.ul
                            variants={dropdownVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="absolute left-0 top-full z-50 mt-4 flex max-h-[420px] min-w-[650px] flex-wrap gap-3 overflow-y-auto rounded-xl bg-white p-5 shadow-xl"
                        >
                            {brands?.length ? (
                                brands.map((brand) => (
                                    <li
                                        key={brand.brand_id}
                                        className="w-[110px] rounded-lg transition-all duration-200 hover:bg-gray-50 hover:shadow-sm"
                                    >
                                        <Link
                                            href={`/brandDetail/${brand.brand_id}`}
                                            onClick={closeDropdownBrand}
                                            className="flex flex-col items-center gap-2 p-3 text-center"
                                        >
                                            <Image
                                                src={brand?.brand_image || 'https://i.ibb.co.com/rKyYKgDT/multimedia-communication-image-placeholder-photography-landscape-image-comics-picture-photo-gallery.webp'}
                                                alt={brand?.brand_name}
                                                width={64}
                                                height={64}
                                                className="h-16 w-16 rounded-full bg-gray-100 object-cover"
                                            />

                                            <span className="font-poppins text-xs font-medium text-gray-800 lg:text-sm">
                                                {brand.name}
                                            </span>
                                        </Link>
                                    </li>
                                ))
                            ) : (
                                <li className="w-full">
                                    <LoadingSpinner />
                                </li>
                            )}
                        </motion.ul>
                    )}
                </AnimatePresence>
            </li>

            {/* Other links */}
            <li>
                <Link
                    href="/categoryDetail/35"
                    className="whitespace-nowrap font-poppins text-sm font-medium transition-colors duration-200 hover:text-gray-700 lg:text-base"
                >
                    Combo Offers
                </Link>
            </li>

            <li>
                <Link
                    href="/categoryDetail/36"
                    className="whitespace-nowrap font-poppins text-sm font-medium transition-colors duration-200 hover:text-gray-700 lg:text-base"
                >
                    Wholesale
                </Link>
            </li>

            <li>
                <Link
                    href="/aboutUs"
                    className="whitespace-nowrap font-poppins text-sm font-medium transition-colors duration-200 hover:text-gray-700 lg:text-base"
                >
                    About Us
                </Link>
            </li>
        </>
    );

    // --------------------------------------------------
    // Mobile navigation
    // --------------------------------------------------

    const mobileNavLinks = (
        <>
            {/* Categories */}
            <li className="relative">
                <button
                    type="button"
                    onClick={() => setIsHoveredCategory((prev) => !prev)}
                    className="flex w-full items-center justify-between rounded-lg px-3 py-2 font-poppins text-left text-sm font-medium uppercase transition-colors duration-200 hover:bg-gray-50 sm:text-base"
                >
                    Categories
                    <IoChevronDown
                        className={`transition-transform duration-200 ${isHoveredCategory ? "rotate-180" : ""
                            }`}
                    />
                </button>

                <AnimatePresence>
                    {isHoveredCategory && (
                        <motion.ul
                            variants={dropdownVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="mt-2 grid grid-cols-3 gap-2 rounded-lg bg-gray-50 p-2"
                        >
                            {categories?.length ? (
                                categories.map((category) => (
                                    <li key={category.category_id}>
                                        <Link
                                            href={`/categoryDetail/${category.category_id}`}
                                            onClick={handleLinkClick}
                                            className="flex flex-col items-center gap-1 rounded-lg p-2 text-center transition-colors duration-200 hover:bg-white"
                                        >
                                            <Image
                                                src={category?.category_image || 'https://i.ibb.co.com/rKyYKgDT/multimedia-communication-image-placeholder-photography-landscape-image-comics-picture-photo-gallery.webp'}
                                                alt={category.category_name}
                                                width={48}
                                                height={48}
                                                className="h-10 w-10 rounded-full object-cover sm:h-12 sm:w-12"
                                            />

                                            <span className="font-poppins text-[10px] text-gray-800 sm:text-xs">
                                                {category.name}
                                            </span>
                                        </Link>
                                    </li>
                                ))
                            ) : (
                                <li className="col-span-full">
                                    <LoadingSpinner size="h-5 w-5" />
                                </li>
                            )}
                        </motion.ul>
                    )}
                </AnimatePresence>
            </li>

            {/* Brands */}
            <li className="relative">
                <button
                    type="button"
                    onClick={() => setIsHoveredBrand((prev) => !prev)}
                    className="flex w-full items-center justify-between rounded-lg px-3 py-2 font-poppins text-left text-sm font-medium uppercase transition-colors duration-200 hover:bg-gray-50 sm:text-base"
                >
                    Brands
                    <IoChevronDown
                        className={`transition-transform duration-200 ${isHoveredBrand ? "rotate-180" : ""
                            }`}
                    />
                </button>

                <AnimatePresence>
                    {isHoveredBrand && (
                        <motion.ul
                            variants={dropdownVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="mt-2 grid grid-cols-3 gap-2 rounded-lg bg-gray-50 p-2"
                        >
                            {brands?.length ? (
                                brands.map((brand) => (
                                    <li key={brand.brand_id}>
                                        <Link
                                            href={`/brandDetail/${brand.brand_id}`}
                                            onClick={handleLinkClick}
                                            className="flex flex-col items-center gap-1 rounded-lg p-2 text-center transition-colors duration-200 hover:bg-white"
                                        >
                                            <Image
                                                src={brand?.brand_image || 'https://i.ibb.co.com/rKyYKgDT/multimedia-communication-image-placeholder-photography-landscape-image-comics-picture-photo-gallery.webp'}
                                                alt={brand?.brand_name}
                                                width={48}
                                                height={48}
                                                className="h-10 w-10 rounded-full object-cover sm:h-12 sm:w-12"
                                            />

                                            <span className="font-poppins text-[10px] text-gray-800 sm:text-xs">
                                                {brand.name}
                                            </span>
                                        </Link>
                                    </li>
                                ))
                            ) : (
                                <li className="col-span-full">
                                    <LoadingSpinner size="h-5 w-5" />
                                </li>
                            )}
                        </motion.ul>
                    )}
                </AnimatePresence>
            </li>

            {/* Other links */}
            <li>
                <Link
                    href="/categoryDetail/35"
                    onClick={handleLinkClick}
                    className="block rounded-lg px-3 py-2 font-poppins text-sm font-medium uppercase transition-colors duration-200 hover:bg-gray-50 sm:text-base"
                >
                    Combo Offers
                </Link>
            </li>

            <li>
                <Link
                    href="/categoryDetail/36"
                    onClick={handleLinkClick}
                    className="block rounded-lg px-3 py-2 font-poppins text-sm font-medium uppercase transition-colors duration-200 hover:bg-gray-50 sm:text-base"
                >
                    Wholesale
                </Link>
            </li>

            <li>
                <Link
                    href="/aboutUs"
                    onClick={handleLinkClick}
                    className="block rounded-lg px-3 py-2 font-poppins text-sm font-medium uppercase transition-colors duration-200 hover:bg-gray-50 sm:text-base"
                >
                    About Us
                </Link>
            </li>
        </>
    );

    return (
        <header className="sticky top-0 z-40 w-full bg-[#FEF987] shadow-sm">
            <div className="mx-auto flex min-h-[64px] w-full max-w-[1440px] items-center justify-between gap-3 px-3 sm:px-5 md:min-h-[76px] md:px-8 lg:px-10">

                {/* Left: Mobile menu + Logo */}
                <div className="flex items-center gap-3 md:gap-5">

                    {/* Mobile menu */}
                    <div id="mobile-menu" className="relative md:hidden">
                        <motion.button
                            {...iconMotion}
                            type="button"
                            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                            className="flex h-10 w-10 items-center justify-center rounded-full transition-colors duration-200 hover:bg-black/5"
                            aria-label="Toggle navigation menu"
                        >
                            {isMobileMenuOpen ? (
                                <IoClose className="text-2xl" />
                            ) : (
                                <IoMenu className="text-2xl" />
                            )}
                        </motion.button>

                        <AnimatePresence>
                            {isMobileMenuOpen && (
                                <motion.div
                                    variants={mobileMenuVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    className="absolute left-0 top-full z-50 mt-3 w-[280px] rounded-xl bg-white p-3 shadow-xl sm:w-[360px]"
                                >
                                    <ul className="flex flex-col gap-1">
                                        {mobileNavLinks}
                                    </ul>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Logo */}
                    <Link
                        href="/"
                        onClick={handleLinkClick}
                        className="flex-shrink-0"
                    >
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

                {/* Desktop navigation */}
                <nav className="hidden flex-1 justify-center md:flex lg:ml-8">
                    <ul className="flex items-center gap-4 lg:gap-7">
                        {navLinks}
                    </ul>
                </nav>

                {/* Right: Search + Cart + Login */}
                <div className="flex items-center gap-3 sm:gap-4 md:gap-5">

                    {/* Search */}
                    <motion.button
                        {...iconMotion}
                        type="button"
                        onClick={handleSearchClick}
                        className="flex h-9 w-9 items-center justify-center rounded-full transition-colors duration-200 hover:bg-black/5"
                        aria-label="Search"
                    >
                        <IoSearchOutline className="text-xl sm:text-[22px]" />
                    </motion.button>

                    {/* Cart */}
                    <motion.button
                        {...iconMotion}
                        type="button"
                        onClick={handleShowDrawer}
                        className="relative flex h-9 w-9 items-center justify-center rounded-full transition-colors duration-200 hover:bg-black/5"
                        aria-label="Open cart"
                    >
                        <IoCartOutline className="text-xl sm:text-[22px]" />
                    </motion.button>

                    {/* Login */}
                    <Link
                        href="/logIn"
                        className="whitespace-nowrap font-poppins text-xs font-medium transition-colors duration-200 hover:text-gray-700 sm:text-sm lg:text-base"
                    >
                        Login
                    </Link>
                </div>
            </div>

            {/* Search bar */}
            <AnimatePresence>
                {isSearchOpen && (
                    <motion.div
                        ref={searchRef}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className="overflow-hidden"
                    >
                        <form
                            onSubmit={handleSearchSubmit}
                            className="mx-auto w-full max-w-2xl px-4 pb-4 sm:px-6"
                        >
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