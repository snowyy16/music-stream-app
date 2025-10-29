import express from "express";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const router = express.Router();

// ✅ Schema người dùng
const userSchema = new mongoose.Schema({
  username: String,
  email: { type: String, unique: true },
  password: String,
}, { timestamps: true });

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

    // ⚠️ Sửa ở đây: so sánh hash bằng bcrypt
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Mật khẩu sai" });

    // Ẩn mật khẩu khi trả về client
    const userData = user.toObject();
    delete userData.password;

    res.json({ message: "Đăng nhập thành công", user: userData });
  } catch (err) {
    console.error("❌ Lỗi đăng nhập:", err);
    res.status(500).json({ message: err.message });
  }
});

// ✅ Cập nhật thông tin người dùng
router.put("/update", async (req, res) => {
  try {
    const { email, username, avatar } = req.body;

    // Kiểm tra có đủ thông tin không
    if (!email || !username) {
      return res.status(400).json({ message: "Thiếu thông tin cập nhật" });
    }

    // Tìm và cập nhật
    const updatedUser = await User.findOneAndUpdate(
      { email },
      { username, avatar },
      { new: true } // Trả lại dữ liệu mới
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    res.json({
      message: "Cập nhật thông tin thành công",
      user: updatedUser,
    });
  } catch (err) {
    console.error("❌ Lỗi cập nhật:", err);
    res.status(500).json({ message: "Lỗi máy chủ khi cập nhật thông tin" });
  }
});


// ✅ Export mặc định (quan trọng)
export default router;
