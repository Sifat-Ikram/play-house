"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiPlus, FiSearch, FiStar } from "react-icons/fi";
import useAdminApi from "@/components/admin/useAdminApi";
import {
  PageHeader,
  Card,
  Modal,
  inputClass,
  inputStyle,
} from "@/components/admin/AdminUI";

function FeaturedModal({ product, onClose, onChanged }) {
  const api = useAdminApi();
  const [detail, setDetail] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!product) return;
    setDetail(null);
    setError("");
    api(`/admin/products/${product.id}`)
      .then((j) => setDetail(j.data))
      .catch((e) => setError(e.message));
  }, [product, api]);

  if (!product) return null;

  const inStock =
    detail?.inventory?.filter(
      (i) => Number(i.stock_quantity) > 0 && !i.mark_unavailable,
    ) || [];
  const makeFeatured = !product.is_featured;

  const confirm = async () => {
    setBusy(true);
    setError("");
    try {
      await api(`/admin/products/${product.id}/featured`, {
        method: "PATCH",
        body: { featured: makeFeatured },
      });
      onChanged(product.id, makeFeatured);
      onClose();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal
      open={!!product}
      onClose={onClose}
      title={
        makeFeatured ? "Add to Featured Collection" : "Remove from Featured"
      }
    >
      <p
        className="text-sm font-semibold text-[var(--ph-text)]"
        style={{ fontFamily: "var(--font-body)" }}
      >
        {product.name}
      </p>

      {!detail && !error && (
        <p className="mt-4 text-sm text-[var(--ph-text-faint)]">
          Checking stock...
        </p>
      )}

      {detail && (
        <div className="mt-4 space-y-2">
          <p className="text-xs font-bold uppercase tracking-wide text-[var(--ph-text-faint)]">
            Stock status
          </p>
          {detail.inventory.length === 0 && (
            <p className="text-sm text-[var(--ph-coral)]">
              This product has no inventory yet.
            </p>
          )}
          {detail.inventory.map((inv) => (
            <div
              key={inv.id}
              className="flex items-center justify-between rounded-xl border px-3 py-2 text-sm"
              style={{
                borderColor: "var(--ph-border)",
                fontFamily: "var(--font-body)",
              }}
            >
              <span className="flex items-center gap-2">
                {inv.color_hex && (
                  <span
                    className="h-3.5 w-3.5 rounded-full border"
                    style={{ backgroundColor: inv.color_hex }}
                  />
                )}
                {inv.color_name || "No colour"}
              </span>
              <span
                className="font-bold"
                style={{
                  color:
                    Number(inv.stock_quantity) > 0 && !inv.mark_unavailable
                      ? "#1E9C79"
                      : "var(--ph-coral)",
                }}
              >
                {inv.mark_unavailable
                  ? "Unavailable"
                  : Number(inv.stock_quantity) > 0
                    ? `${inv.stock_quantity} in stock`
                    : "Out of stock"}
              </span>
            </div>
          ))}

          {makeFeatured && inStock.length === 0 && (
            <p className="pt-1 text-sm font-semibold text-[var(--ph-coral)]">
              Nothing is in stock, so this product can’t be featured. Update the
              stock first.
            </p>
          )}
          {makeFeatured && inStock.length > 0 && (
            <p className="pt-1 text-xs text-[var(--ph-text-soft)]">
              {inStock.length} in-stock variant(s) will appear in the homepage
              Featured Collection.
            </p>
          )}
        </div>
      )}

      {error && (
        <p className="mt-3 text-sm font-semibold text-[var(--ph-coral)]">
          {error}
        </p>
      )}

      <div className="mt-5 flex gap-2.5">
        <button
          type="button"
          onClick={confirm}
          disabled={busy || !detail || (makeFeatured && inStock.length === 0)}
          className="rounded-full px-6 py-2.5 text-sm font-bold text-[#1E2B2B] disabled:opacity-50"
          style={{
            backgroundColor: "var(--ph-primary)",
            fontFamily: "var(--font-body)",
          }}
        >
          {busy
            ? "Saving..."
            : makeFeatured
              ? "Mark as Featured"
              : "Remove from Featured"}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full border px-6 py-2.5 text-sm font-bold text-[var(--ph-text)]"
          style={{ borderColor: "var(--ph-border)" }}
        >
          Cancel
        </button>
      </div>
    </Modal>
  );
}

