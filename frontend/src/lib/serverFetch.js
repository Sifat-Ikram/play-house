import { cookies } from "next/headers";

const baseUrl =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://play-house-backend.vercel.app/api";

export const getProfileFromServer = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("ph_access_token")?.value;

  if (!accessToken) return null;

  try {
    const res = await fetch(`${baseUrl}/profile`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    });

    if (!res.ok) return null;

    const data = await res.json();
    return data.data || null;
  } catch (error) {
    console.error("Server profile fetch error:", error);
    return null;
  }
};

export const getOrdersFromServer = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("ph_access_token")?.value;

  if (!accessToken) return null;

  try {
    const res = await fetch(`${baseUrl}/orders/mine`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    });

    if (!res.ok) return null;

    const data = await res.json();
    return data.data || null;
  } catch (error) {
    console.error("Server orders fetch error:", error);
    return null;
  }
};

export const getOrderFromServer = async (id) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("ph_access_token")?.value;
  try {
    const res = await fetch(`${baseUrl}/orders/${id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      cache: "no-store",
    });
    if (!res.ok) return null;
    return (await res.json()).data || null;
  } catch {
    return null;
  }
};
