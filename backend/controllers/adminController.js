const User = require("../models/User");
const Booking = require("../models/Booking");
const ParkingSlot = require("../models/ParkingSlot");

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { name, email, role } = req.body;

    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;

    await user.save();

    res.json({
      message: "User updated successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    if (req.user._id.toString() === req.params.id) {
      return res.status(400).json({
        message: "You cannot delete your own admin account",
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await Booking.deleteMany({ user: req.params.id });
    await User.findByIdAndDelete(req.params.id);

    res.json({
      message: "User and related bookings deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getReports = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    const slots = await ParkingSlot.find();
    const bookings = await Booking.find()
      .populate("user", "name email")
      .populate("slot")
      .sort({ createdAt: -1 });

    const paidBookings = bookings.filter(
      (booking) => booking.paymentStatus === "Paid"
    );

    const pendingBookings = bookings.filter(
      (booking) => booking.bookingStatus === "Pending"
    );

    const confirmedBookings = bookings.filter(
      (booking) => booking.bookingStatus === "Confirmed"
    );

    const completedBookings = bookings.filter(
      (booking) => booking.bookingStatus === "Completed"
    );

    const cancelledBookings = bookings.filter(
      (booking) => booking.bookingStatus === "Cancelled"
    );

    const refundedPayments = bookings.filter(
      (booking) => booking.paymentStatus === "Refunded"
    );

    const failedPayments = bookings.filter(
      (booking) => booking.paymentStatus === "Failed"
    );

    const totalRevenue = paidBookings.reduce(
      (sum, booking) => sum + booking.totalAmount,
      0
    );

    const totalSpaces = slots.reduce(
      (sum, slot) => sum + (slot.totalSpaces || 0),
      0
    );

    const availableSpaces = slots.reduce(
      (sum, slot) => sum + (slot.availableSpaces || 0),
      0
    );

    const maintenanceSpaces = slots
      .filter((slot) => slot.status === "Maintenance")
      .reduce((sum, slot) => sum + (slot.totalSpaces || 0), 0);

    const bookedSpaces = Math.max(
      totalSpaces - availableSpaces - maintenanceSpaces,
      0
    );

    const bookingStatusData = [
      { name: "Pending", value: pendingBookings.length },
      { name: "Confirmed", value: confirmedBookings.length },
      { name: "Completed", value: completedBookings.length },
      { name: "Cancelled", value: cancelledBookings.length },
    ];

    const paymentStatusData = [
      { name: "Paid", value: paidBookings.length },
      { name: "Pending", value: bookings.filter((b) => b.paymentStatus === "Pending").length },
      { name: "Refunded", value: refundedPayments.length },
      { name: "Failed", value: failedPayments.length },
    ];

    const spaceStatusData = [
      { name: "Available", value: availableSpaces },
      { name: "Booked", value: bookedSpaces },
      { name: "Maintenance", value: maintenanceSpaces },
    ];

    const revenueByLocationMap = {};

    paidBookings.forEach((booking) => {
      const location = booking.slot?.location || "Unknown";

      if (!revenueByLocationMap[location]) {
        revenueByLocationMap[location] = 0;
      }

      revenueByLocationMap[location] += booking.totalAmount;
    });

    const revenueByLocation = Object.keys(revenueByLocationMap).map(
      (location) => ({
        name: location,
        revenue: revenueByLocationMap[location],
      })
    );

    res.json({
      totalUsers: users.length,
      totalCustomers: users.filter((user) => user.role === "user").length,
      totalAdmins: users.filter((user) => user.role === "admin").length,

      totalBookings: bookings.length,
      pendingBookings: pendingBookings.length,
      confirmedBookings: confirmedBookings.length,
      completedBookings: completedBookings.length,
      cancelledBookings: cancelledBookings.length,

      paidBookings: paidBookings.length,
      totalRevenue,

      totalSlots: slots.length,
      totalSpaces,
      availableSpaces,
      bookedSpaces,
      maintenanceSpaces,

      bookingStatusData,
      paymentStatusData,
      spaceStatusData,
      revenueByLocation,

      recentBookings: bookings.slice(0, 8),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};