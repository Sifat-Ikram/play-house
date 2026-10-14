"use client";
import EntityManager from "@/components/admin/EntityManager";

const config = {
  title: "Categories",
  singular: "Category",
  example: "Ride-On & Vehicle Toys",
  endpoint: "/categories",
  idKey: "category_id",
  nameKey: "category_name",
  imageKey: "category_image",
};

export default function AdminCategoriesPage() {
  return <EntityManager config={config} />;
}
