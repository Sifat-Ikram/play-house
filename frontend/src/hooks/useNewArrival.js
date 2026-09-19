"use client";

import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "./useAxiosPublic";

const useNewArrival = () => {
    const axiosPublic = useAxiosPublic();

    const {
        data: newArrivals = [],
        isLoading,
        isError,
        error,
        refetch,
    } = useQuery({
        queryKey: ["new-arrivals"],
        queryFn: async () => {
            const res = await axiosPublic.get("/products/new-arrivals");

            return res.data?.data || res.data?.products || res.data || [];
        },
    });

    return {
        newArrivals,
        isLoading,
        isError,
        error,
        refetch,
    };
};

export default useNewArrival;