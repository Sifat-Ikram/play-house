"use client";

import { useEffect, useState } from "react";
import useAdminApi from "@/components/admin/useAdminApi";
import { PageHeader, Card } from "@/components/admin/AdminUI";

export default function AdminUsersPage() {
  const api = useAdminApi();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api("/admin/users")
      .then((json) => setUsers(json.data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [api]);

  return (
    <div>
      <PageHeader title="Users" subtitle={`${users.length} registered users`} />
      {error && (
        <p className="mb-3 text-sm font-semibold text-[var(--ph-coral)]">
          {error}
        </p>
      )}

      <Card className="overflow-x-auto !p-0">
        <table
          className="w-full min-w-[560px] text-left text-sm"
          style={{ fontFamily: "var(--font-body)" }}
        >
          <thead>
            <tr
              className="border-b text-[11px] uppercase tracking-wide text-[var(--ph-text-faint)]"
              style={{ borderColor: "var(--ph-border)" }}
            >
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Joined</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-6 text-center text-[var(--ph-text-faint)]"
                >
                  Loading...
                </td>
              </tr>
            )}
            {users.map((u) => (
              <tr
                key={u.id}
                className="border-b last:border-b-0"
                style={{ borderColor: "var(--ph-border)" }}
              >
                <td className="px-4 py-3 font-semibold text-[var(--ph-text)]">
                  {u.name}
                </td>
                <td className="px-4 py-3 text-[var(--ph-text-soft)]">
                  {u.email}
                </td>
                <td className="px-4 py-3 text-[var(--ph-text-soft)]">
                  {u.phone_number || "—"}
                </td>
                <td className="px-4 py-3">
                  <span
                    className="rounded-full px-2.5 py-1 text-[11px] font-bold capitalize"
                    style={{
                      backgroundColor:
                        u.role === "admin"
                          ? "var(--ph-primary-soft)"
                          : "var(--ph-accent-soft)",
                      color:
                        u.role === "admin"
                          ? "var(--ph-primary-dark)"
                          : "var(--ph-accent-dark)",
                    }}
                  >
                    {u.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-[var(--ph-text-soft)]">
                  {new Date(u.created_at).toLocaleDateString("en-GB")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
