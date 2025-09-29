import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { initializeAgentExecutor } from "langchain/agents";

// Example website task tools
const tools = [
  {
    name: "navigate",
    description: "Navigate user to a section of the website. Return an action object.",
    func: async (section) => ({
      action: "navigate",
      target: typeof section === "string" ? section : "/",
      message: `Navigating to ${section}...`,
    }),
  },
  {
    name: "book_tickets",
    description: "Book tickets for user. Return an action object.",
    func: async () => ({
      action: "book",
      target: "/bookings",
      message: "✅ Tickets booked successfully.",
    }),
  },
  {
    name: "payment_gateway",
    description: "Redirect to payment gateway. Return an action object.",
    func: async () => ({
      action: "payment",
      target: "/payment",
      message: "💳 Redirecting to payment gateway.",
    }),
  },
];

// Gemini model with environment API key
const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash",
  apiKey: process.env.GOOGLE_API_KEY || "",
});

export async function langchainAgent(task) {
  const executor = await initializeAgentExecutor(tools, model, {
    agentType: "zero-shot-react-description",
    verbose: true,
  });

  const formatInstructions = `
You are an action-generating assistant for a website. Always respond with a single JSON object only, with these fields:
{
  "message": string,               // A brief natural language response for the user
  "action": string | null,         // One of: "navigate", "book", "payment", or null
  "target": string | null          // Route or URL like "/bookings"; null if not applicable
}
If the user asks to go somewhere, set action="navigate" and target to the route.
If the user wants to book tickets, set action="book" and target to "/bookings".
If the user wants to pay, set action="payment" and target to "/payment".
If it is informational only, use action=null and target=null.
Return ONLY the JSON. No extra text.`;

  const input = `${formatInstructions}\nUser request: ${task}`;

  const result = await executor.call({ input });
  const output = result?.output ?? "";

  // Try to parse JSON from the output. If not valid JSON, wrap as message.
  try {
    // Extract the first JSON object if the model added extra text
    const jsonMatch = output.match(/\{[\s\S]*\}/);
    const candidate = jsonMatch ? jsonMatch[0] : output;
    const parsed = JSON.parse(candidate);
    const message = typeof parsed.message === "string" ? parsed.message : String(output);
    const action = typeof parsed.action === "string" ? parsed.action : null;
    const target = typeof parsed.target === "string" ? parsed.target : null;
    return { message, action, target };
  } catch {
    return { message: String(output || ""), action: null, target: null };
  }
}
