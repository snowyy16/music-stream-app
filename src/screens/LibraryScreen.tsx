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
import { useAuth } from "../context/AuthContext";
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from "react-native-popup-menu";
type Song = {
  _id: string;
  title: string;
  artist: string;
  image: string;
  url: string;
};
interface Artist {
  _id: string;
  name: string;
  avatar: string;
  country?: string;
  followers?: number;
}
type TabKey = "Playlists" | "Discover" | "Songs" | "Albums" | "Artists";
const TABS: TabKey[] = ["Playlists", "Discover", "Songs", "Albums", "Artists"];

const MOCK_PLAYLISTS = [
  {
    _id: "p1",
    name: "Daily Mix 1",
    owner: "You",
    cover: "https://mir-s3-cdn-cf.behance.net/project_modules/max_1200_webp/a4430b164396557.63f71e646f263.jpg",
    songCount: 25,
  },
  {
    _id: "p2",
    name: "Focus",
    owner: "You",
    cover: "https://images.squarespace-cdn.com/content/v1/6635b968db68a92f85deec29/9d01a1e1-bd5d-4374-a8f8-c40298c5f4fc/aesthetic-spotify-playlist-covers.jpeg",
    songCount: 18,
  },
  {
    _id: "p3",
    name: "Lo-fi Work",
    owner: "You",
    cover: "https://i.etsystatic.com/44635050/r/il/d4d5ef/6507495435/il_fullxfull.6507495435_bvyx.jpg",
    songCount: 42,
  },
  {
    _id: "p4",
    name: "Chill Night",
    owner: "You",
    cover: "https://marketplace.canva.com/EAGYFRbnbek/2/0/1600w/canva-beige-orange-retro-cassette-tape-party-songs-playlist-cover-MQqkFWaPCUI.jpg",
    songCount: 22,
  },
  {
    _id: "p5",
    name: "Acoustic",
    owner: "You",
    cover: "https://d1csarkz8obe9u.cloudfront.net/posterpreviews/playlist-cover-design-template-7dd4f20145b44bab7da20e33ecbcada6_screen.jpg?ts=1737852087",
    songCount: 22,
  },
  {
    _id: "p6",
    name: "Party",
    owner: "You",
    cover: "https://plus.unsplash.com/premium_photo-1682125488670-29e72e5a7672?fm=jpg&q=60&w=3000",
    songCount: 22,
  },
  {
    _id: "p7",
    name: "Summer",
    owner: "You",
    cover: "https://www.musicinminnesota.com/wp-content/uploads/2022/01/Photo-by-xaviershanley-from-Pexels.jpg",
    songCount: 22,
  },
];

const MOCK_ALBUMS = [
  {
    id: "a1",
    name: "Starboy",
    artist: "The Weeknd",
    cover: "https://upload.wikimedia.org/wikipedia/en/3/39/The_Weeknd_-_Starboy.png",
  },
  {
    id: "a2",
    name: "÷ (Divide)",
    artist: "Ed Sheeran",
    cover: "https://upload.wikimedia.org/wikipedia/en/4/45/Divide_cover.png",
  },
  {
    id: "a3",
    name: "1989 (Taylor’s Version)",
    artist: "Taylor Swift",
    cover: "https://upload.wikimedia.org/wikipedia/en/d/d5/Taylor_Swift_-_1989_%28Taylor%27s_Version%29.png",
  },
  {
    id: "a4",
    name: "25",
    artist: "Adele",
    cover: "https://upload.wikimedia.org/wikipedia/en/1/1b/Adele_-_25_%28Official_Album_Cover%29.png",
  },
  {
    id: "a5",
    name: "Future Nostalgia",
    artist: "Dua Lipa",
    cover: "https://upload.wikimedia.org/wikipedia/en/0/05/Dua_Lipa_-_Future_Nostalgia_%28Official_Album_Cover%29.png",
  },
  {
    id: "a6",
    name: "Scorpion",
    artist: "Drake",
    cover: "https://upload.wikimedia.org/wikipedia/en/9/90/Scorpion_by_Drake.jpg",
  },
  {
    id: "a7",
    name: "Fine Line",
    artist: "Harry Styles",
    cover: "https://upload.wikimedia.org/wikipedia/en/a/a0/Harry_Styles_-_Fine_Line.png",
  },
  {
    id: "a8",
    name: "Born to Die",
    artist: "Lana Del Rey",
    cover: "https://upload.wikimedia.org/wikipedia/en/0/03/Lana_Del_Rey_-_Born_to_Die.png",
  },
  {
    id: "a9",
    name: "Random Access Memories",
    artist: "Daft Punk",
    cover: "https://upload.wikimedia.org/wikipedia/en/a/a7/Random_Access_Memories.jpg",
  },
  {
    id: "a10",
    name: "Thriller",
    artist: "Michael Jackson",
    cover: "https://upload.wikimedia.org/wikipedia/en/5/55/Michael_Jackson_-_Thriller.png",
  },
];




