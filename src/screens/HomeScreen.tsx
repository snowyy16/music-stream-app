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
  const [artists, setArtists] = useState<any[]>([]);

  useEffect(() => {
    // Lấy danh sách bài hát
    fetch(`${BASE_URL}/api/songs`)
      .then((res) => res.json())
      .then((data) => setSongs(data.map(withFullUrl).slice(0, 50)))
      .catch(() => { })
      .finally(() => setLoading(false));

    // Lấy danh sách nghệ sĩ
    fetch(`${BASE_URL}/api/artists`)
      .then((res) => res.json())
      .then((data) => setArtists(data))
      .catch((err) => console.log("Lỗi lấy nghệ sĩ:", err));
  }, []);

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
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    // Lấy danh sách bài hát
    fetch(`${BASE_URL}/api/songs`)
      .then((res) => res.json())
      .then((data) => setSongs(data.map(withFullUrl).slice(0, 50)))
      .catch(() => { })
      .finally(() => setLoading(false));

    // Lấy danh sách nghệ sĩ
    fetch(`${BASE_URL}/api/artists`)
      .then((res) => res.json())
      .then((data) => setArtists(data.slice(0, 10)))
      .catch((err) => console.log("Lỗi lấy nghệ sĩ:", err));
  }, []);

  const suggestions = songs.slice(0, 2);
  const trendingAlbums = songs.slice(2, 5);


  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.username}>Hi, {displayedUsername}</Text>
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
        <Text style={styles.sectionTitle}>Trending albums</Text>
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
            {/* Hiển thị ảnh nền */}
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


      {/* Popular artists */}
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
            onPress={() =>
              navigation.navigate("ArtistDetail", {
                artist: item,
              })
            }
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
  username: {
    fontSize: 30,
    fontWeight: "800",
    color: "#1F2937",
    marginBottom: 20,
  },
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
    position: "relative",
    width: 130,
    height: 130,
    borderRadius: 16,
    marginRight: 14,
    overflow: "hidden",
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },

  chartImage: {
    width: "100%",
    height: "100%",
    borderRadius: 16,
    position: "absolute",
  },

  chartOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 8,
    borderRadius: 16,
  },

  chartTitle: { fontSize: 18, fontWeight: "700", color: "#fff" },
  chartSub: { fontSize: 14, color: "#1DB954", marginTop: 4 },
  chartDesc: {
    fontSize: 12,
    color: "#E5E7EB",
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
