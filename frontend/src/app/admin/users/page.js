"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import useAdminApi from "@/components/admin/useAdminApi";
import { useAuth } from "@/provider/AuthProvider";
import { PageHeader, Card, Dropdown } from "@/components/admin/AdminUI";

const ROLE_OPTIONS = [
  { value: "admin", label: "Admin" },
  { value: "staff", label: "Staff" },
  { value: "viewer", label: "Viewer" },
  { value: "user", label: "User" },
];

export default function AdminUsersPage() {
  const api = useAdminApi();
  const { user: me } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = () =>
    api("/admin/users")
      .then((json) => setUsers(json.data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const changeRole = async (u, role) => {
    if (role === u.role) return;

    const result = await Swal.fire({
      title: "Change role?",
      html: `<b>${u.name}</b>: ${u.role} → <b>${role}</b>`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, change it",
      confirmButtonColor: "#F5A623",
      reverseButtons: true,
    });
    if (!result.isConfirmed) return;

    try {
      await api(`/admin/users/${u.id}/role`, {
        method: "PATCH",
        body: { role },
      });
      await load();
    } catch (e) {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: e.message,
        confirmButtonColor: "#F5A623",
      });
    }
  };

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
          className="w-full min-w-[720px] text-left text-sm"
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
              <th className="px-4 py-3">Joined</th>
              <th className="px-4 py-3">Role</th>
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
                <td className="px-4 py-3 text-[var(--ph-text-soft)]">
                  {new Date(u.created_at).toLocaleDateString("en-GB")}
                </td>
                <td className="px-4 py-3">
                  <div className="w-36">
                    {u.id === me?.id ? (
                      <span
                        className="rounded-full px-3 py-1.5 text-xs font-bold capitalize"
                        style={{
                          backgroundColor: "var(--ph-primary-soft)",
                          color: "var(--ph-primary-dark)",
                        }}
                      >
                        {u.role} (you)
                      </span>
                    ) : (
                      <Dropdown
                        options={ROLE_OPTIONS}
                        value={u.role}
                        onChange={(v) => changeRole(u, v)}
                      />
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
