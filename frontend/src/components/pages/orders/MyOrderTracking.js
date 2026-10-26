"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/provider/AuthProvider";
import TrackResult from "./TrackResult";

const baseUrl =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://play-house-backend.vercel.app/api";

export default function MyOrderTracking({ orderId }) {
  const { authFetch, isLoggedIn, isLoading } = useAuth();
  const [data, setData] = useState(null);

  const load = useCallback(async () => {
    const res = await authFetch(`${baseUrl}/orders/mine/${orderId}/track`);
    if (res.ok) setData((await res.json()).data);
  }, [authFetch, orderId]);

  useEffect(() => {
    if (!isLoading && isLoggedIn) load().catch(() => {});
  }, [isLoading, isLoggedIn, load]);

  if (!data) return null;

  return (
    <div className="mt-6">
      <TrackResult
        data={data}
        showItems={false}
        invoiceHref={`/orders/${orderId}/invoice`}
        onChanged={load}
      />
    </div>
  );
}
