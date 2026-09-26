"use client";

import { useEffect, useState } from "react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://play-house-backend.vercel.app/api";

const useProductSuggestions = (query) => {
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const trimmedQuery = query.trim();

    // Don't call the API for less than 2 characters
    if (trimmedQuery.length < 2) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();

    const timer = setTimeout(async () => {
      try {
        setIsLoading(true);

        const response = await fetch(
          `${API_URL}/products/suggest?q=${encodeURIComponent(trimmedQuery)}`,
          {
            method: "GET",
            signal: controller.signal,
            cache: "no-store",
          },
        );

        if (!response.ok) {
          setSuggestions([]);
          return;
        }

        const result = await response.json();

        setSuggestions(
          result?.success && Array.isArray(result?.data) ? result.data : [],
        );
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Product suggestion error:", error);
          setSuggestions([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }, 300);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  return {
    suggestions,
    isLoading,
  };
};

export default useProductSuggestions;
