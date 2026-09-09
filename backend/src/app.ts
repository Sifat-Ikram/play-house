import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";

import { notFoundMiddleware } from "./middlewares/notFound.middleware.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";

import productRoutes from "./routes/product.routes.js";

import inventoryRoutes from "./routes/inventory.routes.js";

import imageRoutes from "./routes/image.routes.js";

import videoRoutes from "./routes/video.routes.js";

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


app.use("/api/v1/products", productRoutes);

app.use("/api/v1/inventories", inventoryRoutes);

app.use("/api/v1/images", imageRoutes);

app.use("/api/v1/videos", videoRoutes);


// 404
app.use(notFoundMiddleware);


// Error handler
app.use(errorMiddleware);


export default app;