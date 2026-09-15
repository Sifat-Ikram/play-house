const express = require("express");
const router = express.Router();
const comboController = require("../controllers/combo.controller");

router.post("/", comboController.createCombo);
router.get("/", comboController.getAllCombos);
router.get("/:id", comboController.getComboById);
router.put("/:id", comboController.updateCombo);
router.delete("/:id", comboController.deleteCombo);

module.exports = router;