"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import {
  FiX,
  FiChevronDown,
  FiSearch,
  FiUploadCloud,
  FiStar,
  FiCheck,
} from "react-icons/fi";
import useAdminApi from "./useAdminApi";

export const inputClass =
  "w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-[var(--ph-primary)]";

export const inputStyle = {
  borderColor: "var(--ph-border)",
  backgroundColor: "var(--ph-bg)",
  color: "var(--ph-text)",
  fontFamily: "var(--font-body)",
};

export const Field = ({ label, required, hint, children }) => (
  <div>
    <span
      className="mb-1.5 block text-xs font-bold text-[var(--ph-text)]"
      style={{ fontFamily: "var(--font-body)" }}
    >
      {label}
      {required && <span className="text-[var(--ph-coral)]"> *</span>}
    </span>
    {children}
    {hint && (
      <span
        className="mt-1 block text-[11px] text-[var(--ph-text-faint)]"
        style={{ fontFamily: "var(--font-body)" }}
      >
        {hint}
      </span>
    )}
  </div>
);

export const PageHeader = ({ title, subtitle, action }) => (
  <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
    <div>
      <h1
        className="text-xl font-semibold text-[var(--ph-text)] sm:text-2xl"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {title}
      </h1>
      {subtitle && (
        <p
          className="mt-0.5 text-xs text-[var(--ph-text-soft)] sm:text-sm"
          style={{ fontFamily: "var(--font-body)" }}
        >
          {subtitle}
        </p>
      )}
    </div>
    {action}
  </div>
);

export const Card = ({ children, className = "" }) => (
  <div
    className={`rounded-[20px] border border-[var(--ph-border)] bg-[var(--ph-surface)] p-4 sm:p-6 ${className}`}
  >
    {children}
  </div>
);

export const Modal = ({ open, onClose, title, children, wide = false }) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-3 sm:p-6"
      onMouseDown={onClose}
    >
      <div
        onMouseDown={(e) => e.stopPropagation()}
        className={`max-h-[92vh] w-full overflow-y-auto rounded-[24px] border border-[var(--ph-border)] bg-[var(--ph-surface)] shadow-2xl ${
          wide ? "max-w-3xl" : "max-w-lg"
        }`}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[var(--ph-border)] bg-[var(--ph-surface)] px-5 py-4">
          <h2
            className="text-base font-semibold text-[var(--ph-text)] sm:text-lg"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-[var(--ph-primary-soft)]"
          >
            <FiX />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
};

/**
 * Floating panel: trigger-এর নিচে জায়গা কম থাকলে উপরে খোলে।
 * Portal + position:fixed, তাই কোনো overflow/modal এর ভেতরে কাটা পড়ে না।
 */
function FloatingPanel({
  anchorRef,
  open,
  onClose,
  maxHeight = 280,
  children,
}) {
  const panelRef = useRef(null);
  const [pos, setPos] = useState(null);

  const compute = useCallback(() => {
    const el = anchorRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const gap = 6;
    const below = window.innerHeight - r.bottom - gap;
    const above = r.top - gap;
    const openUp = below < Math.min(maxHeight, 220) && above > below;
    const available = Math.max(
      140,
      Math.min(maxHeight, (openUp ? above : below) - 8),
    );

    setPos({
      left: r.left,
      width: r.width,
      maxHeight: available,
      ...(openUp
        ? { bottom: window.innerHeight - r.top + gap }
        : { top: r.bottom + gap }),
    });
  }, [anchorRef, maxHeight]);

  useLayoutEffect(() => {
    if (!open) return;
    compute();
    window.addEventListener("resize", compute);
    window.addEventListener("scroll", compute, true);
    return () => {
      window.removeEventListener("resize", compute);
      window.removeEventListener("scroll", compute, true);
    };
  }, [open, compute]);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (panelRef.current?.contains(e.target)) return;
      if (anchorRef.current?.contains(e.target)) return;
      onClose();
    };
    const esc = (e) => e.key === "Escape" && onClose();
    document.addEventListener("mousedown", handler);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("keydown", esc);
    };
  }, [open, onClose, anchorRef]);

  if (!open || !pos || typeof document === "undefined") return null;

  return createPortal(
    <div
      ref={panelRef}
      className="fixed z-[200] flex flex-col overflow-hidden rounded-xl border bg-[var(--ph-surface)] shadow-xl"
      style={{ ...pos, borderColor: "var(--ph-border)" }}
    >
      {children}
    </div>,
    document.body,
  );
}

