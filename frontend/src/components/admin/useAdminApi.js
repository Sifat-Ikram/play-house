"use client";

import { useCallback } from "react";
import { useAuth } from "@/provider/AuthProvider";

const baseUrl =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://play-house-backend.vercel.app/api";

export const unwrapList = (json) =>
  Array.isArray(json)
    ? json
    : (json?.data ??
      json?.brands ??
      json?.categories ??
      json?.colors ??
      json?.materials ??
      []);

export default function useAdminApi() {
  const { authFetch, user } = useAuth();
  const role = user?.role;

  return useCallback(
    async (path, { method = "GET", body } = {}) => {
      // Viewer শুধু দেখতে পারবে (backend-ও আলাদাভাবে আটকায়)
      if (role === "viewer" && method !== "GET") {
        throw new Error("View-only account: changes are disabled");
      }

      const isForm =
        typeof FormData !== "undefined" && body instanceof FormData;

      const res = await authFetch(`${baseUrl}${path}`, {
        method,
        headers:
          body && !isForm ? { "Content-Type": "application/json" } : undefined,
        body: body ? (isForm ? body : JSON.stringify(body)) : undefined,
      });

      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(json.message || `Request failed (${res.status})`);
      }

      return json;
    },
    [authFetch, role],
  );
}
