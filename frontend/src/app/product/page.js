import ProductPageHeader from "@/components/pages/product/ProductPageHeader";



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

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.yourdomain.com";

    let products = [];
    let endpoint = "";

    try {
        if (brand) {
            endpoint = `${baseUrl}/brand/${brand}`;
        } else if (category) {
            endpoint = `${baseUrl}/category/${category}`;
        } else if (combo) {
            endpoint = `${baseUrl}/combo/${combo}`;
        } else if (interest) {
            endpoint = `${baseUrl}/interest/${interest}`;
        } else if (occasion) {
            endpoint = `${baseUrl}/occasion/${occasion}`;
        } else if (minAge !== undefined) {
            const query = maxAge ? `minAge=${minAge}&maxAge=${maxAge}` : `minAge=${minAge}`;
            endpoint = `${baseUrl}/age?${query}`;
        } else if (search) {
            endpoint = `${baseUrl}/search?q=${encodeURIComponent(search)}`;
        } else {
            endpoint = `${baseUrl}`;
        }

        const res = await fetch(endpoint, { cache: "no-store" });

        if (res.ok) {
            const data = await res.json();
            products = data?.products || data || [];
        }
    } catch (error) {
        console.error("Error fetching products:", error);
    }

    return (
        <main className="min-h-screen bg-[var(--ph-bg)]">
            <ProductPageHeader
                brand={brand}
                category={category}
                combo={combo}
                interest={interest}
                occasion={occasion}
                minAge={minAge}
                maxAge={maxAge}
                search={search}
                productCount={products.length}
            />

            {/* Sidebar/Drawer + Product Grid পরে এখানে বসবে */}
        </main>
    );
}