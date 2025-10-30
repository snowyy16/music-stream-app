// src/screens/HomeScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  FlatList,
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

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const [songs, setSongs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const displayedUsername = user ? user.username : "Guest";
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

  useEffect(() => {
    fetch(`${BASE_URL}/api/songs`)
      .then((res) => res.json())
      .then((data) => {
        setSongs(data.map(withFullUrl).slice(0, 50));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const suggestions = songs.slice(0, 2);
  const trendingAlbums = songs.slice(2, 5);
  const artists = songs.slice(5, 9);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, </Text>
          <Text style={styles.username}>{displayedUsername}</Text>
        </View>

        <Menu>
          <MenuTrigger>
            {/* Ảnh đại diện làm nút kích hoạt Menu */}
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
              <Text style={styles.menuText}> Cài đặt</Text>
            </MenuOption>

            <MenuOption
              onSelect={handleLogout}
              customStyles={{
                optionWrapper: styles.menuItem,
              }}
            >
              <Ionicons name="log-out-outline" size={18} color="#FF4C4C" />
              <Text style={[styles.menuText, { color: "#FF4C4C" }]}>
                {" "}
                Đăng xuất
              </Text>
            </MenuOption>
          </MenuOptions>
        </Menu>
        {/* ĐÃ XÓA <TouchableOpacity> CHỨA ICON GỐC */}
      </View>

      {/* Search box */}
      <View style={styles.searchBox}>
        <Ionicons name="search" size={20} color="#6B7280" />
        <TextInput
          placeholder="What you want to listen to"
          placeholderTextColor="#9CA3AF"
          style={styles.searchInput}
        />
      </View>

      {/* Suggestions */}
      <Text style={styles.sectionTitle}>Suggestions for you</Text>
      <Text></Text>
      <View style={styles.rowBetween}>
        {suggestions.map((item, idx) => (
          <TouchableOpacity
            key={idx}
            style={styles.suggestCard}
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
              <Text style={styles.suggestTitle}>{item.title}</Text>
              <Text style={styles.suggestArtist}>{item.artist}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Charts */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Charts</Text>
        <Text style={styles.seeAll}>See all</Text>
      </View>
      <Text></Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {["Canada", "Global", "Trending"].map((region, i) => (
          <TouchableOpacity key={i} style={styles.chartCard}>
            <Text style={styles.chartTitle}>Top 50</Text>
            <Text style={styles.chartSub}>{region}</Text>
            <Text style={styles.chartDesc}>Daily chart-toppers update</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Trending albums */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Trending albums</Text>
        <Text style={styles.seeAll}>See all</Text>
      </View>
      <Text></Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {trendingAlbums.map((item, i) => (
          <TouchableOpacity key={i} style={styles.albumCard}>
            <Image source={{ uri: item.image }} style={styles.albumImage} />
            <Text style={styles.albumTitle}>{item.title}</Text>
            <Text style={styles.albumArtist}>{item.artist}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Popular artists */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Popular artists</Text>
        <Text style={styles.seeAll}>See all</Text>
      </View>
      <Text></Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {artists.map((item, i) => (
          <View key={i} style={styles.artistCard}>
            <Image source={{ uri: item.image }} style={styles.artistAvatar} />
            <Text style={styles.artistName}>{item.artist}</Text>
            <TouchableOpacity style={styles.followBtn}>
              <Text style={styles.followText}>Follow</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <View style={{ height: 90 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 18,
    paddingTop: 55,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  greeting: { fontSize: 16, color: "#6B7280" },
  username: { fontSize: 22, fontWeight: "700", color: "#111827" },
  avatar: { width: 45, height: 45, borderRadius: 22 },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    marginVertical: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    marginLeft: 8,
    color: "#111827",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 24,
  },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: "#111827" },
  seeAll: { fontSize: 14, color: "#6B7280" },
  rowBetween: { flexDirection: "row", justifyContent: "space-between" },

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
    backgroundColor: "#EEF2FF",
    borderRadius: 16,
    width: 130,
    height: 130,
    marginRight: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  chartTitle: { fontSize: 18, fontWeight: "700", color: "#111827" },
  chartSub: { fontSize: 14, color: "#3B82F6", marginTop: 4 },
  chartDesc: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 6,
    textAlign: "center",
  },

  albumCard: { width: 120, marginRight: 14 },
  albumImage: { width: 120, height: 120, borderRadius: 12 },
  albumTitle: { fontSize: 14, fontWeight: "600", marginTop: 6 },
  albumArtist: { fontSize: 12, color: "#6B7280" },

  artistCard: {
    width: 110,
    alignItems: "center",
    marginRight: 14,
  },
  artistAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#E5E7EB",
  },
  artistName: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: "600",
    color: "#111827",
  },
  followBtn: {
    marginTop: 6,
    backgroundColor: "#111827",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  followText: { color: "#fff", fontSize: 12, fontWeight: "600" },
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
