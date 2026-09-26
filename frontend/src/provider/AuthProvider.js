"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  saveAuth,
  getAccessToken,
  getRefreshToken,
  getStoredUser,
  clearAuth,
} from "@/lib/authStorage";
import { getCartToken } from "@/lib/cartToken";

const AuthContext = createContext(null);

const baseUrl =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://play-house-backend.vercel.app/api";

const mergeGuestCart = async (accessToken) => {
  try {
    const cartToken = getCartToken();
    if (!cartToken) return;

    await fetch(`${baseUrl}/cart/merge`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ cart_token: cartToken }),
    });
  } catch (error) {
    console.error("Cart merge error:", error);
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setUser(getStoredUser());
    setIsLoading(false);
  }, []);

  const register = useCallback(async ({ name, email, password }) => {
    const res = await fetch(`${baseUrl}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Registration failed");
    }

    saveAuth(data.data);
    setUser(data.data.user);
    await mergeGuestCart(data.data.accessToken);
    return data.data;
  }, []);

  const login = useCallback(async ({ email, password }) => {
    const res = await fetch(`${baseUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Login failed");
    }

    saveAuth(data.data);
    setUser(data.data.user);
    await mergeGuestCart(data.data.accessToken);
    return data.data;
  }, []);

  const logout = useCallback(async () => {
    const refreshToken = getRefreshToken();

    try {
      await fetch(`${baseUrl}/auth/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });
    } catch (error) {
      console.error("Logout error:", error);
    }

    clearAuth();
    setUser(null);
  }, []);

  const refreshAccessToken = useCallback(async () => {
    const refreshToken = getRefreshToken();

    if (!refreshToken) {
      clearAuth();
      setUser(null);
      return null;
    }

    try {
      const res = await fetch(`${baseUrl}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      const data = await res.json();

      if (!res.ok) {
        clearAuth();
        setUser(null);
        return null;
      }

      saveAuth(data.data);
      setUser(data.data.user);
      return data.data.accessToken;
    } catch (error) {
      console.error("Token refresh error:", error);
      clearAuth();
      setUser(null);
      return null;
    }
  }, []);

  const authFetch = useCallback(
    async (url, options = {}) => {
      let token = getAccessToken();

      const doFetch = (accessToken) =>
        fetch(url, {
          ...options,
          headers: {
            ...(options.headers || {}),
            Authorization: `Bearer ${accessToken}`,
          },
        });

      let res = await doFetch(token);

      if (res.status === 401) {
        const newToken = await refreshAccessToken();
        if (newToken) {
          res = await doFetch(newToken);
        }
      }

      return res;
    },
    [refreshAccessToken],
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isLoggedIn: !!user,
        register,
        login,
        logout,
        refreshAccessToken,
        authFetch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
};
