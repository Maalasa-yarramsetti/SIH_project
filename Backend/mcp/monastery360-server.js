#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

// Comprehensive MCP Server for Monastery360 Website Agent
class Monastery360MCPServer {
  constructor() {
    this.server = new Server(
      {
        name: "monastery360-agent",
        version: "2.0.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
    this.setupErrorHandling();
  }

  setupErrorHandling() {
    this.server.onerror = (error) => {
      console.error("MCP Server Error:", error);
    };

    process.on("uncaughtException", (error) => {
      console.error("Uncaught Exception:", error);
    });

    process.on("unhandledRejection", (reason, promise) => {
      console.error("Unhandled Rejection at:", promise, "reason:", reason);
    });
  }

  setupToolHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: "navigate_to_page",
            description: "Navigate user to any page on the website",
            inputSchema: {
              type: "object",
              properties: {
                page: {
                  type: "string",
                  description: "The page route to navigate to (e.g., /bookings, /events, /profile, /explore, /maps, /contact)",
                },
                message: {
                  type: "string",
                  description: "Optional message to display to user",
                },
              },
              required: ["page"],
            },
          },
          {
            name: "book_tickets",
            description: "Book tickets for monastery visits, events, or tours",
            inputSchema: {
              type: "object",
              properties: {
                eventId: {
                  type: "string",
                  description: "ID or name of the event/monastery to book",
                },
                quantity: {
                  type: "number",
                  description: "Number of tickets to book",
                  default: 1,
                },
                date: {
                  type: "string",
                  description: "Date for the booking (YYYY-MM-DD format)",
                },
                time: {
                  type: "string",
                  description: "Time slot for the booking",
                },
                type: {
                  type: "string",
                  enum: ["monastery_visit", "event", "tour", "festival"],
                  description: "Type of booking",
                  default: "monastery_visit",
                },
              },
              required: ["eventId"],
            },
          },
          {
            name: "process_payment",
            description: "Process payment for bookings, donations, or services",
            inputSchema: {
              type: "object",
              properties: {
                amount: {
                  type: "number",
                  description: "Payment amount in INR",
                },
                type: {
                  type: "string",
                  enum: ["booking", "donation", "event", "tour", "membership"],
                  description: "Type of payment",
                },
                description: {
                  type: "string",
                  description: "Description of the payment",
                },
                currency: {
                  type: "string",
                  description: "Currency code",
                  default: "INR",
                },
                metadata: {
                  type: "object",
                  description: "Additional payment metadata",
                },
              },
              required: ["amount", "type"],
            },
          },
          {
            name: "search_monasteries",
            description: "Search for monasteries with various filters",
            inputSchema: {
              type: "object",
              properties: {
                query: {
                  type: "string",
                  description: "Search query for monasteries",
                },
                location: {
                  type: "string",
                  description: "Location filter (e.g., 'Gangtok', 'West Sikkim', 'East Sikkim')",
                },
                features: {
                  type: "array",
                  items: { type: "string" },
                  description: "Features to filter by (e.g., ['AR', 'VR', '360', 'Guided Tour'])",
                },
                rating: {
                  type: "number",
                  minimum: 1,
                  maximum: 5,
                  description: "Minimum rating filter",
                },
                distance: {
                  type: "number",
                  description: "Maximum distance in km from a location",
                },
              },
            },
          },
          {
            name: "get_events",
            description: "Get upcoming events, festivals, and activities",
            inputSchema: {
              type: "object",
              properties: {
                monasteryId: {
                  type: "string",
                  description: "Filter events by monastery ID",
                },
                dateRange: {
                  type: "string",
                  description: "Date range for events (e.g., 'this week', 'next month', '2024-12')",
                },
                type: {
                  type: "string",
                  enum: ["festival", "ceremony", "tour", "workshop", "all"],
                  description: "Type of event",
                  default: "all",
                },
                limit: {
                  type: "number",
                  description: "Maximum number of events to return",
                  default: 10,
                },
              },
            },
          },
          {
            name: "get_user_profile",
            description: "Get current user profile and preferences",
            inputSchema: {
              type: "object",
              properties: {
                includeBookings: {
                  type: "boolean",
                  description: "Include user's booking history",
                  default: false,
                },
                includePreferences: {
                  type: "boolean",
                  description: "Include user preferences",
                  default: true,
                },
              },
            },
          },
          {
            name: "update_user_profile",
            description: "Update user profile information",
            inputSchema: {
              type: "object",
              properties: {
                name: { type: "string", description: "User's full name" },
                email: { type: "string", description: "User's email" },
                phone: { type: "string", description: "User's phone number" },
                preferences: {
                  type: "object",
                  description: "User preferences object",
                },
                notifications: {
                  type: "object",
                  description: "Notification preferences",
                },
              },
            },
          },
          {
            name: "submit_feedback",
            description: "Submit feedback, reviews, or complaints",
            inputSchema: {
              type: "object",
              properties: {
                type: {
                  type: "string",
                  enum: ["review", "feedback", "complaint", "suggestion", "bug_report"],
                  description: "Type of feedback",
                },
                content: {
                  type: "string",
                  description: "Feedback content",
                },
                rating: {
                  type: "number",
                  minimum: 1,
                  maximum: 5,
                  description: "Rating (1-5 stars)",
                },
                targetId: {
                  type: "string",
                  description: "ID of monastery, event, or service being reviewed",
                },
                category: {
                  type: "string",
                  description: "Category of feedback",
                },
              },
              required: ["type", "content"],
            },
          },
          {
            name: "get_weather",
            description: "Get weather information for Sikkim",
            inputSchema: {
              type: "object",
              properties: {
                location: {
                  type: "string",
                  description: "Location in Sikkim (e.g., 'Gangtok', 'Pelling')",
                  default: "Gangtok",
                },
                days: {
                  type: "number",
                  description: "Number of days to forecast",
                  default: 3,
                },
              },
            },
          },
          {
            name: "get_travel_info",
            description: "Get travel information and recommendations",
            inputSchema: {
              type: "object",
              properties: {
                from: {
                  type: "string",
                  description: "Starting location",
                },
                to: {
                  type: "string",
                  description: "Destination in Sikkim",
                },
                mode: {
                  type: "string",
                  enum: ["flight", "bus", "car", "train", "all"],
                  description: "Transportation mode",
                  default: "all",
                },
                date: {
                  type: "string",
                  description: "Travel date (YYYY-MM-DD format)",
                },
              },
            },
          },
          {
            name: "open_modal",
            description: "Open a modal or popup on the website",
            inputSchema: {
              type: "object",
              properties: {
                modalType: {
                  type: "string",
                  enum: ["image", "video", "ar_view", "booking_form", "payment_form", "info"],
                  description: "Type of modal to open",
                },
                content: {
                  type: "object",
                  description: "Content to display in modal",
                },
                title: {
                  type: "string",
                  description: "Modal title",
                },
              },
              required: ["modalType"],
            },
          },
          {
            name: "scroll_to_section",
            description: "Scroll to a specific section on the current page",
            inputSchema: {
              type: "object",
              properties: {
                section: {
                  type: "string",
                  description: "Section ID or name to scroll to",
                },
                smooth: {
                  type: "boolean",
                  description: "Whether to use smooth scrolling",
                  default: true,
                },
              },
              required: ["section"],
            },
          },
        ],
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        const result = await this.executeTool(name, args);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result),
            },
          ],
        };
      } catch (error) {
        console.error(`Error executing tool ${name}:`, error);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                action: "error",
                message: `Error executing ${name}: ${error.message}`,
                error: true,
              }),
            },
          ],
          isError: true,
        };
      }
    });
  }

  async executeTool(toolName, args) {
    switch (toolName) {
      case "navigate_to_page":
        return await this.handleNavigateToPage(args);
      case "book_tickets":
        return await this.handleBookTickets(args);
      case "process_payment":
        return await this.handleProcessPayment(args);
      case "search_monasteries":
        return await this.handleSearchMonasteries(args);
      case "get_events":
        return await this.handleGetEvents(args);
      case "get_user_profile":
        return await this.handleGetUserProfile(args);
      case "update_user_profile":
        return await this.handleUpdateUserProfile(args);
      case "submit_feedback":
        return await this.handleSubmitFeedback(args);
      case "get_weather":
        return await this.handleGetWeather(args);
      case "get_travel_info":
        return await this.handleGetTravelInfo(args);
      case "open_modal":
        return await this.handleOpenModal(args);
      case "scroll_to_section":
        return await this.handleScrollToSection(args);
      default:
        throw new Error(`Unknown tool: ${toolName}`);
    }
  }

  // Tool implementations
  async handleNavigateToPage(args) {
    const { page, message } = args;
    return {
      action: "navigate",
      target: page,
      message: message || `Navigating to ${page}...`,
      data: { page, timestamp: new Date().toISOString() },
    };
  }

  async handleBookTickets(args) {
    const { eventId, quantity = 1, date, time, type = "monastery_visit" } = args;
    
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

  async handleProcessPayment(args) {
    const { amount, type, description = "", currency = "INR", metadata = {} } = args;
    
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
        metadata,
        status: "processing",
        timestamp: new Date().toISOString(),
      },
    };
  }

  async handleSearchMonasteries(args) {
    const { query = "monasteries", location, features = [], rating, distance } = args;
    
    // Simulate comprehensive search results
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
      },
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
             monastery.description.toLowerCase().includes(query.toLowerCase());
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

  async handleGetEvents(args) {
    const { monasteryId, dateRange, type = "all", limit = 10 } = args;
    
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
      },
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

  async handleGetUserProfile(args) {
    const { includeBookings = false, includePreferences = true } = args;
    
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
        interests: ["Buddhism", "Architecture", "Culture"],
        travelStyle: "Cultural",
      } : undefined,
      bookings: includeBookings ? [
        {
          id: "booking_123",
          eventId: "rumtek_visit",
          date: "2024-02-15",
          status: "confirmed",
        },
      ] : undefined,
    };

    return {
      action: "profile_data",
      target: "/profile",
      message: "Here's your profile information",
      data: profile,
    };
  }

  async handleUpdateUserProfile(args) {
    const { name, email, phone, preferences, notifications } = args;
    
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

  async handleSubmitFeedback(args) {
    const { type, content, rating, targetId, category } = args;
    
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

  async handleGetWeather(args) {
    const { location = "Gangtok", days = 3 } = args;
    
    // Simulate weather data
    const weather = {
      location,
      current: {
        temperature: 18,
        condition: "Partly Cloudy",
        humidity: 65,
        windSpeed: 12,
      },
      forecast: Array.from({ length: days }, (_, i) => ({
        date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        high: 20 + Math.floor(Math.random() * 5),
        low: 15 + Math.floor(Math.random() * 3),
        condition: ["Sunny", "Partly Cloudy", "Cloudy"][Math.floor(Math.random() * 3)],
      })),
    };

    return {
      action: "weather_info",
      target: "/weather",
      message: `Weather information for ${location}`,
      data: weather,
    };
  }

  async handleGetTravelInfo(args) {
    const { from, to, mode = "all", date } = args;
    
    // Simulate travel options
    const travelOptions = [
      {
        mode: "flight",
        duration: "2h 30m",
        price: 8000,
        airline: "IndiGo",
        departure: "6:00 AM",
        arrival: "8:30 AM",
      },
      {
        mode: "bus",
        duration: "6h 30m",
        price: 1200,
        operator: "Sikkim National Transport",
        departure: "7:00 AM",
        arrival: "1:30 PM",
      },
      {
        mode: "car",
        duration: "5h 15m",
        price: 3500,
        type: "Taxi",
        distance: "120 km",
      },
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

  async handleOpenModal(args) {
    const { modalType, content, title } = args;
    
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

  async handleScrollToSection(args) {
    const { section, smooth = true } = args;
    
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

  async start() {
    try {
      const transport = new StdioServerTransport();
      await this.server.connect(transport);
      console.log("✅ Monastery360 MCP Server started successfully");
      return true;
    } catch (error) {
      console.error("❌ Failed to start MCP Server:", error);
      return false;
    }
  }

  async stop() {
    try {
      await this.server.close();
      console.log("✅ MCP Server stopped");
    } catch (error) {
      console.error("❌ Error stopping MCP Server:", error);
    }
  }
}

// Start server if this file is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const server = new Monastery360MCPServer();
  server.start().catch(console.error);
}

export default Monastery360MCPServer;
