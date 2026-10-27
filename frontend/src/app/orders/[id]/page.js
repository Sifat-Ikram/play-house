import OrderDetailContent from "@/components/pages/orders/OrderDetailContent";
import { getOrderFromServer } from "@/lib/serverFetch";

export async function generateMetadata({ params }) {
  const { id } = await params;
  return {
    title: `Order #${id} | Play House`,
    description: "View your order details at Play House.",
  };
}

export const dynamic = "force-dynamic";

export default async function OrderDetailPage({ params }) {
  const { id } = await params;

  const order = await getOrderFromServer(id);

  return (
    <main className="min-h-screen bg-[var(--ph-bg)]">
      <OrderDetailContent order={order} />
    </main>
  );
}
