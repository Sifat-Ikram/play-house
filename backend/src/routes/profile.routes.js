const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profile.controller");
const { requireAuth } = require("../middleware/auth.middleware");

router.get("/", requireAuth, profileController.getProfile);
router.put("/", requireAuth, profileController.updateProfile);
router.delete("/", requireAuth, profileController.deleteProfile);

module.exports = router;
