"use client";

import { useEffect, useState } from "react";
import { FiSave } from "react-icons/fi";
import useAdminApi, { unwrapList } from "./useAdminApi";
import {
  Field,
  Card,
  SearchableSelect,
  MultiSearchSelect,
  Dropdown,
  inputClass,
  inputStyle,
} from "./AdminUI";

const OCCASIONS = [
  "Birthday Fun",
  "Gift for Kids",
  "Party & Fun",
  "Holiday Gifts",
  "Back to School",
  "Just Because",
];
const INTERESTS = [
  "Cars & Vehicles",
  "Puzzles & Games",
  "Arts & Creativity",
  "Robots & Tech",
  "Building & Blocks",
  "Books & Stories",
];

const emptyForm = {
  name: "",
  brand_id: "",
  category_id: "",
  occasion: "",
  interest: "",
  minimum_age_range: "",
  maximum_age_range: "",
  number_of_pieces: "",
  warranty_info: "",
  materials: [],
  summary: "",
  description: "",
  in_the_box: "",
  return_and_refund_policy: "",
};

const fromProduct = (p) => {
  const f = { ...emptyForm };
  Object.keys(f).forEach((k) => {
    if (p[k] !== null && p[k] !== undefined) f[k] = p[k];
  });
  if (!Array.isArray(f.materials)) f.materials = [];
  return f;
};

const num = (v) =>
  v === "" || v === null || v === undefined ? null : Number(v);
const str = (v) => (v && String(v).trim() ? String(v).trim() : null);

export default function ProductForm({ initial, onSubmit, submitLabel }) {
  const api = useAdminApi();
  const [form, setForm] = useState(initial ? fromProduct(initial) : emptyForm);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    Promise.all([api("/brands"), api("/categories"), api("/materials")])
      .then(([b, c, m]) => {
        setBrands(unwrapList(b));
        setCategories(unwrapList(c));
        setMaterials(unwrapList(m).map((x) => x.material_name));
      })
      .catch((e) => setError(e.message));
  }, [api]);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!form.name.trim()) return setError("Product name is required");
    if (!form.brand_id) return setError("Please select a brand");
    if (!form.category_id) return setError("Please select a category");

    const body = {
      name: form.name.trim(),
      brand_id: num(form.brand_id),
      category_id: num(form.category_id),
      occasion: str(form.occasion),
      interest: str(form.interest),
      minimum_age_range: num(form.minimum_age_range),
      maximum_age_range: num(form.maximum_age_range),
      number_of_pieces: num(form.number_of_pieces),
      warranty_info: str(form.warranty_info),
      materials: form.materials,
      summary: str(form.summary),
      description: str(form.description),
      in_the_box: str(form.in_the_box),
      return_and_refund_policy: str(form.return_and_refund_policy),
    };

    setSaving(true);
    try {
      const result = await onSubmit(body);
      if (result?.message) setMessage(result.message);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const textarea = (key, rows) => (
    <textarea
      value={form[key]}
      onChange={set(key)}
      rows={rows}
      className={`${inputClass} resize-y`}
      style={inputStyle}
    />
  );

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-x-6 gap-y-4 lg:grid-cols-2">
          {/* Left column */}
          <div className="space-y-4">
            <Field label="Product name" required>
              <input
                value={form.name}
                onChange={set("name")}
                className={inputClass}
                style={inputStyle}
              />
            </Field>

            <Field label="Brand" required>
              <SearchableSelect
                options={brands.map((b) => ({
                  value: b.brand_id,
                  label: b.brand_name,
                }))}
                value={form.brand_id}
                onChange={(v) => setForm((f) => ({ ...f, brand_id: v }))}
                placeholder="Select brand"
                searchPlaceholder="Search brands..."
              />
            </Field>

            <Field label="Category" required>
              <SearchableSelect
                options={categories.map((c) => ({
                  value: c.category_id,
                  label: c.category_name,
                }))}
                value={form.category_id}
                onChange={(v) => setForm((f) => ({ ...f, category_id: v }))}
                placeholder="Select category"
                searchPlaceholder="Search categories..."
              />
            </Field>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Occasion">
                <Dropdown
                  options={[
                    { value: "", label: "None" },
                    ...[
                      ...new Set([...OCCASIONS, form.occasion].filter(Boolean)),
                    ].map((o) => ({ value: o, label: o })),
                  ]}
                  value={form.occasion}
                  onChange={(v) => setForm((f) => ({ ...f, occasion: v }))}
                  placeholder="None"
                />
              </Field>
              <Field label="Interest">
                <Dropdown
                  options={[
                    { value: "", label: "None" },
                    ...[
                      ...new Set([...INTERESTS, form.interest].filter(Boolean)),
                    ].map((o) => ({ value: o, label: o })),
                  ]}
                  value={form.interest}
                  onChange={(v) => setForm((f) => ({ ...f, interest: v }))}
                  placeholder="None"
                />
              </Field>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <Field label="Min age">
                <input
                  type="number"
                  min="0"
                  value={form.minimum_age_range}
                  onChange={set("minimum_age_range")}
                  className={inputClass}
                  style={inputStyle}
                />
              </Field>
              <Field label="Max age">
                <input
                  type="number"
                  min="0"
                  value={form.maximum_age_range}
                  onChange={set("maximum_age_range")}
                  className={inputClass}
                  style={inputStyle}
                />
              </Field>
              <Field label="Pieces">
                <input
                  type="number"
                  min="0"
                  value={form.number_of_pieces}
                  onChange={set("number_of_pieces")}
                  className={inputClass}
                  style={inputStyle}
                />
              </Field>
            </div>

            <Field label="Warranty info">
              <input
                value={form.warranty_info}
                onChange={set("warranty_info")}
                className={inputClass}
                style={inputStyle}
                placeholder="e.g. 6 months manufacturer warranty"
              />
            </Field>

            <Field
              label="Materials"
              hint="Add materials from the Materials page first"
            >
              <MultiSearchSelect
                options={materials}
                values={form.materials}
                onChange={(v) => setForm((f) => ({ ...f, materials: v }))}
                placeholder="Search & add material"
              />
            </Field>
          </div>

          {/* Right column */}
          <div className="space-y-4">
            <Field label="Summary">{textarea("summary", 2)}</Field>
            <Field label="In the box">{textarea("in_the_box", 2)}</Field>
            <Field label="Return & refund policy">
              {textarea("return_and_refund_policy", 2)}
            </Field>
            <Field label="Description">{textarea("description", 7)}</Field>
          </div>
        </div>

        {error && (
          <p className="mt-4 text-sm font-semibold text-[var(--ph-coral)]">
            {error}
          </p>
        )}
        {message && (
          <p
            className="mt-4 text-sm font-semibold"
            style={{ color: "#1E9C79" }}
          >
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="mt-5 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-[#1E2B2B] shadow-md disabled:opacity-60"
          style={{
            backgroundColor: "var(--ph-primary)",
            fontFamily: "var(--font-body)",
          }}
        >
          <FiSave /> {saving ? "Saving..." : submitLabel}
        </button>
      </form>
    </Card>
  );
}
