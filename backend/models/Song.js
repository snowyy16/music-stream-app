import mongoose from "mongoose";

const songSchema = new mongoose.Schema({
  title: String,
  artist: String,
  image: String,
  url: String,
  category : String,
  albumName: { type: String, required: false },
});

export default mongoose.model("Song", songSchema);
