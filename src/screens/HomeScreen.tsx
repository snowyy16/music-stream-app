// src/screens/HomeScreen.tsx
import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { BASE_URL } from "../config";
import { withFullUrl } from "../utils/url";
import { useAuth } from "../context/AuthContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from "react-native-popup-menu";

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const [songs, setSongs] = useState<any[]>([]);
  const [artists, setArtists] = useState<any[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [loadingSearch, setLoadingSearch] = useState(false);
  const fetchControllerRef = useRef<AbortController | null>(null);
  const { user, logout } = useAuth();
  const displayedUsername = user ? user.username : "Guest";

  // ===== Load lịch sử tìm kiếm =====
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const saved = await AsyncStorage.getItem("recentSearches");
        if (saved) setRecentSearches(JSON.parse(saved));
      } catch (err) {
        console.error("Lỗi khi đọc lịch sử:", err);
      }
    };
    loadHistory();
  }, []);

  // ====== Lấy dữ liệu mặc định ======
  const fetchDefaultData = () => {
    setLoading(true);
    fetch(`${BASE_URL}/api/songs`)
      .then((res) => res.json())
      .then((data) => setSongs(data.map(withFullUrl).slice(0, 50)))
      .catch(() => {})
      .finally(() => setLoading(false));

    fetch(`${BASE_URL}/api/artists`)
      .then((res) => res.json())
      .then((data) => setArtists(data.slice(0, 10)))
      .catch((err) => console.log("Lỗi lấy nghệ sĩ:", err));
  };

  useEffect(() => {
    fetchDefaultData();
  }, []);

  // ====== Gọi API tìm kiếm + lưu lịch sử ======
  const fetchSongs = async (query: string) => {
    const q = query.trim();
    if (!q) {
      fetchDefaultData();
      return;
    }

    if (fetchControllerRef.current) {
      fetchControllerRef.current.abort();
    }

    const controller = new AbortController();
    fetchControllerRef.current = controller;
    setLoadingSearch(true);

    try {
      const res = await fetch(
        `${BASE_URL}/api/songs?search=${encodeURIComponent(q)}`,
        { signal: controller.signal }
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setSongs(data.map(withFullUrl));

      // ✅ Lưu lịch sử tìm kiếm (tối đa 8 mục)
      if (q && !recentSearches.includes(q)) {
        const updated = [q, ...recentSearches].slice(0, 8);
        setRecentSearches(updated);
        await AsyncStorage.setItem("recentSearches", JSON.stringify(updated));
      }
    } catch (err: any) {
      if (err.name !== "AbortError") console.error("❌ Lỗi tìm kiếm:", err);
    } finally {
      setLoadingSearch(false);
    }
  };

  // ====== Debounce 0.5s ======
  useEffect(() => {
    const delay = setTimeout(() => fetchSongs(searchText), 500);
    return () => clearTimeout(delay);
  }, [searchText]);

  // ====== Logout ======
  const handleLogout = () => {
    logout();
    navigation.reset({ index: 0, routes: [{ name: "AuthStack" }] });
  };

  const handleSettings = () => navigation.navigate("Settings");
  const trendingAlbums = songs.slice(2, 5);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.username}>Hi, {displayedUsername}</Text>
        </View>

        {/* Premium Badge */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate("PremiumSubscriptionScreen")}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 20,
            borderWidth: 1.5,
            borderColor: "#FBBF24",
            backgroundColor: "rgba(255, 193, 7, 0.08)",
            marginRight: -40,
          }}
        >
          <MaterialCommunityIcons name="crown" size={16} color="#F59E0B" />
          <Text
            style={{
              color: "#F59E0B",
              fontWeight: "700",
              fontSize: 13,
              marginLeft: 5,
            }}
          >
            Premium
          </Text>
        </TouchableOpacity>

        {/* Avatar Menu */}
        <Menu>
          <MenuTrigger>
            <Image
              style={styles.avatar}
              source={{
                uri: "https://cdn-icons-png.flaticon.com/512/4825/4825038.png",
              }}
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
              },
            }}
          >
            <MenuOption onSelect={handleSettings} customStyles={{ optionWrapper: styles.menuItem }}>
              <Ionicons name="settings-outline" size={18} color="#1DB954" />
              <Text style={styles.menuText}> Cài đặt</Text>
            </MenuOption>
            <MenuOption onSelect={handleLogout} customStyles={{ optionWrapper: styles.menuItem }}>
              <Ionicons name="log-out-outline" size={18} color="#FF4C4C" />
              <Text style={[styles.menuText, { color: "#FF4C4C" }]}> Đăng xuất</Text>
            </MenuOption>
          </MenuOptions>
        </Menu>
      </View>

      {/* 🔍 Thanh tìm kiếm */}
      <View style={styles.searchBox}>
        <Ionicons name="search" size={20} color="#6B7280" style={{ marginRight: 10 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm bài hát, nghệ sĩ hoặc album..."
          placeholderTextColor="#9CA3AF"
          value={searchText}
          onChangeText={setSearchText}
          autoCorrect={false}
          autoCapitalize="none"
          returnKeyType="search"
        />
        {loadingSearch && <ActivityIndicator size="small" color="#6B7280" />}
      </View>

      {/* 🕓 Lịch sử tìm kiếm */}
      {!searchText && recentSearches.length > 0 && (
        <View style={styles.historyContainer}>
          <Text style={styles.historyTitle}>Search History</Text>
          {recentSearches.map((item, i) => (
            <TouchableOpacity
              key={i}
              style={styles.historyItem}
              onPress={() => setSearchText(item)}
            >
              <Ionicons name="time-outline" size={16} color="#6B7280" />
              <Text style={styles.historyText}>{item}</Text>
              <TouchableOpacity
                onPress={async () => {
                  const updated = recentSearches.filter((x) => x !== item);
                  setRecentSearches(updated);
                  await AsyncStorage.setItem("recentSearches", JSON.stringify(updated));
                }}
              >
                <Ionicons name="close" size={16} color="#9CA3AF" />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}

          {/* Nút Xóa tất cả */}
          <TouchableOpacity
            onPress={async () => {
              setRecentSearches([]);
              await AsyncStorage.removeItem("recentSearches");
            }}
          >
            <Text style={styles.clearAll}>Delete All</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Suggestions */}
      <Text style={styles.sectionTitle}>
        {searchText ? "Kết quả tìm kiếm" : "Suggestions for you"}
      </Text>
      <Text></Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {songs.slice(0, 10).map((item, idx) => (
          <TouchableOpacity
            key={idx}
            style={[styles.suggestCard, { width: 160, marginRight: 14 }]}
            onPress={() =>
              navigation.navigate("PlayScreen", {
                song: item,
                queue: songs,
                index: idx,
              })
            }
          >
            <Image source={{ uri: item.image }} style={styles.suggestImage} />
            <View style={styles.suggestOverlay}>
              <Text style={styles.suggestTitle} numberOfLines={1}>
                {item.title}
              </Text>
              <Text style={styles.suggestArtist} numberOfLines={1}>
                {item.artist}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Charts */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Charts albums</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Search")}>
          <Text style={styles.seeAll}>See all</Text>
        </TouchableOpacity>
      </View>
      <Text></Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {[
          { region: "Canada", image: `${BASE_URL}/image/canada.jpg` },
          { region: "Trending", image: `${BASE_URL}/image/trending.jpg` },
          { region: "Global", image: `${BASE_URL}/image/global.jpg` },
        ].map((item, i) => (
          <TouchableOpacity
            key={i}
            style={styles.chartCard}
            onPress={() =>
              navigation.navigate("CategoryDetail", { categoryName: item.region })
            }
          >
            <Image source={{ uri: item.image }} style={styles.chartImage} />
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Trending albums */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Trending albums</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Search")}>
          <Text style={styles.seeAll}>See all</Text>
        </TouchableOpacity>
      </View>
      <Text></Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {trendingAlbums.map((item, i) => (
          <TouchableOpacity
            key={i}
            style={styles.albumCard}
            onPress={() =>
              navigation.navigate("PlayScreen", {
                queue: songs,
                index: songs.findIndex((s) => s._id === item._id),
              })
            }
          >
            <Image source={{ uri: item.image }} style={styles.albumImage} />
            <Text style={styles.albumTitle}>{item.title}</Text>
            <Text style={styles.albumArtist}>{item.artist}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Artists */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Popular Artists</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Search")}>
          <Text style={styles.seeAll}>See all</Text>
        </TouchableOpacity>
      </View>
      <Text></Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {artists.map((item, i) => (
          <TouchableOpacity
            key={i}
            style={styles.artistCard}
            onPress={() => navigation.navigate("ArtistDetail", { artist: item })}
          >
            <Image
              source={{
                uri: item.avatar.startsWith("http")
                  ? item.avatar
                  : `${BASE_URL}/image/${item.avatar}`,
              }}
              style={styles.artistAvatar}
            />
            <Text style={styles.artistName}>{item.name}</Text>
            <TouchableOpacity style={styles.followBtn}>
              <Text style={styles.followText}>Follow</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={{ height: 90 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 18, paddingTop: 55 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  username: { fontSize: 30, fontWeight: "800", color: "#1F2937", marginBottom: 20 },
  avatar: { width: 45, height: 45, borderRadius: 22 },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginVertical: 16,
  },
  searchInput: { flex: 1, fontSize: 15, color: "#111827", paddingVertical: 2 },
  historyContainer: {
    marginBottom: 10,
    backgroundColor: "#F9FAFB",
    borderRadius: 10,
    padding: 10,
  },
  historyTitle: { fontWeight: "600", color: "#374151", marginBottom: 6 },
  historyItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomWidth: 0.5,
    borderColor: "#E5E7EB",
  },
  historyText: { flex: 1, marginLeft: 8, color: "#111827" },
  clearAll: { textAlign: "right", color: "#EF4444", fontSize: 13, marginTop: 8 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 24,
  },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: "#111827" },
  seeAll: { fontSize: 14, color: "#6B7280" },
  suggestCard: {
    width: "48%",
    height: 180,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#000",
  },
  suggestImage: { width: "100%", height: "100%" },
  suggestOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  suggestTitle: { color: "#fff", fontSize: 16, fontWeight: "700" },
  suggestArtist: { color: "#EEE", fontSize: 13, marginTop: 2 },
  chartCard: {
    width: 130,
    height: 130,
    borderRadius: 16,
    marginRight: 14,
    overflow: "hidden",
  },
  chartImage: { width: "100%", height: "100%", borderRadius: 16 },
  albumCard: { width: 120, marginRight: 14 },
  albumImage: { width: 120, height: 120, borderRadius: 12 },
  albumTitle: { fontSize: 14, fontWeight: "600", marginTop: 6 },
  albumArtist: { fontSize: 12, color: "#6B7280" },
  artistCard: { width: 110, alignItems: "center", marginRight: 14 },
  artistAvatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: "#E5E7EB" },
  artistName: { marginTop: 8, fontSize: 13, fontWeight: "600", color: "#111827" },
  followBtn: {
    marginTop: 6,
    backgroundColor: "#111827",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  followText: { color: "#fff", fontSize: 12, fontWeight: "600" },
  menuItem: { flexDirection: "row", alignItems: "center", paddingVertical: 10, paddingHorizontal: 12 },
  menuText: { fontSize: 15, color: "#E5E7EB", fontWeight: "500" },
});
