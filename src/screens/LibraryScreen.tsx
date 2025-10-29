// src/screens/LibraryScreen.tsx
import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
  FlatList,
  ListRenderItemInfo,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { BASE_URL } from "../config";
import { withFullUrl } from "../utils/url";

type Song = {
  _id: string;
  title: string;
  artist: string;
  image: string;
  url: string;
};

type TabKey = "Playlists" | "New tag" | "Songs" | "Albums" | "Artists";
const TABS: TabKey[] = ["Playlists", "New tag", "Songs", "Albums", "Artists"];

// ==== Mock (có thể thay bằng API thật sau) ====
const MOCK_PLAYLISTS = [
  {
    _id: "p1",
    name: "Daily Mix 1",
    owner: "You",
    cover: "https://placehold.co/600x600/png?text=Daily+Mix+1",
    songCount: 25,
  },
  {
    _id: "p2",
    name: "Focus",
    owner: "You",
    cover: "https://placehold.co/600x600/png?text=Focus",
    songCount: 18,
  },
  {
    _id: "p3",
    name: "Lo-fi Work",
    owner: "You",
    cover: "https://placehold.co/600x600/png?text=Lo-fi+Work",
    songCount: 42,
  },
  {
    _id: "p4",
    name: "Chill Night",
    owner: "You",
    cover: "https://placehold.co/600x600/png?text=Chill+Night",
    songCount: 22,
  },
];

const MOCK_ALBUMS = [
  {
    id: "a1",
    name: "After Hours",
    artist: "The Weeknd",
    cover: "https://placehold.co/300x300/png?text=After+Hours",
  },
  {
    id: "a2",
    name: "Divide",
    artist: "Ed Sheeran",
    cover: "https://placehold.co/300x300/png?text=Divide",
  },
];

const MOCK_ARTISTS = [
  {
    id: "ar1",
    name: "Maroon 5",
    avatar: "https://placehold.co/300x300/png?text=Maroon+5",
  },
  {
    id: "ar2",
    name: "Ed Sheeran",
    avatar: "https://placehold.co/300x300/png?text=Ed+Sheeran",
  },
];

