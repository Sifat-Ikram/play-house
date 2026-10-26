const model = require("../models/address.model");

const wrap =
  (fn, status = 200) =>
  async (req, res) => {
    try {
      const data = await fn(req);
      return res.status(status).json({ success: true, data });
    } catch (error) {
      return res
        .status(error.statusCode || 500)
        .json({ success: false, message: error.message });
    }
  };

module.exports = {
  list: wrap((req) => model.list(req.user.id)),
  create: wrap((req) => model.create(req.user.id, req.body), 201),
  update: wrap((req) => model.update(req.user.id, req.params.id, req.body)),
  setDefault: wrap((req) => model.setDefault(req.user.id, req.params.id)),
  remove: wrap((req) => model.remove(req.user.id, req.params.id)),
};
