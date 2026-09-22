"use client";

import SectionHeader from "@/components/cards/SectionHeader";
import { motion } from "framer-motion";
import Link from "next/link";
import {
    FaCarSide,
    FaPuzzlePiece,
    FaPalette,
    FaRobot,
    FaBuilding,
    FaBookOpen,
} from "react-icons/fa";
import { FiArrowUpRight } from "react-icons/fi";

// Update href values to match your Next.js route (/product) and parameter (interest)
const interests = [
    {
        title: "Cars & Vehicles",
        description: "Race, ride & explore",
        icon: FaCarSide,
        bg: "#B9E6E3",
        accent: "var(--ph-accent)",
        href: "/product?interest=cars-vehicles",
    },
    {
        title: "Puzzles & Games",
        description: "Think, play & solve",
        icon: FaPuzzlePiece,
        bg: "#FCD98C",
        accent: "var(--ph-primary-dark)",
        href: "/product?interest=puzzles-games",
    },
    {
        title: "Arts & Creativity",
        description: "Create something fun",
        icon: FaPalette,
        bg: "#FFC2B3",
        accent: "var(--ph-coral)",
        href: "/product?interest=arts-creativity",
    },
    {
        title: "Robots & Tech",
        description: "Build, discover & play",
        icon: FaRobot,
        bg: "#9FE8CE",
        accent: "#1E9C79",
        href: "/product?interest=robots-tech",
    },
    {
        title: "Building & Blocks",
        description: "Build big ideas",
        icon: FaBuilding,
        bg: "#8FCFCB",
        accent: "var(--ph-accent-dark)",
        href: "/product?interest=building-blocks",
    },
    {
        title: "Books & Stories",
        description: "Imagine & discover",
        icon: FaBookOpen,
        bg: "#F7C46C",
        accent: "var(--ph-primary-dark)",
        href: "/product?interest=books-stories",
    },
];

const ShopByInterest = () => {
    return (
        <section className="px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-end justify-between gap-4 mb-6 sm:mb-8">
                    <SectionHeader
                        subtitle="Discover Their World"
                        title="Shop By Interest"
                    />

                    <Link
                        href="/product"
                        className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-[var(--ph-accent)] hover:text-[var(--ph-accent-dark)] transition-colors"
                        style={{ fontFamily: "var(--font-body)" }}
                    >
                        Explore All
                        <FiArrowUpRight />
                    </Link>
                </div>

                {/* Interest Cards */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5">
                    {interests.map((item, index) => {
                        const Icon = item.icon;

                        return (
                            <Link href={item.href} key={item.title} className="block">
                                <motion.div
                                    key={item.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, amount: 0.2 }}
                                    transition={{
                                        duration: 0.45,
                                        delay: index * 0.07,
                                    }}
                                    whileHover={{
                                        y: -7,
                                        rotate: index % 2 === 0 ? -0.5 : 0.5,
                                    }}
                                    className="group relative overflow-hidden rounded-[24px] sm:rounded-[30px] p-4 sm:p-6 min-h-[150px] sm:min-h-[190px] cursor-pointer border border-white/50 shadow-sm hover:shadow-xl transition-shadow duration-300"
                                    style={{ backgroundColor: item.bg }}
                                >
                                    {/* Decorative circles — more saturated, higher opacity */}
                                    <div
                                        className="absolute -right-8 -top-8 w-24 h-24 sm:w-32 sm:h-32 rounded-full opacity-60 transition-transform duration-500 group-hover:scale-125"
                                        style={{ backgroundColor: item.accent }}
                                    />

                                    <div
                                        className="absolute -bottom-10 -left-10 w-24 h-24 rounded-full opacity-25"
                                        style={{ backgroundColor: item.accent }}
                                    />

                                    {/* Icon */}
                                    <motion.div
                                        whileHover={{ rotate: 8, scale: 1.12 }}
                                        className={`relative z-10 w-11 h-11 sm:w-14 sm:h-14 flex items-center justify-center shadow-md mb-5 ${index % 3 === 0
                                            ? "rounded-full"
                                            : index % 3 === 1
                                                ? "rounded-2xl"
                                                : "rounded-[14px] rotate-3"
                                            }`}
                                        style={{ backgroundColor: "#FFFFFF", color: item.accent }}
                                    >
                                        <Icon className="text-xl sm:text-2xl" />
                                    </motion.div>

                                    {/* Content */}
                                    <div className="relative z-10">
                                        <h3
                                            className="font-extrabold text-sm sm:text-lg text-[#1E2B2B] leading-tight"
                                            style={{ fontFamily: "var(--font-display)" }}
                                        >
                                            {item.title}
                                        </h3>

                                        <p
                                            className="mt-1 text-[10px] sm:text-xs text-[#1E2B2B]/70 font-medium"
                                            style={{ fontFamily: "var(--font-body)" }}
                                        >
                                            {item.description}
                                        </p>
                                    </div>

                                    {/* Arrow */}
                                    <motion.div
                                        initial={{ opacity: 0, x: -5 }}
                                        whileHover={{ opacity: 1, x: 0 }}
                                        className="absolute bottom-4 right-4 sm:bottom-5 sm:right-5 w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-md"
                                        style={{ color: item.accent }}
                                    >
                                        <FiArrowUpRight />
                                    </motion.div>
                                </motion.div>
                            </Link>
                        );
                    })}
                </div>

                <Link
                    href="/product"
                    className="sm:hidden mt-5 flex items-center gap-1.5 mx-auto text-sm font-semibold text-[var(--ph-accent)]"
                    style={{ fontFamily: "var(--font-body)" }}
                >
                    Explore All
                    <FiArrowUpRight />
                </Link>
            </div>
        </section>
    );
};

export default ShopByInterest;