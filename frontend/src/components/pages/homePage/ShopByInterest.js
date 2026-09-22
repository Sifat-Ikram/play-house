"use client";

import SectionHeader from "@/components/cards/SectionHeader";
import { motion } from "framer-motion";
import {
    FaCarSide,
    FaPuzzlePiece,
    FaPalette,
    FaRobot,
    FaBuilding,
    FaBookOpen,
} from "react-icons/fa";
import { FiArrowUpRight } from "react-icons/fi";

const interests = [
    {
        title: "Cars & Vehicles",
        description: "Race, ride & explore",
        icon: FaCarSide,
        bg: "var(--ph-accent-soft)",
        accent: "var(--ph-accent)",
    },
    {
        title: "Puzzles & Games",
        description: "Think, play & solve",
        icon: FaPuzzlePiece,
        bg: "var(--ph-primary-soft)",
        accent: "var(--ph-primary)",
    },
    {
        title: "Arts & Creativity",
        description: "Create something fun",
        icon: FaPalette,
        bg: "#FFE7E3",
        accent: "var(--ph-coral)",
    },
    {
        title: "Robots & Tech",
        description: "Build, discover & play",
        icon: FaRobot,
        bg: "#E1F7F1",
        accent: "var(--ph-mint)",
    },
    {
        title: "Building & Blocks",
        description: "Build big ideas",
        icon: FaBuilding,
        bg: "#D8EBEA",
        accent: "var(--ph-accent-dark)",
    },
    {
        title: "Books & Stories",
        description: "Imagine & discover",
        icon: FaBookOpen,
        bg: "#FBE7C9",
        accent: "var(--ph-primary-dark)",
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

                    <button
                        className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-[var(--ph-accent)] hover:text-[var(--ph-accent-dark)] transition-colors"
                        style={{ fontFamily: "var(--font-body)" }}
                    >
                        Explore All
                        <FiArrowUpRight />
                    </button>
                </div>

                {/* Interest Cards */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5">
                    {interests.map((item, index) => {
                        const Icon = item.icon;

                        return (
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
                                className="group relative overflow-hidden rounded-[24px] sm:rounded-[30px] p-4 sm:p-6 min-h-[150px] sm:min-h-[190px] cursor-pointer border border-white/70 shadow-sm hover:shadow-xl transition-shadow duration-300"
                                style={{ backgroundColor: item.bg }}
                            >
                                {/* Decorative circles */}
                                <div
                                    className="absolute -right-8 -top-8 w-24 h-24 sm:w-32 sm:h-32 rounded-full opacity-40 transition-transform duration-500 group-hover:scale-125"
                                    style={{ backgroundColor: item.accent }}
                                />

                                <div
                                    className="absolute -bottom-10 -left-10 w-24 h-24 rounded-full opacity-20"
                                    style={{ backgroundColor: item.accent }}
                                />

                                {/* Icon */}
                                <motion.div
                                    whileHover={{ rotate: 8, scale: 1.12 }}
                                    className="relative z-10 w-11 h-11 sm:w-14 sm:h-14 rounded-2xl bg-white flex items-center justify-center shadow-sm mb-5"
                                    style={{ color: item.accent }}
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
                                        className="mt-1 text-[10px] sm:text-xs text-[#1E2B2B]/65"
                                        style={{ fontFamily: "var(--font-body)" }}
                                    >
                                        {item.description}
                                    </p>
                                </div>

                                {/* Arrow */}
                                <motion.div
                                    initial={{ opacity: 0, x: -5 }}
                                    whileHover={{ opacity: 1, x: 0 }}
                                    className="absolute bottom-4 right-4 sm:bottom-5 sm:right-5 w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm"
                                    style={{ color: item.accent }}
                                >
                                    <FiArrowUpRight />
                                </motion.div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Mobile explore */}
                <button
                    className="sm:hidden mt-5 flex items-center gap-1.5 mx-auto text-sm font-semibold text-[var(--ph-accent)]"
                    style={{ fontFamily: "var(--font-body)" }}
                >
                    Explore All
                    <FiArrowUpRight />
                </button>
            </div>
        </section>
    );
};

export default ShopByInterest;