import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenerativeAI } from "@google/generative-ai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class Monastery360MCPClient {
  constructor() {
    this.client = null;
    this.serverProcess = null;
    this.isConnected = false;
    this.retryCount = 0;
    this.maxRetries = 3;
    this.retryDelay = 1000; // 1 second
    this.model = null;
    this.tools = [];
  }

  async initialize() {
    try {
      // Initialize Gemini model
      if (!process.env.GOOGLE_API_KEY) {
        throw new Error("GOOGLE_API_KEY is missing");
      }

      this.model = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

      // Start MCP server process
      await this.startMCPServer();
      
      // Connect to MCP server
      await this.connectToServer();
      
      // Load available tools
      await this.loadTools();

      console.log("✅ Monastery360 MCP Client initialized successfully");
      return true;
    } catch (error) {
      console.error("❌ Failed to initialize MCP Client:", error);
      return false;
    }
  }

  async startMCPServer() {
    return new Promise((resolve, reject) => {
      const serverPath = path.join(__dirname, "monastery360-server.js");
      
      console.log("🚀 Starting MCP Server...");
      
      this.serverProcess = spawn("node", [serverPath], {
        stdio: ["pipe", "pipe", "pipe"],
        detached: false,
      });

      this.serverProcess.stdout.on("data", (data) => {
        const message = data.toString();
        console.log(`MCP Server: ${message}`);
        if (message.includes("started successfully")) {
          resolve();
        }
      });

      this.serverProcess.stderr.on("data", (data) => {
        console.error(`MCP Server Error: ${data}`);
      });

      this.serverProcess.on("close", (code) => {
        console.log(`MCP Server process exited with code ${code}`);
        this.isConnected = false;
      });

      this.serverProcess.on("error", (err) => {
        console.error("Failed to start MCP Server:", err);
        reject(err);
      });

      // Timeout after 10 seconds
      setTimeout(() => {
        if (!this.isConnected) {
          reject(new Error("MCP Server startup timeout"));
        }
      }, 10000);
    });
  }

  async connectToServer() {
    try {
      // Create MCP client
      this.client = new Client(
        {
          name: "monastery360-frontend",
          version: "2.0.0",
        },
        {
          capabilities: {
            tools: {},
          },
        }
      );

      // Connect to MCP server
      const transport = new StdioClientTransport({
        reader: this.serverProcess.stdout,
        writer: this.serverProcess.stdin,
      });

      await this.client.connect(transport);
      this.isConnected = true;
      this.retryCount = 0;
      
      console.log("✅ Connected to MCP Server");
    } catch (error) {
      console.error("❌ Failed to connect to MCP Server:", error);
      throw error;
    }
  }

  async loadTools() {
    try {
      const toolsResponse = await this.client.request(
        { method: "tools/list" },
        { method: "tools/list" }
      );
      this.tools = toolsResponse.tools || [];
      console.log(`✅ Loaded ${this.tools.length} MCP tools`);
    } catch (error) {
      console.error("❌ Failed to load tools:", error);
      this.tools = [];
    }
  }

  async processMessage(userMessage) {
    if (!this.isConnected || !this.client) {
      console.log("⚠️ MCP Client not connected, using fallback mode");
      return await this.fallbackResponse(userMessage);
    }

    try {
      // Use Gemini to determine which tools to call
      const toolSelection = await this.selectTools(userMessage);
      
      if (toolSelection.tools.length === 0) {
        // No tools needed, use general conversation
        return await this.handleGeneralConversation(userMessage);
      }

      // Execute the selected tool
      const toolResult = await this.executeTool(toolSelection.tools[0], toolSelection.args);
      
      return toolResult;
    } catch (error) {
      console.error("Error processing message with MCP:", error);
      
      // Retry connection if needed
      if (this.retryCount < this.maxRetries) {
        this.retryCount++;
        console.log(`🔄 Retrying MCP connection (attempt ${this.retryCount})...`);
        
        try {
          await this.connectToServer();
          return await this.processMessage(userMessage);
        } catch (retryError) {
          console.error("Retry failed:", retryError);
        }
      }
      
      // Fallback to general conversation
      return await this.fallbackResponse(userMessage);
    }
  }

  async selectTools(userMessage) {
    const prompt = `You are Monastery360 Assistant. Analyze the user message and determine which tool to use.

Available tools:
${this.tools.map(tool => `- ${tool.name}: ${tool.description}`).join('\n')}

User message: "${userMessage}"

Respond with JSON only:
{
  "tools": ["tool_name"],
  "args": {"arg1": "value1", "arg2": "value2"}
}

If no tool is needed, return: {"tools": [], "args": {}}`;

    try {
      const model = this.model.getGenerativeModel({ model: "gemini-2.0-flash" });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      return { tools: [], args: {} };
    } catch (error) {
      console.error("Error selecting tools:", error);
      return { tools: [], args: {} };
    }
  }

  async executeTool(toolName, args) {
    try {
      const result = await this.client.request(
        { method: "tools/call", params: { name: toolName, arguments: args } },
        { method: "tools/call", params: { name: toolName, arguments: args } }
      );

      if (result.content && result.content[0] && result.content[0].text) {
        return JSON.parse(result.content[0].text);
      }
      
      throw new Error("Invalid tool response format");
    } catch (error) {
      console.error(`Error executing tool ${toolName}:`, error);
      throw error;
    }
  }

  async handleGeneralConversation(userMessage) {
    const prompt = `You are Monastery360 Assistant, a helpful AI for a monastery tourism website in Sikkim, India.

You can help users with:
- Information about monasteries in Sikkim
- Travel planning and recommendations
- Buddhist culture and traditions
- Local attractions and events
- Booking assistance
- General questions about the website

User message: ${userMessage}

Respond naturally and helpfully. If the user seems to want to do something specific (like book tickets, navigate somewhere, etc.), mention that you can help with that.`;

    try {
      const model = this.model.getGenerativeModel({ model: "gemini-2.0-flash" });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      
      return {
        message: response.text(),
        action: null,
        target: null,
        data: null,
      };
    } catch (error) {
      return {
        message: "I'm here to help you explore the beautiful monasteries of Sikkim! How can I assist you today?",
        action: null,
        target: null,
        data: null,
      };
    }
  }

  async fallbackResponse(userMessage) {
    // Simple intent detection for fallback
    const lowerMessage = userMessage.toLowerCase();
    
    if (this.containsAny(lowerMessage, ["navigate", "go to", "show me", "take me to"])) {
      const pageMatch = userMessage.match(/(?:go to|navigate to|show me|take me to)\s+(\/[\w-]+|\w+)/i);
      const page = pageMatch ? (pageMatch[1].startsWith('/') ? pageMatch[1] : `/${pageMatch[1]}`) : '/';
      
      return {
        action: "navigate",
        target: page,
        message: `Navigating to ${page}...`,
        data: { page, fallback: true },
      };
    } else if (this.containsAny(lowerMessage, ["book", "ticket", "reserve"])) {
      return {
        action: "book",
        target: "/bookings",
        message: "I'll help you book tickets. Please visit the bookings page.",
        data: { fallback: true },
      };
    } else if (this.containsAny(lowerMessage, ["pay", "payment", "donate"])) {
      return {
        action: "payment",
        target: "/payment",
        message: "I'll help you with payment. Please visit the payment page.",
        data: { fallback: true },
      };
    } else {
      return await this.handleGeneralConversation(userMessage);
    }
  }

  containsAny(text, keywords) {
    return keywords.some(keyword => text.includes(keyword));
  }

  async disconnect() {
    try {
      if (this.client) {
        await this.client.close();
        this.client = null;
      }
      
      if (this.serverProcess) {
        this.serverProcess.kill();
        this.serverProcess = null;
      }
      
      this.isConnected = false;
      console.log("✅ MCP Client disconnected");
    } catch (error) {
      console.error("❌ Error disconnecting MCP Client:", error);
    }
  }

  getStatus() {
    return {
      isConnected: this.isConnected,
      toolsCount: this.tools.length,
      retryCount: this.retryCount,
    };
  }
}

// Singleton instance
let mcpClientInstance = null;

export async function getMCPClient() {
  if (!mcpClientInstance) {
    mcpClientInstance = new Monastery360MCPClient();
    const success = await mcpClientInstance.initialize();
    if (!success) {
      mcpClientInstance = null;
      throw new Error("Failed to initialize MCP Client");
    }
  }
  return mcpClientInstance;
}

export async function processWithMCPClient(userMessage) {
  try {
    const client = await getMCPClient();
    return await client.processMessage(userMessage);
  } catch (error) {
    console.error("MCP Client error:", error);
    // Return fallback response
    return {
      message: "I'm here to help you explore the beautiful monasteries of Sikkim! How can I assist you today?",
      action: null,
      target: null,
      data: null,
    };
  }
}

export async function disconnectMCPClient() {
  if (mcpClientInstance) {
    await mcpClientInstance.disconnect();
    mcpClientInstance = null;
  }
}
