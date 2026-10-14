"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { FiEdit2, FiTrash2, FiSearch, FiPlus, FiSave } from "react-icons/fi";
import useAdminApi, { unwrapList } from "./useAdminApi";
import {
  Field,
  PageHeader,
  Card,
  ImageUploader,
  inputClass,
  inputStyle,
} from "./AdminUI";

const HEX_RE = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;

export default function EntityManager({ config }) {
  const { title, singular, endpoint, idKey, nameKey, imageKey, hexKey } =
    config;
  const api = useAdminApi();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [name, setName] = useState("");
  const [images, setImages] = useState([]);
  const [hex, setHex] = useState("#F5A623");
  const [editingId, setEditingId] = useState(null);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    try {
      const json = await api(endpoint);
      setItems(unwrapList(json));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [api, endpoint]);

  useEffect(() => {
    load();
  }, [load]);

  const resetForm = () => {
    setName("");
    setImages([]);
    setHex("#F5A623");
    setEditingId(null);
  };

  const startEdit = (item) => {
    setEditingId(item[idKey]);
    setName(item[nameKey] || "");
    if (imageKey)
      setImages(
        item[imageKey]
          ? [{ image_url: item[imageKey], is_display_image: true }]
          : [],
      );
    if (hexKey) setHex(item[hexKey] || "#000000");
    setError("");
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!name.trim()) return setError(`${singular} name is required`);
    if (hexKey && !HEX_RE.test(hex))
      return setError("Enter a valid hex colour like #FF8800");

    const body = { [nameKey]: name.trim() };
    if (imageKey) body[imageKey] = images[0]?.image_url || null;
    if (hexKey) body[hexKey] = hex;

    setSaving(true);
    try {
      if (editingId) {
        await api(`${endpoint}/${editingId}`, { method: "PUT", body });
        setMessage(`${singular} updated`);
      } else {
        await api(endpoint, { method: "POST", body });
        setMessage(`${singular} added`);
      }
      resetForm();
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Delete "${item[nameKey]}"? This cannot be undone.`))
      return;
    setError("");
    setMessage("");
    try {
      await api(`${endpoint}/${item[idKey]}`, { method: "DELETE" });
      setMessage(`${singular} deleted`);
      if (editingId === item[idKey]) resetForm();
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  const filtered = useMemo(
    () =>
      items.filter((i) =>
        String(i[nameKey] || "")
          .toLowerCase()
          .includes(search.toLowerCase()),
      ),
    [items, search, nameKey],
  );

  return (
    <div>
      <PageHeader
        title={editingId ? `Edit ${singular}` : `Add ${singular}`}
        subtitle={`${items.length} existing ${title.toLowerCase()}`}
      />

      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label={`${singular} name`} required>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClass}
                style={inputStyle}
                placeholder={`e.g. ${config.example}`}
              />
            </Field>

            {hexKey && (
              <Field
                label="Colour"
                required
                hint="Pick from the picker or type a hex code"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={
                      HEX_RE.test(hex) && hex.length === 7 ? hex : "#000000"
                    }
                    onChange={(e) => setHex(e.target.value.toUpperCase())}
                    className="h-11 w-14 cursor-pointer rounded-lg border bg-transparent p-1"
                    style={{ borderColor: "var(--ph-border)" }}
                  />
                  <input
                    value={hex}
                    onChange={(e) =>
                      setHex(
                        e.target.value.startsWith("#")
                          ? e.target.value
                          : `#${e.target.value}`,
                      )
                    }
                    className={inputClass}
                    style={inputStyle}
                    placeholder="#F5A623"
                    maxLength={7}
                  />
                </div>
              </Field>
            )}
          </div>

          {imageKey && (
            <Field label={`${singular} image`}>
              <ImageUploader images={images} onChange={setImages} />
            </Field>
          )}

          {error && (
            <p className="text-sm font-semibold text-[var(--ph-coral)]">
              {error}
            </p>
          )}
          {message && (
            <p className="text-sm font-semibold" style={{ color: "#1E9C79" }}>
              {message}
            </p>
          )}

          <div className="flex flex-wrap gap-2.5">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold text-[#1E2B2B] shadow-sm disabled:opacity-60"
              style={{
                backgroundColor: "var(--ph-primary)",
                fontFamily: "var(--font-body)",
              }}
            >
              {editingId ? <FiSave /> : <FiPlus />}
              {saving ? "Saving..." : editingId ? "Update" : `Add ${singular}`}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-full border px-5 py-2.5 text-sm font-bold text-[var(--ph-text)]"
                style={{
                  borderColor: "var(--ph-border)",
                  fontFamily: "var(--font-body)",
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </Card>

      {/* Existing list */}
      <div className="mb-3 mt-8 flex flex-wrap items-center justify-between gap-3">
        <h2
          className="text-base font-semibold text-[var(--ph-text)]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Existing {title}
        </h2>
        <div className="relative w-full sm:w-64">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--ph-text-faint)]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className={`${inputClass} pl-10`}
            style={inputStyle}
          />
        </div>
      </div>

      {loading ? (
        <p className="py-6 text-center text-sm text-[var(--ph-text-faint)]">
          Loading...
        </p>
      ) : filtered.length === 0 ? (
        <p className="py-6 text-center text-sm text-[var(--ph-text-faint)]">
          Nothing found.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <div
              key={item[idKey]}
              className="flex items-center gap-3 rounded-2xl border border-[var(--ph-border)] bg-[var(--ph-surface)] p-3"
            >
              {imageKey && (
                <div
                  className="h-12 w-12 shrink-0 overflow-hidden rounded-xl border bg-white"
                  style={{ borderColor: "var(--ph-border)" }}
                >
                  {item[imageKey] && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item[imageKey]}
                      alt=""
                      className="h-full w-full object-contain"
                    />
                  )}
                </div>
              )}
              {hexKey && (
                <span
                  className="h-10 w-10 shrink-0 rounded-full border"
                  style={{
                    backgroundColor: item[hexKey],
                    borderColor: "var(--ph-border)",
                  }}
                />
              )}
              <div className="min-w-0 flex-1">
                <p
                  className="truncate text-sm font-semibold text-[var(--ph-text)]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {item[nameKey]}
                </p>
                {hexKey && (
                  <p className="text-[11px] text-[var(--ph-text-faint)]">
                    {item[hexKey]}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => startEdit(item)}
                aria-label="Edit"
                className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-[var(--ph-primary-soft)]"
              >
                <FiEdit2 className="text-sm" />
              </button>
              <button
                type="button"
                onClick={() => handleDelete(item)}
                aria-label="Delete"
                className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--ph-coral)] hover:bg-[var(--ph-coral)]/10"
              >
                <FiTrash2 className="text-sm" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
