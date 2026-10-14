"use client";

import { useRouter } from "next/navigation";
import useAdminApi from "@/components/admin/useAdminApi";
import ProductForm from "@/components/admin/ProductForm";
import { PageHeader } from "@/components/admin/AdminUI";

export default function AdminAddProductPage() {
  const api = useAdminApi();
  const router = useRouter();

  const handleCreate = async (body) => {
    const json = await api("/products", { method: "POST", body });
    const id = json.data?.id;
    router.push(`/admin/products/${id}?new=1`);
  };

  return (
    <div>
      <PageHeader
        title="Add Product"
        subtitle="Fill the product details, then add its inventory (colours, price, stock, images)"
      />
      <ProductForm
        onSubmit={handleCreate}
        submitLabel="Add Product & Continue"
      />
    </div>
  );
}
