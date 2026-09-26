import ProductPageContent from "@/components/pages/product/ProductPageContent";

export async function generateMetadata({ searchParams }) {
  const params = await searchParams;

  const brand = params?.brand;
  const category = params?.category;
  const combo = params?.combo;
  const interest = params?.interest;
  const occasion = params?.occasion;
  const search = params?.search;

  let title = "All Products | Play House";
  let description = "Browse our full collection of toys at Play House.";

  if (brand) {
    title = `${decodeURIComponent(brand)} Toys | Play House`;
    description = `Shop ${decodeURIComponent(brand)} toys at Play House.`;
  } else if (category) {
    title = `${decodeURIComponent(category)} | Play House`;
    description = `Explore our ${decodeURIComponent(category)} collection.`;
  } else if (combo) {
    title = `${decodeURIComponent(combo)} Combo | Play House`;
    description = `Get the best value with our ${decodeURIComponent(combo)} bundle.`;
  } else if (interest) {
    title = `${decodeURIComponent(interest)} Toys | Play House`;
    description = `Toys made for ${decodeURIComponent(interest)} lovers.`;
  } else if (occasion) {
    title = `${decodeURIComponent(occasion)} Gifts | Play House`;
    description = `Perfect picks for ${decodeURIComponent(occasion)}.`;
  } else if (search) {
    title = `Search results for "${decodeURIComponent(search)}" | Play House`;
    description = `See what we found for "${decodeURIComponent(search)}" at Play House.`;
  }

  return { title, description };
}

export const dynamic = "force-dynamic";

export default async function ProductPage({ searchParams }) {
  const params = await searchParams;

  const brand = params?.brand;
  const combo = params?.combo;
  const minAge = params?.minAge;
  const maxAge = params?.maxAge;
  const search = params?.search;
  const category = params?.category;
  const interest = params?.interest;
  const occasion = params?.occasion;

  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL ||
    "https://play-house-backend.vercel.app/api";

  let products = [];

  try {
    const queryParams = new URLSearchParams();

    if (brand) queryParams.set("brand", brand);
    else if (category) queryParams.set("category", category);
    else if (combo) queryParams.set("combo", combo);
    else if (interest) queryParams.set("interest", interest);
    else if (occasion) queryParams.set("occasion", occasion);
    else if (minAge !== undefined) {
      queryParams.set("minAge", minAge);
      if (maxAge) queryParams.set("maxAge", maxAge);
    } else if (search) queryParams.set("search", search);

    const endpoint = `${baseUrl}/product-listing?${queryParams.toString()}`;

    const res = await fetch(endpoint, { cache: "no-store" });

    if (res.ok) {
      const data = await res.json();
      products = data?.data || [];
    }
  } catch (error) {
    console.error("Error fetching products:", error);
  }

  return (
    <main className="min-h-screen bg-[var(--ph-bg)]">
      <ProductPageContent
        brand={brand}
        category={category}
        combo={combo}
        interest={interest}
        occasion={occasion}
        minAge={minAge}
        maxAge={maxAge}
        search={search}
        products={products}
      />
    </main>
  );
}
