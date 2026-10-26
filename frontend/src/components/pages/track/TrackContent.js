"use client";

import { useEffect, useState } from "react";
import { FiSearch, FiPackage } from "react-icons/fi";
import { useAuth } from "@/provider/AuthProvider";
import { getGuestOrders } from "@/lib/guestOrders";
import TrackResult from "../orders/TrackResult";

const baseUrl =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://play-house-backend.vercel.app/api";

const inputCls =
  "w-full rounded-full border px-4 py-3 text-sm outline-none focus:border-[var(--ph-primary)]";
const inputSt = {
  borderColor: "var(--ph-border)",
  backgroundColor: "var(--ph-bg)",
  color: "var(--ph-text)",
  fontFamily: "var(--font-body)",
};

export default function TrackContent() {
  const { authFetch, isLoggedIn, isLoading } = useAuth();

  const [orderId, setOrderId] = useState("");
  const [phone, setPhone] = useState("");
  const [data, setData] = useState(null);
  const [source, setSource] = useState(null); // { type: "mine" | "guest", id, phone }
  const [mine, setMine] = useState([]);
  const [guest, setGuest] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setGuest(getGuestOrders());
  }, []);

  useEffect(() => {
    if (isLoading || !isLoggedIn) return;
    authFetch(`${baseUrl}/orders/mine`)
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => j && setMine(j.data || []))
      .catch(() => {});
  }, [isLoading, isLoggedIn, authFetch]);

  const loadMine = async (id) => {
    setBusy(true);
    setError("");
    try {
      const res = await authFetch(`${baseUrl}/orders/mine/${id}/track`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Order not found");
      setData(json.data);
      setSource({ type: "mine", id });
    } catch (e) {
      setError(e.message);
      setData(null);
    } finally {
      setBusy(false);
    }
  };

  const loadGuest = async (id, ph) => {
    setBusy(true);
    setError("");
    try {
      const res = await fetch(`${baseUrl}/orders/track`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_id: id, phone: ph }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Order not found");
      setData(json.data);
      setSource({ type: "guest", id, phone: ph });
    } catch (e) {
      setError(e.message);
      setData(null);
    } finally {
      setBusy(false);
    }
  };

  const refresh = () => {
    if (source?.type === "mine") loadMine(source.id);
    else if (source?.type === "guest") loadGuest(source.id, source.phone);
  };

  const submit = (e) => {
    e.preventDefault();
    if (!orderId.trim() || !phone.trim())
      return setError("Enter your order number and phone");
    loadGuest(orderId.trim().replace("#", ""), phone.trim());
  };

  const invoiceHref = data ? `/orders/${data.id}/invoice` : null;
  const list = isLoggedIn
    ? mine.map((o) => ({
        id: o.id,
        sub: `BDT ${Number(o.total).toLocaleString()}`,
        run: () => loadMine(o.id),
      }))
    : guest.map((o) => ({
        id: o.id,
        sub: new Date(o.at).toLocaleDateString("en-GB"),
        run: () => loadGuest(o.id, o.phone),
      }));

  return (
    <div>
      <section
        className="relative isolate overflow-hidden"
        style={{ backgroundColor: "#FCD98C" }}
      >
        <div className="ph-container py-8 sm:py-10">
          <p
            className="text-[10px] font-bold uppercase tracking-[0.16em] sm:text-xs"
            style={{
              color: "var(--ph-primary-dark)",
              fontFamily: "var(--font-body)",
            }}
          >
            Where's my toy?
          </p>
          <h1
            className="text-2xl font-semibold text-[#1E2B2B] sm:text-4xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Track Your Order
          </h1>
        </div>
      </section>

      <div className="mx-auto w-11/12 max-w-3xl space-y-6 py-8 sm:py-10">
        <form
          onSubmit={submit}
          className="rounded-[24px] border border-[var(--ph-border)] bg-[var(--ph-surface)] p-5 sm:p-7"
        >
          <h2
            className="mb-1 text-base font-semibold text-[var(--ph-text)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Find an order
          </h2>
          <p
            className="mb-4 text-xs text-[var(--ph-text-faint)]"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Use the order number and the phone number you gave at checkout.
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_1fr_auto]">
            <input
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="Order number (e.g. 42)"
              className={inputCls}
              style={inputSt}
            />
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone number"
              className={inputCls}
              style={inputSt}
            />
            <button
              type="submit"
              disabled={busy}
              className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-white disabled:opacity-60"
              style={{
                backgroundColor: "var(--ph-accent)",
                fontFamily: "var(--font-body)",
              }}
            >
              <FiSearch /> Track
            </button>
          </div>
          {error && (
            <p className="mt-3 text-sm font-semibold text-[var(--ph-coral)]">
              {error}
            </p>
          )}
        </form>

        {list.length > 0 && (
          <div className="rounded-[24px] border border-[var(--ph-border)] bg-[var(--ph-surface)] p-5 sm:p-7">
            <h2
              className="mb-3 text-base font-semibold text-[var(--ph-text)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {isLoggedIn ? "Your orders" : "Orders from this browser"}
            </h2>
            <div className="flex flex-wrap gap-2.5">
              {list.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  onClick={o.run}
                  className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold text-[var(--ph-text)] hover:bg-[var(--ph-primary-soft)]"
                  style={{
                    borderColor:
                      data?.id === o.id
                        ? "var(--ph-primary)"
                        : "var(--ph-border)",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  <FiPackage /> #{o.id}
                  <span className="font-medium text-[var(--ph-text-faint)]">
                    {o.sub}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {data && (
          <TrackResult
            data={data}
            invoiceHref={invoiceHref}
            onChanged={refresh}
          />
        )}
      </div>
    </div>
  );
}
