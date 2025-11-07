import express from "express";
import mongoose from "mongoose";
import Comment from "../models/Comment.js";
import User from "../models/User.js"; // ✅ import model User

const router = express.Router();

// 🧠 Lấy bình luận theo bài hát
router.get("/:songId", async (req, res) => {
  try {
    const comments = await Comment.find({ song: req.params.songId })
      .populate("user", "username avatar")
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) {
    console.error("❌ Lỗi khi lấy bình luận:", err);
    res.status(500).json({ message: "Lỗi khi lấy bình luận." });
  }
});

// ✍️ Thêm bình luận
router.post("/", async (req, res) => {
  try {
    const { song, user, text } = req.body;

    if (!song || !user || !text)
      return res.status(400).json({ message: "Thiếu dữ liệu bình luận." });

    // ✅ Kiểm tra user tồn tại
    const userDoc = await User.findById(user);
    if (!userDoc)
      return res.status(404).json({ message: "Người dùng không tồn tại." });

    // ✅ Tạo bình luận
    const comment = await Comment.create({ song, user, text });

    // ✅ Populate user để trả về avatar + username
    const populated = await comment.populate("user", "username avatar");
    res.status(201).json(populated);
  } catch (err) {
    console.error("❌ Lỗi khi thêm bình luận:", err);
    res.status(500).json({ message: "Không thể thêm bình luận." });
  }
});

export default router;
