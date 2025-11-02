import express from "express";
import Comment from "../models/Comment.js";

const router = express.Router();

// Lấy bình luận theo bài hát
router.get("/:songId", async (req, res) => {
  try {
    const comments = await Comment.find({ song: req.params.songId })
      .populate("user", "username avatar")
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi lấy bình luận." });
  }
});

// Thêm bình luận
router.post("/", async (req, res) => {
  try {
    const { song, user, text } = req.body;
    if (!song || !user || !text)
      return res.status(400).json({ message: "Thiếu dữ liệu bình luận." });

    const comment = await Comment.create({ song, user, text });
    res.json(comment);
  } catch (err) {
    res.status(400).json({ message: "Không thể thêm bình luận." });
  }
});

export default router;
