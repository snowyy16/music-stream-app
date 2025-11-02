import express from "express";
import Album from "../models/Album.js";

const router = express.Router();

// ✅ Lấy toàn bộ album
router.get("/", async (req, res) => {
  try {
    const albums = await Album.find();
    res.json(albums);
  } catch (err) {
    res.status(500).json({ message: "Lỗi tải danh sách album", error: err.message });
  }
});

// ✅ Thêm mới album
router.post("/", async (req, res) => {
  try {
    const album = new Album(req.body);
    await album.save();
    res.status(201).json(album);
  } catch (err) {
    res.status(400).json({ message: "Lỗi khi thêm album", error: err.message });
  }
});

export default router;