export default function LibraryScreen() {
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState<TabKey>("Songs");

  // Songs
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const API_URL = `${BASE_URL}/api/songs`;

  // Fetch & normalize như HomeScreen
  const loadSongs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      const data: Song[] = await res.json();
      setSongs(data.map(withFullUrl));
    } catch (err) {
      console.error("❌ Lỗi tải bài hát:", err);
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    loadSongs();
  }, [loadSongs]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadSongs();
    setRefreshing(false);
  };

  // ----- Header dùng chung -----
  const Header = useMemo(
    () => (
      <View style={styles.headerWrap}>
        <Text style={styles.title}>Your Library</Text>

        {/* Tabs */}
        <View style={styles.tabs}>
          {TABS.map((tab) => {
            const isActive = tab === activeTab;
            return (
              <TouchableOpacity
                key={tab}
                style={[styles.tab, isActive && styles.tabActive]}
                onPress={() => setActiveTab(tab)}
                activeOpacity={0.8}
              >
                <Text
                  style={[styles.tabText, isActive && styles.tabActiveText]}
                >
                  {tab}
                </Text>
                {isActive ? <View style={styles.tabIndicator} /> : null}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* User info */}
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
      </View>
    ),
    [activeTab]
  );

  // ===== Songs Tab =====
  const renderSongItem = ({ item, index }: ListRenderItemInfo<Song>) => (
    <TouchableOpacity
      style={styles.songRow}
      onPress={() =>
        navigation.getParent()?.navigate("PlayScreen", {
          song: item,
          queue: songs,
          index,
        })
      }
    >
      <Image source={{ uri: item.image }} style={styles.songImage} />
      <View style={{ flex: 1 }}>
        <Text style={styles.songTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.songArtist} numberOfLines={1}>
          {item.artist}
        </Text>
        <View style={styles.songStats}>
          <Ionicons
            name="play-outline"
            size={14}
            color="#6B7280"
            style={{ marginRight: 4 }}
          />
          <Text style={styles.statText}>{2 + index * 3}M</Text>
          <Text style={styles.dot}>•</Text>
          <Text style={styles.statText}>
            {index % 2 === 0 ? "03:36" : "05:15"}
          </Text>
        </View>
      </View>
      <Ionicons name="heart-outline" size={22} color="#00BFFF" />
    </TouchableOpacity>
  );

  // ===== Playlists Tab =====
  type PL = (typeof MOCK_PLAYLISTS)[number];
  const renderPlaylistItem = ({ item }: ListRenderItemInfo<PL>) => (
    <TouchableOpacity
      style={styles.cardRow}
      activeOpacity={0.85}
      onPress={() => navigation.navigate("PlaylistDetail", { playlist: item })}
    >
      <Image source={{ uri: item.cover }} style={styles.cardImage} />
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.cardSub}>
          {item.songCount} songs • {item.owner}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#111827" />
    </TouchableOpacity>
  );

  // ===== Albums Tab =====
  type AL = (typeof MOCK_ALBUMS)[number];
  const renderAlbumItem = ({ item }: ListRenderItemInfo<AL>) => (
    <View style={styles.cardRow}>
      <Image source={{ uri: item.cover }} style={styles.cardImage} />
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.cardSub}>{item.artist}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#111827" />
    </View>
  );

  // ===== Artists Tab =====
  type AR = (typeof MOCK_ARTISTS)[number];
  const renderArtistItem = ({ item }: ListRenderItemInfo<AR>) => (
    <View style={styles.cardRow}>
      <Image source={{ uri: item.avatar }} style={styles.artistAvatar} />
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.cardSub}>Artist</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#111827" />
    </View>
  );

  // ===== Render theo tab (mỗi tab là 1 FlatList, không lồng ScrollView) =====
  if (activeTab === "Songs") {
    return (
      <FlatList
        style={styles.container}
        data={songs}
        keyExtractor={(item) => item._id}
        ListHeaderComponent={Header}
        renderItem={renderSongItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          loading ? (
            <View style={{ paddingVertical: 24, alignItems: "center" }}>
              <ActivityIndicator size="large" color="#111827" />
            </View>
          ) : (
            <Text
              style={{ textAlign: "center", color: "#6B7280", marginTop: 10 }}
            >
              Không có bài hát nào.
            </Text>
          )
        }
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    );
  }

  if (activeTab === "Playlists") {
    return (
      <FlatList
        style={styles.container}
        data={MOCK_PLAYLISTS}
        keyExtractor={(it) => it._id}
        ListHeaderComponent={
          <>
            {Header}
            <Text style={styles.sectionHint}>Playlists (demo)</Text>
          </>
        }
        renderItem={renderPlaylistItem}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    );
  }

  if (activeTab === "Albums") {
    return (
      <FlatList
        style={styles.container}
        data={MOCK_ALBUMS}
        keyExtractor={(it) => it.id}
        ListHeaderComponent={
          <>
            {Header}
            <Text style={styles.sectionHint}>Albums (demo)</Text>
          </>
        }
        renderItem={renderAlbumItem}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    );
  }

  if (activeTab === "Artists") {
    return (
      <FlatList
        style={styles.container}
        data={MOCK_ARTISTS}
        keyExtractor={(it) => it.id}
        ListHeaderComponent={
          <>
            {Header}
            <Text style={styles.sectionHint}>Artists (demo)</Text>
          </>
        }
        renderItem={renderArtistItem}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    );
  }

  // New tag (demo)
  return (
    <FlatList
      style={styles.container}
      data={[]}
      keyExtractor={(_, i) => String(i)}
      ListHeaderComponent={
        <>
          {Header}
          <Text style={styles.sectionHint}>
            Thẻ mới (demo) — tuỳ biến nội dung của bạn
          </Text>
        </>
      }
      renderItem={null as any}
      ListEmptyComponent={<View style={{ height: 1 }} />}
      contentContainerStyle={{ paddingBottom: 100 }}
    />
  );
}

