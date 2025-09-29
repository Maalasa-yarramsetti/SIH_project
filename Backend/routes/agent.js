import express from "express";
import dotenv from "dotenv";
import { langchainAgent } from "../agents/websiteAgent.js";

dotenv.config();
const router = express.Router();

// POST /api/agent - simple agent task runner (websiteAgent)
router.post("/", async (req, res) => {
  try {
    const { task } = req.body;
    if (!task) {
      return res.status(400).json({ error: "task is required" });
    }
    const result = await langchainAgent(task);
    return res.json({ result });
  } catch (err) {
    console.error("❌ Agent error:", err);
    return res.status(500).json({ error: "Agent failed, see server logs" });
  }
});

export default router;


