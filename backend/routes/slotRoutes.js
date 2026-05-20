const express = require("express");

const {
  createSlot,
  getSlots,
  getAvailableSlots,
  updateSlot,
  deleteSlot,
} = require("../controllers/slotController");

const { protect, adminOnly } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.get("/", protect, getSlots);
router.get("/available", protect, getAvailableSlots);

router.post("/", protect, adminOnly, upload.single("image"), createSlot);
router.put("/:id", protect, adminOnly, upload.single("image"), updateSlot);
router.delete("/:id", protect, adminOnly, deleteSlot);

module.exports = router;