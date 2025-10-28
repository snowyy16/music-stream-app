import React, { useEffect, useState } from "react";
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

const { width } = Dimensions.get("window");

export default function PlayScreen({ route, navigation }: any) {
  const song = route?.params?.song || {
    title: "Let You Free",
    artist: "Ryan Young",
    image: "http://192.168.1.66:4000/image/ShapeOfYou.png",
    url: "http://192.168.1.66:4000/music/ShapeOfYou.mp3",
  };

  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(1); // tránh chia 0

  // ✅ Cấu hình Audio Mode cho iOS
  useEffect(() => {
    (async () => {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          staysActiveInBackground: false,
          playsInSilentModeIOS: true,
        });
      } catch (e) {
        console.log("Lỗi cấu hình AudioMode:", e);
      }
    })();

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  // 🎧 Hàm phát / tạm dừng nhạc
  async function playSound() {
    try {
      if (sound) {
        if (isPlaying) {
          await sound.pauseAsync();
          setIsPlaying(false);
        } else {
          await sound.playAsync();
          setIsPlaying(true);
        }
      } else {
        setLoading(true);
        console.log("▶ Đang tải nhạc từ:", song.url);

        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: song.url },
          { shouldPlay: true },
          onPlaybackStatusUpdate
        );

        const status = await newSound.getStatusAsync();
        if (status.isLoaded) setDuration(status.durationMillis || 1);

        setSound(newSound);
        setIsPlaying(true);
      }
    } catch (error: any) {
      console.error("❌ Lỗi phát nhạc:", error);
      Alert.alert(
        "Lỗi phát nhạc",
        "Không thể phát bài hát. Kiểm tra lại kết nối hoặc URL."
      );
    } finally {
      setLoading(false);
    }
  }

  // 🕐 Cập nhật tiến trình phát nhạc
  const onPlaybackStatusUpdate = (status: any) => {
    if (status.isLoaded && status.positionMillis && status.durationMillis) {
      setPosition(status.positionMillis);
      setDuration(status.durationMillis);
      if (status.didJustFinish) setIsPlaying(false);
    }
  };

  // 🔁 Khi kéo slider
  const onSlideComplete = async (value: number) => {
    if (sound) {
      await sound.setPositionAsync(value);
    }
  };

  // 🧮 Format thời gian (mm:ss)
  const formatTime = (millis: number) => {
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Nền mờ từ ảnh bài hát */}
      <Image
        source={{ uri: song.image }}
        style={StyleSheet.absoluteFillObject}
        blurRadius={25}
      />

      {/* Lớp phủ đen nhẹ */}
      <View style={styles.overlay} />

      {/* Nội dung chính */}
      <View style={styles.content}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={28} color="#fff" />
        </TouchableOpacity>

        {/* Ảnh bìa */}
        <Image source={{ uri: song.image }} style={styles.cover} />

        {/* Thông tin bài hát */}
        <View style={styles.info}>
          <Text style={styles.title}>{song.title}</Text>
          <Text style={styles.artist}>{song.artist}</Text>
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

        {/* Nút phát / dừng */}
        {loading ? (
          <ActivityIndicator size="large" color="#fff" />
        ) : (
          <TouchableOpacity style={styles.playBtn} onPress={playSound}>
            <Ionicons
              name={isPlaying ? "pause" : "play"}
              size={42}
              color="#111827"
            />
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
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
  backBtn: {
    position: "absolute",
    top: 60,
    left: 25,
    zIndex: 10,
  },
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
  info: {
    alignItems: "center",
    marginTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
  },
  artist: {
    fontSize: 16,
    color: "#ccc",
    marginTop: 6,
  },
  sliderContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: width * 0.85,
  },
  time: {
    color: "#aaa",
    fontSize: 13,
  },
  playBtn: {
    backgroundColor: "#fff",
    borderRadius: 50,
    width: 80,
    height: 80,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});
