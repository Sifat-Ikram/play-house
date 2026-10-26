const KEY = "ph_guest_orders";

export const getGuestOrders = () => {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
};

export const saveGuestOrder = ({ id, phone }) => {
  try {
    const list = getGuestOrders().filter((o) => o.id !== id);
    list.unshift({ id, phone, at: Date.now() });
    localStorage.setItem(KEY, JSON.stringify(list.slice(0, 10)));
  } catch {}
};
