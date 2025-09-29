import { GoogleGenerativeAI } from "@google/generative-ai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import axios from "axios";

class HybridAgent {
  constructor() {
    this.model = null;
    this.initializeModel();
  }

  initializeModel() {
    if (!process.env.GOOGLE_API_KEY) {
      throw new Error("GOOGLE_API_KEY is missing");
    }

    this.model = new ChatGoogleGenerativeAI({
      apiKey: process.env.GOOGLE_API_KEY,
      model: "gemini-2.0-flash",
      temperature: 0.7,
    });
  }

  // Tool functions for website actions
  async navigateToPage(page) {
    return {
      action: "navigate",
      target: page,
      message: `Navigating to ${page}...`,
      data: { page }
    };
  }

  async bookTickets(eventId, quantity = 1, date = null) {
    // Simulate booking logic
    const bookingId = `booking_${Date.now()}`;
    
    return {
      action: "book",
      target: "/bookings",
      message: `Successfully booked ${quantity} ticket(s) for ${eventId}${date ? ` on ${date}` : ''}. Booking ID: ${bookingId}`,
      data: {
        bookingId,
        eventId,
        quantity,
        date
      }
    };
  }

  async processPayment(amount, type = "booking", description = "") {
    const paymentId = `pay_${Date.now()}`;
    
    return {
      action: "payment",
      target: "/payment",
      message: `Processing ${type} payment of ₹${amount}${description ? ` for ${description}` : ''}. Payment ID: ${paymentId}`,
      data: {
        paymentId,
        amount,
        type,
        description
      }
    };
  }

  async searchMonasteries(query, location = null, features = []) {
    // Simulate search results
    const results = [
      {
        id: "rumtek",
        name: "Rumtek Monastery",
        location: "Gangtok",
        description: "Famous for its golden stupa and traditional architecture",
        features: ["AR", "VR", "360"]
      },
      {
        id: "pemayangtse",
        name: "Pemayangtse Monastery",
        location: "West Sikkim",
        description: "Ancient monastery with beautiful murals",
        features: ["AR", "360"]
      },
      {
        id: "tashiding",
        name: "Tashiding Monastery",
        location: "West Sikkim",
        description: "Sacred monastery with stunning views",
        features: ["VR", "360"]
      }
    ];

    return {
      action: "search_results",
      target: "/explore",
      message: `Found ${results.length} monasteries matching "${query}"`,
      data: { results, query, location, features }
    };
  }

  async getEvents(monasteryId = null, dateRange = null) {
    const events = [
      {
        id: "festival_1",
        name: "Losar Festival",
        monastery: "Rumtek",
        date: "2024-02-10",
        description: "Tibetan New Year celebration with traditional dances"
      },
      {
        id: "festival_2",
        name: "Saga Dawa",
        monastery: "Pemayangtse",
        date: "2024-05-15",
        description: "Buddha's birth, enlightenment, and parinirvana"
      },
      {
        id: "festival_3",
        name: "Tsechu Festival",
        monastery: "Tashiding",
        date: "2024-08-20",
        description: "Masked dance festival celebrating Guru Padmasambhava"
      }
    ];

    return {
      action: "events_list",
      target: "/events",
      message: `Found ${events.length} upcoming events and festivals`,
      data: { events, monasteryId, dateRange }
    };
  }

  async getUserProfile() {
    const profile = {
      id: "user_123",
      name: "Monastery Explorer",
      email: "explorer@monastery360.com",
      preferences: {
        language: "en",
        notifications: true,
        favoriteMonasteries: ["rumtek", "pemayangtse"]
      }
    };

    return {
      action: "profile_data",
      target: "/profile",
      message: "Here's your profile information",
      data: profile
    };
  }

  async submitFeedback(type, content, rating = null, targetId = null) {
    const feedbackId = `feedback_${Date.now()}`;
    
    return {
      action: "feedback_submitted",
      target: "/feedback",
      message: `Thank you for your ${type}! Your feedback has been recorded.`,
      data: {
        feedbackId,
        type,
        content,
        rating,
        targetId
      }
    };
  }

