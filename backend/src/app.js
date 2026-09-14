const express = require("express");
const cors = require("cors");

const productRoutes = require("./routes/product.routes");
const inventoryRoutes = require("./routes/inventory.routes");
const inventoryImageRoutes = require(
    "./routes/inventoryImage.routes"
);
const inventoryVideoRoutes = require(
    "./routes/inventoryVideo.routes"
);

const notFoundMiddleware = require(
    "./middleware/notFound.middleware"
);

const errorMiddleware = require(
    "./middleware/error.middleware"
);

const app = express();

app.use(
    cors({
        origin: "*",
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "API is running",
    });
});

// Routes
app.use("/api/products", productRoutes);

app.use("/api/inventory", inventoryRoutes);

app.use(
    "/api/inventory-images",
    inventoryImageRoutes
);

app.use(
    "/api/inventory-videos",
    inventoryVideoRoutes
);

// 404
app.use(notFoundMiddleware);

// Error handler
app.use(errorMiddleware);

module.exports = app;