import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import songRoutes from "./routes/songRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Cấu hình đường dẫn tuyệt đối
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/api/auth", authRoutes);      

// Config đường dẫn tuyệt đối cho /music
app.use(
  "/music",
  express.static(path.join(__dirname, "music"), {
    setHeaders: (res) => {
      res.set("Content-Type", "audio/mpeg");
    },
  })
);


// Public thư mục chứa ảnh
app.use("/image", express.static(path.join(__dirname, "image")));

// ⚡ Quan trọng 2: Cho phép iPhone truy cập qua mạng LAN
app.listen(process.env.PORT || 4000, "0.0.0.0", () => {
  console.log("🚀 Server chạy tại:");
  console.log("👉 http://localhost:4000");
  console.log("👉 http://192.168.1.66:4000");
});

// MongoDB
mongoose
  .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/musicdb")
  .then(() => console.log("✅ Đã kết nối MongoDB"))
  .catch((err) => console.log("❌ Lỗi MongoDB:", err));

// Routes
app.use("/api/songs", songRoutes);

app.get("/", (req, res) => res.send("🎶 API chạy tốt"));
