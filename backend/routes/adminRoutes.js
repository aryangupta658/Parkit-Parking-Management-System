const express = require("express");

const {
  getUsers,
  updateUser,
  deleteUser,
  getReports,
} = require("../controllers/adminController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/users", protect, adminOnly, getUsers);
router.put("/users/:id", protect, adminOnly, updateUser);
router.delete("/users/:id", protect, adminOnly, deleteUser);

router.get("/reports", protect, adminOnly, getReports);

module.exports = router;