const express = require("express");
const router = express.Router();
const model = require("../models/stockAlert.model");
const { requireAuth } = require("../middleware/auth.middleware");

router.use(requireAuth);

router.get("/mine", async (req, res) => {
  try {
    res
      .status(200)
      .json({ success: true, data: await model.mine(req.user.id) });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const id = Number(req.body.inventory_id);
    if (!Number.isInteger(id))
      return res
        .status(400)
        .json({ success: false, message: "inventory_id is required" });
    await model.subscribe(req.user.id, id);
    res.status(201).json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

router.delete("/:inventoryId", async (req, res) => {
  try {
    await model.unsubscribe(req.user.id, Number(req.params.inventoryId));
    res.status(200).json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

module.exports = router;
