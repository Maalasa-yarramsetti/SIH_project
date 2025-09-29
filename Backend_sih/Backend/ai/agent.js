import { GoogleGenerativeAI } from "@google/generative-ai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { initializeAgentExecutor } from "langchain/agents";
import axios from "axios";

// Lazy init to ensure env is available
let model;
function getChatModel() {
  if (!process.env.GOOGLE_API_KEY) {
    throw new Error("GOOGLE_API_KEY is missing");
  }
  if (!model) {
    model = new ChatGoogleGenerativeAI({
      apiKey: process.env.GOOGLE_API_KEY,
      model: "gemini-2.0-flash",
      temperature: 0.7,
    });
  }
  return model;
}

// ----------------------
// Define tools
// ----------------------

// 1. Fetch monastery history
const fetchMonasteryHistory = {
  name: "fetch_monastery_history",
  description: "Get historical details about monasteries in Sikkim",
  func: async () => {
    // Here we could fetch from DB, but for demo:
    return "Sikkim is home to ancient monasteries like Rumtek, Pemayangtse, and Tashiding. They hold centuries of Buddhist heritage, art, and festivals.";
  },
};

// 2. Book tickets
const bookTickets = {
  name: "book_tickets",
  description: "Book tickets for users by calling backend booking API",
  func: async (input) => {
    try {
      const res = await axios.post("http://localhost:5000/api/bookings", {
        user: "demoUser",
        tickets: input || 1,
      });
      return `✅ Tickets booked: ${JSON.stringify(res.data)}`;
    } catch (err) {
      return `❌ Error booking tickets: ${err.message}`;
    }
  },
};

// 3. Redirect to payment
const redirectToPayment = {
  name: "redirect_to_payment",
  description: "Redirect user to payment gateway",
  func: async () => {
    return "🔗 Redirecting to payment page... (frontend will handle navigation)";
  },
};

// 4. Navigate anywhere in site
const navigatePage = {
  name: "navigate_to_page",
  description: "Navigate user to a page in the website (like /about, /contact, /booking)",
  func: async (page) => {
    return `🔗 Navigate user to ${page}`;
  },
};

// ----------------------
// Agent Executor
// ----------------------
export async function runAgent(userMessage) {
  const tools = [fetchMonasteryHistory, bookTickets, redirectToPayment, navigatePage];

  const executor = await initializeAgentExecutor(tools, getChatModel(), {
    agentType: "chat-conversational-react-description",
    verbose: true,
  });

  const result = await executor.run(userMessage);
  return result;
}
