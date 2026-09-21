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
                        text-[#38BDF8]
                        font-medium
                        font-poppins
                        tracking-[0.16em]
                        uppercase
                        mb-1
                        sm:mb-1.5
                    "
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
                    font-poppins
                    text-[#1E293B]
                    tracking-tight
                "
            >
                {title}
            </h2>
        </motion.div>
    );
};

export default SectionHeader;