"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Suspense } from "react";
import SectionHeader from "@/components/cards/SectionHeader";

const shopItems = [
    {
        _id: 1,
        title: "Baby Stars",
        age: "0-2 years",
        color: "#FCE7C4", // warm gold-tint (primary family)
        minAge: 0,
        maxAge: 2,
    },
    {
        _id: 2,
        title: "Little Stars",
        age: "3-5 years",
        color: "#DCEFCB", // soft mint-tint (ph-mint family)
        minAge: 3,
        maxAge: 5,
    },
    {
        _id: 3,
        title: "Shining Stars",
        age: "6-11 years",
        color: "#CFE9E8", // soft teal-tint (ph-accent family)
        minAge: 6,
        maxAge: 11,
    },
    {
        _id: 4,
        title: "Super Stars",
        age: "12 and above",
        color: "#F1DCEA", // soft coral-plum tint (ph-coral family)
        minAge: 12,
        maxAge: Infinity,
    },
];

const ShopByAgeContent = () => {
    const searchParams = useSearchParams();
    const minAgeParam = searchParams.get("minAge");
    const maxAgeParam = searchParams.get("maxAge");

    const minAge = minAgeParam ? Number(minAgeParam) : 0;
    const maxAge = maxAgeParam ? Number(maxAgeParam) : Infinity;

    const filteredShopItems = shopItems.filter(
        (item) => item.maxAge >= minAge && item.minAge <= maxAge
    );

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.12,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 260,
                damping: 20,
            },
        },
    };

    return (
        <div className="w-11/12 mx-auto py-8">
            <SectionHeader
                title="Shop By Age"
            />

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 lg:gap-5 mt-10"
            >
                {filteredShopItems.map((item, index) => (
                    <motion.div
                        key={item._id}
                        variants={itemVariants}
                        className="h-full"
                        style={{ perspective: 800 }}
                    >
                        {/* Idle floating wrapper - stops on hover */}
                        <motion.div
                            animate={{
                                y: [0, -8, 0],
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: index * 0.3,
                            }}
                            whileHover={{
                                y: -10,
                                scale: 1.05,
                                transition: {
                                    type: "tween",
                                    duration: 0.25,
                                    ease: "easeOut",
                                },
                            }}
                            whileTap={{ scale: 0.97 }}
                            className="h-full"
                        >
                            <Link
                                href={`/ageCategory/${item._id}?minAge=${item.minAge}&maxAge=${item.maxAge}`}
                                title={`View details for ${item.title}`}
                                aria-label={`View details for ${item.title}`}
                                className="group relative overflow-hidden rounded-3xl border-solid border-4 border-[#1E2B2B]/80 hover:cursor-pointer p-4 lg:p-5 flex flex-col justify-center items-center text-center space-y-3 h-full shadow-sm hover:shadow-lg transition-shadow duration-300"
                                style={{ backgroundColor: item.color }}
                            >
                                <h1
                                    className="text-sm sm:text-lg lg:text-2xl font-medium text-[#1E2B2B]"
                                    style={{ fontFamily: "var(--font-display)" }}
                                >
                                    {item.title}
                                </h1>
                                <p
                                    className="text-sm sm:text-base md:text-lg lg:text-xl text-[#1E2B2B]/75"
                                    style={{ fontFamily: "var(--font-body)" }}
                                >
                                    Age {item.age}
                                </p>

                                {/* Subtle shine sweep on hover */}
                                <span className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                            </Link>
                        </motion.div>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
};

const ShopByAge = () => {
    return (
        <Suspense fallback={<div className="text-center py-8">Loading...</div>}>
            <ShopByAgeContent />
        </Suspense>
    );
};

export default ShopByAge;