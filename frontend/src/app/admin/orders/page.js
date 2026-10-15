"use client";

import { Fragment, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FiSearch, FiUser, FiUserX, FiChevronDown } from "react-icons/fi";
import useAdminApi from "@/components/admin/useAdminApi";
import {
  PageHeader,
  Card,
  Dropdown,
  inputClass,
  inputStyle,
} from "@/components/admin/AdminUI";
import {
  STATUS_TABS,
  STATUS_STYLE,
  statusLabel,
} from "@/components/admin/orderStatus";
import {
  confirmStatusChange,
  toastSuccess,
  toastError,
} from "@/components/admin/confirmStatus";

const STATUS_OPTIONS = STATUS_TABS.filter((t) => t.key !== "all").map((t) => ({
  value: t.key,
  label: t.label,
}));

export default function AdminOrdersPage() {
  const api = useAdminApi();
  const router = useRouter();

  const [tab, setTab] = useState("all");
  const [search, setSearch] = useState("");
  const [orders, setOrders] = useState([]);
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState(null);
  const [details, setDetails] = useState({});

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (tab !== "all") params.set("status", tab);
      if (search.trim()) params.set("q", search.trim());
      const json = await api(`/admin/orders?${params.toString()}`);
      setOrders(json.data.orders);
      setCounts(json.data.counts);
      setError("");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [api, tab, search]);

  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
  }, [load]);

  const toggleExpand = async (id) => {
    if (expanded === id) return setExpanded(null);
    setExpanded(id);
    if (!details[id]) {
      try {
        const json = await api(`/admin/orders/${id}`);
        setDetails((d) => ({ ...d, [id]: json.data }));
      } catch (e) {
        setError(e.message);
      }
    }
  };

  const handleStatusChange = async (order, newStatus) => {
    if (newStatus === order.status) return;

    // Cancel চাপলে কিছুই বদলাবে না (dropdown-এর মান state থেকেই আসে, তাই আগেরটাই থাকে)
    const ok = await confirmStatusChange(order.id, order.status, newStatus);
    if (!ok) return;

    try {
      await api(`/admin/orders/${order.id}/status`, {
        method: "PATCH",
        body: { status: newStatus },
      });
      toastSuccess(`Order #${order.id} is now ${statusLabel(newStatus)}`);
      await load(); // tab count ও filter ঠিক রাখতে আবার আনা হচ্ছে
    } catch (e) {
      toastError(e.message);
    }
  };

  return (
    <div>
      <PageHeader title="Orders" subtitle="Manage orders by status" />

      {/* Tabs */}
      <div className="-mx-1 mb-4 flex gap-2 overflow-x-auto px-1 pb-2">
        {STATUS_TABS.map((t) => {
          const active = tab === t.key;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className="inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold transition-colors"
              style={{
                backgroundColor: active
                  ? "var(--ph-primary)"
                  : "var(--ph-surface)",
                borderColor: active ? "var(--ph-primary)" : "var(--ph-border)",
                color: "#1E2B2B",
                fontFamily: "var(--font-body)",
              }}
            >
              {t.label}
              <span className="rounded-full bg-black/10 px-1.5 py-0.5 text-[10px]">
                {counts[t.key] ?? 0}
              </span>
            </button>
          );
        })}
      </div>

      <div className="relative mb-4 max-w-sm">
        <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--ph-text-faint)]" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search order #, name, phone..."
          className={`${inputClass} pl-10`}
          style={inputStyle}
        />
      </div>

      {error && (
        <p className="mb-3 text-sm font-semibold text-[var(--ph-coral)]">
          {error}
        </p>
      )}

      <Card className="overflow-x-auto !p-0">
        <table
          className="w-full min-w-[980px] text-left text-sm"
          style={{ fontFamily: "var(--font-body)" }}
        >
          <thead>
            <tr
              className="border-b text-[11px] uppercase tracking-wide text-[var(--ph-text-faint)]"
              style={{ borderColor: "var(--ph-border)" }}
            >
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Items</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Change Status</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-8 text-center text-[var(--ph-text-faint)]"
                >
                  Loading...
                </td>
              </tr>
            )}
            {!loading && orders.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-8 text-center text-[var(--ph-text-faint)]"
                >
                  No {tab === "all" ? "" : statusLabel(tab).toLowerCase() + " "}
                  orders.
                </td>
              </tr>
            )}

            {orders.map((o) => {
              const st = STATUS_STYLE[o.status] || STATUS_STYLE.pending;
              const isOpen = expanded === o.id;
              const d = details[o.id];

              return (
                <Fragment key={o.id}>
                  {/* Row click → detail page */}
                  <tr
                    onClick={() => router.push(`/admin/orders/${o.id}`)}
                    className="cursor-pointer border-b transition-colors hover:bg-[var(--ph-primary-soft)]"
                    style={{ borderColor: "var(--ph-border)" }}
                  >
                    <td className="px-4 py-3 font-bold text-[var(--ph-text)]">
                      #{o.id}
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span
                          title={o.user_id ? "Registered user" : "Guest"}
                          className="text-[var(--ph-text-faint)]"
                        >
                          {o.user_id ? <FiUser /> : <FiUserX />}
                        </span>
                        <div>
                          <p className="font-semibold text-[var(--ph-text)]">
                            {o.name}
                          </p>
                          <p className="text-[11px] text-[var(--ph-text-faint)]">
                            {o.phone} · {o.city}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleExpand(o.id);
                        }}
                        className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-[var(--ph-text-soft)] hover:bg-white"
                        aria-label="Show items"
                      >
                        {o.item_count}
                        <FiChevronDown
                          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
                        />
                      </button>
                    </td>

                    <td className="px-4 py-3 font-semibold text-[var(--ph-text)]">
                      BDT {Number(o.total).toLocaleString()}
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className="rounded-full px-2.5 py-1 text-[11px] font-bold"
                        style={{ backgroundColor: st.bg, color: st.color }}
                      >
                        {statusLabel(o.status)}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-[var(--ph-text-soft)]">
                      {new Date(o.created_at).toLocaleDateString("en-GB")}
                    </td>

                    {/* Inline status dropdown: click এ detail পেজে যাবে না */}
                    <td
                      className="px-4 py-3"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="w-44">
                        <Dropdown
                          options={STATUS_OPTIONS}
                          value={o.status}
                          onChange={(v) => handleStatusChange(o, v)}
                        />
                      </div>
                    </td>
                  </tr>

                  {isOpen && (
                    <tr
                      className="border-b"
                      style={{
                        borderColor: "var(--ph-border)",
                        backgroundColor: "var(--ph-bg)",
                      }}
                    >
                      <td colSpan={7} className="px-4 py-3">
                        {!d ? (
                          <p className="text-xs text-[var(--ph-text-faint)]">
                            Loading items...
                          </p>
                        ) : (
                          <div className="space-y-2">
                            {d.items.map((it) => (
                              <div
                                key={it.id}
                                className="flex items-center gap-3"
                              >
                                <div
                                  className="h-11 w-11 shrink-0 overflow-hidden rounded-lg border bg-white"
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
                                <div className="min-w-0 flex-1">
                                  <p className="truncate text-sm font-semibold text-[var(--ph-text)]">
                                    {it.product_name}
                                  </p>
                                  <p className="text-[11px] text-[var(--ph-text-faint)]">
                                    {it.brand_name}
                                    {it.color_name
                                      ? ` · ${it.color_name}`
                                      : ""}{" "}
                                    · Qty {it.quantity}
                                  </p>
                                </div>
                                <p className="text-sm font-bold text-[var(--ph-text)]">
                                  BDT{" "}
                                  {(
                                    Number(it.unit_price) * it.quantity
                                  ).toLocaleString()}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
