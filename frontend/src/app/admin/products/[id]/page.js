"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { FiPlus, FiEdit2, FiTrash2, FiChevronLeft } from "react-icons/fi";
import useAdminApi, { unwrapList } from "@/components/admin/useAdminApi";
import ProductForm from "@/components/admin/ProductForm";
import InventoryModal from "@/components/admin/InventoryModal";
import { PageHeader, Card } from "@/components/admin/AdminUI";

export default function AdminProductDetailPage() {
  const { id } = useParams();
  const api = useAdminApi();

  const [product, setProduct] = useState(null);
  const [colors, setColors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isNew, setIsNew] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingInventory, setEditingInventory] = useState(null);

  const load = useCallback(async () => {
    try {
      const json = await api(`/admin/products/${id}`);
      setProduct(json.data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [api, id]);

  useEffect(() => {
    load();
    api("/colors")
      .then((j) => setColors(unwrapList(j)))
      .catch(() => {});
    setIsNew(new URLSearchParams(window.location.search).get("new") === "1");
  }, [load, api]);

  const openAdd = () => {
    setEditingInventory(null);
    setModalOpen(true);
  };

  const openEdit = (inv) => {
    setEditingInventory(inv);
    setModalOpen(true);
  };

  const handleDeleteInventory = async (inv) => {
    if (!window.confirm("Delete this inventory and its images?")) return;
    try {
      await api(`/admin/inventory/${inv.id}`, { method: "DELETE" });
      await load();
    } catch (e) {
      setError(e.message);
    }
  };

  const handleUpdateProduct = async (body) => {
    await api(`/products/${id}`, { method: "PUT", body });
    await load();
    return { message: "Product updated successfully" };
  };

  if (loading)
    return (
      <p className="py-10 text-center text-sm text-[var(--ph-text-faint)]">
        Loading...
      </p>
    );

  if (!product) {
    return (
      <p className="py-10 text-center text-sm font-semibold text-[var(--ph-coral)]">
        {error || "Product not found"}
      </p>
    );
  }

  return (
    <div>
      <Link
        href="/admin/products"
        className="mb-3 inline-flex items-center gap-1 text-xs font-semibold text-[var(--ph-text-soft)] hover:text-[var(--ph-text)]"
      >
        <FiChevronLeft /> Back to products
      </Link>

      <PageHeader
        title={product.name}
        subtitle={`${product.brand_name || "—"} · ${product.category_name || "—"}`}
      />

      {isNew && (
        <div
          className="mb-5 rounded-2xl p-4 text-sm font-semibold"
          style={{
            backgroundColor: "#DFF5EA",
            color: "#1E9C79",
            fontFamily: "var(--font-body)",
          }}
        >
          🎉 Product created! Now add one or more inventories below (colour,
          price, stock, images).
        </div>
      )}

      <ProductForm
        initial={product}
        onSubmit={handleUpdateProduct}
        submitLabel="Update Product"
      />

      {/* Inventories */}
      <div className="mb-3 mt-10 flex flex-wrap items-center justify-between gap-3">
        <h2
          className="text-lg font-semibold text-[var(--ph-text)]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Inventory ({product.inventory.length})
        </h2>
        <button
          type="button"
          onClick={openAdd}
          className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold text-white shadow-md"
          style={{
            backgroundColor: "var(--ph-accent)",
            fontFamily: "var(--font-body)",
          }}
        >
          <FiPlus /> Add Inventory
        </button>
      </div>

      {error && (
        <p className="mb-3 text-sm font-semibold text-[var(--ph-coral)]">
          {error}
        </p>
      )}

      {product.inventory.length === 0 ? (
        <Card>
          <p
            className="py-6 text-center text-sm text-[var(--ph-text-soft)]"
            style={{ fontFamily: "var(--font-body)" }}
          >
            No inventory yet. Click “Add Inventory” to add the first variant.
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {product.inventory.map((inv) => {
            const cover =
              inv.images?.find((i) => i.is_display_image) || inv.images?.[0];
            return (
              <div
                key={inv.id}
                className="flex flex-wrap items-center gap-4 rounded-2xl border border-[var(--ph-border)] bg-[var(--ph-surface)] p-3 sm:p-4"
              >
                <div
                  className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border bg-white"
                  style={{ borderColor: "var(--ph-border)" }}
                >
                  {cover && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={cover.image_url}
                      alt=""
                      className="h-full w-full object-contain"
                    />
                  )}
                </div>

                <div
                  className="min-w-[140px] flex-1"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  <div className="flex items-center gap-2">
                    {inv.color_hex && (
                      <span
                        className="h-4 w-4 rounded-full border"
                        style={{
                          backgroundColor: inv.color_hex,
                          borderColor: "var(--ph-border)",
                        }}
                      />
                    )}
                    <p className="text-sm font-bold text-[var(--ph-text)]">
                      {inv.color_name || "No colour"}
                    </p>
                  </div>
                  <p className="mt-0.5 text-[11px] text-[var(--ph-text-faint)]">
                    SKU: {inv.sku || "—"} · {inv.images?.length || 0} images
                  </p>
                </div>

                <div
                  className="grid grid-cols-3 gap-x-6 text-xs"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  <div>
                    <p className="text-[var(--ph-text-faint)]">Stock</p>
                    <p
                      className="font-bold"
                      style={{
                        color:
                          Number(inv.stock_quantity) > 0
                            ? "#1E9C79"
                            : "var(--ph-coral)",
                      }}
                    >
                      {inv.stock_quantity}
                    </p>
                  </div>
                  <div>
                    <p className="text-[var(--ph-text-faint)]">Price</p>
                    <p className="font-bold text-[var(--ph-text)]">
                      {Number(inv.selling_price).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-[var(--ph-text-faint)]">Wholesale</p>
                    <p className="font-bold text-[var(--ph-text)]">
                      {inv.wholesale_price
                        ? `${Number(inv.wholesale_price).toLocaleString()} (${inv.min_wholesale_qty}+)`
                        : "—"}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {inv.is_featured && (
                    <span
                      className="rounded-full px-2.5 py-1 text-[10px] font-bold"
                      style={{
                        backgroundColor: "var(--ph-primary-soft)",
                        color: "var(--ph-primary-dark)",
                      }}
                    >
                      Featured
                    </span>
                  )}
                  {inv.mark_unavailable && (
                    <span
                      className="rounded-full px-2.5 py-1 text-[10px] font-bold"
                      style={{
                        backgroundColor: "#FFE7E3",
                        color: "var(--ph-coral)",
                      }}
                    >
                      Unavailable
                    </span>
                  )}
                </div>

                <div className="ml-auto flex gap-1">
                  <button
                    type="button"
                    onClick={() => openEdit(inv)}
                    aria-label="Edit inventory"
                    className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-[var(--ph-primary-soft)]"
                  >
                    <FiEdit2 />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteInventory(inv)}
                    aria-label="Delete inventory"
                    className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--ph-coral)] hover:bg-[var(--ph-coral)]/10"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <InventoryModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        productId={Number(id)}
        inventory={editingInventory}
        colors={colors}
        onSaved={load}
      />
    </div>
  );
}
