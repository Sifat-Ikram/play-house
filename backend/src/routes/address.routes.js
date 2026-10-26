const express = require("express");
const router = express.Router();
const controller = require("../controllers/address.controller");
const { requireAuth } = require("../middleware/auth.middleware");
const { validate } = require("../middleware/validate.middleware");
const { addressSchema } = require("../utils/validators");

router.use(requireAuth);

router.get("/", controller.list);
router.post("/", validate(addressSchema), controller.create);
router.put("/:id", validate(addressSchema), controller.update);
router.patch("/:id/default", controller.setDefault);
router.delete("/:id", controller.remove);

module.exports = router;
