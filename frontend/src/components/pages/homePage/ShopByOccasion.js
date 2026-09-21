"use client";

import SectionHeader from "@/components/cards/SectionHeader";
import { motion } from "framer-motion";
import { FiArrowUpRight, FiGift, FiHeart, FiStar } from "react-icons/fi";
import { HiOutlineCake, HiOutlineSparkles, HiOutlineAcademicCap } from "react-icons/hi2";

const occasions = [
    { id: 1, title: "Birthday Fun", description: "Make their special day extra exciting", icon: HiOutlineCake, emoji: "🎂", accent: "var(--ph-accent-dark)" },
    { id: 2, title: "Gift for Kids", description: "Find something they'll love", icon: FiGift, emoji: "🎁", accent: "var(--ph-primary)" },
    { id: 3, title: "Party & Fun", description: "Toys made for sharing and playing", icon: HiOutlineSparkles, emoji: "🎉", accent: "var(--ph-coral)" },
    { id: 4, title: "Holiday Gifts", description: "Make every celebration memorable", icon: FiStar, emoji: "✨", accent: "var(--ph-mint)" },
    { id: 5, title: "Back to School", description: "Fun learning starts here", icon: HiOutlineAcademicCap, emoji: "🎒", accent: "var(--ph-primary)" },
    { id: 6, title: "Just Because", description: "Sometimes you don't need a reason", icon: FiHeart, emoji: "❤️", accent: "var(--ph-coral)" },
];

const ShopByOccasion = () => {
    return (
        <section className="ph-section">
            <div className="ph-container">
                <div className="mb-6 sm:mb-8">
                    <SectionHeader subtitle="Find the Perfect Moment" title="Shop by Occasion" />
                </div>

                {/* Distinct format: icon-left, badge-style tile — different from ShopByAge (stripe tile) and ShopByInterest (row card) */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:gap-5">
                    {occasions.map((occasion, index) => {
                        const Icon = occasion.icon;

                        return (
                            <motion.button
                                key={occasion.id}
                                initial={{ opacity: 0, y: 18 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.2 }}
                                transition={{ duration: 0.4, delay: index * 0.06 }}
                                whileHover={{ y: -5 }}
                                whileTap={{ scale: 0.98 }}
                                className="ph-card group relative flex min-h-[150px] flex-col justify-between p-4 text-left sm:min-h-[170px] sm:p-5"
                            >
                                <div className="flex items-start justify-between">
                                    <div
                                        className="flex h-11 w-11 items-center justify-center rounded-2xl shadow-sm transition-transform duration-300 group-hover:scale-105 sm:h-12 sm:w-12"
                                        style={{ backgroundColor: occasion.accent, color: "#fff" }}
                                    >
                                        <Icon className="text-lg sm:text-xl" />
                                    </div>

                                    <span className="text-xl transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110 sm:text-2xl">
                                        {occasion.emoji}
                                    </span>
                                </div>

                                <div>
                                    <h3
                                        className="text-sm font-bold sm:text-base"
                                        style={{ fontFamily: "var(--font-display)", color: "var(--ph-text)" }}
                                    >
                                        {occasion.title}
                                    </h3>
                                    <p className="body-sm mt-1 leading-relaxed">{occasion.description}</p>
                                </div>

                                <FiArrowUpRight
                                    className="absolute bottom-4 right-4 text-lg opacity-0 transition-all duration-300 group-hover:opacity-100 sm:bottom-5 sm:right-5"
                                    style={{ color: occasion.accent }}
                                />
                            </motion.button>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default ShopByOccasion;