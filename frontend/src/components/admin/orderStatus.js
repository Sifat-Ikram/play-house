export const STATUS_TABS = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "confirmed", label: "Confirmed" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
  { key: "cancelled", label: "Cancelled" },
  { key: "return_requested", label: "Return Requested" },
  { key: "returned", label: "Returned" },
  { key: "refunded", label: "Refunded" },
];

export const STATUS_STYLE = {
  pending: { bg: "#FFF3D6", color: "#B97A0A" },
  confirmed: { bg: "#DDEBFF", color: "#2F5DA8" },
  shipped: { bg: "#E4E0FF", color: "#5A4BC2" },
  delivered: { bg: "#DFF5EA", color: "#1E9C79" },
  cancelled: { bg: "#FFE7E3", color: "#D9503F" },
  return_requested: { bg: "#FFE9D2", color: "#C46A12" },
  returned: { bg: "#EDE5E0", color: "#7A5A48" },
  refunded: { bg: "#E8EDEF", color: "#4F6670" },
};

export const statusLabel = (key) =>
  STATUS_TABS.find((t) => t.key === key)?.label || key;
