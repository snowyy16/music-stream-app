// src/screens/PlayScreen.tsx
import React, { useEffect, useState, useCallback, useRef } from "react";
import { withFullUrl, ensureHttpUrl } from "../utils/url";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { Audio } from "expo-av";
import { activeSoundRef, stopActiveSound } from "../player/manager";
import { usePlayer } from "../player/store";

const { width } = Dimensions.get("window");

type Song = {
  _id?: string;
  title: string;
  artist: string;
  image: string;
  url: string;
};

type Props = {
  route: {
    params?: {
      song?: Song;
      queue?: Song[];
      index?: number;
    };
  };
  navigation: any;
};

export default function PlayScreen({ route, navigation }: Props) {
  const player = usePlayer();

  // ------ Params & queue ------
  const rawSong =
    route?.params?.song ||
    ({
      title: "Let You Free",
      artist: "Ryan Young",
      image: "http://192.168.1.54:4000/image/ShapeOfYou.png",
      url: "http://192.168.1.54:4000/music/ShapeOfYou.mp3",
    } as Song);

  const initialQueue = (route?.params?.queue || [rawSong]).map(withFullUrl);
  const initialIndex =
    typeof route?.params?.index === "number" ? route.params!.index! : 0;

  const [queue] = useState<Song[]>(initialQueue);
  const [currentIndex, setCurrentIndex] = useState<number>(
    Math.min(Math.max(initialIndex, 0), initialQueue.length - 1)
  );
  const [current, setCurrent] = useState<Song>(initialQueue[currentIndex]);

  // ------ Audio state ------
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(1);

  // tránh race khi next/prev nhanh
  const loadingRef = useRef(false);

  // ------ Audio mode ------
  useEffect(() => {
    (async () => {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          staysActiveInBackground: false,
          playsInSilentModeIOS: true,
          // ✅ Tương thích nhiều SDK (enum mới/cũ)
          interruptionModeIOS:
            (Audio as any).IOSAudioInterruptionMode?.DoNotMix ??
            (Audio as any).INTERRUPTION_MODE_IOS_DO_NOT_MIX ??
            1,
          interruptionModeAndroid:
            (Audio as any).AndroidAudioInterruptionMode?.DoNotMix ??
            (Audio as any).INTERRUPTION_MODE_ANDROID_DO_NOT_MIX ??
            1,
          shouldDuckAndroid: true,
        });
      } catch (e) {
        console.log("Lỗi cấu hình AudioMode:", e);
      }
    })();

    return () => {
      if (sound) {
        sound.stopAsync().catch(() => {});
        sound.unloadAsync().catch(() => {});
      }
      if (activeSoundRef.sound === sound) {
        activeSoundRef.sound = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ------ Helper: load & play 1 bài ------
  const onPlaybackStatusUpdate = (status: any) => {
    if (
      status?.isLoaded &&
      typeof status.positionMillis === "number" &&
      typeof status.durationMillis === "number"
    ) {
      setPosition(status.positionMillis);
      setDuration(status.durationMillis || 1);
      setIsPlaying(!!status.isPlaying);

      // đồng bộ MiniPlayer
      player.updateProgress({
        position: status.positionMillis,
        duration: status.durationMillis || 1,
        isPlaying: !!status.isPlaying,
      });

      if (status.didJustFinish) {
        setTimeout(() => handleNext(), 500);
      }
    }
  };

  const loadAndPlay = useCallback(
    async (song: Song, autoPlay = true) => {
      if (loadingRef.current) return;
      loadingRef.current = true;
      setLoading(true);
      try {
        // Dừng mọi sound đang phát ở bất kỳ màn nào
        await stopActiveSound();

        // Dọn sound cũ của màn này (nếu còn)
        if (sound) {
          await sound.unloadAsync().catch(() => {});
          setSound(null);
        }

        const normalized = withFullUrl(song);
        const streamUrl = ensureHttpUrl(normalized.url);
        if (!streamUrl) {
          Alert.alert("URL không hợp lệ", JSON.stringify(normalized, null, 2));
          setIsPlaying(false);
          return;
        }

        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: streamUrl },
          { shouldPlay: autoPlay },
          onPlaybackStatusUpdate
        );

        const st: any = await newSound.getStatusAsync();
        setDuration(st?.durationMillis || 1);
        setPosition(st?.positionMillis || 0);

        setSound(newSound);
        activeSoundRef.sound = newSound; // gắn sound hiện hành toàn cục
        setIsPlaying(!!autoPlay);

        // cập nhật MiniPlayer ngay khi load
        player.setNowPlaying({
          song: normalized,
          queue,
          index: currentIndex,
          isPlaying: !!autoPlay,
          position: st?.positionMillis || 0,
          duration: st?.durationMillis || 1,
        });
      } catch (e) {
        console.error("❌ loadAndPlay error:", e);
        setIsPlaying(false);
        Alert.alert("Lỗi phát nhạc", "Không thể phát bài hát hiện tại.");
      } finally {
        setLoading(false);
        loadingRef.current = false;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sound, currentIndex, queue]
  );

  // Lần đầu & khi đổi index
  useEffect(() => {
    setCurrent(queue[currentIndex]);
    // hiển thị ngay trên MiniPlayer trước khi play xong
    player.setNowPlaying({
      song: queue[currentIndex],
      queue,
      index: currentIndex,
    });
    loadAndPlay(queue[currentIndex], true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex]);

  useEffect(() => {
    setCurrent(queue[currentIndex]);
    player.setNowPlaying({
      song: queue[currentIndex],
      queue,
      index: currentIndex,
    });
    loadAndPlay(queue[currentIndex], true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ------ Controls ------
  const togglePlay = async () => {
    try {
      if (!sound) {
        await loadAndPlay(current, true);
        return;
      }
      const st: any = await sound.getStatusAsync();
      if (!st.isLoaded) {
        await loadAndPlay(current, true);
        return;
      }
      if (st.isPlaying) {
        await sound.pauseAsync();
        setIsPlaying(false);
        player.updateProgress({ isPlaying: false });
      } else {
        await sound.playAsync();
        setIsPlaying(true);
        player.updateProgress({ isPlaying: true });
      }
    } catch (e) {
      console.error("togglePlay error:", e);
    }
  };

  const onSlideComplete = async (value: number) => {
    if (sound) {
      await sound.setPositionAsync(value);
      setPosition(value);
      player.updateProgress({ position: value });
    }
  };

  const handleNext = useCallback(async () => {
    if (loadingRef.current || !queue.length) return;
    loadingRef.current = true;

    try {
      const nextIndex = (currentIndex + 1) % queue.length;
      setCurrentIndex(nextIndex);

      player.setNowPlaying({
        song: queue[nextIndex],
        queue,
        index: nextIndex,
        isPlaying: true,
      });

      // dọn sound cũ
      if (sound) {
        await sound.stopAsync().catch(() => {});
        await sound.unloadAsync().catch(() => {});
        setSound(null);
      }

      // phát bài tiếp theo
      await loadAndPlay(queue[nextIndex], true);
    } catch (e) {
      console.error("handleNext error:", e);
    } finally {
      loadingRef.current = false;
    }
  }, [queue, currentIndex, sound, loadAndPlay]);

  const handlePrev = useCallback(async () => {
    if (loadingRef.current || !queue.length) return;
    loadingRef.current = true;

    try {
      // Nếu bài hiện tại mới phát < 3s thì quay lại bài trước, ngược lại thì tua về đầu
      if (position > 3000 && sound) {
        await sound.setPositionAsync(0);
        setPosition(0);
        player.updateProgress({ position: 0 });
        return;
      }

      const prevIndex = (currentIndex - 1 + queue.length) % queue.length;
      setCurrentIndex(prevIndex);
      player.setNowPlaying({
        song: queue[prevIndex],
        queue,
        index: prevIndex,
        isPlaying: true,
      });

      if (sound) {
        await sound.stopAsync().catch(() => {});
        await sound.unloadAsync().catch(() => {});
        setSound(null);
      }

      await loadAndPlay(queue[prevIndex], true);
    } catch (e) {
      console.error("handlePrev error:", e);
    } finally {
      loadingRef.current = false;
    }
  }, [queue, currentIndex, sound, position, player, loadAndPlay]);
  // ------ UI ------
  const formatTime = (millis: number) => {
    const total = Math.max(0, Math.floor(millis / 1000));
    const m = Math.floor(total / 60);
    const s = total % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Nền mờ */}
      <Image
        source={{ uri: current.image }}
        style={StyleSheet.absoluteFillObject}
        blurRadius={25}
      />
      <View style={styles.overlay} />

      <View style={styles.content}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={28} color="#fff" />
        </TouchableOpacity>

        {/* Ảnh bìa */}
        <Image source={{ uri: current.image }} style={styles.cover} />

        {/* Thông tin */}
        <View style={styles.info}>
          <Text style={styles.title}>{current.title}</Text>
          <Text style={styles.artist}>{current.artist}</Text>
        </View>

        {/* Thanh tiến trình */}
        <View style={styles.sliderContainer}>
          <Slider
            style={{ width: width * 0.85, height: 40 }}
            minimumValue={0}
            maximumValue={duration}
            value={position}
            onSlidingComplete={onSlideComplete}
            minimumTrackTintColor="#fff"
            maximumTrackTintColor="#888"
            thumbTintColor="#fff"
          />
          <View style={styles.timeRow}>
            <Text style={styles.time}>{formatTime(position)}</Text>
            <Text style={styles.time}>{formatTime(duration)}</Text>
          </View>
        </View>

        {/* Điều khiển: Prev / Play-Pause / Next */}
        <View style={styles.controlsRow}>
          <TouchableOpacity
            style={[styles.ctrlBtn, queue.length <= 1 && { opacity: 0.6 }]}
            onPress={handlePrev}
            disabled={queue.length <= 1 || loading}
          >
            <Ionicons name="play-skip-back" size={34} color="#fff" />
          </TouchableOpacity>

          {loading ? (
            <ActivityIndicator size="large" color="#fff" />
          ) : (
            <TouchableOpacity style={styles.playBtn} onPress={togglePlay}>
              <Ionicons
                name={isPlaying ? "pause" : "play"}
                size={42}
                color="#111827"
              />
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.ctrlBtn, queue.length <= 1 && { opacity: 0.6 }]}
            onPress={handleNext}
            disabled={queue.length <= 1 || loading}
          >
            <Ionicons name="play-skip-forward" size={34} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 40,
  },
  backBtn: { position: "absolute", top: 60, left: 25, zIndex: 10 },
  cover: {
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: 20,
    marginTop: 80,
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  info: { alignItems: "center", marginTop: 40 },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
  },
  artist: { fontSize: 16, color: "#ccc", marginTop: 6 },
  sliderContainer: { alignItems: "center", marginTop: 20 },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: width * 0.85,
  },
  time: { color: "#aaa", fontSize: 13 },
  controlsRow: {
    width: width * 0.9,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 90,
  },
  ctrlBtn: { padding: 10 },
  playBtn: {
    backgroundColor: "#fff",
    borderRadius: 50,
    width: 80,
    height: 80,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});
