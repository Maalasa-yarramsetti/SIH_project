// Event schema
import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  title: String,
  location: String,
  description: String,
  date: Date,
  picture: String,
  status: { type: String, enum: ["upcoming", "past"], default: "upcoming" },
  ngoId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  liveLink: String
}, { timestamps: true });

export default mongoose.model("Event", eventSchema);
