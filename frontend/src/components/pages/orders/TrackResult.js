"use client";

import { useState } from "react";
import Link from "next/link";
import Swal from "sweetalert2";
import {
  FiClock,
  FiCheckCircle,
  FiTruck,
  FiPackage,
  FiXCircle,
  FiRotateCcw,
  FiFileText,
} from "react-icons/fi";
import { useAuth } from "@/provider/AuthProvider";
import { Modal } from "@/components/admin/AdminUI";

const baseUrl =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://play-house-backend.vercel.app/api";

const STEPS = [
  { key: "pending", label: "Order placed", icon: FiClock },
  { key: "confirmed", label: "Confirmed", icon: FiCheckCircle },
  { key: "shipped", label: "Shipped", icon: FiTruck },
  { key: "delivered", label: "Delivered", icon: FiPackage },
];

const OFF_PATH = {
  cancelled: { label: "Cancelled", icon: FiXCircle },
  return_requested: { label: "Return requested", icon: FiRotateCcw },
  returned: { label: "Returned", icon: FiRotateCcw },
  refunded: { label: "Refunded", icon: FiRotateCcw },
};

const REASONS = ["Damaged", "Wrong item", "Not as described", "Other"];

const fmt = (d) =>
  new Date(d).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

export function OrderTimeline({ history = [] }) {
  const reached = (key) => history.find((h) => h.status === key);
  const offPath = history.filter((h) => OFF_PATH[h.status]);
  const lastStatus = history[history.length - 1]?.status;

  const rows = [
    ...STEPS.map((s) => ({ ...s, entry: reached(s.key), off: false })),
    ...offPath.map((h) => ({
      key: `${h.status}-${h.created_at}`,
      ...OFF_PATH[h.status],
      entry: h,
      off: true,
    })),
  ];

  return (
    <ol className="relative space-y-5">
      {rows.map((r, i) => {
        const Icon = r.icon;
        const done = !!r.entry;
        const current =
          r.entry &&
          (r.key === lastStatus ||
            (r.off && r.entry === history[history.length - 1]));
        const color = r.off
          ? "var(--ph-coral)"
          : done
            ? "#1E9C79"
            : "var(--ph-border)";

        return (
          <li key={r.key} className="relative flex gap-3.5">
            {i < rows.length - 1 && (
              <span
                className="absolute left-[15px] top-8 h-[calc(100%+4px)] w-0.5"
                style={{
                  backgroundColor:
                    done && !r.off ? "#9FE8CE" : "var(--ph-border)",
                }}
              />
            )}
            <span
              className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm"
              style={{
                backgroundColor: done ? color : "var(--ph-surface)",
                border: `2px solid ${color}`,
                color: done ? "#fff" : "var(--ph-text-faint)",
              }}
            >
              <Icon />
            </span>
            <div style={{ fontFamily: "var(--font-body)" }}>
              <p
                className="text-sm font-bold"
                style={{
                  color: done ? "var(--ph-text)" : "var(--ph-text-faint)",
                }}
              >
                {r.label}
                {current && (
                  <span
                    className="ml-2 rounded-full px-2 py-0.5 text-[10px] font-bold"
                    style={{
                      backgroundColor: "var(--ph-primary-soft)",
                      color: "var(--ph-primary-dark)",
                    }}
                  >
                    Current
                  </span>
                )}
              </p>
              <p className="text-[11px] text-[var(--ph-text-faint)]">
                {r.entry ? fmt(r.entry.created_at) : "Pending"}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export default function TrackResult({
  data,
  invoiceHref,
  showItems = true,
  onChanged,
}) {
  const { authFetch, isLoggedIn } = useAuth();
  const [returnOpen, setReturnOpen] = useState(false);
  const [reason, setReason] = useState("Damaged");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submitReturn = async () => {
    setBusy(true);
    setError("");
    try {
      const res = await authFetch(`${baseUrl}/orders/${data.id}/return`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason, note }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Could not request return");
      setReturnOpen(false);
      Swal.fire({
        icon: "success",
        title: "Return requested",
        text: "We'll review your request soon.",
        confirmButtonColor: "#F5A623",
      });
      onChanged?.();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="rounded-[24px] border border-[var(--ph-border)] bg-[var(--ph-surface)] p-5 sm:p-7">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2
            className="text-lg font-semibold text-[var(--ph-text)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Order #{data.id}
          </h2>
          <p
            className="text-xs text-[var(--ph-text-faint)]"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Placed {fmt(data.created_at)} · BDT{" "}
            {Number(data.total).toLocaleString()}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {invoiceHref && (
            <Link
              href={invoiceHref}
              className="inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-bold text-[var(--ph-text)] hover:bg-[var(--ph-primary-soft)]"
              style={{
                borderColor: "var(--ph-border)",
                fontFamily: "var(--font-body)",
              }}
            >
              <FiFileText /> Invoice
            </Link>
          )}
          {isLoggedIn && data.can_return && (
            <button
              type="button"
              onClick={() => setReturnOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold text-[#1E2B2B]"
              style={{
                backgroundColor: "var(--ph-primary)",
                fontFamily: "var(--font-body)",
              }}
            >
              <FiRotateCcw /> Request return
            </button>
          )}
        </div>
      </div>

      <OrderTimeline history={data.history} />

      {data.can_return && data.return_deadline && (
        <p
          className="mt-4 text-[11px] text-[var(--ph-text-faint)]"
          style={{ fontFamily: "var(--font-body)" }}
        >
          You can request a return until{" "}
          {new Date(data.return_deadline).toLocaleDateString("en-GB")}.
        </p>
      )}

      {data.return_request && (
        <div
          className="mt-4 rounded-xl p-3 text-xs"
          style={{
            backgroundColor: "#FFE9D2",
            color: "#8A4A0C",
            fontFamily: "var(--font-body)",
          }}
        >
          Return request ({data.return_request.status}):{" "}
          {data.return_request.reason}
        </div>
      )}

      {showItems && (
        <div
          className="mt-6 space-y-3 border-t pt-4"
          style={{ borderColor: "var(--ph-border)" }}
        >
          {data.items.map((it) => (
            <div key={it.id} className="flex items-center gap-3">
              <div
                className="h-12 w-12 shrink-0 overflow-hidden rounded-lg border bg-white"
                style={{ borderColor: "var(--ph-border)" }}
              >
                {it.display_image_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={it.display_image_url}
                    alt=""
                    className="h-full w-full object-contain"
                  />
                )}
              </div>
              <div
                className="min-w-0 flex-1"
                style={{ fontFamily: "var(--font-body)" }}
              >
                <p className="truncate text-sm font-semibold text-[var(--ph-text)]">
                  {it.product_name}
                </p>
                <p className="text-[11px] text-[var(--ph-text-faint)]">
                  {it.brand_name}
                  {it.color_name ? ` · ${it.color_name}` : ""} · Qty{" "}
                  {it.quantity}
                </p>
              </div>
              <p className="text-sm font-bold text-[var(--ph-text)]">
                BDT {(Number(it.unit_price) * it.quantity).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={returnOpen}
        onClose={() => setReturnOpen(false)}
        title="Request a return"
      >
        <p
          className="mb-3 text-sm text-[var(--ph-text-soft)]"
          style={{ fontFamily: "var(--font-body)" }}
        >
          Why do you want to return this order?
        </p>
        <div className="flex flex-wrap gap-2">
          {REASONS.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setReason(r)}
              className="rounded-full border px-3.5 py-1.5 text-xs font-bold"
              style={{
                borderColor:
                  reason === r ? "var(--ph-primary)" : "var(--ph-border)",
                backgroundColor:
                  reason === r ? "var(--ph-primary-soft)" : "transparent",
                color: "var(--ph-text)",
              }}
            >
              {r}
            </button>
          ))}
        </div>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          maxLength={500}
          placeholder="Anything else we should know? (optional)"
          className="mt-4 w-full resize-none rounded-2xl border px-4 py-3 text-sm outline-none focus:border-[var(--ph-primary)]"
          style={{
            borderColor: "var(--ph-border)",
            backgroundColor: "var(--ph-bg)",
            color: "var(--ph-text)",
            fontFamily: "var(--font-body)",
          }}
        />
        {error && (
          <p className="mt-3 text-sm font-semibold text-[var(--ph-coral)]">
            {error}
          </p>
        )}
        <button
          type="button"
          onClick={submitReturn}
          disabled={busy}
          className="mt-4 rounded-full px-6 py-2.5 text-sm font-bold text-[#1E2B2B] disabled:opacity-60"
          style={{
            backgroundColor: "var(--ph-primary)",
            fontFamily: "var(--font-body)",
          }}
        >
          {busy ? "Sending..." : "Submit request"}
        </button>
      </Modal>
    </div>
  );
}
