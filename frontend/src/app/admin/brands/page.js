"use client";
import EntityManager from "@/components/admin/EntityManager";

const config = {
  title: "Brands",
  singular: "Brand",
  example: "LEGO",
  endpoint: "/brands",
  idKey: "brand_id",
  nameKey: "brand_name",
  imageKey: "brand_image",
};

export default function AdminBrandsPage() {
  return <EntityManager config={config} />;
}
