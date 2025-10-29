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

// ✅ Kết nối MongoDB TRƯỚC khi dùng routes
mongoose
  .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/musicdb")
  .then(() => console.log("✅ Đã kết nối MongoDB"))
  .catch((err) => console.log("❌ Lỗi MongoDB:", err));

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/songs", songRoutes);

// ✅ Public file tĩnh
app.use(
  "/music",
  express.static(path.join(__dirname, "music"), {
    setHeaders: (res) => res.set("Content-Type", "audio/mpeg"),
  })
);
app.use("/image", express.static(path.join(__dirname, "image")));

app.get("/", (req, res) => res.send("🎶 API chạy tốt"));

app.listen(process.env.PORT || 4000, "0.0.0.0", () => {
  console.log("🚀 Server chạy tại:");
  console.log("👉 http://localhost:4000");
  console.log("👉 http://192.168.1.22:4000");
});
