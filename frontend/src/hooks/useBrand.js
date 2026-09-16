"use client";

import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "./useAxiosPublic";

const useBrand = () => {
    const axiosPublic = useAxiosPublic();

    const {
        data: brands = [],
        isLoading,
        isError,
        error,
        refetch,
    } = useQuery
            ({
                queryKey: ["brands"],
                queryFn: async () => {
                    const res = await axiosPublic.get("/brands");

                    return res.data?.data || res.data || [];
                },
            });

    return {
        brands,
        isLoading,
        isError,
        error,
        refetch,
    };
};

export default useBrand;