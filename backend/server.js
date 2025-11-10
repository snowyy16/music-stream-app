import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import songRoutes from "./routes/songRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import artistRoutes from "./routes/artistRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import albumRoutes from "./routes/albumRoutes.js";
import playlistRoutes from "./routes/playlistRoutes.js";
import chartRoutes from "./routes/chartRoutes.js";
import userRoutes from "./routes/userRoutes.js";





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

// ✅ Static serve đặt TRƯỚC routes
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/image", express.static(path.join(__dirname, "image")));
app.use(
  "/image/avatars",
  express.static(path.join(__dirname, "uploads/avatars"))
);
app.use(
  "/music",
  express.static(path.join(__dirname, "music"), {
    setHeaders: (res) => res.set("Content-Type", "audio/mpeg"),
  })
);

// ✅ Sau đó mới tới API routes
app.use("/api/auth", authRoutes);
app.use("/api/songs", songRoutes);
app.use("/api/artists", artistRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/albums", albumRoutes);
app.use("/api/playlists", playlistRoutes);
app.use("/api/charts", chartRoutes);
app.use("/api/users", userRoutes);
app.get("/", (req, res) => res.send("🎶 API chạy tốt"));

app.listen(process.env.PORT || 4000, "0.0.0.0", () => {
  console.log("🚀 Server chạy tại:");
  console.log("👉 http://localhost:4000");
  console.log("👉 http://192.168.1.23:4000");
});
