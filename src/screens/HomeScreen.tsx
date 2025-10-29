import React, { useEffect, useState } from "react";
import { withFullUrl } from "../utils/url";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  FlatList,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { BASE_URL } from "../config";

interface Song {
  _id: string;
  title: string;
  artist: string;
  image: string;
  url: string;
  localPath?: string;
  downloaded?: boolean;
}

// ===== Banner Premium =====
const PremiumBanner = () => {
  const navigation = useNavigation<any>();
  return (
    <TouchableOpacity
      style={styles.premiumBanner}
      onPress={() => navigation.navigate("PremiumSubscriptionScreen")}
    >
      <View style={styles.bannerContent}>
        <Ionicons name="sparkles" size={24} color="#FFD700" />
        <View style={{ marginLeft: 10 }}>
          <Text style={styles.bannerTitle}>Nâng cấp lên Premium!</Text>
          <Text style={styles.bannerSubtitle}>
            Nghe nhạc không quảng cáo & ngoại tuyến.
          </Text>
        </View>
      </View>
      <Ionicons name="arrow-forward-circle" size={30} color="#FFD700" />
    </TouchableOpacity>
  );
};

// ===== HomeScreen chính =====
export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState(false);

  const API_URL = `${BASE_URL}/api/songs`;

  // ---- Fetch danh sách + NORMALIZE URL ngay sau khi nhận dữ liệu ----
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchSongs = async () => {
      try {
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        const res = await fetch(API_URL, { signal });
        clearTimeout(timeoutId);

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data: Song[] = await res.json();

        // ⚠️ Chuẩn hoá image/url thành HTTP đầy đủ (kèm encode) ngay tại đây
        const normalized = data.map(withFullUrl);
        setSongs(normalized.slice(0, 10));
      } catch (err: any) {
        if (err.name === "AbortError") {
          console.error("❌ Lỗi tải danh sách bài hát: Timed out (5s).");
        } else {
          console.error("❌ Lỗi tải danh sách bài hát:", err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
    return () => controller.abort();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const res = await fetch(API_URL);
      const data: Song[] = await res.json();
      // Normalize khi refresh
      setSongs(data.map(withFullUrl));
    } catch (err) {
      console.error("❌ Lỗi refresh danh sách bài hát:", err);
    } finally {
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color="#111827" />
      </View>
    );
  }

  return (
    <FlatList
      style={styles.container}
      data={songs}
      keyExtractor={(item) => item._id}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      ListHeaderComponent={
        <>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.welcomeText}>
                Chào buổi sáng, Ashley Scott
              </Text>
              <Text style={styles.subtitle}>Khám phá âm nhạc hôm nay</Text>
            </View>
            <TouchableOpacity>
              <Image
                style={styles.avatar}
                source={{ uri: "https://picsum.photos/id/1025/150/150" }}
              />
            </TouchableOpacity>
          </View>

          {/* Banner Premium */}
          <PremiumBanner />
          <Text style={styles.sectionTitle}>Đang thịnh hành 🔥</Text>
        </>
      }
      renderItem={({ item, index }: { item: Song; index: number }) => (
        <TouchableOpacity
          style={styles.songRow}
          onPress={() =>
            navigation.navigate("PlayScreen", {
              song: item,
              queue: songs, // mảng đã normalize
              index, // vị trí bài được bấm
            })
          }
        >
          <Image source={{ uri: item.image }} style={styles.songImage} />
          <View style={styles.songInfo}>
            <Text style={styles.songTitle}>{item.title}</Text>
            <Text style={styles.songArtist}>{item.artist}</Text>
          </View>
          <Ionicons name="play-circle" size={28} color="#111827" />
        </TouchableOpacity>
      )}
      ListFooterComponent={
        <>
          <TouchableOpacity
            style={styles.feedButton}
            onPress={() => navigation.navigate("Feed")}
          >
            <Text style={styles.feedButtonText}>🎧 Đi đến Feed</Text>
          </TouchableOpacity>
          <View style={{ height: 40 }} />
        </>
      }
      ListEmptyComponent={
        loading ? (
          <ActivityIndicator size="large" color="#111827" />
        ) : (
          <Text style={{ color: "#6B7280", textAlign: "center" }}>
            Không có bài hát nào 😢
          </Text>
        )
      }
    />
  );
}

// ===== Styles =====
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#E5E7EB",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111827",
    marginVertical: 16,
  },
  songRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
    padding: 10,
    borderRadius: 12,
    backgroundColor: "#FFF",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  songImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 12,
  },
  songInfo: {
    flex: 1,
    marginRight: 10,
  },
  songTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  songArtist: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 2,
  },
  feedButton: {
    marginTop: 30,
    backgroundColor: "#111827",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 40,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  feedButtonText: {
    color: "white",
    fontSize: 17,
    fontWeight: "700",
  },
  premiumBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#333",
    padding: 15,
    borderRadius: 12,
    marginTop: 10,
    marginBottom: 5,
    shadowColor: "#FFD700",
    shadowOpacity: 0.4,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  bannerContent: { flexDirection: "row", alignItems: "center" },
  bannerTitle: { fontSize: 16, fontWeight: "bold", color: "white" },
  bannerSubtitle: { fontSize: 13, color: "#DDD", marginTop: 2 },
});
