// Trivia routes
import express from "express";
import Trivia from "../models/Trivia.js";
import User from "../models/User.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// Get 5 random trivia questions
router.get("/", async (req, res) => {
  const questions = await Trivia.aggregate([{ $sample: { size: 5 } }]);
  res.json(questions);
});

// Submit answers
router.post("/submit", verifyToken, async (req, res) => {
  const { answers } = req.body; // [{questionId, selected}]
  let score = 0;

  for (const ans of answers) {
    const q = await Trivia.findById(ans.questionId);
    if (q && q.answer === ans.selected) score += 10;
  }

  await User.findByIdAndUpdate(req.user.id, { $inc: { coins: score } });

  res.json({ score, message: `You earned ${score} coins` });
});

export default router;