import express from "express";
import Chart from "../models/Chart.js";
import Album from "../models/Album.js";
import Song from "../models/Song.js";

const router = express.Router();

// ✅ Lấy tất cả charts
router.get("/", async (req, res) => {
  try {
    const charts = await Chart.find()
      .populate("albums", "name cover artist")
      .populate("songs", "title artist image url");
    res.json(charts);
  } catch (err) {
    res.status(500).json({ message: "Lỗi tải charts", error: err.message });
  }
});

// ✅ Thêm mới chart
router.post("/", async (req, res) => {
  try {
    const chart = new Chart(req.body);
    await chart.save();
    res.status(201).json(chart);
  } catch (err) {
    res.status(400).json({ message: "Lỗi khi thêm chart", error: err.message });
  }
});

// ✅ Lấy chart cụ thể
router.get("/:id", async (req, res) => {
  try {
    const chart = await Chart.findById(req.params.id)
      .populate("albums", "name cover artist")
      .populate("songs", "title artist image url");
    res.json(chart);
  } catch (err) {
    res.status(404).json({ message: "Chart không tồn tại", error: err.message });
  }
});

export default router;
