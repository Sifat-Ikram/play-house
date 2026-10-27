const SITE = "https://play-house-phi.vercel.app";
const API =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://play-house-backend.vercel.app/api";

export default async function sitemap() {
  let names = [];
  try {
    const res = await fetch(`${API}/product-listing`, {
      next: { revalidate: 3600 },
    });
    const json = await res.json();
    names = [...new Set((json.data || []).map((p) => p.product_name))];
  } catch {}

  const pages = [
    "",
    "/product",
    "/aboutUs",
    "/track",
    "/faq",
    "/contact",
    "/privacy-policy",
    "/terms",
    "/shipping-returns",
  ].map((p) => ({
    url: `${SITE}${p}`,
    changeFrequency: "weekly",
    priority: p === "" ? 1 : 0.6,
  }));

  return [
    ...pages,
    ...names.map((n) => ({
      url: `${SITE}/productDetails/${encodeURIComponent(n)}`,
      changeFrequency: "weekly",
      priority: 0.8,
    })),
  ];
}
