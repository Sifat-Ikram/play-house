const express = require("express");
const cors = require("cors");

const notFoundMiddleware = require("./middleware/notFound.middleware");
const errorMiddleware = require("./middleware/error.middleware");

const app = express();

app.use(
    cors({
        origin: "*",
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "API is running",
    });
});

/*
  Routes will be added here.

  Example:

  const productRoutes = require("./routes/product.routes");
  app.use("/api/products", productRoutes);
*/

app.use(notFoundMiddleware);
app.use(errorMiddleware);

module.exports = app;