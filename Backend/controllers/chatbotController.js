import { GoogleGenerativeAI } from "@google/generative-ai";
import { langchainAgent } from "../agents/websiteAgent.js";

const apiKey = process.env.GOOGLE_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

// Gemini Chatbot (multilingual + monasteries in Sikkim)
export const chatWithGemini = async (req, res) => {
  try {
    const { message, language } = req.body;

    const prompt = `
You are a multilingual assistant. If asked about monasteries in Sikkim, 
give detailed historical and cultural information in the requested language (${language || "English"}).
User query: ${message}
    `;

    if (!genAI) {
      return res.status(500).json({ error: "Server is missing GOOGLE_API_KEY" });
    }
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);

    res.json({ reply: result.response.text() });
  } catch (err) {
    console.error("Chatbot error:", err);
    res.status(500).json({ error: "Chatbot error" });
  }
};

// Agentic AI
export const runAgent = async (req, res) => {
  try {
    const { task } = req.body;
    const result = await langchainAgent(task);
    res.json({ result });
  } catch (err) {
    console.error("Agent error:", err);
    res.status(500).json({ error: "Agent error" });
  }
};
