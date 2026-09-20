"use client";

import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "./useAxiosPublic";


const useReviews = () => {
    const axiosPublic = useAxiosPublic();

    const {
        data: reviews = [],
        isLoading,
        isError,
        error,
        refetch,
    } = useQuery
            ({
                queryKey: ["reviews"],
                queryFn: async () => {
                    const res = await axiosPublic.get("/review/top-rated");

                    return res.data?.data || res.data || [];
                },
            });

    return {
        reviews,
        isLoading,
        isError,
        error,
        refetch,
    };
};

export default useReviews;