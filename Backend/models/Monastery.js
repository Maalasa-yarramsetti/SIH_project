// Monastery schema
import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  review: String,
  rating: Number
}, { timestamps: true });

const monasterySchema = new mongoose.Schema({
  title: String,
  location: String,
  description: String,
  rating: { type: Number, default: 0 },
  image: String,
  reviews: [reviewSchema]
}, { timestamps: true });

export default mongoose.model("Monastery", monasterySchema);
