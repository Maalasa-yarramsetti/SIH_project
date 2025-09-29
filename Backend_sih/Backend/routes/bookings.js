import express from "express";

const router = express.Router();

// Simple in-memory bookings for demo
const bookings = [];

router.post("/", (req, res) => {
  const { user, tickets = 1 } = req.body || {};
  const booking = { id: bookings.length + 1, user: user || "anonymous", tickets };
  bookings.push(booking);
  res.json({ success: true, booking });
});

router.get("/", (_req, res) => {
  res.json({ count: bookings.length, bookings });
});

export default router;



