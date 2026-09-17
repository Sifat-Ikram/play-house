"use client";

import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/image-removebg-preview_6.webp";
import {
    AiOutlineFacebook,
    AiOutlineInstagram,
    AiOutlineLinkedin,
} from "react-icons/ai";
import { FaXTwitter } from "react-icons/fa6";
import { TbBrandYoutube } from "react-icons/tb";

const Footer = () => {
    return (
        <footer className="bg-[#FFFCB7] pt-12 sm:pt-20 space-y-12 relative max-sm:w-full dark:text-black">
            <div className="w-11/12 md:w-4/5 mx-auto flex flex-wrap flex-row justify-between gap-8 space-y-8 sm:space-y-0">

                {/* Logo and Description */}
                <div className="w-full sm:w-1/2 flex flex-col items-center lg:items-start space-y-4">
                    <Link href="/" className="inline-block">
                        <Image
                            src={logo}
                            alt="Toy House Logo"
                            width={180}
                            height={100}
                            className="h-[100px] w-auto object-contain"
                        />
                    </Link>
                    <p className="text-base font-normal font-roboto text-center lg:text-left lg:pr-20 leading-relaxed">
                        By subscribing you agree to our Privacy Policy and consent to
                        receive updates from our company.
                    </p>
                </div>

                {/* Social Links & Newsletter */}
                <div className="w-full sm:flex-1 flex flex-col max-sm:items-center space-y-6">
                    <div className="space-y-3 max-sm:text-center">
                        <h2 className="font-roboto text-sm md:text-base lg:text-lg font-semibold tracking-wide">
                            Follow Us
                        </h2>
                        <div className="flex gap-6 flex-wrap items-center max-sm:justify-center">
                            <Link
                                href="https://facebook.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Facebook"
                                className="hover:scale-110 transition-transform duration-200"
                            >
                                <AiOutlineFacebook className="font-roboto text-3xl font-light hover:text-blue-600 transition-colors" />
                            </Link>
                            <Link
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Instagram"
                                className="hover:scale-110 transition-transform duration-200"
                            >
                                <AiOutlineInstagram className="font-roboto text-3xl font-light hover:text-pink-600 transition-colors" />
                            </Link>
                            <Link
                                href="https://x.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Twitter"
                                className="hover:scale-110 transition-transform duration-200"
                            >
                                <FaXTwitter className="font-roboto text-[26px] font-light hover:text-gray-800 transition-colors" />
                            </Link>
                            <Link
                                href="https://linkedin.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="LinkedIn"
                                className="hover:scale-110 transition-transform duration-200"
                            >
                                <AiOutlineLinkedin className="font-roboto text-3xl font-light hover:text-blue-700 transition-colors" />
                            </Link>
                            <Link
                                href="https://youtube.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="YouTube"
                                className="hover:scale-110 transition-transform duration-200"
                            >
                                <TbBrandYoutube className="font-roboto text-3xl font-light hover:text-red-600 transition-colors" />
                            </Link>
                        </div>
                    </div>

                    <div className="space-y-3 w-full">
                        <p className="text-base font-normal font-roboto text-black text-center lg:text-left">
                            Join our newsletter to stay up to date on features and releases.
                        </p>
                        <form
                            onSubmit={(e) => e.preventDefault()}
                            className="flex flex-col sm:flex-row items-center gap-3"
                        >
                            <input
                                type="email"
                                required
                                placeholder="Enter your email"
                                className="p-3 w-full lg:w-[365px] bg-[#FFFCB7] rounded-lg dark:placeholder:text-gray-700 border border-solid border-black focus:outline-none focus:ring-2 focus:ring-black transition-all"
                            />
                            <button
                                type="submit"
                                className="w-full sm:w-auto px-6 py-3 bg-[#FFFCB7] text-black font-medium border border-solid border-black rounded-lg hover:bg-black hover:text-white transition-all duration-300 shadow-sm hover:shadow-md"
                            >
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="w-4/5 mx-auto flex flex-col sm:flex-row justify-between items-center border-t border-solid border-black/80 pt-6 pb-10 gap-4">
                <p className="text-sm font-roboto text-center sm:text-left">
                    © {new Date().getFullYear()} Toy House. All rights reserved.
                </p>
                <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6">
                    <Link
                        href="/privacyPolicy"
                        className="text-sm font-roboto hover:underline transition-all"
                    >
                        Privacy Policy
                    </Link>
                    <Link
                        href="/terms"
                        className="text-sm font-roboto hover:underline transition-all"
                    >
                        Terms of Service
                    </Link>
                    <button
                        type="button"
                        className="text-sm font-roboto hover:underline transition-all cursor-pointer"
                    >
                        Cookies Settings
                    </button>
                </div>
            </div>
        </footer>
    );
};

export default Footer;