"use client";

import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "./useAxiosPublic";

const useFeaturedProducts = () => {
  const axiosPublic = useAxiosPublic();

  const {
    data: featuredProducts = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["featuredProducts"],
    queryFn: async () => {
      const res = await axiosPublic.get("/products/featured");

      return res.data?.data || res.data || [];
    },
  });

  return {
    featuredProducts,
    isLoading,
    isError,
    error,
    refetch,
  };
};

export default useFeaturedProducts;
