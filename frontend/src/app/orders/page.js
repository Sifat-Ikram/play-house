import OrdersContent from "@/components/pages/orders/OrdersContent";
import { getOrdersFromServer } from "@/lib/serverFetch";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "My Orders | Play House",
  description: "View your past orders at Play House.",
};

export default async function OrdersPage() {
  const orders = await getOrdersFromServer();

  return (
    <main className="min-h-screen bg-[var(--ph-bg)]">
      <OrdersContent initialOrders={orders} />
    </main>
  );
}
