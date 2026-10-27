"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FiBell, FiBellOff } from "react-icons/fi";
import { useAuth } from "@/provider/AuthProvider";

const baseUrl =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://play-house-backend.vercel.app/api";

export default function NotifyMe({ inventoryId }) {
  const { authFetch, isLoggedIn, isLoading } = useAuth();
  const [subscribed, setSubscribed] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (isLoading || !isLoggedIn || !inventoryId) return;
    authFetch(`${baseUrl}/stock-alerts/mine`)
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => j && setSubscribed((j.data || []).includes(inventoryId)))
      .catch(() => {});
  }, [isLoading, isLoggedIn, inventoryId, authFetch]);

  if (isLoading) return null;

  if (!isLoggedIn) {
    return (
      <Link
        href="/logIn"
        className="mt-4 inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-bold text-[var(--ph-text)]"
        style={{
          borderColor: "var(--ph-border)",
          fontFamily: "var(--font-body)",
        }}
      >
        <FiBell /> Log in to get notified when it's back
      </Link>
    );
  }

  const toggle = async () => {
    setBusy(true);
    try {
      if (subscribed) {
        await authFetch(`${baseUrl}/stock-alerts/${inventoryId}`, {
          method: "DELETE",
        });
        setSubscribed(false);
      } else {
        await authFetch(`${baseUrl}/stock-alerts`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ inventory_id: inventoryId }),
        });
        setSubscribed(true);
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={busy}
      className="mt-4 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold text-[#1E2B2B] disabled:opacity-60"
      style={{
        backgroundColor: subscribed
          ? "var(--ph-primary-soft)"
          : "var(--ph-primary)",
        fontFamily: "var(--font-body)",
      }}
    >
      {subscribed ? (
        <>
          <FiBellOff /> You'll be emailed when it's back
        </>
      ) : (
        <>
          <FiBell /> Notify me when back in stock
        </>
      )}
    </button>
  );
}