export default function AdminProductsPage() {
  const api = useAdminApi();
  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [featuredTarget, setFeaturedTarget] = useState(null);

  const load = useCallback(
    async (q = "") => {
      try {
        const json = await api(
          `/admin/products${q ? `?q=${encodeURIComponent(q)}` : ""}`,
        );
        setProducts(json.data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    },
    [api],
  );

  // search debounce
  useEffect(() => {
    const t = setTimeout(() => load(search), 300);
    return () => clearTimeout(t);
  }, [search, load]);

  const handleFeaturedChanged = (productId, featured) =>
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId ? { ...p, is_featured: featured } : p,
      ),
    );

  return (
    <div>
      <PageHeader
        title="Products"
        subtitle={`${products.length} products`}
        action={
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold text-white shadow-md"
            style={{
              backgroundColor: "var(--ph-accent)",
              fontFamily: "var(--font-body)",
            }}
          >
            <FiPlus /> Add Product
          </Link>
        }
      />

      <div className="relative mb-4 max-w-sm">
        <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--ph-text-faint)]" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name, brand, category..."
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
          className="w-full min-w-[720px] text-left text-sm"
          style={{ fontFamily: "var(--font-body)" }}
        >
          <thead>
            <tr
              className="border-b text-[11px] uppercase tracking-wide text-[var(--ph-text-faint)]"
              style={{ borderColor: "var(--ph-border)" }}
            >
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Brand</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Featured</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-[var(--ph-text-faint)]"
                >
                  Loading...
                </td>
              </tr>
            )}
            {!loading && products.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-[var(--ph-text-faint)]"
                >
                  No products found.
                </td>
              </tr>
            )}
            {products.map((p) => (
              <tr
                key={p.id}
                onClick={() => router.push(`/admin/products/${p.id}`)}
                className="cursor-pointer border-b transition-colors last:border-b-0 hover:bg-[var(--ph-primary-soft)]"
                style={{ borderColor: "var(--ph-border)" }}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="h-12 w-12 shrink-0 overflow-hidden rounded-xl border bg-white"
                      style={{ borderColor: "var(--ph-border)" }}
                    >
                      {p.image_url && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={p.image_url}
                          alt=""
                          className="h-full w-full object-contain"
                        />
                      )}
                    </div>
                    <span className="max-w-[220px] truncate font-semibold text-[var(--ph-text)]">
                      {p.name}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-[var(--ph-text-soft)]">
                  {p.brand_name || "—"}
                </td>
                <td className="px-4 py-3 text-[var(--ph-text-soft)]">
                  {p.category_name || "—"}
                </td>
                <td className="px-4 py-3 font-semibold text-[var(--ph-text)]">
                  {p.price ? `BDT ${Number(p.price).toLocaleString()}` : "—"}
                </td>
                <td
                  className="px-4 py-3 font-semibold"
                  style={{
                    color: p.total_stock > 0 ? "#1E9C79" : "var(--ph-coral)",
                  }}
                >
                  {p.total_stock}
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFeaturedTarget(p);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-transform hover:scale-105"
                    style={{
                      backgroundColor: p.is_featured
                        ? "var(--ph-primary)"
                        : "transparent",
                      color: p.is_featured ? "#1E2B2B" : "var(--ph-text-soft)",
                      border: p.is_featured
                        ? "1px solid var(--ph-primary)"
                        : "1px solid var(--ph-border)",
                    }}
                  >
                    <FiStar
                      style={{ fill: p.is_featured ? "currentColor" : "none" }}
                    />
                    {p.is_featured ? "True" : "False"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <FeaturedModal
        product={featuredTarget}
        onClose={() => setFeaturedTarget(null)}
        onChanged={handleFeaturedChanged}
      />
    </div>
  );
}
