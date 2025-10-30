import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { usePlayer } from "../player/store";

const { width } = Dimensions.get("window");

export default function MiniPlayer() {
  const navigation = useNavigation<any>();
  const { song, isPlaying, position, duration, togglePlayPause, queue, index } =
    usePlayer(); // ✅ bỏ next, prev

  if (!song) return null;

  const progress = duration > 0 ? Math.min(1, position / duration) : 0;

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() =>
        navigation.navigate("PlayScreen", {
          song,
          queue,
          index,
        })
      }
      style={styles.container}
    >
      {/* Thanh tiến trình */}
      <View
        style={[styles.progress, { width: Math.max(12, progress * width) }]}
      />

      <View style={styles.row}>
        {/* Ảnh bài hát */}
        <Image source={{ uri: song.image }} style={styles.cover} />

        {/* Thông tin bài hát */}
        <View style={styles.info}>
          <Text numberOfLines={1} style={styles.title}>
            {song.title}
          </Text>
          <Text numberOfLines={1} style={styles.artist}>
            {song.artist}
          </Text>
        </View>

        {/* ✅ Chỉ giữ nút Play/Pause */}
        <TouchableOpacity onPress={togglePlayPause} style={styles.iconBtn}>
          <Ionicons
            name={isPlaying ? "pause" : "play"}
            size={22}
            color="#111827"
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 12,
    right: 12,
    bottom: 64,
    backgroundColor: "#fff",
    borderRadius: 14,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  cover: {
    width: 44,
    height: 44,
    borderRadius: 8,
    marginRight: 10,
    backgroundColor: "#eee",
  },
  info: { flex: 1, justifyContent: "center" },
  title: { fontSize: 14, fontWeight: "700", color: "#111827" },
  artist: { fontSize: 12, color: "#6B7280", marginTop: 2 },
  iconBtn: { paddingHorizontal: 10, paddingVertical: 4 }, // ✅ căn giữa đẹp hơn
  progress: { height: 2, backgroundColor: "#1DB954" },
});
