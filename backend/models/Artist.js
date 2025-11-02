import mongoose from "mongoose";

const artistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  avatar: {
    type: String,
    default: "https://cdn-icons-png.flaticon.com/512/4825/4825038.png",
  },
  bio: { type: String, default: "" },
  followers: { type: Number, default: 0 },
  country: { type: String, default: "Vietnam" },
}, { timestamps: true });

export default mongoose.model("Artist", artistSchema);
