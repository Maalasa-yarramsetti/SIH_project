// Monastery routes
import express from "express";
import Monastery from "../models/Monastery.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// Get all monasteries
router.get("/", async (req, res) => {
  const monasteries = await Monastery.find();
  res.json(monasteries);
});

// Get single monastery
router.get("/:id", async (req, res) => {
  const monastery = await Monastery.findById(req.params.id);
  res.json(monastery);
});

// Add review
router.post("/:id/review", verifyToken, async (req, res) => {
  const { review, rating } = req.body;
  const monastery = await Monastery.findById(req.params.id);
  monastery.reviews.push({ userId: req.user.userId, review, rating });
  await monastery.save();
  res.json(monastery);
});

export default router;
