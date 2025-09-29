// Event routes
import express from "express";
import Event from "../models/Event.js";
import { verifyToken, requireAdmin, requireNGO } from "../middleware/auth.js";

const router = express.Router();

// Get events by status
router.get("/:status", async (req, res) => {
  const events = await Event.find({ status: req.params.status });
  res.json(events);
});

// Create event (Admin only)
router.post("/", verifyToken, requireAdmin, async (req, res) => {
  const event = new Event(req.body);
  await event.save();
  res.status(201).json(event);
});

// NGO uploads past event media
router.put("/:id/media", verifyToken, requireNGO, async (req, res) => {
  const event = await Event.findByIdAndUpdate(req.params.id, { status: "past" }, { new: true });
  res.json(event);
});

export default router;
