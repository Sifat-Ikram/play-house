"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import AuthShell, { authInputClass, authInputStyle } from "./AuthShell";

const baseUrl =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://play-house-backend.vercel.app/api";

export default function ResetPasswordContent() {
  const token = useSearchParams().get("token") || "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 6)
      return setError("Password must be at least 6 characters");
    if (password !== confirm) return setError("Passwords do not match");

    setBusy(true);
    try {
      const res = await fetch(`${baseUrl}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Could not reset password");
      setDone(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell eyebrow="Account recovery" title="Set a new password">
      {!token ? (
        <p className="text-sm text-[var(--ph-coral)]">
          This link is missing its token. Please request a new reset link.
        </p>
      ) : done ? (
        <div className="text-center" style={{ fontFamily: "var(--font-body)" }}>
          <p className="text-4xl">✅</p>
          <p className="mt-3 text-sm text-[var(--ph-text-soft)]">
            Your password has been updated.
          </p>
          <Link
            href="/logIn"
            className="mt-5 inline-block rounded-full px-6 py-2.5 text-sm font-bold text-white"
            style={{ backgroundColor: "var(--ph-accent)" }}
          >
            Go to login
          </Link>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="New password"
            className={authInputClass}
            style={authInputStyle}
          />
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Confirm new password"
            className={authInputClass}
            style={authInputStyle}
          />
          {error && (
            <p className="text-xs font-semibold text-[var(--ph-coral)]">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-full py-3 text-sm font-bold text-[#1E2B2B] shadow-md disabled:opacity-60"
            style={{
              backgroundColor: "var(--ph-primary)",
              fontFamily: "var(--font-body)",
            }}
          >
            {busy ? "Saving..." : "Update password"}
          </button>
        </form>
      )}
    </AuthShell>
  );
}
