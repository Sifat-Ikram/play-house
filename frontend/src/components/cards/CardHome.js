"use client";

import Image from "next/image";

const CardHome = ({ product }) => {
    return (
        <div className="overflow-hidden group rounded-lg border border-gray-200 bg-white text-black shadow-sm transition-all duration-300 hover:shadow-md">
            {/* Product Image */}
            <div className="relative w-full h-[110px] sm:h-[150px] md:h-[170px] lg:h-[200px] xl:h-[220px] overflow-hidden rounded-t-lg bg-gray-100">
                <Image
                    src={product?.display_image_url || "/placeholder.png"}
                    alt={product?.name || "Product"}
                    fill
                    sizes="
                        (max-width: 640px) 45vw,
                        (max-width: 768px) 30vw,
                        (max-width: 1024px) 25vw,
                        (max-width: 1280px) 20vw,
                        16vw
                    "
                    className="object-cover rounded-t-lg transition-transform duration-300 group-hover:scale-105"
                />
            </div>

            {/* Product Details */}
            <div className="p-2 sm:p-3 md:p-4 space-y-1.5 sm:space-y-2">
                <div className="space-y-0.5">
                    {/* Brand */}
                    <p className="text-[10px] sm:text-xs md:text-sm font-roboto font-light text-gray-500 truncate">
                        {product?.brand_name || ""}
                    </p>

                    {/* Product Name */}
                    <h3 className="text-xs sm:text-sm md:text-base lg:text-lg font-semibold font-poppins truncate">
                        {product?.name || "No Name Available"}
                    </h3>
                </div>

                {/* Price */}
                <p className="text-xs sm:text-sm md:text-base font-medium font-roboto">
                    BDT {product?.selling_price ?? "0"}
                </p>
            </div>
        </div>
    );
};

export default CardHome;