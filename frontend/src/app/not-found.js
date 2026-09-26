import Link from "next/link";
import { FiHome, FiSearch } from "react-icons/fi";

export default function NotFound() {
  return (
    <main
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: "#FCD98C" }}
    >
      <div className="text-center max-w-md">
        <p className="text-8xl sm:text-9xl select-none mb-2">🧸</p>
        <h1
          className="text-5xl sm:text-6xl font-bold text-[#1E2B2B] mb-2"
          style={{ fontFamily: "var(--font-display)" }}
        >
          404
        </h1>
        <h2
          className="text-xl sm:text-2xl font-semibold text-[#1E2B2B] mb-3"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Oops, this toy wandered off!
        </h2>
        <p
          className="text-sm text-[#1E2B2B]/70 mb-8"
          style={{ fontFamily: "var(--font-body)" }}
        >
          The page you're looking for doesn't exist. Let's get you back to the
          fun.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-white shadow-md"
            style={{
              backgroundColor: "var(--ph-accent)",
              fontFamily: "var(--font-body)",
            }}
          >
            <FiHome /> Back to Home
          </Link>
          <Link
            href="/product"
            className="inline-flex items-center justify-center gap-2 rounded-full border px-6 py-3 text-sm font-bold text-[#1E2B2B]"
            style={{ borderColor: "#1E2B2B", fontFamily: "var(--font-body)" }}
          >
            <FiSearch /> Browse Toys
          </Link>
        </div>
      </div>
    </main>
  );
}
