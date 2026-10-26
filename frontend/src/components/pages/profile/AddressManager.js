"use client";

import { useCallback, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { FiPlus, FiEdit2, FiTrash2, FiMapPin, FiStar } from "react-icons/fi";
import { useAuth } from "@/provider/AuthProvider";
import { BD_CITIES } from "@/lib/bdCities";
import {
  Modal,
  Field,
  SearchableSelect,
  inputClass,
  inputStyle,
} from "@/components/admin/AdminUI";

const baseUrl =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://play-house-backend.vercel.app/api";
const MAX = 5;

const blank = {
  label: "Home",
  name: "",
  phone: "",
  city: "",
  address: "",
  is_default: false,
};

export default function AddressManager() {
  const { authFetch, isLoggedIn } = useAuth();
  const [list, setList] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(blank);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    const res = await authFetch(`${baseUrl}/addresses`);
    if (res.ok) setList((await res.json()).data || []);
  }, [authFetch]);

  useEffect(() => {
    if (isLoggedIn) load().catch(() => {});
  }, [isLoggedIn, load]);

  const openAdd = () => {
    setEditing(null);
    setForm(blank);
    setError("");
    setOpen(true);
  };

  const openEdit = (a) => {
    setEditing(a);
    setForm({
      label: a.label,
      name: a.name,
      phone: a.phone,
      city: a.city,
      address: a.address,
      is_default: a.is_default,
    });
    setError("");
    setOpen(true);
  };

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const save = async (e) => {
    e.preventDefault();
    setError("");

    if (
      !form.name.trim() ||
      !form.phone.trim() ||
      !form.city ||
      !form.address.trim()
    ) {
      return setError("Please fill in name, phone, city and address");
    }

    setSaving(true);
    try {
      const res = await authFetch(
        `${baseUrl}/addresses${editing ? `/${editing.id}` : ""}`,
        {
          method: editing ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        },
      );
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Could not save address");
      setOpen(false);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const makeDefault = async (a) => {
    await authFetch(`${baseUrl}/addresses/${a.id}/default`, {
      method: "PATCH",
    });
    load();
  };

  const remove = async (a) => {
    const r = await Swal.fire({
      title: "Delete this address?",
      text: `${a.label}: ${a.address}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#FF6F5E",
      reverseButtons: true,
    });
    if (!r.isConfirmed) return;
    await authFetch(`${baseUrl}/addresses/${a.id}`, { method: "DELETE" });
    load();
  };

  return (
    <div className="mt-6 rounded-[24px] border border-[var(--ph-border)] bg-[var(--ph-surface)] p-5 sm:p-7">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2
            className="text-base font-semibold text-[var(--ph-text)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Saved Addresses
          </h2>
          <p
            className="text-xs text-[var(--ph-text-faint)]"
            style={{ fontFamily: "var(--font-body)" }}
          >
            {list.length}/{MAX} saved. The default address is filled in
            automatically at checkout.
          </p>
        </div>
        {list.length < MAX && (
          <button
            type="button"
            onClick={openAdd}
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold text-white"
            style={{
              backgroundColor: "var(--ph-accent)",
              fontFamily: "var(--font-body)",
            }}
          >
            <FiPlus /> Add address
          </button>
        )}
      </div>

      {list.length === 0 ? (
        <p
          className="py-4 text-center text-sm text-[var(--ph-text-faint)]"
          style={{ fontFamily: "var(--font-body)" }}
        >
          No saved addresses yet.
        </p>
      ) : (
        <div className="space-y-3">
          {list.map((a) => (
            <div
              key={a.id}
              className="flex flex-wrap items-start gap-3 rounded-2xl border p-3.5"
              style={{
                borderColor: a.is_default
                  ? "var(--ph-primary)"
                  : "var(--ph-border)",
                backgroundColor: a.is_default
                  ? "var(--ph-primary-soft)"
                  : "transparent",
              }}
            >
              <FiMapPin
                className="mt-1 shrink-0"
                style={{ color: "var(--ph-accent)" }}
              />
              <div
                className="min-w-[160px] flex-1"
                style={{ fontFamily: "var(--font-body)" }}
              >
                <p className="text-sm font-bold text-[var(--ph-text)]">
                  {a.label}
                  {a.is_default && (
                    <span
                      className="ml-2 rounded-full px-2 py-0.5 text-[10px] font-bold"
                      style={{
                        backgroundColor: "var(--ph-primary)",
                        color: "#1E2B2B",
                      }}
                    >
                      Default
                    </span>
                  )}
                </p>
                <p className="text-xs text-[var(--ph-text-soft)]">
                  {a.name} · {a.phone}
                </p>
                <p className="text-xs text-[var(--ph-text-soft)]">
                  {a.address}, {a.city}
                </p>
              </div>
              <div className="flex items-center gap-1">
                {!a.is_default && (
                  <button
                    type="button"
                    onClick={() => makeDefault(a)}
                    className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-[11px] font-bold hover:bg-white"
                    style={{ color: "var(--ph-accent)" }}
                  >
                    <FiStar /> Set default
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => openEdit(a)}
                  aria-label="Edit"
                  className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-white"
                >
                  <FiEdit2 />
                </button>
                <button
                  type="button"
                  onClick={() => remove(a)}
                  aria-label="Delete"
                  className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--ph-coral)] hover:bg-white"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? "Edit address" : "Add address"}
      >
        <form onSubmit={save} className="space-y-4">
          <Field label="Label">
            <input
              value={form.label}
              onChange={set("label")}
              className={inputClass}
              style={inputStyle}
              placeholder="Home, Office..."
            />
          </Field>
          <Field label="Full name" required>
            <input
              value={form.name}
              onChange={set("name")}
              className={inputClass}
              style={inputStyle}
            />
          </Field>
          <Field label="Phone" required>
            <input
              value={form.phone}
              onChange={set("phone")}
              className={inputClass}
              style={inputStyle}
            />
          </Field>
          <Field label="City" required>
            <SearchableSelect
              options={BD_CITIES.map((c) => ({ value: c, label: c }))}
              value={form.city}
              onChange={(v) => setForm((f) => ({ ...f, city: v }))}
              placeholder="Select city"
              searchPlaceholder="Search city..."
            />
          </Field>
          <Field label="Full address" required>
            <textarea
              rows={3}
              value={form.address}
              onChange={set("address")}
              className={`${inputClass} resize-none`}
              style={inputStyle}
            />
          </Field>
          <label
            className="flex cursor-pointer items-center gap-2 text-sm text-[var(--ph-text)]"
            style={{ fontFamily: "var(--font-body)" }}
          >
            <input
              type="checkbox"
              checked={form.is_default}
              onChange={(e) =>
                setForm((f) => ({ ...f, is_default: e.target.checked }))
              }
              style={{ accentColor: "#F5A623" }}
            />
            Make this my default address
          </label>
          {error && (
            <p className="text-sm font-semibold text-[var(--ph-coral)]">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={saving}
            className="rounded-full px-6 py-2.5 text-sm font-bold text-[#1E2B2B] disabled:opacity-60"
            style={{
              backgroundColor: "var(--ph-primary)",
              fontFamily: "var(--font-body)",
            }}
          >
            {saving ? "Saving..." : "Save address"}
          </button>
        </form>
      </Modal>
    </div>
  );
}
