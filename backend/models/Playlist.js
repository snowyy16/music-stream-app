import mongoose from "mongoose";

const playlistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  cover: {
    type: String,
    default: "", // ảnh bìa
  },
  songs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Song", // liên kết sang collection Song
    },
  ],
  owner: {
    type: String,
    default: "System",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Playlist = mongoose.model("Playlist", playlistSchema);
export default Playlist;
