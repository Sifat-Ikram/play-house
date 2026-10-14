"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { FiSearch, FiChevronRight, FiUser, FiUserX } from "react-icons/fi";
import useAdminApi from "@/components/admin/useAdminApi";
import {
  PageHeader,
  Card,
  inputClass,
  inputStyle,
} from "@/components/admin/AdminUI";
import {
  STATUS_TABS,
  STATUS_STYLE,
  statusLabel,
} from "@/components/admin/orderStatus";

export default function AdminOrdersPage() {
  const api = useAdminApi();

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
          className="w-full min-w-[760px] text-left text-sm"
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
              <th className="w-10 px-2 py-3" />
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
                <FragmentRow key={o.id}>
                  <tr
                    onClick={() => toggleExpand(o.id)}
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
                    <td className="px-4 py-3 text-[var(--ph-text-soft)]">
                      {o.item_count}
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
                    <td className="px-2 py-3">
                      <Link
                        href={`/admin/orders/${o.id}`}
                        onClick={(e) => e.stopPropagation()}
                        aria-label="Open order"
                        className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-white"
                      >
                        <FiChevronRight />
                      </Link>
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
                </FragmentRow>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
}


function FragmentRow({ children }) {
  return <>{children}</>;
}
