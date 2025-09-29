// Archive schema
import mongoose from "mongoose";

const archiveSchema = new mongoose.Schema({
  type: { type: String, enum: ["mural", "manuscript", "artwork"], required: true },
  monasteryId: { type: mongoose.Schema.Types.ObjectId, ref: "Monastery" },
  title: String,
  description: String,
  image: String
}, { timestamps: true });

export default mongoose.model("Archive", archiveSchema);
