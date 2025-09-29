import { GoogleGenerativeAI } from "@google/generative-ai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class MCPAgent {
  constructor() {
    this.client = null;
    this.model = null;
    this.tools = [];
    this.isConnected = false;
  }

  async initialize() {
    try {
      // Initialize Gemini model
      if (!process.env.GOOGLE_API_KEY) {
        throw new Error("GOOGLE_API_KEY is missing");
      }

      this.model = new ChatGoogleGenerativeAI({
        apiKey: process.env.GOOGLE_API_KEY,
        model: "gemini-2.0-flash",
        temperature: 0.7,
      });

      // Start MCP server process
      const serverPath = path.join(__dirname, "server.js");
      const serverProcess = spawn("node", [serverPath], {
        stdio: ["pipe", "pipe", "pipe"],
      });

      // Create MCP client
      this.client = new Client(
        {
          name: "monastery360-frontend",
          version: "1.0.0",
        },
        {
          capabilities: {
            tools: {},
          },
        }
      );

      // Connect to MCP server
      const transport = new StdioClientTransport({
        reader: serverProcess.stdout,
        writer: serverProcess.stdin,
      });

      await this.client.connect(transport);
      this.isConnected = true;

      // Load available tools
      await this.loadTools();

      console.log("MCP Agent initialized successfully");
      return true;
    } catch (error) {
      console.error("Failed to initialize MCP Agent:", error);
      return false;
    }
  }

  async loadTools() {
    try {
      const toolsResponse = await this.client.request(
        { method: "tools/list" },
        { method: "tools/list" }
      );
      this.tools = toolsResponse.tools || [];
      console.log(`Loaded ${this.tools.length} MCP tools`);
    } catch (error) {
      console.error("Failed to load tools:", error);
      this.tools = [];
    }
  }

  async processMessage(userMessage) {
    if (!this.isConnected || !this.client) {
      throw new Error("MCP Agent not connected");
    }

    try {
      // Create a context-aware prompt
      const systemPrompt = `You are Monastery360 Assistant, an AI agent for a monastery tourism website in Sikkim, India.

Your capabilities:
- Navigate users to different pages (bookings, events, profile, etc.)
- Book tickets for monastery visits and events
- Process payments for bookings and donations
- Search monasteries by location, features, or keywords
- Get information about upcoming events and festivals
- Manage user profiles and preferences
- Handle feedback and reviews

Always respond with structured JSON in this format:
{
  "message": "Human-readable response to the user",
  "action": "action_type" | null,
  "target": "route_or_url" | null,
  "data": {} | null
}

Action types:
- "navigate": Navigate to a page
- "book": Book tickets
- "payment": Process payment
- "search_results": Show search results
- "events_list": Show events
- "profile_data": Show profile
- "profile_updated": Profile updated
- "feedback_submitted": Feedback submitted
- null: Just informational response

User message: ${userMessage}`;

      // Use Gemini to determine which tools to call
      const response = await this.model.invoke(systemPrompt);
      
      // Parse the response to determine actions
      let action = null;
      let target = null;
      let data = null;
      let message = response.content;

      // Simple intent detection for tool selection
      const lowerMessage = userMessage.toLowerCase();
      
      if (lowerMessage.includes("navigate") || lowerMessage.includes("go to") || lowerMessage.includes("show me")) {
        // Extract page from message
        const pageMatch = userMessage.match(/(?:go to|navigate to|show me)\s+(\/[\w-]+|\w+)/i);
        const page = pageMatch ? (pageMatch[1].startsWith('/') ? pageMatch[1] : `/${pageMatch[1]}`) : '/';
        
        action = "navigate";
        target = page;
        message = `Navigating to ${page}...`;
      } else if (lowerMessage.includes("book") || lowerMessage.includes("ticket")) {
        // Extract event info
        const eventMatch = userMessage.match(/book\s+(?:tickets?\s+for\s+)?(.+)/i);
        const eventId = eventMatch ? eventMatch[1].replace(/\s+/g, '_').toLowerCase() : 'general';
        
        action = "book";
        target = "/bookings";
        message = `Booking tickets for ${eventId}...`;
        data = { eventId, quantity: 1 };
      } else if (lowerMessage.includes("pay") || lowerMessage.includes("payment")) {
        // Extract payment info
        const amountMatch = userMessage.match(/₹?(\d+)/);
        const amount = amountMatch ? parseInt(amountMatch[1]) : 100;
        
        action = "payment";
        target = "/payment";
        message = `Processing payment of ₹${amount}...`;
        data = { amount, type: "booking" };
      } else if (lowerMessage.includes("search") || lowerMessage.includes("find")) {
        // Extract search query
        const queryMatch = userMessage.match(/(?:search|find)\s+(.+)/i);
        const query = queryMatch ? queryMatch[1] : "monasteries";
        
        action = "search_results";
        target = "/explore";
        message = `Searching for ${query}...`;
        data = { query };
      } else if (lowerMessage.includes("event") || lowerMessage.includes("festival")) {
        action = "events_list";
        target = "/events";
        message = "Getting upcoming events...";
      } else if (lowerMessage.includes("profile") || lowerMessage.includes("account")) {
        action = "profile_data";
        target = "/profile";
        message = "Getting your profile...";
      } else if (lowerMessage.includes("feedback") || lowerMessage.includes("review")) {
        action = "feedback_submitted";
        target = "/feedback";
        message = "Submitting your feedback...";
        data = { type: "feedback", content: userMessage };
      }

      return {
        message,
        action,
        target,
        data,
      };
    } catch (error) {
      console.error("Error processing message:", error);
      return {
        message: "I'm sorry, I encountered an error processing your request. Please try again.",
        action: null,
        target: null,
        data: null,
      };
    }
  }

  async callTool(toolName, args) {
    if (!this.client) {
      throw new Error("MCP client not connected");
    }

    try {
      const result = await this.client.request(
        { method: "tools/call", params: { name: toolName, arguments: args } },
        { method: "tools/call", params: { name: toolName, arguments: args } }
      );

      return result;
    } catch (error) {
      console.error(`Error calling tool ${toolName}:`, error);
      throw error;
    }
  }

  async disconnect() {
    if (this.client) {
      await this.client.close();
      this.client = null;
    }
    this.isConnected = false;
  }
}

// Singleton instance
let mcpAgentInstance = null;

export async function getMCPAgent() {
  if (!mcpAgentInstance) {
    mcpAgentInstance = new MCPAgent();
    await mcpAgentInstance.initialize();
  }
  return mcpAgentInstance;
}

export async function processWithMCPAgent(userMessage) {
  const agent = await getMCPAgent();
  return await agent.processMessage(userMessage);
}

