import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

// MCP Server for Monastery360 Website Agent
class Monastery360MCPServer {
  constructor() {
    this.server = new Server(
      {
        name: "monastery360-agent",
        version: "1.0.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
  }

  setupToolHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: "navigate_to_page",
            description: "Navigate user to a specific page on the website",
            inputSchema: {
              type: "object",
              properties: {
                page: {
                  type: "string",
                  description: "The page route to navigate to (e.g., /bookings, /events, /profile)",
                },
              },
              required: ["page"],
            },
          },
          {
            name: "book_tickets",
            description: "Book tickets for monastery visits or events",
            inputSchema: {
              type: "object",
              properties: {
                eventId: {
                  type: "string",
                  description: "ID of the event to book tickets for",
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
              },
              required: ["eventId"],
            },
          },
          {
            name: "process_payment",
            description: "Process payment for bookings or donations",
            inputSchema: {
              type: "object",
              properties: {
                amount: {
                  type: "number",
                  description: "Payment amount in INR",
                },
                type: {
                  type: "string",
                  enum: ["booking", "donation", "event"],
                  description: "Type of payment",
                },
                description: {
                  type: "string",
                  description: "Description of the payment",
                },
              },
              required: ["amount", "type"],
            },
          },
          {
            name: "search_monasteries",
            description: "Search for monasteries based on criteria",
            inputSchema: {
              type: "object",
              properties: {
                query: {
                  type: "string",
                  description: "Search query for monasteries",
                },
                location: {
                  type: "string",
                  description: "Location filter (e.g., 'Gangtok', 'West Sikkim')",
                },
                features: {
                  type: "array",
                  items: { type: "string" },
                  description: "Features to filter by (e.g., ['AR', 'VR', '360'])",
                },
              },
            },
          },
          {
            name: "get_events",
            description: "Get upcoming events and festivals",
            inputSchema: {
              type: "object",
              properties: {
                monasteryId: {
                  type: "string",
                  description: "Filter events by monastery ID",
                },
                dateRange: {
                  type: "string",
                  description: "Date range for events (e.g., 'this week', 'next month')",
                },
              },
            },
          },
          {
            name: "get_user_profile",
            description: "Get current user profile information",
            inputSchema: {
              type: "object",
              properties: {},
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
                preferences: {
                  type: "object",
                  description: "User preferences",
                },
              },
            },
          },
          {
            name: "submit_feedback",
            description: "Submit feedback or review",
            inputSchema: {
              type: "object",
              properties: {
                type: {
                  type: "string",
                  enum: ["review", "feedback", "complaint"],
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
              },
              required: ["type", "content"],
            },
          },
        ],
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
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
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error executing tool ${name}: ${error.message}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  // Tool implementations
  async handleNavigateToPage(args) {
    const { page } = args;
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            action: "navigate",
            target: page,
            message: `Navigating to ${page}...`,
          }),
        },
      ],
    };
  }

  async handleBookTickets(args) {
    const { eventId, quantity = 1, date } = args;
    
    // Simulate booking logic
    const bookingId = `booking_${Date.now()}`;
    
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            action: "book",
            target: "/bookings",
            message: `Successfully booked ${quantity} ticket(s) for event ${eventId}${date ? ` on ${date}` : ''}. Booking ID: ${bookingId}`,
            data: {
              bookingId,
              eventId,
              quantity,
              date,
            },
          }),
        },
      ],
    };
  }

  async handleProcessPayment(args) {
    const { amount, type, description } = args;
    
    // Simulate payment processing
    const paymentId = `pay_${Date.now()}`;
    
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            action: "payment",
            target: "/payment",
            message: `Processing ${type} payment of ₹${amount}${description ? ` for ${description}` : ''}. Payment ID: ${paymentId}`,
            data: {
              paymentId,
              amount,
              type,
              description,
            },
          }),
        },
      ],
    };
  }

  async handleSearchMonasteries(args) {
    const { query, location, features } = args;
    
    // Simulate search results
    const results = [
      {
        id: "rumtek",
        name: "Rumtek Monastery",
        location: "Gangtok",
        description: "Famous for its golden stupa and traditional architecture",
        features: ["AR", "VR", "360"],
      },
      {
        id: "pemayangtse",
        name: "Pemayangtse Monastery",
        location: "West Sikkim",
        description: "Ancient monastery with beautiful murals",
        features: ["AR", "360"],
      },
    ];

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            action: "search_results",
            target: "/explore",
            message: `Found ${results.length} monasteries matching your search`,
            data: { results, query, location, features },
          }),
        },
      ],
    };
  }

  async handleGetEvents(args) {
    const { monasteryId, dateRange } = args;
    
    // Simulate events data
    const events = [
      {
        id: "festival_1",
        name: "Losar Festival",
        monastery: "Rumtek",
        date: "2024-02-10",
        description: "Tibetan New Year celebration",
      },
      {
        id: "festival_2",
        name: "Saga Dawa",
        monastery: "Pemayangtse",
        date: "2024-05-15",
        description: "Buddha's birth, enlightenment, and parinirvana",
      },
    ];

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            action: "events_list",
            target: "/events",
            message: `Found ${events.length} upcoming events`,
            data: { events, monasteryId, dateRange },
          }),
        },
      ],
    };
  }

  async handleGetUserProfile(args) {
    // Simulate user profile
    const profile = {
      id: "user_123",
      name: "John Doe",
      email: "john@example.com",
      preferences: {
        language: "en",
        notifications: true,
      },
    };

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            action: "profile_data",
            target: "/profile",
            message: "Retrieved your profile information",
            data: profile,
          }),
        },
      ],
    };
  }

  async handleUpdateUserProfile(args) {
    const { name, email, preferences } = args;
    
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            action: "profile_updated",
            target: "/profile",
            message: "Profile updated successfully",
            data: { name, email, preferences },
          }),
        },
      ],
    };
  }

  async handleSubmitFeedback(args) {
    const { type, content, rating, targetId } = args;
    
    const feedbackId = `feedback_${Date.now()}`;
    
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            action: "feedback_submitted",
            target: "/feedback",
            message: `Thank you for your ${type}! Your feedback has been recorded.`,
            data: {
              feedbackId,
              type,
              content,
              rating,
              targetId,
            },
          }),
        },
      ],
    ];
  }

  async start() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.log("MCP Server started successfully");
  }
}

export default Monastery360MCPServer;

