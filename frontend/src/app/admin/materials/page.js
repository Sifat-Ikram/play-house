"use client";
import EntityManager from "@/components/admin/EntityManager";

const config = {
  title: "Materials",
  singular: "Material",
  example: "Plastic",
  endpoint: "/materials",
  idKey: "material_id",
  nameKey: "material_name",
};

export default function AdminMaterialsPage() {
  return <EntityManager config={config} />;
}