  // Main processing function
  async processMessage(userMessage) {
    try {
      const lowerMessage = userMessage.toLowerCase();
      
      // Intent detection and action mapping
      if (this.containsAny(lowerMessage, ["navigate", "go to", "show me", "take me to"])) {
        return await this.handleNavigation(userMessage);
      } else if (this.containsAny(lowerMessage, ["book", "ticket", "reserve"])) {
        return await this.handleBooking(userMessage);
      } else if (this.containsAny(lowerMessage, ["pay", "payment", "donate", "donation"])) {
        return await this.handlePayment(userMessage);
      } else if (this.containsAny(lowerMessage, ["search", "find", "look for"])) {
        return await this.handleSearch(userMessage);
      } else if (this.containsAny(lowerMessage, ["event", "festival", "celebration"])) {
        return await this.handleEvents(userMessage);
      } else if (this.containsAny(lowerMessage, ["profile", "account", "my info"])) {
        return await this.getUserProfile();
      } else if (this.containsAny(lowerMessage, ["feedback", "review", "complaint", "suggestion"])) {
        return await this.handleFeedback(userMessage);
      } else {
        // General conversation - use LLM
        return await this.handleGeneralConversation(userMessage);
      }
    } catch (error) {
      console.error("Error in HybridAgent:", error);
      return {
        message: "I'm sorry, I encountered an error. Please try again.",
        action: null,
        target: null,
        data: null
      };
    }
  }

  // Helper methods for intent detection
  containsAny(text, keywords) {
    return keywords.some(keyword => text.includes(keyword));
  }

  async handleNavigation(message) {
    // Extract page from message
    const pageMatch = message.match(/(?:go to|navigate to|show me|take me to)\s+(\/[\w-]+|\w+)/i);
    let page = "/";
    
    if (pageMatch) {
      page = pageMatch[1].startsWith('/') ? pageMatch[1] : `/${pageMatch[1]}`;
    } else {
      // Smart page detection
      if (this.containsAny(message, ["booking", "book"])) page = "/bookings";
      else if (this.containsAny(message, ["event", "festival"])) page = "/events";
      else if (this.containsAny(message, ["profile", "account"])) page = "/profile";
      else if (this.containsAny(message, ["explore", "monastery", "monasteries"])) page = "/explore";
      else if (this.containsAny(message, ["map", "location"])) page = "/maps";
      else if (this.containsAny(message, ["contact", "help"])) page = "/contact";
    }

    return await this.navigateToPage(page);
  }

  async handleBooking(message) {
    // Extract event info
    const eventMatch = message.match(/book\s+(?:tickets?\s+for\s+)?(.+)/i);
    const eventId = eventMatch ? eventMatch[1].replace(/\s+/g, '_').toLowerCase() : 'monastery_visit';
    
    // Extract quantity
    const quantityMatch = message.match(/(\d+)\s+tickets?/i);
    const quantity = quantityMatch ? parseInt(quantityMatch[1]) : 1;

    return await this.bookTickets(eventId, quantity);
  }

  async handlePayment(message) {
    // Extract amount
    const amountMatch = message.match(/₹?(\d+)/);
    const amount = amountMatch ? parseInt(amountMatch[1]) : 100;
    
    // Determine payment type
    let type = "booking";
    if (this.containsAny(message, ["donate", "donation"])) type = "donation";
    else if (this.containsAny(message, ["event", "festival"])) type = "event";

    return await this.processPayment(amount, type);
  }

  async handleSearch(message) {
    // Extract search query
    const queryMatch = message.match(/(?:search|find|look for)\s+(.+)/i);
    const query = queryMatch ? queryMatch[1] : "monasteries";

    return await this.searchMonasteries(query);
  }

  async handleEvents(message) {
    return await this.getEvents();
  }

  async handleFeedback(message) {
    const type = this.containsAny(message, ["complaint"]) ? "complaint" : 
                 this.containsAny(message, ["suggestion"]) ? "suggestion" : "feedback";
    
    return await this.submitFeedback(type, message);
  }

  async handleGeneralConversation(message) {
    // Use LLM for general conversation
    const prompt = `You are Monastery360 Assistant, a helpful AI for a monastery tourism website in Sikkim, India.

You can help users with:
- Information about monasteries in Sikkim
- Travel planning and recommendations
- Buddhist culture and traditions
- Local attractions and events
- Booking assistance
- General questions about the website

User message: ${message}

Respond naturally and helpfully. If the user seems to want to do something specific (like book tickets, navigate somewhere, etc.), mention that you can help with that.`;

    try {
      const response = await this.model.invoke(prompt);
      return {
        message: response.content,
        action: null,
        target: null,
        data: null
      };
    } catch (error) {
      return {
        message: "I'm here to help you explore the beautiful monasteries of Sikkim! How can I assist you today?",
        action: null,
        target: null,
        data: null
      };
    }
  }
}

// Export singleton instance
let hybridAgentInstance = null;

export function getHybridAgent() {
  if (!hybridAgentInstance) {
    hybridAgentInstance = new HybridAgent();
  }
  return hybridAgentInstance;
}

export async function processWithHybridAgent(userMessage) {
  const agent = getHybridAgent();
  return await agent.processMessage(userMessage);
}
