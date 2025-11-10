import express from "express";
import multer from "multer";
import path from "path";
import Playlist from "../models/Playlist.js";

const router = express.Router();

// ⚙️ Cấu hình nơi lưu và tên file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join("uploads", "playlists"));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, filename);
  },
});

const upload = multer({ storage });

// ✅ Lấy toàn bộ playlist
router.get("/", async (req, res) => {
  try {
    const playlists = await Playlist.find().populate("songs");
    res.json(playlists);
  } catch (err) {
    res.status(500).json({ message: "Lỗi tải danh sách playlist", error: err.message });
  }
});

// ✅ Thêm mới playlist (có thể kèm ảnh bìa)
router.post("/", upload.single("cover"), async (req, res) => {
  try {
    const { name, description, owner } = req.body;
    const cover = req.file ? `/uploads/playlists/${req.file.filename}` : "";
    const playlist = new Playlist({
      name,
      description,
      cover,
      owner: owner || "System",
    });

    await playlist.save();
    res.status(201).json(playlist);
  } catch (err) {
    console.error("❌ Lỗi thêm playlist:", err);
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

// Thêm bài hát vào playlist
router.post("/:id/add-song", async (req, res) => {
  try {
    const { id } = req.params;
    const { songId } = req.body;

    const playlist = await Playlist.findById(id);
    if (!playlist) return res.status(404).json({ message: "Playlist không tồn tại" });

    if (!playlist.songs.includes(songId)) {
      playlist.songs.push(songId);
      await playlist.save();
    }

    res.json({ message: "Đã thêm bài hát vào playlist", playlist });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err });
  }
});


export default router;
