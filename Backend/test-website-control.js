#!/usr/bin/env node

// Test script to verify complete website control
import fetch from 'node-fetch';

const API_BASE = 'http://localhost:5000';

async function testWebsiteControl() {
  console.log("🧪 Testing Complete Website Control...\n");

  const testCommands = [
    // Navigation tests
    "Go to the homepage",
    "Navigate to bookings page",
    "Take me to events",
    "Show me the profile page",
    "Go to explore page",
    "I want to see maps",
    "Navigate to contact us",
    "Go to about page",
    
    // Booking tests
    "Book tickets for Rumtek monastery",
    "I want to book 2 tickets for the festival",
    "Reserve 3 tickets for Pemayangtse monastery",
    "Book a guided tour for Tashiding monastery",
    "I need tickets for the meditation workshop",
    
    // Payment tests
    "I want to pay ₹500 for a donation",
    "Process payment of ₹1000 for booking",
    "Pay ₹2000 for event tickets",
    "Make a donation of ₹5000",
    "I want to pay for the tour",
    
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
  ];

  let successCount = 0;
  let errorCount = 0;
  let actionCount = 0;

  for (let i = 0; i < testCommands.length; i++) {
    const command = testCommands[i];
    console.log(`\n${i + 1}. 📝 User: ${command}`);
    
    try {
      const response = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: command }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log(`🤖 Bot: ${result.reply}`);
      
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
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  console.log(`\n📊 Test Results:`);
  console.log(`   ✅ Successful: ${successCount}`);
  console.log(`   ❌ Errors: ${errorCount}`);
  console.log(`   🎯 Actions Executed: ${actionCount}`);
  console.log(`   📈 Success Rate: ${((successCount / testCommands.length) * 100).toFixed(1)}%`);
  console.log(`   🎯 Action Rate: ${((actionCount / testCommands.length) * 100).toFixed(1)}%`);
  console.log(`\n🎉 Website Control Test completed!`);
}

// Run test if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testWebsiteControl().catch(console.error);
}

export default testWebsiteControl;

