import express from "express";
import Song from "../models/Song.js";

const router = express.Router();

// 👉 Lấy danh sách bài hát và tự động ghép BASE_URL
router.get("/", async (req, res) => {
  try {
    const songs = await Song.find();
    const baseUrl = `${req.protocol}://${req.hostname}:4000`;

    const formatted = songs.map((s) => ({
      _id: s._id,
      title: s.title,
      artist: s.artist,
      image: s.image.startsWith("http")
        ? s.image
        : `${baseUrl}/image/${s.image}`,
      url: s.url.startsWith("http") ? s.url : `${baseUrl}/music/${s.url}`,
    }));

    res.json(formatted);
  } catch (err) {
    console.error("❌ Lỗi lấy danh sách bài hát:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

export default router;
