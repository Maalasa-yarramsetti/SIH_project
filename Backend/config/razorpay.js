import Razorpay from "razorpay";
import dotenv from "dotenv";

dotenv.config();

// Only initialize Razorpay if credentials are provided
let razorpay = null;

if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
  console.log("✅ Razorpay initialized");
} else {
  console.log("⚠️  Razorpay credentials not found - payment features disabled");
}

export default razorpay;