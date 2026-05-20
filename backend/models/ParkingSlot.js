const mongoose = require("mongoose");

const parkingSlotSchema = new mongoose.Schema(
  {
    location: {
      type: String,
      required: true,
    },

    slotNumber: {
      type: String,
      required: true,
      unique: true,
    },

    floor: {
      type: String,
      required: true,
    },

    vehicleType: {
      type: String,
      enum: ["Two Wheeler", "Four Wheeler"],
      required: true,
    },

    status: {
      type: String,
      enum: ["Available", "Occupied", "Reserved", "Maintenance"],
      default: "Available",
    },

    pricePerHour: {
      type: Number,
      required: true,
    },

    totalSpaces: {
      type: Number,
      required: true,
      default: 1,
    },

    availableSpaces: {
      type: Number,
      required: true,
      default: 1,
    },

    image: {
      type: String,
      default:
        "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg",
    },

    imagePublicId: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ParkingSlot", parkingSlotSchema);