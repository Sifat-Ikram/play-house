const adminService = require("../services/admin.service");

const respond =
  (fn, successStatus = 200) =>
  async (req, res) => {
    try {
      const data = await fn(req);
      return res.status(successStatus).json({ success: true, data });
    } catch (error) {
      if (error.code === "23505") {
        return res
          .status(409)
          .json({
            success: false,
            message: "Duplicate value (e.g. SKU already exists)",
          });
      }
      if (error.code === "23503") {
        return res.status(409).json({
          success: false,
          message:
            "This item is referenced elsewhere (e.g. in an order) and cannot be deleted",
        });
      }
      return res
        .status(error.statusCode || 500)
        .json({ success: false, message: error.message });
    }
  };

module.exports = {
  getStats: respond(() => adminService.getStats()),
  listUsers: respond(() => adminService.listUsers()),
  listProducts: respond((req) => adminService.listProducts(req.query.q)),
  getProduct: respond((req) => adminService.getProduct(req.params.id)),
  setFeatured: respond((req) =>
    adminService.setFeatured(req.params.id, req.body.featured),
  ),
  createInventory: respond(
    (req) => adminService.createInventory(req.body),
    201,
  ),
  updateInventory: respond((req) =>
    adminService.updateInventory(req.params.id, req.body),
  ),
  deleteInventory: respond((req) =>
    adminService.deleteInventory(req.params.id),
  ),
};
