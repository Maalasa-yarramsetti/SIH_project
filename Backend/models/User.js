// User model schema
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true }, // hashed
  role: { type: String, enum: ["user", "admin", "ngo"], default: "user" },
  coins: { type: Number, default: 0 },
  favourites: {
    monasteries: [{ type: mongoose.Schema.Types.ObjectId, ref: "Monastery" }],
    archives: [{ type: mongoose.Schema.Types.ObjectId, ref: "Archive" }]
  },
  profilePic: { type: String, default: "" },
  phone: { type: String, default: "" }
}, { timestamps: true });

export default mongoose.model("User", userSchema);
