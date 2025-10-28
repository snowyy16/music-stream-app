// src/screens/LibraryScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { BASE_URL } from "../config";
import colors from "../theme/colors";
import { withFullUrl } from "../utils/url";

interface Song {
  _id: string;
  title: string;
  artist: string;
  image: string;
  url: string;
}

export default function LibraryScreen() {
  const navigation = useNavigation<any>();
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/songs`);
        const data: Song[] = await res.json();
        // 🔧 Normalize URL (image/url) để tránh lỗi -1002
        setSongs(data.map(withFullUrl));
      } catch (err) {
        console.error("❌ Lỗi tải bài hát:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSongs();
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center" }]}>
        <ActivityIndicator size="large" color={colors?.primary || "#111827"} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Your Library</Text>

      {/* --- Tabs --- */}
      <View style={styles.tabs}>
        {["Playlists", "New tag", "Songs", "Albums", "Artists"].map((tab) => (
          <TouchableOpacity key={tab} style={styles.tab}>
            <Text style={[styles.tabText, tab === "Songs" && styles.tabActiveText]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* --- User Section --- */}
      <View style={styles.userRow}>
        <Image
          source={{ uri: "https://randomuser.me/api/portraits/women/40.jpg" }}
          style={styles.userAvatar}
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.userName}>Mer Watson</Text>
          <Text style={styles.userSubtitle}>8 • 1.234K Followers</Text>
        </View>
        <TouchableOpacity style={styles.followBtn}>
          <Text style={styles.followText}>Follow</Text>
        </TouchableOpacity>
      </View>

      {/* --- Danh sách bài hát --- */}
      {songs.map((item, index) => (
        <TouchableOpacity
          key={item._id}
          style={styles.songRow}
          onPress={() => navigation.navigate("PlayScreen", { song: item })} // item đã normalize
        >
          <Image source={{ uri: item.image }} style={styles.songImage} />
          <View style={{ flex: 1 }}>
            <Text style={styles.songTitle}>{item.title}</Text>
            <Text style={styles.songArtist}>{item.artist}</Text>
            <View style={styles.songStats}>
              <Ionicons name="play-outline" size={14} color="#6B7280" style={{ marginRight: 4 }} />
              <Text style={styles.statText}>{2 + index * 3}M</Text>
              <Text style={styles.dot}>•</Text>
              <Text style={styles.statText}>{index % 2 === 0 ? "03:36" : "05:15"}</Text>
            </View>
          </View>
          <TouchableOpacity>
            <Ionicons name="heart-outline" size={22} color="#00BFFF" style={{ marginLeft: 8 }} />
          </TouchableOpacity>
        </TouchableOpacity>
      ))}

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

// ---------- STYLES ----------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 18,
    paddingTop: 55,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#000",
    marginBottom: 20,
  },

  // Tabs
  tabs: {
    flexDirection: "row",
    marginBottom: 25,
  },
  tab: {
    backgroundColor: "#F3F4F6",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 18,
    marginRight: 10,
  },
  tabText: {
    fontSize: 14,
    color: "#6B7280",
  },
  tabActiveText: {
    color: "#111",
    fontWeight: "700",
  },

  // User section
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
  },
  userAvatar: { width: 55, height: 55, borderRadius: 27, marginRight: 12 },
  userName: { fontSize: 16, fontWeight: "700", color: "#111" },
  userSubtitle: { fontSize: 13, color: "#6B7280" },
  followBtn: {
    backgroundColor: "#000",
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  followText: {
    color: "#fff",
    fontWeight: "600",
  },

  // Song list
  songRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  songImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 15,
    backgroundColor: "#eee",
  },
  songTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111",
  },
  songArtist: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 2,
  },
  songStats: {
    flexDirection: "row",
    alignItems: "center",
  },
  statText: {
    fontSize: 12,
    color: "#6B7280",
  },
  dot: {
    marginHorizontal: 5,
    color: "#6B7280",
  },
});
