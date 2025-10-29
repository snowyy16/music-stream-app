import express from "express";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const router = express.Router();

// ✅ Schema người dùng
const userSchema = new mongoose.Schema({
  username: String,
  email: { type: String, unique: true },
  password: String,
});

const User = mongoose.model("User", userSchema);

// ✅ Đăng ký
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
    console.error("❌ Lỗi đăng ký:", err);
    res.status(500).json({ message: err.message });
  }
});

// ✅ Đăng nhập
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Email không tồn tại" });

    const isMatch = password === user.password;
    if (!isMatch) return res.status(400).json({ message: "Mật khẩu sai" });

    res.json({ message: "Đăng nhập thành công", user });
  } catch (err) {
    console.error("❌ Lỗi đăng nhập:", err);
    res.status(500).json({ message: err.message });
  }
});

// ✅ Export mặc định (quan trọng)
export default router;