/** সাধারণ dropdown (search ছাড়া)। options: [{ value, label, swatch? }] */
export function Dropdown({
  options,
  value,
  onChange,
  placeholder = "Select...",
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const close = useCallback(() => setOpen(false), []);

  const selected = options.find((o) => String(o.value) === String(value));

  return (
    <div ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className={`${inputClass} flex items-center justify-between gap-2 text-left`}
        style={inputStyle}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="flex min-w-0 items-center gap-2 truncate">
          {selected?.swatch && (
            <span
              className="h-4 w-4 shrink-0 rounded-full border"
              style={{
                backgroundColor: selected.swatch,
                borderColor: "var(--ph-border)",
              }}
            />
          )}
          {selected ? (
            selected.label
          ) : (
            <span className="text-[var(--ph-text-faint)]">{placeholder}</span>
          )}
        </span>
        <FiChevronDown
          className={`shrink-0 text-[var(--ph-text-faint)] transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      <FloatingPanel anchorRef={ref} open={open} onClose={close}>
        <ul className="overflow-y-auto py-1" role="listbox">
          {options.map((o) => {
            const active = String(o.value) === String(value);
            return (
              <li key={String(o.value)}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(o.value);
                    close();
                  }}
                  className="flex w-full items-center justify-between gap-2 px-4 py-2 text-left text-sm text-[var(--ph-text)] hover:bg-[var(--ph-primary-soft)]"
                  style={{
                    fontFamily: "var(--font-body)",
                    fontWeight: active ? 700 : 500,
                  }}
                >
                  <span className="flex items-center gap-2">
                    {o.swatch && (
                      <span
                        className="h-4 w-4 shrink-0 rounded-full border"
                        style={{
                          backgroundColor: o.swatch,
                          borderColor: "var(--ph-border)",
                        }}
                      />
                    )}
                    {o.label}
                  </span>
                  {active && <FiCheck style={{ color: "var(--ph-accent)" }} />}
                </button>
              </li>
            );
          })}
        </ul>
      </FloatingPanel>
    </div>
  );
}

/** Search সহ dropdown। options: [{ value, label, swatch? }] */
export function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = "Select...",
  searchPlaceholder = "Search...",
}) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const ref = useRef(null);
  const close = useCallback(() => {
    setOpen(false);
    setQ("");
  }, []);

  const selected = options.find((o) => String(o.value) === String(value));
  const filtered = options.filter((o) =>
    o.label.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <div ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className={`${inputClass} flex items-center justify-between gap-2 text-left`}
        style={inputStyle}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="flex min-w-0 items-center gap-2 truncate">
          {selected?.swatch && (
            <span
              className="h-4 w-4 shrink-0 rounded-full border"
              style={{
                backgroundColor: selected.swatch,
                borderColor: "var(--ph-border)",
              }}
            />
          )}
          {selected ? (
            selected.label
          ) : (
            <span className="text-[var(--ph-text-faint)]">{placeholder}</span>
          )}
        </span>
        <FiChevronDown
          className={`shrink-0 text-[var(--ph-text-faint)] transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      <FloatingPanel anchorRef={ref} open={open} onClose={close}>
        <div className="relative shrink-0 p-2">
          <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--ph-text-faint)]" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={searchPlaceholder}
            className={`${inputClass} pl-9`}
            style={inputStyle}
          />
        </div>
        <ul className="overflow-y-auto pb-1" role="listbox">
          {filtered.length === 0 && (
            <li className="px-4 py-3 text-xs text-[var(--ph-text-faint)]">
              No results
            </li>
          )}
          {filtered.map((o) => (
            <li key={String(o.value)}>
              <button
                type="button"
                onClick={() => {
                  onChange(o.value);
                  close();
                }}
                className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-[var(--ph-text)] hover:bg-[var(--ph-primary-soft)]"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {o.swatch && (
                  <span
                    className="h-4 w-4 shrink-0 rounded-full border"
                    style={{
                      backgroundColor: o.swatch,
                      borderColor: "var(--ph-border)",
                    }}
                  />
                )}
                {o.label}
              </button>
            </li>
          ))}
        </ul>
      </FloatingPanel>
    </div>
  );
}

