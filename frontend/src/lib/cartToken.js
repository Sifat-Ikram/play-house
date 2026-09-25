"use client";

export const getCartToken = () => {
  if (typeof window === "undefined") return null;

  let token = localStorage.getItem("ph_cart_token");

  if (!token) {
    token = crypto.randomUUID();
    localStorage.setItem("ph_cart_token", token);
  }

  return token;
};
