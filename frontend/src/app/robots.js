export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/checkout",
          "/profile",
          "/orders",
          "/orderSuccess",
        ],
      },
    ],
    sitemap: "https://play-house-phi.vercel.app/sitemap.xml",
  };
}
