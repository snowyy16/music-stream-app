import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcryptjs";

const app = express();
app.use(cors());
app.use(express.json());

// Kết nối Mongo
mongoose.connect("mongodb://127.0.0.1:27017/musicdb");

// Schema người dùng
const userSchema = new mongoose.Schema({
  username: String,
  email: { type: String, unique: true },
  password: String,
});
const User = mongoose.model("User", userSchema);

// Đăng ký
app.post("/api/auth/register", async (req, res) => {
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

// ✅ Đăng nhập
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Email không tồn tại" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Mật khẩu sai" });

    res.json({ message: "Đăng nhập thành công", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(4000, () => console.log("✅ Server chạy tại cổng 4000"));
