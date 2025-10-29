// src/screens/FeedScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { BASE_URL } from "../config";
import colors from "../theme/colors";
import { withFullUrl } from "../utils/url";
import { MenuTrigger } from "react-native-popup-menu";

interface Song {
  _id: string;
  title: string;
  artist: string;
  image: string;
  url: string;
  category?: string;
}

export default function FeedScreen() {
  const navigation = useNavigation<any>();
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchSongs = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/api/songs`);
      const data: Song[] = await res.json();
      // 🔧 Chuẩn hoá URL (image/url) & đảo thứ tự cho feed
      const normalized = data.map(withFullUrl).reverse();
      setSongs(normalized);
    } catch (err) {
      console.error("❌ Lỗi tải danh sách Feed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSongs();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchSongs();
    setRefreshing(false);
  };

  const renderItem = ({ item, index }: { item: Song; index: number }) => (
    <View style={styles.postCard}>
      {/* Header người đăng */}
      <View style={styles.userRow}>
        <Image
          source={{
            uri:
              index % 2 === 0
                ? "https://randomuser.me/api/portraits/women/45.jpg"
                : "https://randomuser.me/api/portraits/men/46.jpg",
          }}
          style={styles.avatar}
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.username}>
            {index % 2 === 0 ? "Jessica Gonzalez" : "William King"}
          </Text>
          <Text style={styles.posted}>Posted a track · {index + 2}d</Text>
        </View>
        <Ionicons name="ellipsis-horizontal" size={20} color="#777" />
      </View>

      {/* Ảnh bài hát */}
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => navigation.navigate("PlayScreen", { song: item })} // item đã normalize
      >
        <View style={styles.imageContainer}>
          <Image source={{ uri: item.image }} style={styles.coverImage} />
          {/* Overlay nửa trong suốt */}
          <View style={styles.overlay}>
            <Text style={styles.songTitle}>{item.title}</Text>
            <View style={styles.songRowBottom}>
              <Text style={styles.songArtist}>{item.artist}</Text>
              <View style={styles.songStats}>
                <Ionicons
                  name="play"
                  size={13}
                  color="#fff"
                  style={{ marginRight: 4 }}
                />
                <Text style={styles.statText}>{120 + index * 10}</Text>
                <Text style={styles.dot}>•</Text>
                <Text style={styles.statText}>05:15</Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>

      {/* Hành động (like, comment, share) */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionBtn}>
          <Ionicons name="heart-outline" size={20} color="#444" />
          <Text style={styles.actionText}>{20 + index * 3}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn}>
          <Ionicons name="chatbubble-outline" size={20} color="#444" />
          <Text style={styles.actionText}>{3 + index}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn}>
          <Ionicons name="repeat-outline" size={20} color="#444" />
          <Text style={styles.actionText}>{1 + index}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Feed</Text>
        <MenuTrigger>
          {/* Ảnh đại diện làm nút kích hoạt Menu */}
          <Image
            style={styles.icon}
            source={{ uri: "https://cdn-icons-png.flaticon.com/512/4825/4825038.png" }}
          />
        </MenuTrigger>
      </View>

      {loading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={songs}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={{ paddingBottom: 70 }}
          ListEmptyComponent={
            <Text style={{ textAlign: "center", marginTop: 20, color: "#777" }}>
              Không có bài hát nào.
            </Text>
          }
        />
      )}
    </View>
  );
}

// ---------- STYLES ----------
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    paddingTop: 55,
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: { fontSize: 22, fontWeight: "800", color: "#111" },

  // Bài đăng
  postCard: {
    marginBottom: 24,
    backgroundColor: "#fff",
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  avatar: { width: 42, height: 42, borderRadius: 21, marginRight: 10 },
  username: { fontSize: 15, fontWeight: "700", color: "#111" },
  posted: { fontSize: 12, color: "#777" },

  imageContainer: {
    position: "relative",
    marginHorizontal: 16,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#ddd",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  coverImage: {
    width: "100%",
    height: 220,
    resizeMode: "cover",
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  songTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
    textTransform: "uppercase",
  },
  songRowBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 3,
  },
  songArtist: { color: "#ddd", fontSize: 13 },
  songStats: { flexDirection: "row", alignItems: "center" },
  statText: { color: "#fff", fontSize: 12, marginHorizontal: 2 },
  dot: { color: "#fff", marginHorizontal: 4 },

  actions: {
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingHorizontal: 40,
    marginTop: 12,
  },
  actionBtn: { flexDirection: "row", alignItems: "center", marginRight: 20 },
  actionText: { marginLeft: 6, color: "#444", fontSize: 13 },
  icon: { width: 45, height: 45, borderRadius: 22 },
});
