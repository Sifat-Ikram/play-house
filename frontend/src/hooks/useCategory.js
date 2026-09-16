"use client";

import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "./useAxiosPublic";

const useCategory = () => {
    const axiosPublic = useAxiosPublic();

    const {
        data: categories = [],
        isLoading,
        isError,
        error,
        refetch,
    } = useQuery({
        queryKey: ["categories"],
        queryFn: async () => {
            const res = await axiosPublic.get("/categories");

            return res.data?.data || res.data || [];
        },
    });

    return {
        categories,
        isLoading,
        isError,
        error,
        refetch,
    };
};

export default useCategory;