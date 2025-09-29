// Archive routes
import express from "express";
import Archive from "../models/Archive.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// Get all archives
router.get("/", async (req, res) => {
  const archives = await Archive.find().populate("monasteryId");
  res.json(archives);
});

// Search by monastery name
router.get("/search/:name", async (req, res) => {
  const archives = await Archive.find().populate("monasteryId");
  const filtered = archives.filter(a => a.monasteryId.title.toLowerCase().includes(req.params.name.toLowerCase()));
  res.json(filtered);
});

// Add archive (Admin only)
router.post("/", verifyToken, async (req, res) => {
  const archive = new Archive(req.body);
  await archive.save();
  res.status(201).json(archive);
});

export default router;
