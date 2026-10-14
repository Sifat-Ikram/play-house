"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FiPackage,
  FiUsers,
  FiTag,
  FiLayers,
  FiStar,
  FiAlertTriangle,
  FiShoppingBag,
  FiTrendingUp,
} from "react-icons/fi";
import useAdminApi from "@/components/admin/useAdminApi";
import { PageHeader, Card } from "@/components/admin/AdminUI";

const CARDS = [
  { key: "products", label: "Products", icon: FiPackage, bg: "#FCD98C" },
  { key: "users", label: "Users", icon: FiUsers, bg: "#B9E6E3" },
  { key: "brands", label: "Brands", icon: FiTag, bg: "#FFC2B3" },
  { key: "categories", label: "Categories", icon: FiLayers, bg: "#9FE8CE" },
  { key: "featured", label: "Featured Products", icon: FiStar, bg: "#FBD48A" },
  {
    key: "low_stock",
    label: "Low Stock (≤5)",
    icon: FiAlertTriangle,
    bg: "#FFE7E3",
  },
  { key: "orders", label: "Orders", icon: FiShoppingBag, bg: "#DFF5EA" },
  {
    key: "revenue",
    label: "Revenue (BDT)",
    icon: FiTrendingUp,
    bg: "#E4F6EE",
    money: true,
  },
];

export default function AdminDashboardPage() {
  const api = useAdminApi();
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api("/admin/stats")
      .then((json) => setStats(json.data))
      .catch((e) => setError(e.message));
  }, [api]);

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="A quick look at your toy store" />

      {error && (
        <p className="mb-4 text-sm font-semibold text-[var(--ph-coral)]">
          {error}
        </p>
      )}

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {CARDS.map((c) => {
          const Icon = c.icon;
          const value = stats?.[c.key];
          return (
            <div
              key={c.key}
              className="rounded-[20px] p-4 sm:p-5"
              style={{ backgroundColor: c.bg }}
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-lg text-[#1E2B2B]">
                <Icon />
              </span>
              <p
                className="mt-3 text-2xl font-bold text-[#1E2B2B]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {value === undefined
                  ? "—"
                  : c.money
                    ? Number(value).toLocaleString()
                    : value}
              </p>
              <p
                className="text-xs font-semibold text-[#1E2B2B]/70"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {c.label}
              </p>
            </div>
          );
        })}
      </div>

      <Card className="mt-6">
        <h2
          className="mb-3 text-base font-semibold text-[var(--ph-text)]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Quick actions
        </h2>
        <div className="flex flex-wrap gap-2.5">
          {[
            ["/admin/products/new", "+ Add Product"],
            ["/admin/products", "Manage Products"],
            ["/admin/brands", "Brands"],
            ["/admin/categories", "Categories"],
          ].map(([href, label]) => (
            <Link
              key={href}
              href={href}
              className="rounded-full border px-4 py-2 text-xs font-bold text-[var(--ph-text)] hover:bg-[var(--ph-primary-soft)]"
              style={{
                borderColor: "var(--ph-border)",
                fontFamily: "var(--font-body)",
              }}
            >
              {label}
            </Link>
          ))}
        </div>
      </Card>
    </div>
  );
}
