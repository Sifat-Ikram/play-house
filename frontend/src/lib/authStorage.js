"use client";

import Cookies from "js-cookie";

const ACCESS_KEY = "ph_access_token";
const REFRESH_KEY = "ph_refresh_token";
const USER_KEY = "ph_user";

export const saveAuth = ({ accessToken, refreshToken, user }) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(ACCESS_KEY, accessToken);
  localStorage.setItem(REFRESH_KEY, refreshToken);
  localStorage.setItem(USER_KEY, JSON.stringify(user));

  // Also store the access token as a cookie so server components
  // (page.js) can read it via next/headers and fetch user-specific data.
  Cookies.set(ACCESS_KEY, accessToken, { expires: 1 / 96, path: "/" }); // ~15 min
};

export const getAccessToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACCESS_KEY);
};

export const getRefreshToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFRESH_KEY);
};

export const getStoredUser = () => {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
};

export const setAccessToken = (token) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(ACCESS_KEY, token);
  Cookies.set(ACCESS_KEY, token, { expires: 1 / 96, path: "/" });
};

export const clearAuth = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(USER_KEY);
  Cookies.remove(ACCESS_KEY, { path: "/" });
};
