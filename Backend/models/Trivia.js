// Trivia schema
import mongoose from "mongoose";

const triviaSchema = new mongoose.Schema({
  question: String,
  options: [String],
  answer: String
}, { timestamps: true });

export default mongoose.model("Trivia", triviaSchema);
