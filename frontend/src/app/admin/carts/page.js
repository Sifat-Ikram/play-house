"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  FiTrash2,
  FiUser,
  FiUserX,
  FiSearch,
  FiMinus,
  FiPlus,
} from "react-icons/fi";
import useAdminApi from "@/components/admin/useAdminApi";
import {
  PageHeader,
  Card,
  inputClass,
  inputStyle,
} from "@/components/admin/AdminUI";

export default function AdminCartsPage() {
  const api = useAdminApi();
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      const json = await api("/admin/carts");
      setItems(json.data);
      setError("");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    load();
  }, [load]);

  const changeQty = async (item, qty) => {
    if (qty < 1) return;
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, quantity: qty } : i)),
    );
    try {
      await api(`/admin/carts/${item.id}`, {
        method: "PUT",
        body: { quantity: qty },
      });
    } catch (e) {
      setError(e.message);
      load();
    }
  };

  const remove = async (item) => {
    if (!window.confirm(`Remove "${item.product_name}" from this cart?`))
      return;
    try {
      await api(`/admin/carts/${item.id}`, { method: "DELETE" });
      setItems((prev) => prev.filter((i) => i.id !== item.id));
    } catch (e) {
      setError(e.message);
    }
  };

  // user_id থাকলে user অনুযায়ী, না থাকলে cart_token অনুযায়ী group
  const groups = useMemo(() => {
    const map = new Map();
    items.forEach((i) => {
      const key = i.user_id ? `u-${i.user_id}` : `g-${i.cart_token}`;
      if (!map.has(key)) {
        map.set(key, {
          key,
          isUser: !!i.user_id,
          title: i.user_id ? i.user_name : "Guest",
          sub: i.user_id
            ? i.user_email
            : `Token ${String(i.cart_token).slice(0, 8)}…`,
          items: [],
        });
      }
      map.get(key).items.push(i);
    });

    const term = search.trim().toLowerCase();
    return [...map.values()].filter(
      (g) =>
        !term ||
        String(g.title).toLowerCase().includes(term) ||
        String(g.sub).toLowerCase().includes(term) ||
        g.items.some((i) => i.product_name.toLowerCase().includes(term)),
    );
  }, [items, search]);

  return (
    <div>
      <PageHeader
        title="Carts"
        subtitle={`${groups.length} active carts · ${items.length} items`}
      />

      <div className="relative mb-4 max-w-sm">
        <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--ph-text-faint)]" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search user, email, product..."
          className={`${inputClass} pl-10`}
          style={inputStyle}
        />
      </div>

      {error && (
        <p className="mb-3 text-sm font-semibold text-[var(--ph-coral)]">
          {error}
        </p>
      )}

      {loading ? (
        <p className="py-8 text-center text-sm text-[var(--ph-text-faint)]">
          Loading...
        </p>
      ) : groups.length === 0 ? (
        <Card>
          <p className="py-6 text-center text-sm text-[var(--ph-text-soft)]">
            No carts found.
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {groups.map((g) => {
            const total = g.items.reduce(
              (s, i) => s + Number(i.selling_price) * i.quantity,
              0,
            );
            return (
              <Card key={g.key} className="!p-0 overflow-hidden">
                <div
                  className="flex flex-wrap items-center justify-between gap-2 border-b px-4 py-3"
                  style={{
                    borderColor: "var(--ph-border)",
                    backgroundColor: "var(--ph-bg)",
                  }}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className="flex h-9 w-9 items-center justify-center rounded-full"
                      style={{
                        backgroundColor: "var(--ph-primary-soft)",
                        color: "var(--ph-primary-dark)",
                      }}
                    >
                      {g.isUser ? <FiUser /> : <FiUserX />}
                    </span>
                    <div style={{ fontFamily: "var(--font-body)" }}>
                      <p className="text-sm font-bold text-[var(--ph-text)]">
                        {g.title}
                      </p>
                      <p className="text-[11px] text-[var(--ph-text-faint)]">
                        {g.sub}
                      </p>
                    </div>
                  </div>
                  <p
                    className="text-sm font-bold text-[var(--ph-text)]"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    BDT {total.toLocaleString()}
                  </p>
                </div>

                <div
                  className="divide-y"
                  style={{ borderColor: "var(--ph-border)" }}
                >
                  {g.items.map((i) => (
                    <div
                      key={i.id}
                      className="flex flex-wrap items-center gap-3 px-4 py-3"
                      style={{ borderColor: "var(--ph-border)" }}
                    >
                      <div
                        className="h-14 w-14 shrink-0 overflow-hidden rounded-xl border bg-white"
                        style={{ borderColor: "var(--ph-border)" }}
                      >
                        {i.display_image_url && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={i.display_image_url}
                            alt=""
                            className="h-full w-full object-contain"
                          />
                        )}
                      </div>

                      <div
                        className="min-w-[140px] flex-1"
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        <p className="truncate text-sm font-semibold text-[var(--ph-text)]">
                          {i.product_name}
                        </p>
                        <p className="flex items-center gap-1.5 text-[11px] text-[var(--ph-text-faint)]">
                          {i.color_hex && (
                            <span
                              className="h-3 w-3 rounded-full border"
                              style={{ backgroundColor: i.color_hex }}
                            />
                          )}
                          {i.brand_name}
                          {i.color_name ? ` · ${i.color_name}` : ""} · BDT{" "}
                          {Number(i.selling_price).toLocaleString()}
                        </p>
                        <p
                          className="text-[11px]"
                          style={{
                            color:
                              i.quantity > i.stock_quantity
                                ? "var(--ph-coral)"
                                : "var(--ph-text-faint)",
                          }}
                        >
                          Stock: {i.stock_quantity}
                          {i.quantity > i.stock_quantity
                            ? " (cart exceeds stock)"
                            : ""}
                        </p>
                      </div>

                      <div
                        className="flex items-center overflow-hidden rounded-full border"
                        style={{ borderColor: "var(--ph-border)" }}
                      >
                        <button
                          type="button"
                          onClick={() => changeQty(i, i.quantity - 1)}
                          disabled={i.quantity <= 1}
                          aria-label="Decrease"
                          className="flex h-8 w-8 items-center justify-center hover:bg-[var(--ph-primary-soft)] disabled:opacity-40"
                        >
                          <FiMinus />
                        </button>
                        <span className="w-8 text-center text-sm font-bold text-[var(--ph-text)]">
                          {i.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => changeQty(i, i.quantity + 1)}
                          aria-label="Increase"
                          className="flex h-8 w-8 items-center justify-center hover:bg-[var(--ph-primary-soft)]"
                        >
                          <FiPlus />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => remove(i)}
                        aria-label="Remove item"
                        className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--ph-coral)] hover:bg-[var(--ph-coral)]/10"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
