import mongoose from "mongoose";

const albumSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    artist: { type: String, required: true },
    cover: { type: String, required: true },
    year: { type: Number },
    genre: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Album", albumSchema);
