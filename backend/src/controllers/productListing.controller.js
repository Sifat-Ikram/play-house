const productListingService = require("../services/productListing.service");

const getProductListing = async (req, res) => {
    try {
        const products = await productListingService.getProductListing(req.query);

        return res.status(200).json({
            success: true,
            data: products,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    getProductListing,
};