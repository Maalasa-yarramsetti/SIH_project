#!/usr/bin/env node

// Test script for MCP Agent
import { processWithMCPAgent } from "./mcp/agent.js";
import dotenv from "dotenv";

dotenv.config();

async function testMCPAgent() {
  console.log("🧪 Testing MCP Agent...\n");

  const testMessages = [
    "Navigate to bookings page",
    "Book tickets for Rumtek monastery",
    "I want to pay ₹500 for a donation",
    "Search for monasteries with AR features",
    "Show me upcoming events",
    "What's my profile information?",
    "I want to submit feedback about my visit",
    "Hello, how are you?",
  ];

  for (const message of testMessages) {
    console.log(`\n📝 User: ${message}`);
    try {
      const result = await processWithMCPAgent(message);
      console.log(`🤖 Bot: ${result.message}`);
      if (result.action) {
        console.log(`   Action: ${result.action}`);
        console.log(`   Target: ${result.target}`);
        if (result.data) {
          console.log(`   Data: ${JSON.stringify(result.data)}`);
        }
      }
    } catch (error) {
      console.error(`❌ Error: ${error.message}`);
    }
  }

  console.log("\n✅ MCP Agent test completed!");
}

// Run test if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testMCPAgent().catch(console.error);
}

export default testMCPAgent;

