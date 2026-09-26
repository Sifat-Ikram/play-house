"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiSave,
  FiTrash2,
} from "react-icons/fi";
import { useAuth } from "@/provider/AuthProvider";

const baseUrl =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://play-house-backend.vercel.app/api";

const ProfileContent = ({ initialProfile }) => {
  const { authFetch, isLoggedIn, logout, authLoading } = useAuth();

  const [profile, setProfile] = useState(initialProfile);
  const [name, setName] = useState(initialProfile?.name || "");
  const [phone, setPhone] = useState(initialProfile?.phone_number || "");
  const [address, setAddress] = useState(initialProfile?.addresses || "");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  console.log(profile);
  

  // Fallback: if server render couldn't fetch (token expired/missing),
  // retry client-side once the AuthProvider has a valid access token.
  useEffect(() => {
    if (!initialProfile && !authLoading && isLoggedIn) {
      (async () => {
        try {
          const res = await authFetch(`${baseUrl}/profile`);
          if (res.ok) {
            const data = await res.json();
            setProfile(data.data);
            setName(data.data.name || "");
            setPhone(data.data.phone_number || "");
            setAddress(data.data.addresses || "");
          }
        } catch (err) {
          console.error("Client profile fetch error:", err);
        }
      })();
    }
  }, [initialProfile, isLoggedIn, authFetch, authLoading]);

  const handleSave = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setIsSaving(true);

    try {
      const res = await authFetch(`${baseUrl}/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone_number: phone, addresses: address }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      setProfile(data.data);
      setMessage("Profile updated successfully!");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to delete your account? This cannot be undone.",
      )
    ) {
      return;
    }

    setIsDeleting(true);

    try {
      const res = await authFetch(`${baseUrl}/profile`, { method: "DELETE" });

      if (res.ok) {
        await logout();
        window.location.href = "/";
      }
    } catch (err) {
      setError("Failed to delete account. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (authLoading) {
    return null;
  }

  if (!isLoggedIn) {
    return (
      <div className="w-11/12 max-w-md mx-auto py-20 text-center">
        <p
          className="text-lg font-semibold text-[var(--ph-text)]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Please log in to view your profile
        </p>
      </div>
    );
  }

  return (
    <div className="w-11/12 max-w-2xl mx-auto py-8 sm:py-12">
      {/* Header */}
      <section
        className="relative isolate overflow-hidden rounded-[28px] mb-8"
        style={{ backgroundColor: "#FCD98C" }}
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full blur-2xl"
          style={{ backgroundColor: "var(--ph-primary-dark)", opacity: 0.35 }}
        />
        <div className="relative z-10 px-6 sm:px-8 py-8 sm:py-10 flex items-center gap-4">
          <div
            className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full text-2xl"
            style={{ backgroundColor: "var(--ph-surface)" }}
          >
            👤
          </div>
          <div>
            <h1
              className="text-xl sm:text-2xl font-semibold text-[#1E2B2B]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {profile?.name || "Your Profile"}
            </h1>
            <p
              className="text-xs sm:text-sm text-[#1E2B2B]/70"
              style={{ fontFamily: "var(--font-body)" }}
            >
              {profile?.email}
            </p>
          </div>
        </div>
      </section>

      {/* Edit form */}
      <form
        onSubmit={handleSave}
        className="rounded-[24px] border border-[var(--ph-border)] bg-[var(--ph-surface)] p-5 sm:p-7 space-y-4"
      >
        <div className="relative">
          <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--ph-text-faint)]" />
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-full border pl-11 pr-4 py-3 text-sm outline-none focus:border-[var(--ph-primary)] transition-colors"
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
            value={profile?.email || ""}
            disabled
            className="w-full rounded-full border pl-11 pr-4 py-3 text-sm outline-none opacity-60 cursor-not-allowed"
            style={{
              borderColor: "var(--ph-border)",
              backgroundColor: "var(--ph-bg)",
              color: "var(--ph-text)",
              fontFamily: "var(--font-body)",
            }}
          />
        </div>

        <div className="relative">
          <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--ph-text-faint)]" />
          <input
            type="tel"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-full border pl-11 pr-4 py-3 text-sm outline-none focus:border-[var(--ph-primary)] transition-colors"
            style={{
              borderColor: "var(--ph-border)",
              backgroundColor: "var(--ph-bg)",
              color: "var(--ph-text)",
              fontFamily: "var(--font-body)",
            }}
          />
        </div>

        <div className="relative">
          <FiMapPin className="absolute left-4 top-3.5 text-[var(--ph-text-faint)]" />
          <textarea
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            rows={3}
            className="w-full rounded-[20px] border pl-11 pr-4 py-3 text-sm outline-none focus:border-[var(--ph-primary)] transition-colors resize-none"
            style={{
              borderColor: "var(--ph-border)",
              backgroundColor: "var(--ph-bg)",
              color: "var(--ph-text)",
              fontFamily: "var(--font-body)",
            }}
          />
        </div>

        {message && (
          <p
            className="text-xs font-semibold text-center"
            style={{ color: "#1E9C79" }}
          >
            {message}
          </p>
        )}
        {error && (
          <p className="text-xs font-semibold text-center text-[var(--ph-coral)]">
            {error}
          </p>
        )}

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isSaving}
          className="w-full inline-flex items-center justify-center gap-2 rounded-full py-3 text-sm font-bold text-[#1E2B2B] shadow-md disabled:opacity-60"
          style={{
            backgroundColor: "var(--ph-primary)",
            fontFamily: "var(--font-body)",
          }}
        >
          <FiSave /> {isSaving ? "Saving..." : "Save Changes"}
        </motion.button>
      </form>

      {/* Danger zone */}
      <div
        className="mt-6 rounded-[24px] border p-5 sm:p-7"
        style={{ borderColor: "var(--ph-coral)" }}
      >
        <h3
          className="text-sm font-bold text-[var(--ph-coral)] mb-2"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Danger Zone
        </h3>
        <p
          className="text-xs text-[var(--ph-text-soft)] mb-4"
          style={{ fontFamily: "var(--font-body)" }}
        >
          Deleting your account is permanent and cannot be undone.
        </p>
        <button
          type="button"
          onClick={handleDelete}
          disabled={isDeleting}
          className="inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-bold disabled:opacity-60"
          style={{
            borderColor: "var(--ph-coral)",
            color: "var(--ph-coral)",
            fontFamily: "var(--font-body)",
          }}
        >
          <FiTrash2 /> {isDeleting ? "Deleting..." : "Delete Account"}
        </button>
      </div>
    </div>
  );
};

export default ProfileContent;
