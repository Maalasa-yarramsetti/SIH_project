#!/usr/bin/env node

// Test script for Hybrid Agent
import { processWithHybridAgent } from "./ai/hybridAgent.js";
import dotenv from "dotenv";

dotenv.config();

async function testHybridAgent() {
  console.log("🧪 Testing Hybrid Agent...\n");

  const testMessages = [
    "Hello, how are you?",
    "Navigate to bookings page",
    "Go to events",
    "Book tickets for Rumtek monastery",
    "I want to book 3 tickets for the festival",
    "I want to pay ₹500 for a donation",
    "Process payment of ₹1000 for booking",
    "Search for monasteries with AR features",
    "Find monasteries in Gangtok",
    "Show me upcoming events",
    "What festivals are happening?",
    "What's my profile information?",
    "Show my account details",
    "I want to submit feedback about my visit",
    "I have a complaint about the service",
    "Tell me about Rumtek Monastery",
    "What can I do on this website?",
  ];

  for (const message of testMessages) {
    console.log(`\n📝 User: ${message}`);
    try {
      const result = await processWithHybridAgent(message);
      console.log(`🤖 Bot: ${result.message}`);
      if (result.action) {
        console.log(`   Action: ${result.action}`);
        console.log(`   Target: ${result.target}`);
        if (result.data) {
          console.log(`   Data: ${JSON.stringify(result.data, null, 2)}`);
        }
      } else {
        console.log(`   (General conversation - no action)`);
      }
    } catch (error) {
      console.error(`❌ Error: ${error.message}`);
    }
  }

  console.log("\n✅ Hybrid Agent test completed!");
}

// Run test if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testHybridAgent().catch(console.error);
}

export default testHybridAgent;
