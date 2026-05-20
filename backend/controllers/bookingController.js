const crypto = require("crypto");
const Booking = require("../models/Booking");
const ParkingSlot = require("../models/ParkingSlot");
const razorpay = require("../config/razorpay");

const getBookingHours = (startTime, endTime) => {
  const start = new Date(startTime);
  const end = new Date(endTime);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return null;
  }

  const hours = Math.ceil((end - start) / (1000 * 60 * 60));
  return hours;
};

const reserveSlotSpace = async (slotId, count) => {
  const slot = await ParkingSlot.findById(slotId);

  if (!slot) {
    throw new Error("Slot not found");
  }

  if (slot.status !== "Available" || slot.availableSpaces < count) {
    throw new Error("Not enough available spaces");
  }

  slot.availableSpaces -= count;

  if (slot.availableSpaces <= 0) {
    slot.status = "Reserved";
  }

  await slot.save();
  return slot;
};

const releaseSlotSpace = async (slotId, count) => {
  const slot = await ParkingSlot.findById(slotId);

  if (!slot) return;

  slot.availableSpaces += count;

  if (slot.availableSpaces > slot.totalSpaces) {
    slot.availableSpaces = slot.totalSpaces;
  }

  if (slot.availableSpaces > 0 && slot.status === "Reserved") {
    slot.status = "Available";
  }

  await slot.save();
};

const isActiveBooking = (booking) => {
  return (
    booking.bookingStatus === "Pending" ||
    booking.bookingStatus === "Confirmed"
  );
};

