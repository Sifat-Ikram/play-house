"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  FiChevronLeft,
  FiMapPin,
  FiPhone,
  FiMail,
  FiTruck,
  FiCreditCard,
} from "react-icons/fi";
import useAdminApi from "@/components/admin/useAdminApi";
import { PageHeader, Card, Dropdown } from "@/components/admin/AdminUI";
import {
  STATUS_TABS,
  STATUS_STYLE,
  statusLabel,
} from "@/components/admin/orderStatus";

const STATUS_OPTIONS = STATUS_TABS.filter((t) => t.key !== "all").map((t) => ({
  value: t.key,
  label: t.label,
}));

export default function AdminOrderDetailPage() {
  const { id } = useParams();
  const api = useAdminApi();

  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    try {
      const json = await api(`/admin/orders/${id}`);
      setOrder(json.data);
      setStatus(json.data.status);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [api, id]);

  useEffect(() => {
    load();
  }, [load]);

  const saveStatus = async () => {
    setError("");
    setMessage("");
    setSaving(true);
    try {
      await api(`/admin/orders/${id}/status`, {
        method: "PATCH",
        body: { status },
      });
      await load();
      setMessage(`Status changed to “${statusLabel(status)}”`);
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <p className="py-10 text-center text-sm text-[var(--ph-text-faint)]">
        Loading...
      </p>
    );
  if (!order)
    return (
      <p className="py-10 text-center text-sm font-semibold text-[var(--ph-coral)]">
        {error || "Order not found"}
      </p>
    );

  const st = STATUS_STYLE[order.status] || STATUS_STYLE.pending;

  return (
    <div>
      <Link
        href="/admin/orders"
        className="mb-3 inline-flex items-center gap-1 text-xs font-semibold text-[var(--ph-text-soft)] hover:text-[var(--ph-text)]"
      >
        <FiChevronLeft /> Back to orders
      </Link>

      <PageHeader
        title={`Order #${order.id}`}
        subtitle={`Placed ${new Date(order.created_at).toLocaleString("en-GB")} · ${order.user_id ? "Registered user" : "Guest checkout"}`}
        action={
          <span
            className="rounded-full px-4 py-1.5 text-xs font-bold"
            style={{ backgroundColor: st.bg, color: st.color }}
          >
            {statusLabel(order.status)}
          </span>
        }
      />

      {/* Status control */}
      <Card className="mb-5">
        <h2
          className="mb-3 text-base font-semibold text-[var(--ph-text)]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Update status
        </h2>
        <div className="flex flex-wrap items-center gap-3">
          <div className="w-full sm:w-64">
            <Dropdown
              options={STATUS_OPTIONS}
              value={status}
              onChange={setStatus}
            />
          </div>
          <button
            type="button"
            onClick={saveStatus}
            disabled={saving || status === order.status}
            className="rounded-full px-6 py-2.5 text-sm font-bold text-[#1E2B2B] disabled:opacity-50"
            style={{
              backgroundColor: "var(--ph-primary)",
              fontFamily: "var(--font-body)",
            }}
          >
            {saving ? "Saving..." : "Save Status"}
          </button>
        </div>
        <p
          className="mt-2 text-[11px] text-[var(--ph-text-faint)]"
          style={{ fontFamily: "var(--font-body)" }}
        >
          Cancelled / Returned / Refunded করলে stock নিজে থেকে ফেরত আসে।
        </p>
        {error && (
          <p className="mt-3 text-sm font-semibold text-[var(--ph-coral)]">
            {error}
          </p>
        )}
        {message && (
          <p
            className="mt-3 text-sm font-semibold"
            style={{ color: "#1E9C79" }}
          >
            {message}
          </p>
        )}
      </Card>

      {order.return_request && (
        <Card className="mb-5">
          <h2
            className="mb-2 text-base font-semibold text-[var(--ph-text)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Return request ({order.return_request.status})
          </h2>
          <p
            className="text-sm text-[var(--ph-text-soft)]"
            style={{ fontFamily: "var(--font-body)" }}
          >
            <b>{order.return_request.reason}</b>
            {order.return_request.note ? `: ${order.return_request.note}` : ""}
          </p>
          <p className="mt-1 text-[11px] text-[var(--ph-text-faint)]">
            অনুমোদন করতে status "Returned" করুন, বাতিল করতে "Delivered"-এ ফেরান।
          </p>
        </Card>
      )}

      {/* Items */}
      <Card className="mb-5">
        <h2
          className="mb-4 text-base font-semibold text-[var(--ph-text)]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Items ({order.items.length})
        </h2>
        <div className="space-y-3">
          {order.items.map((it) => (
            <div
              key={it.id}
              className="flex items-center gap-3 border-b pb-3 last:border-b-0 last:pb-0"
              style={{ borderColor: "var(--ph-border)" }}
            >
              <div
                className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border bg-white"
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
                <p className="flex items-center gap-1.5 text-[11px] text-[var(--ph-text-faint)]">
                  {it.color_hex && (
                    <span
                      className="h-3 w-3 rounded-full border"
                      style={{ backgroundColor: it.color_hex }}
                    />
                  )}
                  {it.brand_name} {it.color_name ? `· ${it.color_name}` : ""} ·
                  SKU {it.sku || "—"}
                </p>
                <p className="text-[11px] text-[var(--ph-text-soft)]">
                  {Number(it.unit_price).toLocaleString()} × {it.quantity}
                </p>
              </div>
              <p
                className="text-sm font-bold text-[var(--ph-text)]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                BDT {(Number(it.unit_price) * it.quantity).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Card>
          <h2
            className="mb-3 text-base font-semibold text-[var(--ph-text)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Customer
          </h2>
          <div
            className="space-y-2 text-sm text-[var(--ph-text-soft)]"
            style={{ fontFamily: "var(--font-body)" }}
          >
            <p className="font-semibold text-[var(--ph-text)]">{order.name}</p>
            <p className="flex items-center gap-2">
              <FiPhone /> {order.phone}
            </p>
            {order.email && (
              <p className="flex items-center gap-2">
                <FiMail /> {order.email}
              </p>
            )}
            <p className="flex items-start gap-2">
              <FiMapPin className="mt-0.5 shrink-0" /> {order.shipping_address},{" "}
              {order.city}
            </p>
            <p className="flex items-center gap-2">
              <FiTruck />{" "}
              {order.delivery_option === "INSIDE_DHAKA"
                ? "Inside Dhaka"
                : "Outside Dhaka"}
            </p>
            <p className="flex items-center gap-2 uppercase">
              <FiCreditCard /> {order.payment_method}
            </p>
          </div>
        </Card>

        <Card>
          <h2
            className="mb-3 text-base font-semibold text-[var(--ph-text)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Billing
          </h2>
          <div
            className="space-y-2 text-sm"
            style={{ fontFamily: "var(--font-body)" }}
          >
            <div className="flex justify-between text-[var(--ph-text-soft)]">
              <span>Subtotal</span>
              <span>BDT {Number(order.subtotal).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-[var(--ph-text-soft)]">
              <span>Shipping</span>
              <span>BDT {Number(order.shipping_cost).toLocaleString()}</span>
            </div>
            <div
              className="flex justify-between border-t pt-2 font-bold text-[var(--ph-text)]"
              style={{ borderColor: "var(--ph-border)" }}
            >
              <span>Total</span>
              <span style={{ color: "var(--ph-primary-dark)" }}>
                BDT {Number(order.total).toLocaleString()}
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
