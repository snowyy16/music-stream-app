import express from "express";
import Artist from "../models/Artist.js";
import Song from "../models/Song.js";

const router = express.Router();

// 🧩 Lấy danh sách nghệ sĩ (chỉ trả tên file ảnh, không gắn IP)
router.get("/", async (req, res) => {
  try {
    const artists = await Artist.find().sort({ createdAt: -1 });

    const data = artists.map((a) => ({
      ...a._doc,
      avatar: a.avatar?.trim?.() || "default.jpg", // chỉ giữ tên file
    }));

    res.json(data);
  } catch (err) {
    console.error("❌ Lỗi lấy danh sách nghệ sĩ:", err);
    res.status(500).json({ message: "Lỗi server khi lấy danh sách nghệ sĩ." });
  }
});

// 🧩 Lấy bài hát theo nghệ sĩ
router.get("/:id/songs", async (req, res) => {
  try {
    const artist = await Artist.findById(req.params.id);
    if (!artist) {
      return res.status(404).json({ message: "Không tìm thấy nghệ sĩ." });
    }

    // Tìm các bài hát có tên nghệ sĩ trùng
    const songs = await Song.find({ artist: artist.name });
    res.json(songs);
  } catch (err) {
    console.error("❌ Lỗi lấy bài hát của nghệ sĩ:", err);
    res.status(500).json({ message: "Lỗi server khi lấy bài hát của nghệ sĩ." });
  }
});

// 🧩 Thêm nghệ sĩ mới
router.post("/", async (req, res) => {
  try {
    const newArtist = await Artist.create(req.body);
    res.json(newArtist);
  } catch (err) {
    console.error("❌ Lỗi thêm nghệ sĩ:", err);
    res.status(400).json({ message: "Không thể thêm nghệ sĩ." });
  }
});

// 🧩 Route tăng lượt followers
router.post("/:id/follow", async (req, res) => {
  try {
    const artist = await Artist.findById(req.params.id);
    if (!artist) {
      return res.status(404).json({ message: "Artist not found" });
    }

    artist.followers = (artist.followers || 0) + 1;
    await artist.save();

    res.json({ success: true, followers: artist.followers });
  } catch (err) {
    console.error("❌ Lỗi khi follow nghệ sĩ:", err);
    res.status(500).json({ message: "Server error" });
  }
});




export default router;
