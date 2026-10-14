"use client";
import EntityManager from "@/components/admin/EntityManager";

const config = {
  title: "Colours",
  singular: "Colour",
  example: "Sky Blue",
  endpoint: "/colors",
  idKey: "color_id",
  nameKey: "color_name",
  hexKey: "hex_code",
};

export default function AdminColorsPage() {
  return <EntityManager config={config} />;
}
