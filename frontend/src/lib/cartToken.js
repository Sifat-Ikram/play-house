"use client";

import Cookies from "js-cookie";

const TOKEN_KEY = "ph_cart_token";
const COOKIE_DAYS = 60;

export const getCartToken = () => {
  if (typeof window === "undefined") return null;

  let token = Cookies.get(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY);

  if (!token) {
    token = crypto.randomUUID();
  }

  Cookies.set(TOKEN_KEY, token, { expires: COOKIE_DAYS, path: "/" });
  localStorage.setItem(TOKEN_KEY, token);

  return token;
};
