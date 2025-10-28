import mongoose from "mongoose";

const songSchema = new mongoose.Schema({
  title: String,
  artist: String,
  image: String,
  url: String,
});

export default mongoose.model("Song", songSchema);
