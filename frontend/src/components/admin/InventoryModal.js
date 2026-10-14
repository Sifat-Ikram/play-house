"use client";

import { useEffect, useState } from "react";
import useAdminApi from "./useAdminApi";
import {
  Modal,
  Field,
  SearchableSelect,
  ImageUploader,
  inputClass,
  inputStyle,
} from "./AdminUI";

const blank = {
  color_id: "",
  sku: "",
  stock_quantity: "",
  buying_price: "",
  selling_price: "",
  min_wholesale_qty: "",
  wholesale_price: "",
  applicable_tax_percent: "",
  mark_unavailable: false,
  is_featured: false,
  images: [],
};

const fromInventory = (i) => ({
  color_id: i.color_id ?? "",
  sku: i.sku ?? "",
  stock_quantity: i.stock_quantity ?? "",
  buying_price: i.buying_price ?? "",
  selling_price: i.selling_price ?? "",
  min_wholesale_qty: i.min_wholesale_qty ?? "",
  wholesale_price: i.wholesale_price ?? "",
  applicable_tax_percent: i.applicable_tax_percent ?? "",
  mark_unavailable: !!i.mark_unavailable,
  is_featured: !!i.is_featured,
  images: (i.images || []).map((im) => ({
    image_url: im.image_url,
    is_display_image: !!im.is_display_image,
  })),
});

export default function InventoryModal({
  open,
  onClose,
  productId,
  inventory,
  colors,
  onSaved,
}) {
  const api = useAdminApi();
  const [form, setForm] = useState(blank);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setForm(inventory ? fromInventory(inventory) : blank);
      setError("");
    }
  }, [open, inventory]);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const check = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.checked }));

  const save = async (addAnother) => {
    setError("");

    if (form.selling_price === "") return setError("Selling price is required");
    if (form.images.length === 0) {
      if (!window.confirm("No images added. Save without images?")) return;
    }

    setSaving(true);
    try {
      if (inventory) {
        await api(`/admin/inventory/${inventory.id}`, {
          method: "PUT",
          body: form,
        });
      } else {
        await api("/admin/inventory", {
          method: "POST",
          body: { ...form, product_id: productId },
        });
      }

      await onSaved();

      if (addAnother) {
        setForm(blank);
      } else {
        onClose();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={inventory ? "Edit Inventory" : "Add Inventory"}
      wide
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Colour" hint="Colours come from the Add Colour page">
          <SearchableSelect
            options={colors.map((c) => ({
              value: c.color_id,
              label: c.color_name,
              swatch: c.hex_code,
            }))}
            value={form.color_id}
            onChange={(v) => setForm((f) => ({ ...f, color_id: v }))}
            placeholder="Select colour (optional)"
            searchPlaceholder="Search colours..."
          />
        </Field>

        <Field label="SKU">
          <input
            value={form.sku}
            onChange={set("sku")}
            className={inputClass}
            style={inputStyle}
            placeholder="e.g. TOY-CAR-001"
          />
        </Field>

        <Field label="Stock quantity" required>
          <input
            type="number"
            min="0"
            value={form.stock_quantity}
            onChange={set("stock_quantity")}
            className={inputClass}
            style={inputStyle}
          />
        </Field>

        <Field label="Selling price (BDT)" required>
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.selling_price}
            onChange={set("selling_price")}
            className={inputClass}
            style={inputStyle}
          />
        </Field>

        <Field label="Buying price (BDT)">
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.buying_price}
            onChange={set("buying_price")}
            className={inputClass}
            style={inputStyle}
          />
        </Field>

        <Field label="Tax (%)">
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.applicable_tax_percent}
            onChange={set("applicable_tax_percent")}
            className={inputClass}
            style={inputStyle}
          />
        </Field>

        <Field
          label="Min wholesale qty"
          hint="Leave both wholesale fields empty if not wholesale"
        >
          <input
            type="number"
            min="1"
            value={form.min_wholesale_qty}
            onChange={set("min_wholesale_qty")}
            className={inputClass}
            style={inputStyle}
          />
        </Field>

        <Field label="Wholesale price (BDT)">
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.wholesale_price}
            onChange={set("wholesale_price")}
            className={inputClass}
            style={inputStyle}
          />
        </Field>
      </div>

      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
        <label
          className="flex cursor-pointer items-center gap-2 text-sm text-[var(--ph-text)]"
          style={{ fontFamily: "var(--font-body)" }}
        >
          <input
            type="checkbox"
            checked={form.mark_unavailable}
            onChange={check("mark_unavailable")}
            style={{ accentColor: "#F5A623" }}
          />
          Mark unavailable
        </label>
        <label
          className="flex cursor-pointer items-center gap-2 text-sm text-[var(--ph-text)]"
          style={{ fontFamily: "var(--font-body)" }}
        >
          <input
            type="checkbox"
            checked={form.is_featured}
            onChange={check("is_featured")}
            style={{ accentColor: "#F5A623" }}
          />
          Featured
        </label>
      </div>

      <div className="mt-4">
        <Field
          label="Images"
          hint="First image becomes the cover unless you pick another with ★"
        >
          <ImageUploader
            multiple
            images={form.images}
            onChange={(images) => setForm((f) => ({ ...f, images }))}
          />
        </Field>
      </div>

      {error && (
        <p className="mt-4 text-sm font-semibold text-[var(--ph-coral)]">
          {error}
        </p>
      )}

      <div className="mt-5 flex flex-wrap gap-2.5">
        <button
          type="button"
          disabled={saving}
          onClick={() => save(false)}
          className="rounded-full px-6 py-2.5 text-sm font-bold text-[#1E2B2B] shadow-sm disabled:opacity-60"
          style={{
            backgroundColor: "var(--ph-primary)",
            fontFamily: "var(--font-body)",
          }}
        >
          {saving
            ? "Saving..."
            : inventory
              ? "Update Inventory"
              : "Save Inventory"}
        </button>
        {!inventory && (
          <button
            type="button"
            disabled={saving}
            onClick={() => save(true)}
            className="rounded-full border px-6 py-2.5 text-sm font-bold text-[var(--ph-text)] disabled:opacity-60"
            style={{
              borderColor: "var(--ph-border)",
              fontFamily: "var(--font-body)",
            }}
          >
            Save & Add Another
          </button>
        )}
      </div>
    </Modal>
  );
}
