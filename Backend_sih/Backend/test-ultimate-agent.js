#!/usr/bin/env node

// Comprehensive test script for Ultimate Agent
import { processWithUltimateAgent } from "./ai/ultimateAgent.js";
import dotenv from "dotenv";

dotenv.config();

async function testUltimateAgent() {
  console.log("🧪 Testing Ultimate Agent System...\n");

  const testMessages = [
    // Navigation tests
    "Hello, how are you?",
    "Navigate to bookings page",
    "Go to events",
    "Take me to the profile page",
    "Show me the explore page",
    "I want to go to maps",
    "Go to contact page",
    
    // Booking tests
    "Book tickets for Rumtek monastery",
    "I want to book 3 tickets for the festival",
    "Reserve 2 tickets for Pemayangtse monastery on 2024-03-15",
    "Book a guided tour for Tashiding monastery",
    "I need 5 tickets for the meditation workshop",
    
    // Payment tests
    "I want to pay ₹500 for a donation",
    "Process payment of ₹1000 for booking",
    "Pay ₹2000 for event tickets",
    "I want to donate ₹5000 to the monastery",
    "Make a payment of ₹1500 for the tour",
    
    // Search tests
    "Search for monasteries with AR features",
    "Find monasteries in Gangtok",
    "Look for monasteries with VR tours",
    "Search for monasteries with 4+ star rating",
    "Find monasteries within 50km of Pelling",
    "Show me monasteries with guided tours",
    
    // Events tests
    "Show me upcoming events",
    "What festivals are happening?",
    "Get events for Rumtek monastery",
    "Show me workshops this month",
    "What ceremonies are scheduled?",
    "Find meditation workshops",
    
    // Profile tests
    "What's my profile information?",
    "Show my account details",
    "Update my name to John Doe",
    "Change my email to john@example.com",
    "Update my phone number",
    
    // Feedback tests
    "I want to submit feedback about my visit",
    "I have a complaint about the service",
    "Submit a 5-star review for Rumtek monastery",
    "I want to report a bug",
    "Give feedback about the booking process",
    
    // Weather tests
    "What's the weather like in Gangtok?",
    "Get weather forecast for Pelling",
    "Show me weather for the next 5 days",
    "Weather in West Sikkim",
    
    // Travel tests
    "How do I get to Gangtok from Delhi?",
    "Show me travel options to Sikkim",
    "Get flight information to Bagdogra",
    "Travel from Mumbai to Gangtok",
    "What are the bus options to Sikkim?",
    
    // Modal tests
    "Open the booking form",
    "Show me the AR view",
    "Open the payment modal",
    "Display the monastery gallery",
    
    // Scroll tests
    "Scroll to the events section",
    "Go to the monastery details",
    "Scroll to the top of the page",
    "Show me the footer",
    
    // General conversation
    "Tell me about Rumtek Monastery",
    "What can I do on this website?",
    "Help me plan my trip to Sikkim",
    "What are the best monasteries to visit?",
    "Tell me about Buddhist culture in Sikkim",
    "What should I pack for my monastery visit?",
  ];

  let successCount = 0;
  let errorCount = 0;
  let actionCount = 0;

  for (let i = 0; i < testMessages.length; i++) {
    const message = testMessages[i];
    console.log(`\n${i + 1}. 📝 User: ${message}`);
    
    try {
      const result = await processWithUltimateAgent(message);
      console.log(`🤖 Bot: ${result.message}`);
      
      if (result.action) {
        console.log(`   ✅ Action: ${result.action}`);
        console.log(`   🎯 Target: ${result.target}`);
        if (result.data) {
          console.log(`   📊 Data: ${JSON.stringify(result.data, null, 2)}`);
        }
        actionCount++;
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
  console.log(`   🎯 Actions Executed: ${actionCount}`);
  console.log(`   📈 Success Rate: ${((successCount / testMessages.length) * 100).toFixed(1)}%`);
  console.log(`   🎯 Action Rate: ${((actionCount / testMessages.length) * 100).toFixed(1)}%`);
  console.log(`\n🎉 Ultimate Agent test completed!`);
}

// Run test if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testUltimateAgent().catch(console.error);
}

export default testUltimateAgent;

