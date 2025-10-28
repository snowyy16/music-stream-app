import express from "express";
import Song from "../models/Song.js";

const router = express.Router();

// ✅ Lấy danh sách bài hát (có hỗ trợ search + category)
router.get("/", async (req, res) => {
  try {
    const { search, category } = req.query;

    const query = {};

    // Nếu có tìm kiếm theo tên hoặc nghệ sĩ
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { artist: { $regex: search, $options: "i" } },
      ];
    }

    // Nếu có lọc theo thể loại
    if (category) {
      query.category = category;
    }

    const songs = await Song.find(query);
    res.json(songs);
  } catch (error) {
    console.error("❌ Lỗi lấy danh sách bài hát:", error);
    res.status(500).json({ message: "Lỗi server khi lấy danh sách bài hát." });
  }
});

// ✅ Thêm bài hát mới
router.post("/", async (req, res) => {
  try {
    const newSong = await Song.create(req.body);
    res.json(newSong);
  } catch (error) {
    console.error("❌ Lỗi thêm bài hát:", error);
    res.status(500).json({ message: "Không thể thêm bài hát." });
  }
});

export default router;
