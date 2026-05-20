const express = require("express");

const {
  createBooking,
  createRazorpayOrder,
  verifyRazorpayPayment,
  getMyBookings,
  getAllBookings,
  updateBookingByAdmin,
  deleteBookingByAdmin,
  cancelBooking,
  completeBooking,
} = require("../controllers/bookingController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createBooking);

router.post("/create-order", protect, createRazorpayOrder);
router.post("/verify-payment", protect, verifyRazorpayPayment);

router.get("/my-bookings", protect, getMyBookings);
router.get("/all-bookings", protect, adminOnly, getAllBookings);

router.put("/admin/:id", protect, adminOnly, updateBookingByAdmin);
router.delete("/admin/:id", protect, adminOnly, deleteBookingByAdmin);

router.put("/cancel/:id", protect, cancelBooking);
router.put("/complete/:id", protect, adminOnly, completeBooking);

module.exports = router;