"use client";

import SectionHeader from "@/components/cards/SectionHeader";
import { motion } from "framer-motion";
import {
    FiArrowUpRight,
    FiGift,
    FiHeart,
    FiStar,
} from "react-icons/fi";
import {
    HiOutlineCake,
    HiOutlineSparkles,
    HiOutlineAcademicCap,
} from "react-icons/hi2";


const occasions = [
    {
        id: 1,
        title: "Birthday Fun",
        description: "Make their special day extra exciting",
        icon: HiOutlineCake,
        emoji: "🎂",
        bg: "bg-[#FFF7D6]",
        accent: "bg-[#FACC15]",
        iconColor: "text-[#CA8A04]",
        border: "border-[#FDE68A]",
    },
    {
        id: 2,
        title: "Gift for Kids",
        description: "Find something they'll love",
        icon: FiGift,
        emoji: "🎁",
        bg: "bg-[#E0F7FF]",
        accent: "bg-[#38BDF8]",
        iconColor: "text-[#0284C7]",
        border: "border-[#BAE6FD]",
    },
    {
        id: 3,
        title: "Party & Fun",
        description: "Toys made for sharing and playing",
        icon: HiOutlineSparkles,
        emoji: "🎉",
        bg: "bg-[#FFE7F0]",
        accent: "bg-[#FB7185]",
        iconColor: "text-[#E11D48]",
        border: "border-[#FECDD3]",
    },
    {
        id: 4,
        title: "Holiday Gifts",
        description: "Make every celebration memorable",
        icon: FiStar,
        emoji: "✨",
        bg: "bg-[#E9F9E8]",
        accent: "bg-[#4ADE80]",
        iconColor: "text-[#16A34A]",
        border: "border-[#BBF7D0]",
    },
    {
        id: 5,
        title: "Back to School",
        description: "Fun learning starts here",
        icon: HiOutlineAcademicCap,
        emoji: "🎒",
        bg: "bg-[#F0E9FF]",
        accent: "bg-[#A78BFA]",
        iconColor: "text-[#7C3AED]",
        border: "border-[#DDD6FE]",
    },
    {
        id: 6,
        title: "Just Because",
        description: "Sometimes you don't need a reason",
        icon: FiHeart,
        emoji: "❤️",
        bg: "bg-[#FFF0E5]",
        accent: "bg-[#FB923C]",
        iconColor: "text-[#EA580C]",
        border: "border-[#FED7AA]",
    },
];

const ShopByOccasion = () => {
    return (
        <section className="w-full py-10 sm:py-14 lg:py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">

                {/* Section Header */}
                <div className="mb-6 sm:mb-8">
                    <SectionHeader
                        subtitle="Find the perfect moment"
                        title="Shop by Occasion"
                    />
                </div>

                {/* Occasion Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5 lg:gap-6">
                    {occasions.map((occasion, index) => {
                        const Icon = occasion.icon;

                        return (
                            <motion.button
                                key={occasion.id}
                                initial={{
                                    opacity: 0,
                                    y: 20,
                                }}
                                whileInView={{
                                    opacity: 1,
                                    y: 0,
                                }}
                                viewport={{ once: true }}
                                transition={{
                                    duration: 0.4,
                                    delay: index * 0.06,
                                }}
                                whileHover={{
                                    y: -7,
                                    scale: 1.015,
                                }}
                                whileTap={{
                                    scale: 0.98,
                                }}
                                className={`
                                    group relative overflow-hidden
                                    ${occasion.bg}
                                    ${occasion.border}
                                    border
                                    rounded-[28px]
                                    p-4 sm:p-5 lg:p-6
                                    text-left
                                    min-h-[165px]
                                    sm:min-h-[190px]
                                    lg:min-h-[210px]
                                    shadow-sm
                                    hover:shadow-lg
                                    transition-shadow duration-300
                                    cursor-pointer
                                `}
                            >
                                {/* Decorative Circle */}
                                <div
                                    className={`
                                        absolute
                                        -right-8
                                        -top-8
                                        w-28 h-28
                                        sm:w-36 sm:h-36
                                        rounded-full
                                        ${occasion.accent}
                                        opacity-20
                                        transition-transform
                                        duration-500
                                        group-hover:scale-125
                                    `}
                                />

                                {/* Small Decorative Circle */}
                                <div
                                    className={`
                                        absolute
                                        right-8 bottom-8
                                        w-3 h-3
                                        rounded-full
                                        ${occasion.accent}
                                        opacity-40
                                        group-hover:scale-150
                                        transition-transform
                                        duration-300
                                    `}
                                />

                                {/* Icon */}
                                <div className="relative z-10 flex items-start justify-between">
                                    <motion.div
                                        whileHover={{
                                            rotate: [-5, 5, -5, 0],
                                        }}
                                        transition={{ duration: 0.4 }}
                                        className={`
                                            w-11 h-11
                                            sm:w-13 sm:h-13
                                            rounded-2xl
                                            ${occasion.accent}
                                            flex items-center justify-center
                                            shadow-sm
                                        `}
                                    >
                                        <Icon
                                            className="
                                                text-white
                                                text-xl
                                                sm:text-2xl
                                            "
                                        />
                                    </motion.div>

                                    {/* Emoji */}
                                    <span
                                        className="
                                            text-2xl
                                            sm:text-3xl
                                            group-hover:scale-110
                                            group-hover:-rotate-6
                                            transition-all duration-300
                                        "
                                    >
                                        {occasion.emoji}
                                    </span>
                                </div>

                                {/* Content */}
                                <div className="relative z-10 mt-5 sm:mt-6">
                                    <h3
                                        className={`
                                            font-poppins
                                            font-bold
                                            text-base
                                            sm:text-lg
                                            lg:text-xl
                                            ${occasion.iconColor}
                                        `}
                                    >
                                        {occasion.title}
                                    </h3>

                                    <p
                                        className="
                                            mt-1
                                            max-w-[220px]
                                            font-roboto
                                            text-xs
                                            sm:text-sm
                                            text-gray-600
                                            leading-relaxed
                                        "
                                    >
                                        {occasion.description}
                                    </p>
                                </div>

                                {/* Arrow */}
                                <div
                                    className={`
                                        absolute
                                        bottom-4
                                        right-4
                                        sm:bottom-5
                                        sm:right-5
                                        w-8 h-8
                                        rounded-full
                                        bg-white/80
                                        ${occasion.iconColor}
                                        flex items-center justify-center
                                        shadow-sm
                                        opacity-0
                                        translate-x-2
                                        group-hover:opacity-100
                                        group-hover:translate-x-0
                                        transition-all duration-300
                                    `}
                                >
                                    <FiArrowUpRight className="text-sm" />
                                </div>
                            </motion.button>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default ShopByOccasion;