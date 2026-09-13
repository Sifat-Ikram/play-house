import dotenv from "dotenv";

dotenv.config();

export const env = {
    PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 5000,
    DATABASE_URL: process.env.DATABASE_URL || "",
};