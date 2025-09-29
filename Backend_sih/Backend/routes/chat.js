import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { processWithUltimateAgent } from "../ai/ultimateAgent.js";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

// Create Gemini model directly
const chatApiKey = process.env.GOOGLE_API_KEY;
const genAI = chatApiKey ? new GoogleGenerativeAI(chatApiKey) : null;

// Helper to call a specific Gemini model
async function askGemini(genAI, prompt, modelName) {
  const model = genAI.getGenerativeModel({ model: modelName });
  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}

// Heuristic: decide if message should be handled by agent tools
function shouldUseAgent(message) {
  const m = (message || "").toLowerCase();
  return m.includes("navigate") || m.includes("go to ") || m.includes("book") || m.includes("ticket") || m.includes("payment") || m.includes("pay");
}

// POST /api/chat - Simple chatbot endpoint for frontend
router.post("/", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    if (!genAI) {
      return res.status(500).json({ error: "Server missing GOOGLE_API_KEY" });
    }

    // Create a context-aware prompt for monastery-related queries
    const prompt = `You are a helpful assistant for Monastery360, a platform about monasteries in Sikkim, India. 
    You can help users with information about:
    - Monastery history and culture
    - Travel planning to Sikkim
    - Buddhist traditions and practices
    - Local attractions and events
    - Booking and payment assistance
    
    User message: ${message}`;

    // Use Ultimate Agent for all messages (it handles both actionable and informational)
    try {
      const agentResult = await processWithUltimateAgent(message);
      return res.json({ 
        reply: agentResult.message || "I'm here to help!", 
        action: agentResult.action || null, 
        target: agentResult.target || null,
        data: agentResult.data || null
      });
    } catch (e) {
      // If Ultimate agent fails, continue to LLM fallback below
      console.error("Ultimate Agent fallback to LLM due to error:", e?.message || e);
    }

    // Try primary model with retries (handles 503 overloads), then fallback
    const primaryModel = "gemini-2.0-flash";
    const fallbackModel = "gemini-1.5-flash";

    let attempt = 0;
    const maxAttempts = 3;
    while (attempt < maxAttempts) {
      try {
        const text = await askGemini(genAI, prompt, primaryModel);
        return res.json({ reply: text, action: null, target: null, data: null });
      } catch (e) {
        // Retry on 503 (model overloaded). For other errors, break.
        if (e?.status === 503) {
          const backoffMs = Math.pow(2, attempt) * 500; // 500ms, 1000ms, 2000ms
          await new Promise(r => setTimeout(r, backoffMs));
          attempt++;
          continue;
        }
        break;
      }
    }

    // Fallback model once
    try {
      const text = await askGemini(genAI, prompt, fallbackModel);
      return res.json({ reply: text, action: null, target: null, data: null });
    } catch (e) {
      return res.status(503).json({ error: "Service busy. Please try again shortly." });
    }
  } catch (err) {
    console.error("❌ Chatbot error:", err);
    res.status(500).json({ error: "Chatbot failed, see server logs" });
  }
});

export default router;

