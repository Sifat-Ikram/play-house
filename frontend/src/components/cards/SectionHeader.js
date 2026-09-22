"use client";

import { motion } from "framer-motion";

const SectionHeader = ({ subtitle, title }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
        >
            {subtitle && (
                <p
                    className="
                        text-[10px]
                        sm:text-xs
                        md:text-sm
                        text-[var(--ph-accent)]
                        font-semibold
                        tracking-[0.16em]
                        uppercase
                        mb-1
                        sm:mb-1.5
                    "
                    style={{ fontFamily: "var(--font-body)" }}
                >
                    {subtitle}
                </p>
            )}

            <h2
                className="
                    text-xl
                    sm:text-2xl
                    md:text-3xl
                    lg:text-4xl
                    font-semibold
                    text-[var(--ph-text)]
                    tracking-tight
                "
                style={{ fontFamily: "var(--font-display)" }}
            >
                {title}
            </h2>
        </motion.div>
    );
};

export default SectionHeader;