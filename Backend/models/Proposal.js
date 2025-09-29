// Proposal schema
import mongoose from "mongoose";

const proposalSchema = new mongoose.Schema({
  ngoId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  monasteryId: { type: mongoose.Schema.Types.ObjectId, ref: "Monastery" },
  proposalText: String,
  status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model("Proposal", proposalSchema);
