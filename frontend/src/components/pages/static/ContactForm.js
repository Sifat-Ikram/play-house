"use client";

import { useState } from "react";

const baseUrl =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://play-house-backend.vercel.app/api";
const cls =
  "w-full rounded-2xl border px-4 py-3 text-sm outline-none focus:border-[var(--ph-primary)]";
const st = {
  borderColor: "var(--ph-border)",
  backgroundColor: "var(--ph-bg)",
  color: "var(--ph-text)",
};

export default function ContactForm() {
  const [f, setF] = useState({ name: "", email: "", message: "" });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState({ ok: false, text: "" });

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setMsg({ ok: false, text: "" });
    try {
      const res = await fetch(`${baseUrl}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(f),
      });
      const json = await res.json();
      setMsg({
        ok: res.ok,
        text: json.message || (res.ok ? "Sent!" : "Something went wrong"),
      });
      if (res.ok) setF({ name: "", email: "", message: "" });
    } catch {
      setMsg({ ok: false, text: "Could not connect. Please try again." });
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-3.5">
      <input
        required
        placeholder="Your name"
        value={f.name}
        onChange={(e) => setF({ ...f, name: e.target.value })}
        className={cls}
        style={st}
      />
      <input
        required
        type="email"
        placeholder="Your email"
        value={f.email}
        onChange={(e) => setF({ ...f, email: e.target.value })}
        className={cls}
        style={st}
      />
      <textarea
        required
        rows={5}
        minLength={10}
        placeholder="How can we help?"
        value={f.message}
        onChange={(e) => setF({ ...f, message: e.target.value })}
        className={`${cls} resize-none`}
        style={st}
      />
      {msg.text && (
        <p
          className="text-sm font-semibold"
          style={{ color: msg.ok ? "#1E9C79" : "var(--ph-coral)" }}
        >
          {msg.text}
        </p>
      )}
      <button
        type="submit"
        disabled={busy}
        className="rounded-full px-6 py-3 text-sm font-bold text-[#1E2B2B] disabled:opacity-60"
        style={{ backgroundColor: "var(--ph-primary)" }}
      >
        {busy ? "Sending..." : "Send message"}
      </button>
    </form>
  );
}
