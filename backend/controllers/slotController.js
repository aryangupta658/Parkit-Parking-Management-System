const ParkingSlot = require("../models/ParkingSlot");
const uploadToCloudinary = require("../utils/uploadToCloudinary");
const cloudinary = require("../config/cloudinary");

exports.createSlot = async (req, res) => {
  try {
    const {
      location,
      slotNumber,
      floor,
      vehicleType,
      status,
      pricePerHour,
      totalSpaces,
      availableSpaces,
    } = req.body;

    if (!location || !slotNumber || !floor || !vehicleType || !pricePerHour) {
      return res.status(400).json({
        message:
          "Location, slot number, floor, vehicle type and price are required",
      });
    }

    const existingSlot = await ParkingSlot.findOne({ slotNumber });

    if (existingSlot) {
      return res.status(400).json({
        message: "Slot number already exists",
      });
    }

    const total = Number(totalSpaces) || 1;
    const available =
      availableSpaces !== undefined && availableSpaces !== ""
        ? Number(availableSpaces)
        : total;

    if (total <= 0) {
      return res.status(400).json({
        message: "Total spaces must be greater than 0",
      });
    }

    if (available < 0 || available > total) {
      return res.status(400).json({
        message: "Available spaces must be between 0 and total spaces",
      });
    }

    let image = undefined;
    let imagePublicId = null;

    if (req.file) {
      const uploadResult = await uploadToCloudinary(
        req.file.buffer,
        "parking-management/slots"
      );

      image = uploadResult.secure_url;
      imagePublicId = uploadResult.public_id;
    }

    const finalStatus =
      available <= 0 ? "Reserved" : status || "Available";

    const slot = await ParkingSlot.create({
      location,
      slotNumber,
      floor,
      vehicleType,
      status: finalStatus,
      pricePerHour: Number(pricePerHour),
      totalSpaces: total,
      availableSpaces: available,
      image,
      imagePublicId,
    });

    res.status(201).json(slot);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSlots = async (req, res) => {
  try {
    const slots = await ParkingSlot.find().sort({ createdAt: -1 });
    res.json(slots);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAvailableSlots = async (req, res) => {
  try {
    const slots = await ParkingSlot.find({
      status: "Available",
      availableSpaces: { $gt: 0 },
    }).sort({
      createdAt: -1,
    });

    res.json(slots);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateSlot = async (req, res) => {
  try {
    const slot = await ParkingSlot.findById(req.params.id);

    if (!slot) {
      return res.status(404).json({ message: "Slot not found" });
    }

    const {
      location,
      slotNumber,
      floor,
      vehicleType,
      status,
      pricePerHour,
      totalSpaces,
      availableSpaces,
    } = req.body;

    if (location) slot.location = location;
    if (slotNumber) slot.slotNumber = slotNumber;
    if (floor) slot.floor = floor;
    if (vehicleType) slot.vehicleType = vehicleType;
    if (status) slot.status = status;
    if (pricePerHour) slot.pricePerHour = Number(pricePerHour);

    if (totalSpaces !== undefined && totalSpaces !== "") {
      const total = Number(totalSpaces);

      if (total <= 0) {
        return res.status(400).json({
          message: "Total spaces must be greater than 0",
        });
      }

      slot.totalSpaces = total;

      if (slot.availableSpaces > total) {
        slot.availableSpaces = total;
      }
    }

    if (availableSpaces !== undefined && availableSpaces !== "") {
      const available = Number(availableSpaces);

      if (available < 0 || available > slot.totalSpaces) {
        return res.status(400).json({
          message: "Available spaces must be between 0 and total spaces",
        });
      }

      slot.availableSpaces = available;
    }

    if (slot.availableSpaces <= 0 && slot.status === "Available") {
      slot.status = "Reserved";
    }

    if (slot.availableSpaces > 0 && slot.status === "Reserved") {
      slot.status = "Available";
    }

    if (req.file) {
      if (slot.imagePublicId) {
        await cloudinary.uploader.destroy(slot.imagePublicId);
      }

      const uploadResult = await uploadToCloudinary(
        req.file.buffer,
        "parking-management/slots"
      );

      slot.image = uploadResult.secure_url;
      slot.imagePublicId = uploadResult.public_id;
    }

    await slot.save();

    res.json(slot);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteSlot = async (req, res) => {
  try {
    const slot = await ParkingSlot.findById(req.params.id);

    if (!slot) {
      return res.status(404).json({ message: "Slot not found" });
    }

    if (slot.imagePublicId) {
      await cloudinary.uploader.destroy(slot.imagePublicId);
    }

    await ParkingSlot.findByIdAndDelete(req.params.id);

    res.json({ message: "Slot deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};