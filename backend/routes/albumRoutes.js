import express from "express";
import Album from "../models/Album.js";

const router = express.Router();

// ✅ Lấy toàn bộ album hoặc tìm kiếm theo từ khóa
router.get("/", async (req, res) => {
  try {
    const search = req.query.search?.trim();

    let query = {};
    if (search) {
      // 🔍 Nếu có từ khóa search, tìm theo tên hoặc nghệ sĩ (không phân biệt hoa thường)
      query = {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { artist: { $regex: search, $options: "i" } },
        ],
      };
    }

    const albums = await Album.find(query);
    res.json(albums);
  } catch (err) {
    res.status(500).json({
      message: "Lỗi tải danh sách album",
      error: err.message,
    });
  }
});

// ✅ Thêm mới album
router.post("/", async (req, res) => {
  try {
    const album = new Album(req.body);
    await album.save();
    res.status(201).json(album);
  } catch (err) {
    res.status(400).json({
      message: "Lỗi khi thêm album",
      error: err.message,
    });
  }
});

// ✅ Lấy danh sách album thuộc Charts
router.get("/charts", async (req, res) => {
  try {
    const charts = await Album.find({
      $or: [
        { genre: /chart/i },
        { name: /top/i },
        { name: /billboard/i },
        { name: /hot/i }
      ]
    });
    res.json(charts);
  } catch (err) {
    res.status(500).json({ message: "Lỗi tải charts albums" });
  }
});


export default router;
