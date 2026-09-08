import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";

import { notFoundMiddleware } from "./middlewares/notFound.middleware";
import { errorMiddleware } from "./middlewares/error.middleware";

const app = express();


// Security
app.use(helmet());


// CORS
app.use(
    cors()
);


// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Cookies
app.use(cookieParser());


// Health check
app.get("/", (_req, res) => {
    res.status(200).json({
        success: true,
        message: "Play House API is running",
    });
});


// 404
app.use(notFoundMiddleware);


// Error handler
app.use(errorMiddleware);


export default app;