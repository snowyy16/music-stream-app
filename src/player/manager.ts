// src/player/manager.ts
import { Audio } from "expo-av";

type Ref = { sound: Audio.Sound | null };

// Giữ tham chiếu đến sound đang phát trên toàn app
export const activeSoundRef: Ref = { sound: null };

// Dừng và giải phóng sound đang phát (nếu có)
export async function stopActiveSound() {
  try {
    if (activeSoundRef.sound) {
      await activeSoundRef.sound.stopAsync().catch(() => {});
      await activeSoundRef.sound.unloadAsync().catch(() => {});
    }
  } finally {
    activeSoundRef.sound = null;
  }
}

// 🔊 Hàm này sẽ load và phát bài mới
export async function loadAndPlay(song: { url: string }) {
  try {
    // Dừng bài cũ nếu có
    await stopActiveSound();

    // Tạo sound mới
    const { sound } = await Audio.Sound.createAsync(
      { uri: song.url },
      { shouldPlay: true } // tự động phát luôn
    );

    activeSoundRef.sound = sound;
    console.log("▶️ Đang phát:", song.url);
  } catch (error) {
    console.error("Lỗi loadAndPlay:", error);
  }
}
