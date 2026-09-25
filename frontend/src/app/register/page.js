"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  FiUser,
  FiMail,
  FiLock,
  FiUserPlus,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";
import { useAuth } from "@/provider/AuthProvider";

const RegisterPage = () => {
  const router = useRouter();
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setIsSubmitting(true);

    try {
      await register({ name, email, password });
      router.push("/");
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[var(--ph-bg)] flex items-center justify-center px-4 py-12 sm:py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md overflow-hidden rounded-[28px] sm:rounded-[32px] border border-[var(--ph-border)] bg-[var(--ph-surface)] shadow-xl"
      >
        <div
          className="relative h-24 sm:h-28 flex items-center justify-center overflow-hidden"
          style={{ backgroundColor: "var(--ph-accent-soft)" }}
        >
          <motion.div
            animate={{ y: [0, -8, 0], rotate: [0, 8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute left-6 top-4 text-2xl opacity-70"
          >
            🎈
          </motion.div>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            className="text-5xl select-none"
          >
            🧸
          </motion.div>
          <motion.div
            animate={{ y: [0, 8, 0], rotate: [0, -8, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute right-8 bottom-4 text-xl opacity-60"
          >
            ✨
          </motion.div>
        </div>

        <div className="px-6 sm:px-8 py-7 sm:py-9">
          <h1
            className="text-2xl sm:text-3xl font-semibold text-[var(--ph-text)] text-center"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Join Play House!
          </h1>
          <p
            className="mt-1.5 text-sm text-[var(--ph-text-soft)] text-center"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Create an account for a better toy shopping experience 🎉
          </p>

          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
            <div className="relative">
              <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--ph-text-faint)]" />
              <input
                type="text"
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-full border pl-11 pr-4 py-3 text-sm outline-none transition-colors focus:border-[var(--ph-primary)]"
                style={{
                  borderColor: "var(--ph-border)",
                  backgroundColor: "var(--ph-bg)",
                  color: "var(--ph-text)",
                  fontFamily: "var(--font-body)",
                }}
              />
            </div>

            <div className="relative">
              <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--ph-text-faint)]" />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-full border pl-11 pr-4 py-3 text-sm outline-none transition-colors focus:border-[var(--ph-primary)]"
                style={{
                  borderColor: "var(--ph-border)",
                  backgroundColor: "var(--ph-bg)",
                  color: "var(--ph-text)",
                  fontFamily: "var(--font-body)",
                }}
              />
            </div>

            <div className="relative">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--ph-text-faint)]" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password (min. 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-full border pl-11 pr-11 py-3 text-sm outline-none transition-colors focus:border-[var(--ph-primary)]"
                style={{
                  borderColor: "var(--ph-border)",
                  backgroundColor: "var(--ph-bg)",
                  color: "var(--ph-text)",
                  fontFamily: "var(--font-body)",
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--ph-text-faint)]"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>

            {error && (
              <p
                className="text-xs font-semibold text-[var(--ph-coral)] text-center"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {error}
              </p>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSubmitting}
              className="w-full inline-flex items-center justify-center gap-2 rounded-full py-3 text-sm font-bold text-white shadow-md hover:shadow-lg transition-shadow disabled:opacity-60"
              style={{
                backgroundColor: "var(--ph-accent)",
                fontFamily: "var(--font-body)",
              }}
            >
              <FiUserPlus />
              {isSubmitting ? "Creating account..." : "Create Account"}
            </motion.button>
          </form>

          <p
            className="mt-5 text-center text-xs sm:text-sm text-[var(--ph-text-soft)]"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Already have an account?{" "}
            <Link
              href="/logIn"
              className="font-bold hover:underline"
              style={{ color: "var(--ph-accent)" }}
            >
              Log in
            </Link>
          </p>
        </div>
      </motion.div>
    </main>
  );
};

export default RegisterPage;
