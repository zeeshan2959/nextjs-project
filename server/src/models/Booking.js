const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    eventSlug: {
      type: String,
      required: [true, "Event slug is required"],
      trim: true,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
    },
    tickets: {
      type: Number,
      required: [true, "Number of tickets is required"],
      min: [1, "At least 1 ticket required"],
      max: [10, "Maximum 10 tickets per booking"],
      default: 1,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
