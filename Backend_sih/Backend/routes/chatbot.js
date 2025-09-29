// Backend/routes/chatbot.js
import { Router } from "express";
import dotenv from "dotenv";
dotenv.config();
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

// ✅ Load .env before anything else


const router = Router();

// ✅ Safety: don't crash the server if key missing; return 500 during request

// ✅ Create Gemini chat model with explicit key
const chatApiKey = process.env.GOOGLE_API_KEY;
const chatModel = chatApiKey
  ? new ChatGoogleGenerativeAI({
      apiKey: chatApiKey,
      model: "gemini-2.0-flash", // or gemini-1.5-pro if you want higher quality
    })
  : null;

// ✅ Chat endpoint
router.post("/", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    if (!chatModel) {
      return res.status(500).json({ error: "Server missing GOOGLE_API_KEY" });
    }

    // Call Gemini API via LangChain wrapper
    const response = await chatModel.invoke(message);

    res.json({
      reply: response.content,
    });
  } catch (err) {
    console.error("❌ Chatbot error:", err);
    res.status(500).json({ error: "Chatbot failed, see server logs" });
  }
});

export default router;