/// ---------- STYLES (Đã chỉnh sửa) ----------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // Thay màu nền toàn màn hình
    backgroundColor: "#F9FAFB", // Màu nền rất nhạt, sạch sẽ
    paddingHorizontal: 16, // Giảm padding ngang một chút
    paddingTop: 55,
  },
  headerWrap: {
    paddingBottom: 16, // Tăng khoảng cách dưới header
    backgroundColor: "#F9FAFB", // Đảm bảo header có màu nền đồng nhất
  },

  title: {
    fontSize: 32, // Tăng kích thước tiêu đề chính
    fontWeight: "900", // Đậm hơn
    color: "#1F2937", // Màu đen đậm hơn
    marginBottom: 20, // Tăng khoảng cách
  },

  // Tabs
  tabs: {
    flexDirection: "row",
    marginBottom: 20, // Tăng khoảng cách dưới tabs
    // Thêm scroll ngang nếu cần nhiều tab hơn, nhưng tạm thời giữ nguyên
  },
  tab: {
    backgroundColor: "#E5E7EB", // Nền tab bình thường nhạt hơn
    paddingVertical: 8, // Tăng padding dọc
    paddingHorizontal: 16, // Tăng padding ngang
    borderRadius: 20, // Bo tròn nhiều hơn
    marginRight: 10,
    position: "relative",
  },
  tabActive: {
    backgroundColor: "#1F2937", // Thay đổi màu nền tab active thành màu đen đậm
  },
  tabText: {
    fontSize: 15, // Tăng kích thước chữ tab
    color: "#4B5563", // Màu chữ bình thường xám hơn
    fontWeight: "600",
  },
  tabActiveText: {
    color: "#fff", // Màu chữ tab active là trắng
    fontWeight: "700",
  },
  tabIndicator: {
    // Xóa indicator, vì màu nền đã thay đổi đủ rõ ràng
    display: "none",
  },

  // User section
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24, // Tăng khoảng cách
    padding: 12, // Thêm padding cho hàng này
    borderRadius: 12,
    backgroundColor: "#fff", // Nền trắng cho hàng thông tin người dùng
    // Thêm shadow nhẹ
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25, // Bo tròn
    marginRight: 12,
    borderWidth: 2, // Thêm viền nhẹ
    borderColor: "#E5E7EB",
  },
  userName: {
    fontSize: 18, // Tăng kích thước tên
    fontWeight: "700",
    color: "#1F2937",
  },
  userSubtitle: {
    fontSize: 14,
    color: "#6B7280",
  },
  followBtn: {
    backgroundColor: "#059669", // Màu xanh lá cây nổi bật hơn
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 8,
    marginLeft: 10, // Thêm khoảng cách với text
  },
  followText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },

  // Songs
  songRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10, // Thêm padding dọc
    marginBottom: 8, // Giảm margin giữa các hàng
    borderRadius: 8,
    // Không cần background hoặc shadow, để list trông sạch sẽ
  },
  songRowActive: {
    backgroundColor: "#E5E7EB", // Có thể thêm khi row được focus/chọn
  },
  songImage: {
    width: 50,
    height: 50,
    borderRadius: 6, // Giảm bo tròn một chút
    marginRight: 12,
    backgroundColor: "#E5E7EB",
  },
  songTitle: {
    fontSize: 15, // Giảm một chút
    fontWeight: "600", // Giảm độ đậm
    color: "#1F2937",
  },
  songArtist: {
    fontSize: 13,
    color: "#9CA3AF", // Màu xám nhạt hơn
    marginBottom: 4,
  },
  songStats: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  statText: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  dot: {
    marginHorizontal: 6,
    color: "#D1D5DB", // Màu chấm mờ hơn
  },

  // Cards (Playlists/Albums/Artists)
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15, // Tăng padding
    borderRadius: 16, // Bo tròn nhiều hơn
    backgroundColor: "#fff",
    // Cải thiện shadow (mềm hơn)
    shadowColor: "#000",
    shadowOpacity: 0.08, // Tăng nhẹ opacity
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  cardImage: {
    width: 60, // Tăng kích thước
    height: 60,
    borderRadius: 10, // Bo tròn hợp lý với card
    backgroundColor: "#D1D5DB",
  },
  artistAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30, // Bo tròn nhiều hơn
    backgroundColor: "#D1D5DB",
  },
  cardTitle: {
    fontSize: 17, // Tăng kích thước
    fontWeight: "700",
    color: "#1F2937",
  },
  cardSub: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
  },

  sectionHint: {
    color: "#4B5563",
    fontSize: 15,
    marginBottom: 10,
    marginTop: 15, // Tăng khoảng cách trên
    fontWeight: "600", // Thêm độ đậm
    paddingHorizontal: 4, // Cân bằng với padding của container
  },
});
