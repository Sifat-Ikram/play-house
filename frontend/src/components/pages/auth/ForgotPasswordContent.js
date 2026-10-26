"use client";

import { useState } from "react";
import Link from "next/link";
import AuthShell, { authInputClass, authInputStyle } from "./AuthShell";

const baseUrl =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://play-house-backend.vercel.app/api";

export default function ForgotPasswordContent() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const res = await fetch(`${baseUrl}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Something went wrong");
      setDone(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell eyebrow="Account recovery" title="Forgot password?">
      {done ? (
        <div className="text-center" style={{ fontFamily: "var(--font-body)" }}>
          <p className="text-4xl">📬</p>
          <p className="mt-3 text-sm text-[var(--ph-text-soft)]">
            If an account exists for{" "}
            <b className="text-[var(--ph-text)]">{email}</b>, we've sent a reset
            link. It works for 30 minutes.
          </p>
          <Link
            href="/logIn"
            className="mt-5 inline-block text-sm font-bold"
            style={{ color: "var(--ph-accent)" }}
          >
            Back to login
          </Link>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <p
            className="text-sm text-[var(--ph-text-soft)]"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Enter your email and we'll send you a link to set a new password.
          </p>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
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
            {busy ? "Sending..." : "Send reset link"}
          </button>
          <Link
            href="/logIn"
            className="block text-center text-xs font-semibold text-[var(--ph-text-soft)] hover:underline"
          >
            Back to login
          </Link>
        </form>
      )}
    </AuthShell>
  );
}
