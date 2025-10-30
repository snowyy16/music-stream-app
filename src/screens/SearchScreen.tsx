// src/screens/SearchScreen.tsx
import { usePlayer } from "../player/store";
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { BASE_URL } from "../config";
import CategoryCard from "../components/CategoryCard";
import { withFullUrl } from "../utils/url";
import { useAuth } from "../context/AuthContext";
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from "react-native-popup-menu";

interface Song {
  _id: string;
  title: string;
  artist: string;
  image: string;
  url: string;
  category?: string;
}

// --- Dữ liệu Thể loại (Mock Data) ---
const categories = [
  { name: "Top Hits", color: "#6A5ACD" },
  { name: "Relax", color: "#4682B4" },
  { name: "Workout", color: "#DC143C" },
  { name: "Acoustic", color: "#FF8C00" },
  { name: "Jazz", color: "#3CB371" },
  { name: "Trending", color: "#FF4500" },
];

export default function SearchScreen() {
  const navigation = useNavigation<any>();
  const [searchText, setSearchText] = useState("");
  const { user, logout } = useAuth();
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);
  const { song: currentSong } = usePlayer();   // 

  const fetchControllerRef = useRef<AbortController | null>(null);

  const handleCategoryPress = (categoryName: string) => {
    navigation.navigate("CategoryDetail", { categoryName });
  };
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

  // 🎧 Hàm tìm kiếm bài hát
  const fetchSongs = async (query: string) => {
    const q = query.trim();
    if (!q) {
      setSongs([]);
      return;
    }

    // Huỷ request cũ (nếu còn)
    if (fetchControllerRef.current) {
      fetchControllerRef.current.abort();
    }
    const controller = new AbortController();
    fetchControllerRef.current = controller;

    setLoading(true);
    try {
      const timeout = setTimeout(() => controller.abort(), 8000); // timeout 8s
      const res = await fetch(
        `${BASE_URL}/api/songs?search=${encodeURIComponent(q)}`,
        { signal: controller.signal }
      );
      clearTimeout(timeout);

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: Song[] = await res.json();

      // 🔧 Chuẩn hoá URL ảnh/nhạc để tránh -1002 khi phát
      setSongs(data.map(withFullUrl));
    } catch (error: any) {
      if (error.name === "AbortError") {
        // bị huỷ do gõ tiếp hoặc timeout
        return;
      }
      console.error("❌ Lỗi tìm kiếm bài hát:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🔍 Gọi API khi người dùng gõ (debounce 500ms)
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchSongs(searchText);
    }, 500);
    return () => clearTimeout(delayDebounce);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText]);

  // cleanup khi unmount
  useEffect(() => {
    return () => {
      if (fetchControllerRef.current) {
        fetchControllerRef.current.abort();
      }
    };
  }, []);

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Tìm kiếm</Text>
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

      {/* Input Tìm kiếm */}
      <View style={styles.searchBox}>
        <Ionicons
          name="search"
          size={20}
          color="#6B7280"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.input}
          placeholder="Tìm bài hát, nghệ sĩ hoặc album..."
          placeholderTextColor="#6B7280"
          value={searchText}
          onChangeText={setSearchText}
          autoCorrect={false}
          autoCapitalize="none"
          returnKeyType="search"
        />
      </View>

      {/* Nếu người dùng đang gõ → hiển thị kết quả bài hát */}
      {searchText ? (
        <>
          <Text style={styles.sectionTitle}>Kết quả tìm kiếm</Text>

          {loading ? (
            <ActivityIndicator size="large" color="#111827" />
          ) : songs.length > 0 ? (
            songs.map((song) => (
              <TouchableOpacity
                key={song._id}
                style={styles.songRow}
                onPress={() =>
                  navigation.navigate("PlayScreen", {
                    queue: songs, // danh sách đang hiển thị (đã normalize)
                    index: songs.findIndex((s) => s._id === song._id), // vị trí bài được bấm
                  })
                }
              >
                <Image source={{ uri: song.image }} style={styles.songImage} />
                <View style={styles.songInfo}>
                  <Text style={styles.songTitle}>{song.title}</Text>
                  <Text style={styles.songArtist}>{song.artist}</Text>
                </View>
                <Ionicons name="play-circle" size={28} color="#111827" />
              </TouchableOpacity>
            ))
          ) : (
            <Text
              style={{ textAlign: "center", color: "#6B7280", marginTop: 10 }}
            >
              Không tìm thấy bài hát nào.
            </Text>
          )}
        </>
      ) : (
        <>
          <Text style={styles.sectionTitle}>Khám phá âm nhạc</Text>
          <View style={styles.grid}>
            {filteredCategories.map((category, index) => (
              <CategoryCard
                key={index}
                categoryName={category.name}
                backgroundColor={category.color}
                onPress={() => handleCategoryPress(category.name)}
              />
            ))}
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: { fontSize: 32, fontWeight: "bold", color: "#111827" },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 25,
  },
  searchIcon: { marginRight: 10 },
  input: { flex: 1, height: 48, fontSize: 16, color: "#111827" },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 10,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 10,
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
  songImage: { width: 60, height: 60, borderRadius: 10, marginRight: 12 },
  songInfo: { flex: 1, marginRight: 10 },
  songTitle: { fontSize: 16, fontWeight: "600", color: "#111827" },
  songArtist: { fontSize: 14, color: "#6B7280", marginTop: 2 },
  avatar: { width: 45, height: 45, borderRadius: 22 },
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
