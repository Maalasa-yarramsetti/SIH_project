#!/usr/bin/env node

// Comprehensive test script for MCP Agent
import { processWithMCPClient } from "./mcp/monastery360-client.js";
import dotenv from "dotenv";

dotenv.config();

async function testMCPAgent() {
  console.log("🧪 Testing Complete MCP Agent System...\n");

  const testMessages = [
    // Navigation tests
    "Hello, how are you?",
    "Navigate to bookings page",
    "Go to events",
    "Take me to the profile page",
    "Show me the explore page",
    "I want to go to maps",
    
    // Booking tests
    "Book tickets for Rumtek monastery",
    "I want to book 3 tickets for the festival",
    "Reserve 2 tickets for Pemayangtse monastery on 2024-03-15",
    "Book a guided tour for Tashiding monastery",
    
    // Payment tests
    "I want to pay ₹500 for a donation",
    "Process payment of ₹1000 for booking",
    "Pay ₹2000 for event tickets",
    "I want to donate ₹5000 to the monastery",
    
    // Search tests
    "Search for monasteries with AR features",
    "Find monasteries in Gangtok",
    "Look for monasteries with VR tours",
    "Search for monasteries with 4+ star rating",
    "Find monasteries within 50km of Pelling",
    
    // Events tests
    "Show me upcoming events",
    "What festivals are happening?",
    "Get events for Rumtek monastery",
    "Show me workshops this month",
    "What ceremonies are scheduled?",
    
    // Profile tests
    "What's my profile information?",
    "Show my account details",
    "Update my name to John Doe",
    "Change my email to john@example.com",
    
    // Feedback tests
    "I want to submit feedback about my visit",
    "I have a complaint about the service",
    "Submit a 5-star review for Rumtek monastery",
    "I want to report a bug",
    
    // Weather tests
    "What's the weather like in Gangtok?",
    "Get weather forecast for Pelling",
    "Show me weather for the next 5 days",
    
    // Travel tests
    "How do I get to Gangtok from Delhi?",
    "Show me travel options to Sikkim",
    "Get flight information to Bagdogra",
    
    // Modal tests
    "Open the booking form",
    "Show me the AR view",
    "Open the payment modal",
    
    // Scroll tests
    "Scroll to the events section",
    "Go to the monastery details",
    "Scroll to the top of the page",
    
    // General conversation
    "Tell me about Rumtek Monastery",
    "What can I do on this website?",
    "Help me plan my trip to Sikkim",
    "What are the best monasteries to visit?",
  ];

  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < testMessages.length; i++) {
    const message = testMessages[i];
    console.log(`\n${i + 1}. 📝 User: ${message}`);
    
    try {
      const result = await processWithMCPClient(message);
      console.log(`🤖 Bot: ${result.message}`);
      
      if (result.action) {
        console.log(`   ✅ Action: ${result.action}`);
        console.log(`   🎯 Target: ${result.target}`);
        if (result.data) {
          console.log(`   📊 Data: ${JSON.stringify(result.data, null, 2)}`);
        }
      } else {
        console.log(`   💬 (General conversation - no action)`);
      }
      
      successCount++;
    } catch (error) {
      console.error(`❌ Error: ${error.message}`);
      errorCount++;
    }
    
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log(`\n📊 Test Results:`);
  console.log(`   ✅ Successful: ${successCount}`);
  console.log(`   ❌ Errors: ${errorCount}`);
  console.log(`   📈 Success Rate: ${((successCount / testMessages.length) * 100).toFixed(1)}%`);
  console.log(`\n🎉 MCP Agent test completed!`);
}

// Run test if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testMCPAgent().catch(console.error);
}

export default testMCPAgent;
