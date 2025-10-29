import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const router = express.Router(); // <-- BẮT BUỘC PHẢI CÓ DÒNG NÀY

// Đăng ký
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const exist = await User.findOne({ email });
    if (exist) return res.status(400).json({ message: "Email đã tồn tại" });

    const hashed = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashed });
    await newUser.save();

    res.json({ message: "Đăng ký thành công" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Đăng nhập
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Email không tồn tại" });

    const isMatch = password === user.password;
    if (!isMatch) return res.status(400).json({ message: "Mật khẩu sai" });

    res.json({ message: "Đăng nhập thành công", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router; // ✅ Export đúng
