const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const Event = require("../models/Event");

// POST /api/bookings — create a booking
router.post("/", async (req, res) => {
  try {
    const { eventSlug, name, email, tickets } = req.body;

    const event = await Event.findOne({ slug: eventSlug });
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    const booking = await Booking.create({ eventSlug, name, email, tickets });
    res.status(201).json({ success: true, data: booking });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// GET /api/bookings/:eventSlug — list all bookings for an event
router.get("/:eventSlug", async (req, res) => {
  try {
    const bookings = await Booking.find({ eventSlug: req.params.eventSlug }).sort({
      createdAt: -1,
    });
    res.json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
