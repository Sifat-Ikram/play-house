"use client";

import { motion } from "framer-motion";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const LOAD_STEP = 10;
const SWITCH_THRESHOLD = 40;
const PAGE_SIZE = 20;

const ProductPagination = ({
    totalCount,
    visibleCount,
    onLoadMore,
    mode,
    currentPage,
    totalPages,
    onPageChange,
}) => {
    if (totalCount === 0) return null;

    if (mode === "loadMore") {
        if (visibleCount >= totalCount) return null;

        return (
            <div className="flex justify-center mt-6 sm:mt-8 md:mt-10">
                <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    type="button"
                    onClick={onLoadMore}
                    className="rounded-full px-5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-[#1E2B2B] shadow-md hover:shadow-lg transition-shadow"
                    style={{ backgroundColor: "var(--ph-primary)", fontFamily: "var(--font-body)" }}
                >
                    Load More Toys 🧸
                </motion.button>
            </div>
        );
    }

    // numbered pagination
    return (
        <div className="flex items-center justify-center gap-1.5 sm:gap-2 mt-6 sm:mt-8 md:mt-10">
            <button
                type="button"
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="nav-btn"
                aria-label="Previous page"
            >
                <FiChevronLeft className="text-sm sm:text-base" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                    key={page}
                    type="button"
                    onClick={() => onPageChange(page)}
                    className={`
                        flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full text-xs sm:text-sm font-bold transition-colors
                        ${page === currentPage
                            ? "text-[#1E2B2B]"
                            : "text-[var(--ph-text-soft)] hover:bg-[var(--ph-primary-soft)]"
                        }
                    `}
                    style={{
                        backgroundColor: page === currentPage ? "var(--ph-primary)" : "transparent",
                        fontFamily: "var(--font-body)",
                    }}
                >
                    {page}
                </button>
            ))}

            <button
                type="button"
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="nav-btn"
                aria-label="Next page"
            >
                <FiChevronRight className="text-sm sm:text-base" />
            </button>
        </div>
    );
};

export { LOAD_STEP, SWITCH_THRESHOLD, PAGE_SIZE };
export default ProductPagination;