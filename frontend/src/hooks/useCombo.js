"use client";

import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "./useAxiosPublic";

const useCombo = () => {
    const axiosPublic = useAxiosPublic();

    const {
        data: combos = [],
        isLoading,
        isError,
        error,
        refetch,
    } = useQuery({
        queryKey: ["combos"],
        queryFn: async () => {
            const res = await axiosPublic.get("/combo");

            return res.data?.combos || res.data?.data || res.data || [];
        },
    });

    return {
        combos,
        isLoading,
        isError,
        error,
        refetch,
    };
};

export default useCombo;