exports.createBooking = async (req, res) => {
  try {
    const { slotId, vehicleNumber, startTime, endTime, slotsBooked } = req.body;

    if (!slotId || !vehicleNumber || !startTime || !endTime) {
      return res.status(400).json({
        message: "Slot, vehicle number, start time and end time are required",
      });
    }

    const requestedSlots = Number(slotsBooked) || 1;

    if (requestedSlots <= 0) {
      return res.status(400).json({
        message: "Number of slots must be at least 1",
      });
    }

    const slot = await ParkingSlot.findById(slotId);

    if (!slot) {
      return res.status(404).json({ message: "Slot not found" });
    }

    if (slot.status !== "Available" || slot.availableSpaces < requestedSlots) {
      return res.status(400).json({
        message: `Only ${slot.availableSpaces} spaces available`,
      });
    }

    const hours = getBookingHours(startTime, endTime);

    if (hours === null) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    if (hours <= 0) {
      return res.status(400).json({ message: "Invalid time selected" });
    }

    const totalAmount = hours * slot.pricePerHour * requestedSlots;

    const booking = await Booking.create({
      user: req.user._id,
      slot: slot._id,
      vehicleNumber,
      slotsBooked: requestedSlots,
      startTime,
      endTime,
      totalAmount,
      bookingStatus: "Pending",
      paymentStatus: "Pending",
      paymentMethod: "Razorpay",
    });

    await reserveSlotSpace(slot._id, requestedSlots);

    res.status(201).json({
      message: "Booking created. Please complete payment.",
      booking,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createRazorpayOrder = async (req, res) => {
  try {
    const { bookingId } = req.body;

    if (!bookingId) {
      return res.status(400).json({ message: "Booking ID is required" });
    }

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    if (booking.paymentStatus === "Paid") {
      return res.status(400).json({ message: "Payment already completed" });
    }

    const options = {
      amount: booking.totalAmount * 100,
      currency: "INR",
      receipt: `receipt_${booking._id}`,
    };

    const order = await razorpay.orders.create(options);

    booking.razorpayOrderId = order.id;
    await booking.save();

    res.json({
      message: "Razorpay order created",
      order,
      booking,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.verifyRazorpayPayment = async (req, res) => {
  try {
    const {
      bookingId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    if (
      !bookingId ||
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        message: "All payment verification fields are required",
      });
    }

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    if (booking.razorpayOrderId !== razorpay_order_id) {
      return res.status(400).json({
        message: "Razorpay order ID does not match",
      });
    }

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      booking.paymentStatus = "Failed";
      booking.bookingStatus = "Cancelled";
      await booking.save();

      await releaseSlotSpace(booking.slot, booking.slotsBooked);

      return res.status(400).json({
        message: "Payment verification failed",
      });
    }

    booking.paymentStatus = "Paid";
    booking.bookingStatus = "Confirmed";
    booking.razorpayPaymentId = razorpay_payment_id;
    booking.razorpaySignature = razorpay_signature;
    booking.paymentMethod = "Razorpay";

    await booking.save();

    res.json({
      message: "Payment verified and booking confirmed",
      booking,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("slot")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email role")
      .populate("slot")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateBookingByAdmin = async (req, res) => {
  try {
    const {
      vehicleNumber,
      startTime,
      endTime,
      slotsBooked,
      bookingStatus,
      paymentStatus,
    } = req.body;

    const booking = await Booking.findById(req.params.id).populate("slot");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const oldActive = isActiveBooking(booking);
    const oldSlotsBooked = booking.slotsBooked;

    const newSlotsBooked = Number(slotsBooked) || booking.slotsBooked;
    const newBookingStatus = bookingStatus || booking.bookingStatus;

    if (newSlotsBooked <= 0) {
      return res.status(400).json({
        message: "Number of slots must be at least 1",
      });
    }

    if (vehicleNumber) booking.vehicleNumber = vehicleNumber;
    if (startTime) booking.startTime = startTime;
    if (endTime) booking.endTime = endTime;
    if (paymentStatus) booking.paymentStatus = paymentStatus;

    booking.slotsBooked = newSlotsBooked;
    booking.bookingStatus = newBookingStatus;

    const hours = getBookingHours(booking.startTime, booking.endTime);

    if (hours === null || hours <= 0) {
      return res.status(400).json({ message: "Invalid booking time" });
    }

    const slot = await ParkingSlot.findById(booking.slot._id);

    if (!slot) {
      return res.status(404).json({ message: "Parking slot not found" });
    }

    const newActive =
      newBookingStatus === "Pending" || newBookingStatus === "Confirmed";

    if (oldActive && newActive) {
      const difference = newSlotsBooked - oldSlotsBooked;

      if (difference > 0) {
        if (slot.availableSpaces < difference) {
          return res.status(400).json({
            message: `Only ${slot.availableSpaces} extra spaces available`,
          });
        }

        await reserveSlotSpace(slot._id, difference);
      }

      if (difference < 0) {
        await releaseSlotSpace(slot._id, Math.abs(difference));
      }
    }

    if (oldActive && !newActive) {
      await releaseSlotSpace(slot._id, oldSlotsBooked);
    }

    if (!oldActive && newActive) {
      if (slot.availableSpaces < newSlotsBooked) {
        return res.status(400).json({
          message: `Only ${slot.availableSpaces} spaces available`,
        });
      }

      await reserveSlotSpace(slot._id, newSlotsBooked);
    }

    booking.totalAmount = hours * slot.pricePerHour * newSlotsBooked;

    await booking.save();

    res.json({
      message: "Booking updated successfully",
      booking,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteBookingByAdmin = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (isActiveBooking(booking)) {
      await releaseSlotSpace(booking.slot, booking.slotsBooked);
    }

    await Booking.findByIdAndDelete(req.params.id);

    res.json({
      message: "Booking deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (
      req.user.role !== "admin" &&
      booking.user.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not allowed" });
    }

    if (booking.bookingStatus === "Cancelled") {
      return res.status(400).json({
        message: "Booking is already cancelled",
      });
    }

    const wasActive = isActiveBooking(booking);

    booking.bookingStatus = "Cancelled";

    if (booking.paymentStatus === "Paid") {
      booking.paymentStatus = "Refunded";
    } else {
      booking.paymentStatus = "Failed";
    }

    await booking.save();

    if (wasActive) {
      await releaseSlotSpace(booking.slot, booking.slotsBooked);
    }

    res.json({
      message: "Booking cancelled successfully",
      booking,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.completeBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.bookingStatus !== "Confirmed") {
      return res.status(400).json({
        message: "Only confirmed bookings can be completed",
      });
    }

    booking.bookingStatus = "Completed";
    await booking.save();

    await releaseSlotSpace(booking.slot, booking.slotsBooked);

    res.json({
      message: "Booking completed successfully",
      booking,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};