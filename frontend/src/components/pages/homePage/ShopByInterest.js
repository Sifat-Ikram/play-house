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
    { title: "Cars & Vehicles", description: "Race, ride & explore", icon: FaCarSide, accent: "var(--ph-primary)" },
    { title: "Puzzles & Games", description: "Think, play & solve", icon: FaPuzzlePiece, accent: "var(--ph-accent-dark)" },
    { title: "Arts & Creativity", description: "Create something fun", icon: FaPalette, accent: "var(--ph-coral)" },
    { title: "Robots & Tech", description: "Build, discover & play", icon: FaRobot, accent: "var(--ph-mint)" },
    { title: "Building & Blocks", description: "Build big ideas", icon: FaBuilding, accent: "var(--ph-primary)" },
    { title: "Books & Stories", description: "Imagine & discover", icon: FaBookOpen, accent: "var(--ph-coral)" },
];

const ShopByInterest = () => {
    return (
        <section className="ph-section">
            <div className="ph-container">
                <div className="mb-6 flex items-end justify-between gap-4 sm:mb-8">
                    <SectionHeader subtitle="Discover Their World" title="Shop By Interest" />

                    <button
                        className="hidden items-center gap-1.5 text-sm font-semibold transition-colors sm:flex"
                        style={{ color: "var(--ph-primary)" }}
                    >
                        Explore All
                        <FiArrowUpRight />
                    </button>
                </div>

                {/* Interest list — row cards, distinct from ShopByAge's tile format */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
                    {interests.map((item, index) => {
                        const Icon = item.icon;

                        return (
                            <motion.div
                                key={item.title}
                                initial={{ opacity: 0, y: 16 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.2 }}
                                transition={{ duration: 0.4, delay: index * 0.06 }}
                            >
                                <div className="ph-card group flex cursor-pointer items-center gap-4 p-4 sm:p-5">
                                    <div
                                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-105 sm:h-14 sm:w-14"
                                        style={{ backgroundColor: "var(--ph-bg-soft)", color: item.accent }}
                                    >
                                        <Icon className="text-lg sm:text-xl" />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <h3
                                            className="truncate text-sm font-bold sm:text-base"
                                            style={{ fontFamily: "var(--font-display)", color: "var(--ph-text)" }}
                                        >
                                            {item.title}
                                        </h3>
                                        <p className="body-sm truncate">{item.description}</p>
                                    </div>

                                    <FiArrowUpRight
                                        className="shrink-0 text-lg opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                                        style={{ color: item.accent }}
                                    />
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                <button
                    className="mx-auto mt-5 flex items-center gap-1.5 text-sm font-semibold sm:hidden"
                    style={{ color: "var(--ph-primary)" }}
                >
                    Explore All
                    <FiArrowUpRight />
                </button>
            </div>
        </section>
    );
};

export default ShopByInterest;