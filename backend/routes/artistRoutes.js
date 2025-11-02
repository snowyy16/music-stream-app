import express from "express";
import Artist from "../models/Artist.js";

const router = express.Router();

// Lấy danh sách nghệ sĩ
router.get("/", async (req, res) => {
  try {
    const artists = await Artist.find().sort({ createdAt: -1 });
    res.json(artists);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server khi lấy danh sách nghệ sĩ." });
  }
});

// Thêm nghệ sĩ mới
router.post("/", async (req, res) => {
  try {
    const newArtist = await Artist.create(req.body);
    res.json(newArtist);
  } catch (err) {
    res.status(400).json({ message: "Không thể thêm nghệ sĩ." });
  }
});

export default router;
