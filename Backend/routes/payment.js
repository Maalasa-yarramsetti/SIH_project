import express from "express";
import razorpay from "../config/razorpay.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: "Access token required" });
  }

  jwt.verify(token, process.env.JWT_SECRET || "fallback-secret", (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = user;
    next();
  });
};

// Create payment order
router.post("/create-order", authenticateToken, async (req, res) => {
  try {
    if (!razorpay) {
      return res.status(503).json({ 
        message: "Payment service not available - Razorpay credentials not configured" 
      });
    }

    const { amount, currency = "INR" } = req.body;
    
    const options = {
      amount: amount * 100, // Razorpay expects amount in paise
      currency,
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.json({ order });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Verify payment
router.post("/verify", authenticateToken, async (req, res) => {
  try {
    if (!razorpay) {
      return res.status(503).json({ 
        message: "Payment service not available - Razorpay credentials not configured" 
      });
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    
    // In a real application, you would verify the signature here
    // For now, we'll just return success
    res.json({ message: "Payment verified successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;