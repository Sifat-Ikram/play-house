import ProductPageContent from "@/components/pages/product/ProductPageContent";


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