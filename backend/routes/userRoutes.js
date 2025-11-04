import express from "express";
import multer from "multer";
import path from "path";
import User from "../models/User.js";

const router = express.Router();

// ✅ Cấu hình nơi lưu file avatar
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/avatars");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// ✅ API upload avatar
router.post("/upload-avatar/:id", upload.single("avatar"), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "Không tìm thấy user" });

    // 🔹 Cập nhật avatar nếu có file
    if (req.file) {
      user.avatar = req.file.filename; // chỉ lưu tên file
    }

    // 🔹 Cập nhật thêm thông tin nếu có
    if (req.body.username) user.username = req.body.username;
    if (req.body.email) user.email = req.body.email;

    await user.save(); // ✅ Lưu lại database

    res.json({
      message: "Upload avatar thành công",
      avatar: user.avatar,
    });
  } catch (err) {
    res.status(500).json({
      message: "Lỗi khi upload avatar",
      error: err.message,
    });
  }
});

export default router;
