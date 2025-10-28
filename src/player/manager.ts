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
