"use client";

import { AnimatePresence, motion } from "framer-motion";
import FilterSidebar from "./FilterSidebar";

const FilterDrawer = ({ isOpen, onClose, ...sidebarProps }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[90] lg:hidden">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
                    />

                    {/* Sliding panel */}
                    <motion.div
                        initial={{ x: "-100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "-100%" }}
                        transition={{ type: "tween", duration: 0.28, ease: "easeOut" }}
                        className="absolute left-0 top-0 h-full w-[85%] max-w-[340px] bg-[var(--ph-surface)] shadow-2xl"
                    >
                        <FilterSidebar
                            {...sidebarProps}
                            onClose={onClose}
                            showCloseButton
                        />
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default FilterDrawer;