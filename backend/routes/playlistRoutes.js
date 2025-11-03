import express from "express";
import Playlist from "../models/Playlist.js";

const router = express.Router();

// ✅ Lấy toàn bộ playlist
router.get("/", async (req, res) => {
  try {
    const playlists = await Playlist.find().populate("songs");
    res.json(playlists);
  } catch (err) {
    res.status(500).json({ message: "Lỗi tải danh sách playlist", error: err.message });
  }
});

// ✅ Thêm mới playlist
router.post("/", async (req, res) => {
  try {
    const playlist = new Playlist(req.body);
    await playlist.save();
    res.status(201).json(playlist);
  } catch (err) {
    res.status(400).json({ message: "Lỗi khi thêm playlist", error: err.message });
  }
});

// ✅ Xem chi tiết playlist
router.get("/:id", async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id).populate("songs");
    if (!playlist) return res.status(404).json({ message: "Không tìm thấy playlist" });
    res.json(playlist);
  } catch (err) {
    res.status(500).json({ message: "Lỗi tải chi tiết playlist", error: err.message });
  }
});

export default router;
