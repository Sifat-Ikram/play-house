import "dotenv/config";

const requiredEnv = (key: string): string => {
    const value = process.env[key];

    if (!value) {
        throw new Error(`Missing environment variable: ${key}`);
    }

    return value;
};

export const env = {
    PORT: Number(process.env.PORT) || 5000,
    NODE_ENV: process.env.NODE_ENV || "development",

    DATABASE_URL: requiredEnv("DATABASE_URL"),

    JWT_SECRET: requiredEnv("JWT_SECRET"),
};