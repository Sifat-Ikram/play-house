import OrderDetailContent from "@/components/pages/orders/OrderDetailContent";

export async function generateMetadata({ params }) {
  const { id } = await params;
  return {
    title: `Order #${id} | Play House`,
    description: "View your order details at Play House.",
  };
}

export const dynamic = "force-dynamic";

const baseUrl =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://play-house-backend.vercel.app/api";

export default async function OrderDetailPage({ params }) {
  const { id } = await params;

  let order = null;
  try {
    const res = await fetch(`${baseUrl}/orders/${id}`, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      order = data.data;
    }
  } catch (error) {
    console.error("Order fetch error:", error);
  }

  return (
    <main className="min-h-screen bg-[var(--ph-bg)]">
      <OrderDetailContent order={order} />
    </main>
  );
}
