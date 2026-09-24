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

    console.log(product);


    return (
        <main className="min-h-screen bg-[var(--ph-bg)]">

        </main>
    );
}