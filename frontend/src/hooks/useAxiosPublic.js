"use client";

import axios from "axios";

const useAxiosPublic = () => {
    const axiosPublic = axios.create({
        baseURL: "https://play-house-backend.vercel.app/api",
    });

    return axiosPublic;
};

export default useAxiosPublic;