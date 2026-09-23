const productListingModel = require("../models/productListing.model");

const getProductListing = async (queryParams) => {
    const {
        brand,
        category,
        combo,
        interest,
        occasion,
        minAge,
        maxAge,
        search,
    } = queryParams;

    const filters = {
        brand: brand || null,
        category: category || null,
        combo: combo || null,
        interest: interest || null,
        occasion: occasion || null,
        minAge: minAge !== undefined ? minAge : null,
        maxAge: maxAge !== undefined ? maxAge : null,
        search: search || null,
    };

    return await productListingModel.getProductListing(filters);
};

module.exports = {
    getProductListing,
};