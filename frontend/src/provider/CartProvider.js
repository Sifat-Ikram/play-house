"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { getCartToken } from "@/lib/cartToken";

const CartContext = createContext(null);

const baseUrl =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://play-house-backend.vercel.app/api";

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    const token = getCartToken();
    if (!token) return;

    try {
      setIsLoading(true);
      const res = await fetch(`${baseUrl}/cart/${token}`, {
        cache: "no-store",
      });
      if (res.ok) {
        const data = await res.json();
        setItems(data?.data || []);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = useCallback(
    async (inventoryId, quantity = 1) => {
      const token = getCartToken();

      try {
        const res = await fetch(`${baseUrl}/cart`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cart_token: token,
            inventory_id: inventoryId,
            quantity,
          }),
        });

        if (res.ok) {
          await fetchCart();
          setIsOpen(true);
        }
      } catch (error) {
        console.error("Error adding to cart:", error);
      }
    },
    [fetchCart],
  );

  const updateQuantity = useCallback(
    async (cartItemId, quantity) => {
      if (quantity < 1) return;

      setItems((prev) =>
        prev.map((item) =>
          item.id === cartItemId ? { ...item, quantity } : item,
        ),
      );

      try {
        await fetch(`${baseUrl}/cart/${cartItemId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quantity }),
        });
      } catch (error) {
        console.error("Error updating quantity:", error);
        fetchCart();
      }
    },
    [fetchCart],
  );

  const removeItem = useCallback(
    async (cartItemId) => {
      setItems((prev) => prev.filter((item) => item.id !== cartItemId));

      try {
        await fetch(`${baseUrl}/cart/${cartItemId}`, { method: "DELETE" });
      } catch (error) {
        console.error("Error removing item:", error);
        fetchCart();
      }
    },
    [fetchCart],
  );

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = items.reduce(
    (sum, item) => sum + Number(item.selling_price || 0) * item.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        isLoading,
        cartCount,
        cartTotal,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
        addToCart,
        updateQuantity,
        removeItem,
        refreshCart: fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
};
