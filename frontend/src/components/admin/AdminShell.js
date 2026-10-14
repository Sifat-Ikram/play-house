"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FiGrid,
  FiPackage,
  FiUsers,
  FiPlusSquare,
  FiTag,
  FiLayers,
  FiDroplet,
  FiBox,
  FiShoppingBag,
  FiShoppingCart,
  FiLogOut,
  FiMenu,
  FiX,
} from "react-icons/fi";
import { useAuth } from "@/provider/AuthProvider";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: FiGrid, exact: true },
  {
    href: "/admin/products",
    label: "Products",
    icon: FiPackage,
    exclude: "/admin/products/new",
  },
  { href: "/admin/users", label: "Users", icon: FiUsers },
  {
    href: "/admin/products/new",
    label: "Add Product",
    icon: FiPlusSquare,
    exact: true,
  },
  { href: "/admin/brands", label: "Add Brand", icon: FiTag },
  { href: "/admin/categories", label: "Add Category", icon: FiLayers },
  { href: "/admin/colors", label: "Add Colour", icon: FiDroplet },
  { href: "/admin/materials", label: "Add Material", icon: FiBox },
  { label: "Orders", icon: FiShoppingBag, soon: true },
  { label: "Carts", icon: FiShoppingCart, soon: true },
];

const AdminShell = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading, logout } = useAuth();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  const isActive = (item) => {
    if (item.exclude && pathname.startsWith(item.exclude)) return false;
    if (item.exact) return pathname === item.href;
    return pathname === item.href || pathname.startsWith(item.href + "/");
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-[var(--ph-text-faint)]">
        Loading...
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
        <p className="text-5xl">🔒</p>
        <h1
          className="mt-3 text-xl font-semibold text-[var(--ph-text)]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Admin access only
        </h1>
        <p
          className="mt-1.5 max-w-sm text-sm text-[var(--ph-text-soft)]"
          style={{ fontFamily: "var(--font-body)" }}
        >
          {user
            ? "Your account is not an admin. If you were just promoted, log out and log in again."
            : "Please log in with an admin account."}
        </p>
        <Link
          href="/logIn"
          className="mt-5 rounded-full px-6 py-2.5 text-sm font-bold text-white"
          style={{ backgroundColor: "var(--ph-accent)" }}
        >
          Go to Login
        </Link>
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <div className="flex min-h-screen bg-[var(--ph-bg)]">
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 transform flex-col transition-transform duration-200 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ backgroundColor: "var(--ph-accent-dark)" }}
      >
        <div className="flex items-center justify-between px-5 py-5">
          <div>
            <p
              className="text-[10px] font-bold uppercase tracking-[0.16em]"
              style={{ color: "var(--ph-primary)" }}
            >
              Play House
            </p>
            <p
              className="text-lg font-semibold text-white"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Admin Panel
            </p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="text-white lg:hidden"
            aria-label="Close menu"
          >
            <FiX className="text-xl" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 pb-3">
          <ul className="space-y-1">
            {NAV.map((item) => {
              const Icon = item.icon;

              if (item.soon) {
                return (
                  <li key={item.label}>
                    <span
                      className="flex cursor-not-allowed items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold text-white/40"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      <span className="flex items-center gap-3">
                        <Icon className="text-lg" />
                        {item.label}
                      </span>
                      <span className="rounded-full bg-white/10 px-2 py-0.5 text-[9px] uppercase">
                        Soon
                      </span>
                    </span>
                  </li>
                );
              }

              const active = isActive(item);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors"
                    style={{
                      backgroundColor: active
                        ? "var(--ph-primary)"
                        : "transparent",
                      color: active ? "#1E2B2B" : "rgba(255,255,255,0.8)",
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    <Icon className="text-lg" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-white/10 p-3">
          <p className="truncate px-3 pb-2 text-xs text-white/60">
            {user.email}
          </p>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-white/80 transition-colors hover:bg-white/10"
            style={{ fontFamily: "var(--font-body)" }}
          >
            <FiLogOut className="text-lg" /> Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-[var(--ph-border)] bg-[var(--ph-surface)] px-4 py-3 lg:hidden">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="text-xl text-[var(--ph-text)]"
          >
            <FiMenu />
          </button>
          <span
            className="text-sm font-semibold text-[var(--ph-text)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Admin Panel
          </span>
        </header>

        <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminShell;
