// Proposal routes
import express from "express";
import Proposal from "../models/Proposal.js";
import { verifyToken, requireNGO, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// NGO submits proposal
router.post("/", verifyToken, requireNGO, async (req, res) => {
  const proposal = new Proposal({ ...req.body, ngoId: req.user.userId });
  await proposal.save();
  res.status(201).json(proposal);
});

// Admin views proposals
router.get("/", verifyToken, requireAdmin, async (req, res) => {
  const proposals = await Proposal.find().populate("ngoId monasteryId");
  res.json(proposals);
});

// Admin updates proposal status
router.put("/:id/status", verifyToken, requireAdmin, async (req, res) => {
  const { status } = req.body;
  const proposal = await Proposal.findByIdAndUpdate(req.params.id, { status }, { new: true });
  res.json(proposal);
});

export default router;
