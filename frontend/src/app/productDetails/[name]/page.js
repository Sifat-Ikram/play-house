import ProductDetailsContent from "@/components/pages/productDetails/ProductDetailsContent";

export async function generateMetadata({ params }) {
  const { name } = await params;

  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL ||
    "https://play-house-backend.vercel.app/api";

  try {
    const res = await fetch(
      `${baseUrl}/products/name/${encodeURIComponent(name)}`,
      {
        cache: "no-store",
      },
    );

    if (res.ok) {
      const data = await res.json();
      const product = data?.data;

      if (product) {
        const description =
          product.summary ||
          product.description?.slice(0, 155) ||
          `Buy ${product.name} at Play House.`;

        return {
          title: `${product.name} | Play House`,
          description,
          openGraph: {
            title: product.name,
            description,
            images: product.inventory?.[0]?.images?.[0]?.image_url
              ? [product.inventory[0].images[0].image_url]
              : [],
          },
        };
      }
    }
  } catch (error) {
    console.error("Metadata fetch error:", error);
  }

  return {
    title: "Product | Play House",
    description: "Discover toys made for little adventures at Play House.",
  };
}

export const dynamic = "force-dynamic";

export default async function ProductDetailsPage({ params }) {
  const { name } = await params;

  const baseUrl = "https://play-house-backend.vercel.app/api";

  let product = null;

  try {
    const endpoint = `${baseUrl}/products/name/${name}`;

    console.log("Fetching from:", endpoint); // ← temporary debug log

    const res = await fetch(endpoint, { cache: "no-store" });

    if (res.ok) {
      const data = await res.json();
      product = data?.data || null;
    } else {
      const errorBody = await res.text();
      console.log("Fetch failed:", res.status, errorBody);
    }
  } catch (error) {
    console.error("Error fetching product details:", error);
  }

  let reviews = [];

  try {
    const endpoint = `${baseUrl}/review/products/${product.id}/reviews`;

    console.log("Fetching reviews from:", endpoint);

    const res = await fetch(endpoint, { cache: "no-store" });

    if (res.ok) {
      const data = await res.json();
      reviews = data?.data || [];
    } else {
      const errorBody = await res.text();
      console.log("Reviews fetch failed:", res.status, errorBody);
    }
  } catch (error) {
    console.error("Error fetching reviews:", error);
  }

  let similarProducts = [];

  if (product?.brand_name) {
    try {
      const endpoint = `${baseUrl}/product-listing?brand=${encodeURIComponent(
        product.brand_name,
      )}`;

      console.log("Fetching similar products from:", endpoint);

      const res = await fetch(endpoint, { cache: "no-store" });

      if (res.ok) {
        const data = await res.json();

        similarProducts = (data?.data || []).filter(
          (item) => item.id !== product.id,
        );
      } else {
        const errorBody = await res.text();
        console.log("Similar products fetch failed:", res.status, errorBody);
      }
    } catch (error) {
      console.error("Error fetching similar products:", error);
    }
  }

  return (
    <main className="min-h-screen bg-[var(--ph-bg)]">
      <ProductDetailsContent
        product={product}
        reviews={reviews}
        similarProducts={similarProducts}
      />
    </main>
  );
}
