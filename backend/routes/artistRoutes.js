import express from "express";
import Artist from "../models/Artist.js";
import Song from "../models/Song.js";

const router = express.Router();

// 🧩 Lấy danh sách nghệ sĩ (chỉ trả tên file ảnh, không gắn IP)
router.get("/", async (req, res) => {
  try {
    const artists = await Artist.find().sort({ createdAt: -1 });

    const data = artists.map((a) => ({
      ...a._doc,
      avatar: a.avatar?.trim?.() || "default.jpg", // chỉ giữ tên file
    }));

    res.json(data);
  } catch (err) {
    console.error("❌ Lỗi lấy danh sách nghệ sĩ:", err);
    res.status(500).json({ message: "Lỗi server khi lấy danh sách nghệ sĩ." });
  }
});

// 🧩 Lấy bài hát theo nghệ sĩ
router.get("/:id/songs", async (req, res) => {
  try {
    const artist = await Artist.findById(req.params.id);
    if (!artist) {
      return res.status(404).json({ message: "Không tìm thấy nghệ sĩ." });
    }

    // Tìm các bài hát có tên nghệ sĩ trùng
    const songs = await Song.find({ artist: artist.name });
    res.json(songs);
  } catch (err) {
    console.error("❌ Lỗi lấy bài hát của nghệ sĩ:", err);
    res.status(500).json({ message: "Lỗi server khi lấy bài hát của nghệ sĩ." });
  }
});

// 🧩 Thêm nghệ sĩ mới
router.post("/", async (req, res) => {
  try {
    const newArtist = await Artist.create(req.body);
    res.json(newArtist);
  } catch (err) {
    console.error("❌ Lỗi thêm nghệ sĩ:", err);
    res.status(400).json({ message: "Không thể thêm nghệ sĩ." });
  }
});

// server/routes/artistRoutes.js
router.post("/:id/follow", async (req, res) => {
  const { userId } = req.body; // id người dùng gửi lên
  const artist = await Artist.findById(req.params.id);
  if (!artist) return res.status(404).json({ success: false, message: "Artist not found" });

  const hasFollowed = artist.followersList.includes(userId);

  if (hasFollowed) {
    // ❌ Nếu đã follow → unfollow
    artist.followersList = artist.followersList.filter(id => id !== userId);
    artist.followers -= 1;
    await artist.save();
    return res.json({ success: true, followers: artist.followers, followed: false });
  } else {
    // ✅ Nếu chưa follow → follow
    artist.followersList.push(userId);
    artist.followers += 1;
    await artist.save();
    return res.json({ success: true, followers: artist.followers, followed: true });
  }
});

// ✅ Kiểm tra xem user đã follow nghệ sĩ chưa
router.get("/:id/isFollowed", async (req, res) => {
  const { userId } = req.query; // lấy userId từ query
  try {
    const artist = await Artist.findById(req.params.id);
    if (!artist) {
      return res
        .status(404)
        .json({ success: false, message: "Artist not found" });
    }

    // Nếu chưa có danh sách followersList thì gán rỗng
    const hasFollowed = artist.followersList?.includes(userId) || false;
    return res.json({ success: true, followed: hasFollowed });
  } catch (err) {
    console.error("❌ Lỗi kiểm tra follow:", err);
    res
      .status(500)
      .json({ success: false, message: "Lỗi server khi kiểm tra follow." });
  }
});

// ✅ Tìm kiếm nghệ sĩ theo từ khóa
router.get("/search", async (req, res) => {
  try {
    const search = req.query.q?.trim();
    if (!search) return res.json([]);

    const artists = await Artist.find({
      name: { $regex: search, $options: "i" },
    });

    res.json(artists);
  } catch (err) {
    console.error("❌ Lỗi tìm kiếm nghệ sĩ:", err);
    res.status(500).json({ message: "Lỗi server khi tìm kiếm nghệ sĩ." });
  }
});


export default router;