/** options: string[] , values: string[] */
export function MultiSearchSelect({
  options,
  values,
  onChange,
  placeholder = "Search & add...",
}) {
  const available = options
    .filter((o) => !values.includes(o))
    .map((o) => ({ value: o, label: o }));

  return (
    <div>
      <SearchableSelect
        options={available}
        value=""
        onChange={(v) => onChange([...values, v])}
        placeholder={placeholder}
      />
      {values.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {values.map((v) => (
            <span
              key={v}
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
              style={{
                backgroundColor: "var(--ph-primary-soft)",
                color: "var(--ph-primary-dark)",
              }}
            >
              {v}
              <button
                type="button"
                onClick={() => onChange(values.filter((x) => x !== v))}
                aria-label={`Remove ${v}`}
              >
                <FiX />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

/** images: [{ image_url, is_display_image }] */
export function ImageUploader({ images, onChange, multiple = false }) {
  const api = useAdminApi();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const handleFiles = async (e) => {
    const input = e.target;
    const files = Array.from(input.files || []);
    if (files.length === 0) return;

    setBusy(true);
    setError("");

    try {
      const uploaded = [];
      for (const file of files) {
        const fd = new FormData();
        fd.append("file", file);
        const json = await api("/admin/upload", { method: "POST", body: fd });
        uploaded.push({ image_url: json.data.url, is_display_image: false });
      }

      const next = multiple ? [...images, ...uploaded] : uploaded.slice(0, 1);
      if (next.length > 0 && !next.some((i) => i.is_display_image)) {
        next[0] = { ...next[0], is_display_image: true };
      }
      onChange(next);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
      input.value = "";
    }
  };

  const makeCover = (index) =>
    onChange(
      images.map((img, i) => ({ ...img, is_display_image: i === index })),
    );

  const remove = (index) => {
    const next = images.filter((_, i) => i !== index);
    if (next.length > 0 && !next.some((i) => i.is_display_image)) {
      next[0] = { ...next[0], is_display_image: true };
    }
    onChange(next);
  };

  return (
    <div>
      <label
        className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-5 text-sm font-semibold text-[var(--ph-text-soft)] transition-colors hover:bg-[var(--ph-primary-soft)]"
        style={{
          borderColor: "var(--ph-border)",
          fontFamily: "var(--font-body)",
        }}
      >
        <FiUploadCloud className="text-lg" />
        {busy
          ? "Uploading..."
          : multiple
            ? "Click to upload images"
            : "Click to upload image"}
        <input
          type="file"
          accept="image/*"
          multiple={multiple}
          onChange={handleFiles}
          disabled={busy}
          className="hidden"
        />
      </label>

      {error && (
        <p className="mt-1.5 text-xs font-semibold text-[var(--ph-coral)]">
          {error}
        </p>
      )}

      {images.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-3">
          {images.map((img, index) => (
            <div
              key={img.image_url + index}
              className="relative h-20 w-20 overflow-hidden rounded-xl border-2 bg-white"
              style={{
                borderColor: img.is_display_image
                  ? "var(--ph-primary)"
                  : "var(--ph-border)",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.image_url}
                alt=""
                className="h-full w-full object-contain"
              />
              <button
                type="button"
                onClick={() => remove(index)}
                aria-label="Remove image"
                className="absolute right-0.5 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-[10px] text-white"
              >
                <FiX />
              </button>
              {multiple && (
                <button
                  type="button"
                  onClick={() => makeCover(index)}
                  aria-label="Set as cover"
                  className="absolute bottom-0.5 left-0.5 flex h-5 w-5 items-center justify-center rounded-full text-[10px]"
                  style={{
                    backgroundColor: img.is_display_image
                      ? "var(--ph-primary)"
                      : "rgba(255,255,255,0.9)",
                    color: "#1E2B2B",
                  }}
                >
                  <FiStar />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
      {multiple && images.length > 1 && (
        <p className="mt-1.5 text-[11px] text-[var(--ph-text-faint)]">
          ★ চাপলে সেই ছবিটা cover (display) ছবি হবে।
        </p>
      )}
    </div>
  );
}
