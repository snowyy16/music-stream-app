import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  song: { type: mongoose.Schema.Types.ObjectId, ref: "Song", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true },
  likes: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model("Comment", commentSchema);
