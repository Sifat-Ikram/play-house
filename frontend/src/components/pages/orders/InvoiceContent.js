"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FiPrinter, FiX } from "react-icons/fi";
import { useAuth } from "@/provider/AuthProvider";
import { getGuestOrders } from "@/lib/guestOrders";

const baseUrl =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://play-house-backend.vercel.app/api";

export default function InvoiceContent() {
  const { id } = useParams();
  const router = useRouter();
  const { authFetch, isLoggedIn, isLoading } = useAuth();
  const [order, setOrder] = useState(null);
  const [state, setState] = useState("loading");

  useEffect(() => {
    if (isLoading) return;

    (async () => {
      try {
        if (isLoggedIn) {
          const res = await authFetch(`${baseUrl}/orders/mine/${id}/track`);
          if (res.ok) {
            setOrder((await res.json()).data);
            return setState("ok");
          }
        }

        const saved = getGuestOrders().find((o) => String(o.id) === String(id));
        if (saved) {
          const res = await fetch(`${baseUrl}/orders/track`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ order_id: id, phone: saved.phone }),
          });
          if (res.ok) {
            setOrder((await res.json()).data);
            return setState("ok");
          }
        }
        setState("error");
      } catch {
        setState("error");
      }
    })();
  }, [isLoading, isLoggedIn, authFetch, id]);

  return (
    <div className="fixed inset-0 z-[400] overflow-y-auto bg-neutral-100 p-3 sm:p-8">
      <div
        className="mx-auto mb-4 flex max-w-3xl items-center justify-between"
        data-no-print
      >
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold shadow"
        >
          <FiX /> Close
        </button>
        {state === "ok" && (
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-bold text-[#1E2B2B] shadow"
            style={{ backgroundColor: "var(--ph-primary)" }}
          >
            <FiPrinter /> Print / Save as PDF
          </button>
        )}
      </div>

      {state === "loading" && (
        <p className="py-20 text-center text-sm text-neutral-500">
          Loading invoice...
        </p>
      )}
      {state === "error" && (
        <p className="py-20 text-center text-sm font-semibold text-red-500">
          Invoice not available. Open it from your order page, or track the
          order first.
        </p>
      )}

      {state === "ok" && order && (
        <div
          id="invoice-print"
          className="mx-auto max-w-3xl rounded-2xl bg-white p-6 text-[#1E2B2B] shadow sm:p-10"
          style={{ fontFamily: "var(--font-body)" }}
        >
          <div className="flex flex-wrap items-start justify-between gap-4 border-b pb-6">
            <div>
              <p
                className="text-2xl font-bold"
                style={{ fontFamily: "var(--font-display)", color: "#0F5257" }}
              >
                🧸 Play House
              </p>
              <p className="text-xs text-neutral-500">
                A little world of wonder
              </p>
            </div>
            <div className="text-right text-sm">
              <p className="text-lg font-bold">INVOICE</p>
              <p>#{order.id}</p>
              <p className="text-neutral-500">
                {new Date(order.created_at).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 py-6 text-sm sm:grid-cols-2">
            <div>
              <p className="mb-1 text-xs font-bold uppercase text-neutral-500">
                Billed to
              </p>
              <p className="font-semibold">{order.name}</p>
              <p>{order.phone}</p>
              {order.email && <p>{order.email}</p>}
              <p>
                {order.shipping_address}, {order.city}
              </p>
            </div>
            <div className="sm:text-right">
              <p className="mb-1 text-xs font-bold uppercase text-neutral-500">
                Details
              </p>
              <p>
                Payment: <b className="uppercase">{order.payment_method}</b>
              </p>
              <p>
                Delivery:{" "}
                {order.delivery_option === "INSIDE_DHAKA"
                  ? "Inside Dhaka"
                  : "Outside Dhaka"}
              </p>
              <p>
                Status:{" "}
                <b className="capitalize">
                  {String(order.status).replace("_", " ")}
                </b>
              </p>
            </div>
          </div>

          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-y text-xs uppercase text-neutral-500">
                <th className="py-2">Item</th>
                <th className="py-2 text-center">Qty</th>
                <th className="py-2 text-right">Price</th>
                <th className="py-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((it) => (
                <tr key={it.id} className="border-b">
                  <td className="py-2.5">
                    <p className="font-semibold">{it.product_name}</p>
                    <p className="text-xs text-neutral-500">
                      {it.brand_name}
                      {it.color_name ? ` · ${it.color_name}` : ""}
                    </p>
                  </td>
                  <td className="py-2.5 text-center">{it.quantity}</td>
                  <td className="py-2.5 text-right">
                    BDT {Number(it.unit_price).toLocaleString()}
                  </td>
                  <td className="py-2.5 text-right font-semibold">
                    BDT {(Number(it.unit_price) * it.quantity).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="ml-auto mt-6 w-full max-w-xs space-y-1.5 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>BDT {Number(order.subtotal).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>BDT {Number(order.shipping_cost).toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-t pt-2 text-base font-bold">
              <span>Total</span>
              <span>BDT {Number(order.total).toLocaleString()}</span>
            </div>
          </div>

          <p className="mt-10 text-center text-xs text-neutral-500">
            Thank you for shopping at Play House! 🧸
          </p>
        </div>
      )}
    </div>
  );
}
