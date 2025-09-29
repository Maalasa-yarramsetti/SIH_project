# Monastery360 Backend API

A Node.js/Express backend API for the Monastery360 application, providing endpoints for monastery management, user authentication, events, archives, and more.

## Prerequisites

Before running this application, make sure you have the following installed:

1. **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
2. **MongoDB** - [Download here](https://www.mongodb.com/try/download/community) or use MongoDB Atlas
3. **Git** (optional, for version control)

## Installation

1. **Install Node.js and npm:**
   - Download and install Node.js from [https://nodejs.org/](https://nodejs.org/)
   - This will also install npm (Node Package Manager)

2. **Clone or download this repository:**
   ```bash
   git clone <repository-url>
   cd Backend
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Set up environment variables:**
   Create a `.env` file in the root directory with the following variables:
   ```env
   # Database Configuration
   MONGODB_URI=mongodb://localhost:27017/monastery360
   # For MongoDB Atlas, use: mongodb+srv://username:password@cluster.mongodb.net/monastery360

   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # JWT Secret
   JWT_SECRET=your-super-secret-jwt-key-here

   # Google OAuth Configuration
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret

   # Razorpay Configuration
   RAZORPAY_KEY_ID=your-razorpay-key-id
   RAZORPAY_KEY_SECRET=your-razorpay-key-secret

   # OpenAI Configuration
   OPENAI_API_KEY=your-openai-api-key

   # Cloudinary Configuration (for image uploads)
   CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
   CLOUDINARY_API_KEY=your-cloudinary-api-key
   CLOUDINARY_API_SECRET=your-cloudinary-api-secret

   # Session Secret
   SESSION_SECRET=monastery360-super-secret-session-key
   ```

## Running the Application

1. **Start MongoDB:**
   - If using local MongoDB, make sure MongoDB service is running
   - If using MongoDB Atlas, ensure your connection string is correct

2. **Run the application:**
   ```bash
   npm start
   ```
   
   Or for development with auto-restart:
   ```bash
   npm run dev
   ```

3. **The server will start on port 5000:**
   - API Base URL: `http://localhost:5000`
   - Server logs will show: "🚀 Server running on port 5000"

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/google` - Google OAuth login
- `GET /api/auth/google/callback` - Google OAuth callback

### Users
- `GET /api/users/profile` - Get user profile (requires auth)
- `PUT /api/users/profile` - Update user profile (requires auth)
- `GET /api/users` - Get all users (admin only)

### Monasteries
- `GET /api/monasteries` - Get all monasteries
- `GET /api/monasteries/:id` - Get single monastery
- `POST /api/monasteries` - Create monastery (admin only)

### Events
- `GET /api/events` - Get all events
- `POST /api/events` - Create event (NGO only)

### Archives
- `GET /api/archives` - Get all archives
- `POST /api/archives` - Create archive (admin only)

### Proposals
- `GET /api/proposals` - Get all proposals
- `POST /api/proposals` - Create proposal (NGO only)

### Trivia
- `GET /api/trivia` - Get all trivia questions
- `POST /api/trivia` - Create trivia question (admin only)

### Chatbot
- `POST /api/chatbot/chat` - Chat with AI (requires auth)

### Payment
- `POST /api/payment/create-order` - Create Razorpay order (requires auth)
- `POST /api/payment/verify` - Verify payment (requires auth)

## Authentication

Most endpoints require authentication via JWT token. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Database Models

- **User**: User accounts with roles (user, admin, ngo)
- **Monastery**: Monastery information and reviews
- **Event**: Events organized by NGOs
- **Archive**: Digital archives and documents
- **Proposal**: Proposals from NGOs to monasteries
- **Trivia**: Trivia questions and answers

## Features

- JWT-based authentication
- Google OAuth integration
- Role-based access control (user, admin, ngo)
- MongoDB database integration
- Razorpay payment integration
- OpenAI chatbot integration
- Image upload support (Cloudinary)
- CORS enabled for frontend integration

## Troubleshooting

1. **"npm is not recognized" error:**
   - Make sure Node.js is properly installed
   - Restart your terminal/command prompt
   - Check if Node.js is added to your system PATH

2. **Database connection error:**
   - Ensure MongoDB is running (if using local MongoDB)
   - Check your MongoDB connection string in the `.env` file
   - Verify network connectivity (if using MongoDB Atlas)

3. **Port already in use:**
   - Change the PORT in your `.env` file
   - Or stop the process using port 5000

4. **Missing environment variables:**
   - Ensure all required variables are set in your `.env` file
   - Restart the server after making changes to `.env`

## Development

- The application uses ES6 modules (type: "module" in package.json)
- All routes are organized in separate files
- Middleware is used for authentication and validation
- Error handling is implemented across all routes

## License

This project is licensed under the ISC License.




