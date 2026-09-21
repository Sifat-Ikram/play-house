"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Suspense } from "react";
import SectionHeader from "@/components/cards/SectionHeader";

const shopItems = [
    { _id: 1, title: "Baby Stars", age: "0-2 years", accent: "var(--ph-coral)", minAge: 0, maxAge: 2 },
    { _id: 2, title: "Little Stars", age: "3-5 years", accent: "var(--ph-accent-dark)", minAge: 3, maxAge: 5 },
    { _id: 3, title: "Shining Stars", age: "6-11 years", accent: "var(--ph-primary)", minAge: 6, maxAge: 11 },
    { _id: 4, title: "Super Stars", age: "12 and above", accent: "var(--ph-mint)", minAge: 12, maxAge: Infinity },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 22 } },
};

const ShopByAgeContent = () => {
    const searchParams = useSearchParams();
    const minAgeParam = searchParams.get("minAge");
    const maxAgeParam = searchParams.get("maxAge");

    const minAge = minAgeParam ? Number(minAgeParam) : 0;
    const maxAge = maxAgeParam ? Number(maxAgeParam) : Infinity;

    const filteredShopItems = shopItems.filter(
        (item) => item.maxAge >= minAge && item.minAge <= maxAge
    );

    return (
        <div className="ph-container ph-section !py-0">
            <SectionHeader subtitle="Shop By" title="Shop By Age" />

            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                className="mt-8 grid grid-cols-2 gap-3 sm:mt-10 sm:gap-4 md:grid-cols-4 lg:gap-5"
            >
                {filteredShopItems.map((item) => (
                    <motion.div key={item._id} variants={itemVariants} className="h-full">
                        <motion.div
                            whileHover={{ y: -6 }}
                            whileTap={{ scale: 0.98 }}
                            transition={{ type: "tween", duration: 0.2, ease: "easeOut" }}
                            className="h-full"
                        >
                            <Link
                                href={`/ageCategory/${item._id}?minAge=${item.minAge}&maxAge=${item.maxAge}`}
                                aria-label={`View details for ${item.title}`}
                                className="ph-card group relative flex h-full flex-col items-center justify-center gap-2 overflow-hidden p-5 text-center sm:gap-2.5 sm:p-6"
                            >
                                <span
                                    aria-hidden="true"
                                    className="absolute inset-x-0 top-0 h-1"
                                    style={{ backgroundColor: item.accent }}
                                />

                                <span
                                    className="mb-1 h-2 w-2 rounded-full"
                                    style={{ backgroundColor: item.accent }}
                                />

                                <h3
                                    className="text-sm font-bold sm:text-base md:text-lg"
                                    style={{ fontFamily: "var(--font-display)", color: "var(--ph-text)" }}
                                >
                                    {item.title}
                                </h3>

                                <p className="body-sm">Age {item.age}</p>
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
        <Suspense fallback={<div className="py-8 text-center body-sm">Loading...</div>}>
            <ShopByAgeContent />
        </Suspense>
    );
};

export default ShopByAge;