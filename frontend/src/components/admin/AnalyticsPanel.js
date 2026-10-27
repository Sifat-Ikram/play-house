"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { FiDownload, FiAlertTriangle } from "react-icons/fi";
import { useAuth } from "@/provider/AuthProvider";
import useAdminApi from "./useAdminApi";
import { Card, Dropdown } from "./AdminUI";
import { statusLabel, STATUS_STYLE } from "./orderStatus";

const baseUrl =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://play-house-backend.vercel.app/api";
const RANGE = [
  { value: 7, label: "Last 7 days" },
  { value: 30, label: "Last 30 days" },
  { value: 90, label: "Last 90 days" },
];

const Title = ({ children }) => (
  <h2
    className="mb-3 text-base font-semibold text-[var(--ph-text)]"
    style={{ fontFamily: "var(--font-display)" }}
  >
    {children}
  </h2>
);

export default function AnalyticsPanel() {
  const api = useAdminApi();
  const { authFetch } = useAuth();
  const [days, setDays] = useState(30);
  const [data, setData] = useState(null);
  const [low, setLow] = useState([]);

  useEffect(() => {
    api(`/admin/analytics?days=${days}`)
      .then((j) => setData(j.data))
      .catch(() => {});
  }, [api, days]);

  useEffect(() => {
    api("/admin/low-stock")
      .then((j) => setLow(j.data))
      .catch(() => {});
  }, [api]);

  const download = async (type) => {
    const res = await authFetch(`${baseUrl}/admin/export/${type}`);
    if (!res.ok) return;
    const blob = await res.blob();
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${type}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const pie = (data?.status || []).map((s) => ({
    name: statusLabel(s.status),
    value: s.count,
    color: STATUS_STYLE[s.status]?.color || "#999",
  }));

  return (
    <div className="mt-6 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2
          className="text-lg font-semibold text-[var(--ph-text)]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Analytics
        </h2>
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => download("inventory")}
            className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold text-[var(--ph-text)] hover:bg-[var(--ph-primary-soft)]"
            style={{ borderColor: "var(--ph-border)" }}
          >
            <FiDownload /> Inventory CSV
          </button>
          <button
            type="button"
            onClick={() => download("orders")}
            className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold text-[var(--ph-text)] hover:bg-[var(--ph-primary-soft)]"
            style={{ borderColor: "var(--ph-border)" }}
          >
            <FiDownload /> Orders CSV
          </button>
          <div className="w-40">
            <Dropdown
              options={RANGE}
              value={days}
              onChange={(v) => setDays(Number(v))}
            />
          </div>
        </div>
      </div>

      <Card>
        <Title>Revenue</Title>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data?.sales || []}>
              <defs>
                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F5A623" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#F5A623" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#EDE6D8" />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 11 }}
                interval="preserveStartEnd"
              />
              <YAxis tick={{ fontSize: 11 }} width={50} />
              <Tooltip
                formatter={(v) => [
                  `BDT ${Number(v).toLocaleString()}`,
                  "Revenue",
                ]}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#D68C0F"
                strokeWidth={2}
                fill="url(#rev)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card>
          <Title>Top selling products</Title>
          {data?.top?.length ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data.top}
                  layout="vertical"
                  margin={{ left: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#EDE6D8" />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 11 }}
                    allowDecimals={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={110}
                    tick={{ fontSize: 10 }}
                    tickFormatter={(v) =>
                      v.length > 16 ? `${v.slice(0, 15)}…` : v
                    }
                  />
                  <Tooltip formatter={(v) => [v, "Units sold"]} />
                  <Bar dataKey="units" fill="#0F5257" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="py-10 text-center text-sm text-[var(--ph-text-faint)]">
              No sales in this period.
            </p>
          )}
        </Card>

        <Card>
          <Title>Orders by status</Title>
          {pie.length ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pie}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={2}
                    label={({ name, value }) => `${name} (${value})`}
                    labelLine={false}
                    style={{ fontSize: 10 }}
                  >
                    {pie.map((p) => (
                      <Cell key={p.name} fill={p.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="py-10 text-center text-sm text-[var(--ph-text-faint)]">
              No orders yet.
            </p>
          )}
        </Card>
      </div>

      <Card>
        <Title>
          <span className="inline-flex items-center gap-2">
            <FiAlertTriangle style={{ color: "var(--ph-coral)" }} /> Low stock
            alert ({low.length})
          </span>
        </Title>
        {low.length === 0 ? (
          <p className="text-sm text-[var(--ph-text-soft)]">
            Everything is well stocked. 🎉
          </p>
        ) : (
          <div className="divide-y" style={{ borderColor: "var(--ph-border)" }}>
            {low.map((i) => (
              <Link
                key={i.id}
                href={`/admin/products/${i.product_id}`}
                className="flex items-center justify-between gap-3 py-2.5 hover:bg-[var(--ph-primary-soft)]"
                style={{
                  borderColor: "var(--ph-border)",
                  fontFamily: "var(--font-body)",
                }}
              >
                <span className="min-w-0 truncate text-sm font-semibold text-[var(--ph-text)]">
                  {i.name}
                  {i.color_name ? ` · ${i.color_name}` : ""}
                </span>
                <span
                  className="shrink-0 rounded-full px-3 py-1 text-xs font-bold"
                  style={{
                    backgroundColor:
                      Number(i.stock_quantity) === 0 ? "#FFE7E3" : "#FFF3D6",
                    color:
                      Number(i.stock_quantity) === 0
                        ? "var(--ph-coral)"
                        : "#B97A0A",
                  }}
                >
                  {Number(i.stock_quantity) === 0
                    ? "Out of stock"
                    : `${i.stock_quantity} left`}
                </span>
              </Link>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
