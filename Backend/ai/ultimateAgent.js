import { GoogleGenerativeAI } from "@google/generative-ai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

class UltimateAgent {
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

  // Comprehensive tool functions for complete website control
  async navigateToPage(page, message = null) {
    return {
      action: "navigate",
      target: page,
      message: message || `Navigating to ${page}...`,
      data: { 
        page, 
        timestamp: new Date().toISOString(),
        type: "navigation"
      },
    };
  }

  async bookTickets(eventId, quantity = 1, date = null, time = null, type = "monastery_visit") {
    const bookingId = `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      action: "book",
      target: "/bookings",
      message: `Successfully booked ${quantity} ticket(s) for ${eventId}${date ? ` on ${date}` : ''}${time ? ` at ${time}` : ''}. Booking ID: ${bookingId}`,
      data: {
        bookingId,
        eventId,
        quantity,
        date,
        time,
        type,
        status: "confirmed",
        timestamp: new Date().toISOString(),
      },
    };
  }

  async processPayment(amount, type = "booking", description = "", currency = "INR") {
    const paymentId = `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      action: "payment",
      target: "/payment",
      message: `Processing ${type} payment of ${currency} ${amount}${description ? ` for ${description}` : ''}. Payment ID: ${paymentId}`,
      data: {
        paymentId,
        amount,
        type,
        description,
        currency,
        status: "processing",
        timestamp: new Date().toISOString(),
      },
    };
  }

  async searchMonasteries(query, location = null, features = [], rating = null, distance = null) {
    // Comprehensive monastery database
    const allMonasteries = [
      {
        id: "rumtek",
        name: "Rumtek Monastery",
        location: "Gangtok",
        description: "Famous for its golden stupa and traditional architecture",
        features: ["AR", "VR", "360", "Guided Tour"],
        rating: 4.8,
        distance: 0,
        images: ["rumtek1.jpg", "rumtek2.jpg"],
        visitingHours: "6:00 AM - 6:00 PM",
        entryFee: 0,
        highlights: ["Golden Stupa", "Karma Shri Nalanda Institute", "Tse-Chu Festival"]
      },
      {
        id: "pemayangtse",
        name: "Pemayangtse Monastery",
        location: "West Sikkim",
        description: "Ancient monastery with beautiful murals",
        features: ["AR", "360", "Guided Tour"],
        rating: 4.6,
        distance: 120,
        images: ["pemayangtse1.jpg", "pemayangtse2.jpg"],
        visitingHours: "7:00 AM - 5:00 PM",
        entryFee: 0,
        highlights: ["Ancient Murals", "Peaceful Gardens", "Mountain Views"]
      },
      {
        id: "tashiding",
        name: "Tashiding Monastery",
        location: "West Sikkim",
        description: "Sacred monastery with stunning views",
        features: ["VR", "360", "Guided Tour"],
        rating: 4.7,
        distance: 150,
        images: ["tashiding1.jpg", "tashiding2.jpg"],
        visitingHours: "6:30 AM - 5:30 PM",
        entryFee: 0,
        highlights: ["Sacred Stupa", "Mountain Views", "Peaceful Atmosphere"]
      },
      {
        id: "enchey",
        name: "Enchey Monastery",
        location: "Gangtok",
        description: "Peaceful monastery with beautiful gardens",
        features: ["AR", "360"],
        rating: 4.5,
        distance: 5,
        images: ["enchey1.jpg"],
        visitingHours: "6:00 AM - 6:00 PM",
        entryFee: 0,
        highlights: ["Beautiful Gardens", "Peaceful Environment", "City Views"]
      },
      {
        id: "labrang",
        name: "Labrang Monastery",
        location: "East Sikkim",
        description: "Traditional monastery with cultural significance",
        features: ["360", "Guided Tour"],
        rating: 4.4,
        distance: 80,
        images: ["labrang1.jpg"],
        visitingHours: "7:00 AM - 6:00 PM",
        entryFee: 0,
        highlights: ["Cultural Heritage", "Traditional Architecture", "Local Community"]
      }
    ];

    // Filter results based on criteria
    let results = allMonasteries.filter(monastery => {
      if (location && !monastery.location.toLowerCase().includes(location.toLowerCase())) {
        return false;
      }
      if (features.length > 0 && !features.some(feature => monastery.features.includes(feature))) {
        return false;
      }
      if (rating && monastery.rating < rating) {
        return false;
      }
      if (distance && monastery.distance > distance) {
        return false;
      }
      return monastery.name.toLowerCase().includes(query.toLowerCase()) ||
             monastery.description.toLowerCase().includes(query.toLowerCase()) ||
             monastery.highlights.some(h => h.toLowerCase().includes(query.toLowerCase()));
    });

    return {
      action: "search_results",
      target: "/explore",
      message: `Found ${results.length} monasteries matching your search`,
      data: {
        results,
        query,
        location,
        features,
        rating,
        distance,
        totalCount: results.length,
        timestamp: new Date().toISOString(),
      },
    };
  }

  async getEvents(monasteryId = null, dateRange = null, type = "all", limit = 10) {
    const allEvents = [
      {
        id: "festival_1",
        name: "Losar Festival",
        monastery: "Rumtek",
        monasteryId: "rumtek",
        date: "2024-02-10",
        time: "6:00 AM",
        description: "Tibetan New Year celebration with traditional dances",
        type: "festival",
        price: 0,
        duration: "3 days",
        capacity: 500,
        highlights: ["Traditional Dances", "Cultural Performances", "Community Gathering"]
      },
      {
        id: "festival_2",
        name: "Saga Dawa",
        monastery: "Pemayangtse",
        monasteryId: "pemayangtse",
        date: "2024-05-15",
        time: "5:00 AM",
        description: "Buddha's birth, enlightenment, and parinirvana",
        type: "ceremony",
        price: 0,
        duration: "1 day",
        capacity: 200,
        highlights: ["Religious Ceremony", "Prayer Flags", "Community Participation"]
      },
      {
        id: "festival_3",
        name: "Tsechu Festival",
        monastery: "Tashiding",
        monasteryId: "tashiding",
        date: "2024-08-20",
        time: "9:00 AM",
        description: "Masked dance festival celebrating Guru Padmasambhava",
        type: "festival",
        price: 0,
        duration: "2 days",
        capacity: 300,
        highlights: ["Masked Dances", "Religious Rituals", "Cultural Heritage"]
      },
      {
        id: "workshop_1",
        name: "Meditation Workshop",
        monastery: "Rumtek",
        monasteryId: "rumtek",
        date: "2024-03-15",
        time: "10:00 AM",
        description: "Learn basic meditation techniques",
        type: "workshop",
        price: 500,
        duration: "2 hours",
        capacity: 20,
        highlights: ["Guided Meditation", "Breathing Techniques", "Mindfulness"]
      },
      {
        id: "tour_1",
        name: "Heritage Walk",
        monastery: "Pemayangtse",
        monasteryId: "pemayangtse",
        date: "2024-04-10",
        time: "8:00 AM",
        description: "Guided tour of monastery history and architecture",
        type: "tour",
        price: 200,
        duration: "1.5 hours",
        capacity: 15,
        highlights: ["Historical Tour", "Architecture", "Cultural Insights"]
      }
    ];

    let events = allEvents;
    
    if (monasteryId) {
      events = events.filter(event => event.monasteryId === monasteryId);
    }
    
    if (type !== "all") {
      events = events.filter(event => event.type === type);
    }
    
    events = events.slice(0, limit);

    return {
      action: "events_list",
      target: "/events",
      message: `Found ${events.length} upcoming events`,
      data: {
        events,
        monasteryId,
        dateRange,
        type,
        totalCount: events.length,
        timestamp: new Date().toISOString(),
      },
    };
  }

  async getUserProfile(includeBookings = false, includePreferences = true) {
    const profile = {
      id: "user_123",
      name: "Monastery Explorer",
      email: "explorer@monastery360.com",
      phone: "+91-9876543210",
      joinDate: "2024-01-15",
      preferences: includePreferences ? {
        language: "en",
        notifications: true,
        favoriteMonasteries: ["rumtek", "pemayangtse"],
        interests: ["Buddhism", "Architecture", "Culture", "Photography"],
        travelStyle: "Cultural",
        budget: "moderate"
      } : undefined,
      bookings: includeBookings ? [
        {
          id: "booking_123",
          eventId: "rumtek_visit",
          date: "2024-02-15",
          status: "confirmed",
          type: "monastery_visit"
        },
        {
          id: "booking_124",
          eventId: "meditation_workshop",
          date: "2024-03-15",
          status: "pending",
          type: "workshop"
        }
      ] : undefined,
    };

    return {
      action: "profile_data",
      target: "/profile",
      message: "Here's your profile information",
      data: profile,
    };
  }

  async updateUserProfile(name, email, phone, preferences, notifications) {
    return {
      action: "profile_updated",
      target: "/profile",
      message: "Profile updated successfully",
      data: {
        name,
        email,
        phone,
        preferences,
        notifications,
        updatedAt: new Date().toISOString(),
      },
    };
  }

  async submitFeedback(type, content, rating = null, targetId = null, category = null) {
    const feedbackId = `feedback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      action: "feedback_submitted",
      target: "/feedback",
      message: `Thank you for your ${type}! Your feedback has been recorded.`,
      data: {
        feedbackId,
        type,
        content,
        rating,
        targetId,
        category,
        status: "submitted",
        timestamp: new Date().toISOString(),
      },
    };
  }

  async getWeather(location = "Gangtok", days = 3) {
    const weather = {
      location,
      current: {
        temperature: 18,
        condition: "Partly Cloudy",
        humidity: 65,
        windSpeed: 12,
        visibility: "Good"
      },
      forecast: Array.from({ length: days }, (_, i) => ({
        date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        high: 20 + Math.floor(Math.random() * 5),
        low: 15 + Math.floor(Math.random() * 3),
        condition: ["Sunny", "Partly Cloudy", "Cloudy", "Light Rain"][Math.floor(Math.random() * 4)],
        humidity: 60 + Math.floor(Math.random() * 20),
        windSpeed: 10 + Math.floor(Math.random() * 10)
      })),
    };

    return {
      action: "weather_info",
      target: "/weather",
      message: `Weather information for ${location}`,
      data: weather,
    };
  }

  async getTravelInfo(from, to, mode = "all", date = null) {
    const travelOptions = [
      {
        mode: "flight",
        duration: "2h 30m",
        price: 8000,
        airline: "IndiGo",
        departure: "6:00 AM",
        arrival: "8:30 AM",
        stops: "Direct"
      },
      {
        mode: "bus",
        duration: "6h 30m",
        price: 1200,
        operator: "Sikkim National Transport",
        departure: "7:00 AM",
        arrival: "1:30 PM",
        stops: "Multiple"
      },
      {
        mode: "car",
        duration: "5h 15m",
        price: 3500,
        type: "Taxi",
        distance: "120 km",
        stops: "Direct"
      },
      {
        mode: "train",
        duration: "8h 45m",
        price: 2500,
        operator: "Northeast Express",
        departure: "10:00 PM",
        arrival: "6:45 AM",
        stops: "2 stops"
      }
    ];

    return {
      action: "travel_info",
      target: "/travel",
      message: `Travel options from ${from} to ${to}`,
      data: {
        from,
        to,
        mode,
        date,
        options: travelOptions,
        timestamp: new Date().toISOString(),
      },
    };
  }

  async openModal(modalType, content = null, title = null) {
    return {
      action: "open_modal",
      target: "modal",
      message: `Opening ${modalType} modal`,
      data: {
        modalType,
        content,
        title,
        timestamp: new Date().toISOString(),
      },
    };
  }

  async scrollToSection(section, smooth = true) {
    return {
      action: "scroll_to_section",
      target: "current_page",
      message: `Scrolling to ${section} section`,
      data: {
        section,
        smooth,
        timestamp: new Date().toISOString(),
      },
    };
  }

  // Main processing function with advanced intent detection
  async processMessage(userMessage) {
    try {
      const lowerMessage = userMessage.toLowerCase();
      
      // Advanced intent detection using Gemini
      const intent = await this.detectIntent(userMessage);
      
      switch (intent.action) {
        case "navigate":
          return await this.handleNavigation(intent);
        case "book":
          return await this.handleBooking(intent);
        case "payment":
          return await this.handlePayment(intent);
        case "search":
          return await this.handleSearch(intent);
        case "events":
          return await this.handleEvents(intent);
        case "profile":
          return await this.handleProfile(intent);
        case "feedback":
          return await this.handleFeedback(intent);
        case "weather":
          return await this.handleWeather(intent);
        case "travel":
          return await this.handleTravel(intent);
        case "modal":
          return await this.handleModal(intent);
        case "scroll":
          return await this.handleScroll(intent);
        default:
          return await this.handleGeneralConversation(userMessage);
      }
    } catch (error) {
      console.error("Error in UltimateAgent:", error);
      return {
        message: "I'm sorry, I encountered an error. Please try again.",
        action: null,
        target: null,
        data: null
      };
    }
  }

  async detectIntent(userMessage) {
    const prompt = `Analyze this user message and determine the intent and parameters.

User message: "${userMessage}"

Respond with JSON only:
{
  "action": "navigate|book|payment|search|events|profile|feedback|weather|travel|modal|scroll|general",
  "parameters": {
    "page": "string (for navigate)",
    "eventId": "string (for book)",
    "quantity": "number (for book)",
    "amount": "number (for payment)",
    "type": "string (for payment)",
    "query": "string (for search)",
    "location": "string (for search/weather)",
    "features": "array (for search)",
    "monasteryId": "string (for events)",
    "dateRange": "string (for events)",
    "name": "string (for profile)",
    "email": "string (for profile)",
    "content": "string (for feedback)",
    "rating": "number (for feedback)",
    "days": "number (for weather)",
    "from": "string (for travel)",
    "to": "string (for travel)",
    "mode": "string (for travel)",
    "modalType": "string (for modal)",
    "section": "string (for scroll)"
  }
}

Examples:
- "Go to bookings" → {"action": "navigate", "parameters": {"page": "/bookings"}}
- "Book 2 tickets for Rumtek" → {"action": "book", "parameters": {"eventId": "rumtek", "quantity": 2}}
- "Pay ₹500 for donation" → {"action": "payment", "parameters": {"amount": 500, "type": "donation"}}
- "Search for monasteries with AR" → {"action": "search", "parameters": {"query": "monasteries", "features": ["AR"]}}
- "Show me events" → {"action": "events", "parameters": {}}
- "What's my profile?" → {"action": "profile", "parameters": {}}
- "Submit feedback about visit" → {"action": "feedback", "parameters": {"content": "about visit", "type": "feedback"}}
- "Weather in Gangtok" → {"action": "weather", "parameters": {"location": "Gangtok"}}
- "How to get to Sikkim" → {"action": "travel", "parameters": {"to": "Sikkim"}}
- "Open booking form" → {"action": "modal", "parameters": {"modalType": "booking_form"}}
- "Scroll to events" → {"action": "scroll", "parameters": {"section": "events"}}`;

    try {
      const model = this.model;
      const result = await model.invoke(prompt);
      const response = result.content;
      
      // Extract JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      // Fallback to simple detection
      return this.simpleIntentDetection(userMessage);
    } catch (error) {
      console.error("Error detecting intent:", error);
      return this.simpleIntentDetection(userMessage);
    }
  }

  simpleIntentDetection(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    
    if (this.containsAny(lowerMessage, ["navigate", "go to", "show me", "take me to"])) {
      const pageMatch = userMessage.match(/(?:go to|navigate to|show me|take me to)\s+(\/[\w-]+|\w+)/i);
      const page = pageMatch ? (pageMatch[1].startsWith('/') ? pageMatch[1] : `/${pageMatch[1]}`) : '/';
      return { action: "navigate", parameters: { page } };
    } else if (this.containsAny(lowerMessage, ["book", "ticket", "reserve"])) {
      const eventMatch = userMessage.match(/book\s+(?:tickets?\s+for\s+)?(.+)/i);
      const eventId = eventMatch ? eventMatch[1].replace(/\s+/g, '_').toLowerCase() : 'monastery_visit';
      const quantityMatch = userMessage.match(/(\d+)\s+tickets?/i);
      const quantity = quantityMatch ? parseInt(quantityMatch[1]) : 1;
      return { action: "book", parameters: { eventId, quantity } };
    } else if (this.containsAny(lowerMessage, ["pay", "payment", "donate"])) {
      const amountMatch = userMessage.match(/₹?(\d+)/);
      const amount = amountMatch ? parseInt(amountMatch[1]) : 100;
      const type = this.containsAny(lowerMessage, ["donate", "donation"]) ? "donation" : "booking";
      return { action: "payment", parameters: { amount, type } };
    } else if (this.containsAny(lowerMessage, ["search", "find", "look for"])) {
      const queryMatch = userMessage.match(/(?:search|find|look for)\s+(.+)/i);
      const query = queryMatch ? queryMatch[1] : "monasteries";
      return { action: "search", parameters: { query } };
    } else if (this.containsAny(lowerMessage, ["event", "festival", "celebration"])) {
      return { action: "events", parameters: {} };
    } else if (this.containsAny(lowerMessage, ["profile", "account", "my info"])) {
      return { action: "profile", parameters: {} };
    } else if (this.containsAny(lowerMessage, ["feedback", "review", "complaint"])) {
      const type = this.containsAny(lowerMessage, ["complaint"]) ? "complaint" : "feedback";
      return { action: "feedback", parameters: { content: userMessage, type } };
    } else if (this.containsAny(lowerMessage, ["weather", "forecast"])) {
      const locationMatch = userMessage.match(/weather\s+(?:in\s+)?(.+)/i);
      const location = locationMatch ? locationMatch[1] : "Gangtok";
      return { action: "weather", parameters: { location } };
    } else if (this.containsAny(lowerMessage, ["travel", "get to", "how to"])) {
      const toMatch = userMessage.match(/get to\s+(.+)/i) || userMessage.match(/travel to\s+(.+)/i);
      const to = toMatch ? toMatch[1] : "Sikkim";
      return { action: "travel", parameters: { to } };
    } else if (this.containsAny(lowerMessage, ["open", "show", "modal"])) {
      const modalMatch = userMessage.match(/open\s+(.+)/i);
      const modalType = modalMatch ? modalMatch[1].replace(/\s+/g, '_').toLowerCase() : "info";
      return { action: "modal", parameters: { modalType } };
    } else if (this.containsAny(lowerMessage, ["scroll", "go to section"])) {
      const sectionMatch = userMessage.match(/scroll to\s+(.+)/i) || userMessage.match(/go to\s+(.+)\s+section/i);
      const section = sectionMatch ? sectionMatch[1] : "top";
      return { action: "scroll", parameters: { section } };
    } else {
      return { action: "general", parameters: {} };
    }
  }

  async handleNavigation(intent) {
    const { page } = intent.parameters;
    return await this.navigateToPage(page);
  }

  async handleBooking(intent) {
    const { eventId, quantity = 1, date, time, type = "monastery_visit" } = intent.parameters;
    return await this.bookTickets(eventId, quantity, date, time, type);
  }

  async handlePayment(intent) {
    const { amount, type = "booking", description = "" } = intent.parameters;
    return await this.processPayment(amount, type, description);
  }

  async handleSearch(intent) {
    const { query = "monasteries", location, features = [], rating, distance } = intent.parameters;
    return await this.searchMonasteries(query, location, features, rating, distance);
  }

  async handleEvents(intent) {
    const { monasteryId, dateRange, type = "all", limit = 10 } = intent.parameters;
    return await this.getEvents(monasteryId, dateRange, type, limit);
  }

  async handleProfile(intent) {
    const { includeBookings = false, includePreferences = true } = intent.parameters;
    return await this.getUserProfile(includeBookings, includePreferences);
  }

  async handleFeedback(intent) {
    const { type, content, rating, targetId, category } = intent.parameters;
    return await this.submitFeedback(type, content, rating, targetId, category);
  }

  async handleWeather(intent) {
    const { location = "Gangtok", days = 3 } = intent.parameters;
    return await this.getWeather(location, days);
  }

  async handleTravel(intent) {
    const { from, to, mode = "all", date } = intent.parameters;
    return await this.getTravelInfo(from, to, mode, date);
  }

  async handleModal(intent) {
    const { modalType, content, title } = intent.parameters;
    return await this.openModal(modalType, content, title);
  }

  async handleScroll(intent) {
    const { section, smooth = true } = intent.parameters;
    return await this.scrollToSection(section, smooth);
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
      const result = await this.model.invoke(prompt);
      return {
        message: result.content,
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

  containsAny(text, keywords) {
    return keywords.some(keyword => text.includes(keyword));
  }
}

// Export singleton instance
let ultimateAgentInstance = null;

export function getUltimateAgent() {
  if (!ultimateAgentInstance) {
    ultimateAgentInstance = new UltimateAgent();
  }
  return ultimateAgentInstance;
}

export async function processWithUltimateAgent(userMessage) {
  const agent = getUltimateAgent();
  return await agent.processMessage(userMessage);
}