export default function LibraryScreen() {
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState<TabKey>("Playlists");

  // Songs
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [artists, setArtists] = useState<any[]>([]);
  const [albums, setAlbums] = useState<any[]>([]);

  const API_URL = `${BASE_URL}/api/songs`;
  const { user, logout } = useAuth();
  const fetchArtists = useCallback(async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/artists`);
      const data = await res.json();

      // ✅ Tự build URL ảnh ngay tại frontend
      const artistsWithUrl = data.map((a: any) => {
        const avatarFile = (a?.avatar || "").trim();

        // Nếu avatar đã là URL thì giữ nguyên, còn nếu chỉ là tên file thì thêm BASE_URL
        const fullAvatarUrl = avatarFile.startsWith("http")
          ? avatarFile
          : `${BASE_URL}/image/${encodeURIComponent(avatarFile)}`;

        return { ...a, avatar: fullAvatarUrl };
      });

      setArtists(artistsWithUrl);
      console.log("✅ Artists loaded:", artistsWithUrl);
    } catch (err) {
      console.error("❌ Lỗi tải nghệ sĩ:", err);
    }
  }, []);

  const fetchAlbums = useCallback(async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/albums`);
      const data = await res.json();

      // Nếu cover chỉ là tên file, thêm BASE_URL
      const normalized = data.map((a: any) => {
        const coverFile = (a?.cover || "").trim();
        const fullCover = coverFile.startsWith("http")
          ? coverFile
          : `${BASE_URL}/image/${encodeURIComponent(coverFile)}`;
        return { ...a, cover: fullCover };
      });

      setAlbums(normalized);
      console.log("✅ Albums loaded:", normalized);
    } catch (err) {
      console.error("❌ Lỗi tải albums:", err);
    }
  }, []);



  const handleLogout = () => {
    logout();
    navigation.reset({
      index: 0,
      routes: [{ name: "AuthStack" }],
    });
  };

  const handleSettings = () => {
    navigation.navigate("Settings");
  };

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

  useEffect(() => {
    fetchArtists();
  }, [fetchArtists]);

  useEffect(() => {
    fetchArtists();
    fetchAlbums();
  }, [fetchArtists, fetchAlbums]);



  const onRefresh = async () => {
    setRefreshing(true);
    await loadSongs();
    setRefreshing(false);
  };

  // ----- Header dùng chung -----
  const Header = useMemo(
    () => (
      <View style={styles.headerWrap}>
        <View style={styles.header}>
          <Text style={styles.title}>Your Library</Text>
          <Menu>
            <MenuTrigger>
              {/* Ảnh đại diện làm nút kích hoạt Menu */}
              <Image
                style={styles.avatar}
                source={{ uri: "https://cdn-icons-png.flaticon.com/512/4825/4825038.png" }}
              />
            </MenuTrigger>

            <MenuOptions
              customStyles={{
                optionsContainer: {
                  backgroundColor: "#1E1E1E",
                  borderRadius: 12,
                  paddingVertical: 8,
                  marginTop: 50,
                  marginRight: 10,
                  width: 160,
                  shadowColor: "#000",
                  shadowOpacity: 0.2,
                  shadowOffset: { width: 0, height: 3 },
                  shadowRadius: 5,
                  elevation: 5,
                },
              }}
            >
              <MenuOption
                onSelect={handleSettings}
                customStyles={{
                  optionWrapper: styles.menuItem,
                  optionText: styles.menuText,
                }}
              >
                <Ionicons name="settings-outline" size={18} color="#1DB954" />
                <Text style={styles.menuText}>  Cài đặt</Text>
              </MenuOption>

              <MenuOption
                onSelect={handleLogout}
                customStyles={{
                  optionWrapper: styles.menuItem,
                }}
              >
                <Ionicons name="log-out-outline" size={18} color="#FF4C4C" />
                <Text style={[styles.menuText, { color: "#FF4C4C" }]}>  Đăng xuất</Text>
              </MenuOption>
            </MenuOptions>

          </Menu>
        </View>

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
  // Thay trong renderAlbumItem:
  const renderAlbumItem = ({ item }: ListRenderItemInfo<AL>) => (
    <TouchableOpacity
      style={styles.cardRow}
      activeOpacity={0.85}
      onPress={() => navigation.navigate("AlbumDetail", { album: item })}
    >
      <Image source={{ uri: item.cover }} style={styles.cardImage} />
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.cardSub}>{item.artist}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#111827" />
    </TouchableOpacity>
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
      <>
        <FlatList
          style={styles.container}
          data={MOCK_PLAYLISTS}
          keyExtractor={(it) => it._id}
          ListHeaderComponent={
            <>
              {Header}
              <Text style={styles.sectionHint}>Your playlists</Text>
            </>
          }
          renderItem={renderPlaylistItem}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          contentContainerStyle={{ paddingBottom: 140 }}
        />

        {/* ✅ Floating Button */}
        <TouchableOpacity
          style={styles.fab}
          activeOpacity={0.8}
          onPress={() => navigation.navigate("AddPlaylistScreen")}
        >
          <Ionicons name="add" size={28} color="#fff" />
        </TouchableOpacity>
      </>
    );
  }

  if (activeTab === "Albums") {
    return (
      <FlatList
        style={styles.container}
        data={albums}
        keyExtractor={(it) => it._id}
        ListHeaderComponent={
          <>
            {Header}
            <Text style={styles.sectionHint}>Albums</Text>
          </>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.cardRow}
            activeOpacity={0.85}
            onPress={() => navigation.navigate("AlbumDetail", { album: item })}
          >
            <Image source={{ uri: item.cover }} style={styles.cardImage} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.cardTitle} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={styles.cardSub}>{item.artist}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#111827" />
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", color: "#6B7280", marginTop: 10 }}>
            Không có album nào.
          </Text>
        }
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    );
  }


  if (activeTab === "Artists") {
    return (
      <FlatList
        style={styles.container}
        data={artists}
        keyExtractor={(item) => item._id}
        ListHeaderComponent={
          <>
            {Header}
            <Text style={styles.sectionHint}>Artists</Text>
          </>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.cardRow}
            activeOpacity={0.8}
            onPress={() => navigation.navigate("ArtistDetail", { artist: item })}
          >
            <Image source={{ uri: item.avatar }} style={styles.artistAvatar} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardSub}>
                {item.country || "Vietnam"} • {item.followers || 0} followers
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#111827" />
          </TouchableOpacity>

        )}

        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", color: "#6B7280", marginTop: 10 }}>
            Không có nghệ sĩ nào.
          </Text>
        }
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
  header: {
    paddingBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerWrap: {
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
    marginBottom: 5,

  },
  tab: {
    backgroundColor: "#E5E7EB",
    paddingVertical: 8,
    paddingHorizontal: 13,
    borderRadius: 20,
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
    color: "#D1D5DB",
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
    fontSize: 18,
    marginBottom: 10,
    marginTop: 15, // Tăng khoảng cách trên
    fontWeight: "600", // Thêm độ đậm
    paddingHorizontal: 4, // Cân bằng với padding của container
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 90, // nằm trên thanh tab bar một chút
    backgroundColor: "#111827",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 6,
  },
  avatar: { width: 42, height: 42, borderRadius: 21, marginRight: 10 },
  username: { fontSize: 15, fontWeight: "700", color: "#111" },
  posted: { fontSize: 12, color: "#777" },
  // --- STYLE MỚI CHO POP-UP MENU ---
  menuOptionsContainer: {
    marginTop: 40, // Điều chỉnh vị trí thả xuống
    width: 150,
    padding: 5,
    borderRadius: 8,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  menuText: {
    fontSize: 15,
    color: "#E5E7EB",
    fontWeight: "500",
  },


});
