import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  TextInput,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRoute, useNavigation } from "@react-navigation/native";
import { BASE_URL } from "../config";
import { withFullUrl } from "../utils/url";

export default function PlaylistDetail() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { playlist } = route.params;

  const [songs, setSongs] = useState<any[]>([]);
  const [allSongs, setAllSongs] = useState<any[]>([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  const [searchResults, setSearchResults] = useState({
    songs: [],
    albums: [],
    artists: [],
  });


  // 📦 Lấy danh sách bài hát trong playlist
  const loadSongs = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/api/playlists/${playlist._id}`);
      const data = await res.json();
      setSongs(data?.songs ? data.songs.map(withFullUrl) : []);
    } catch (err) {
      console.error("❌ Lỗi tải bài hát từ playlist:", err);
      setSongs([]);
    } finally {
      setLoading(false);
    }
  }, [playlist]);

  // 🎵 Lấy toàn bộ bài hát trên server
  const loadAllSongs = useCallback(async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/songs`);
      const data = await res.json();
      setAllSongs(data.map(withFullUrl));
    } catch (err) {
      console.error("❌ Lỗi tải danh sách bài hát:", err);
    }
  }, []);

  useEffect(() => {
    loadSongs();
    loadAllSongs();
  }, [loadSongs, loadAllSongs]);

  // ➕ Thêm bài hát vào playlist
  const handleAddSong = async (songId: string) => {
    try {
      setAdding(true);
      const res = await fetch(
        `${BASE_URL}/api/playlists/${playlist._id}/add-song`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ songId }),
        }
      );
      if (res.ok) {
        Alert.alert("✅ Thành công", "Đã thêm bài hát vào playlist");
        loadSongs(); // tải lại danh sách
      } else {
        const errData = await res.json();
        Alert.alert("⚠️ Lỗi", errData.message || "Không thể thêm bài hát");
      }
    } catch (err) {
      console.error("❌ Lỗi khi thêm bài hát:", err);
    } finally {
      setAdding(false);
    }
  };

  // 🔍 Lọc bài hát theo tìm kiếm
  const filteredSongs = allSongs.filter((s) =>
    s.title.toLowerCase().includes(searchText.toLowerCase())
  );

  const renderSong = ({ item, index }: any) => (
    <TouchableOpacity
      key={item._id}
      style={styles.songRow}
      onPress={() =>
        navigation.navigate("PlayScreen", {
          song: item,
          queue: songs,
          index,
        })
      }
    >
      <Image source={{ uri: item.image }} style={styles.songImage} />
      <View style={{ flex: 1 }}>
        <Text style={styles.songTitle}>{item.title}</Text>
        <Text style={styles.songArtist}>{item.artist}</Text>
      </View>
      <Ionicons name="play-circle-outline" size={26} color="#1DB954" />
    </TouchableOpacity>
  );

  const renderSearchSong = ({ item }: any) => (
    <View style={styles.songRow}>
      <Image source={{ uri: item.image }} style={styles.songImage} />
      <View style={{ flex: 1 }}>
        <Text style={styles.songTitle}>{item.title}</Text>
        <Text style={styles.songArtist}>{item.artist}</Text>
      </View>
      <TouchableOpacity onPress={() => handleAddSong(item._id)}>
        <Ionicons name="add-circle-outline" size={28} color="#111827" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={26} color="#111827" />
        </TouchableOpacity>
        <View style={{ width: 26 }} />
      </View>

      {/* Info */}
      <View style={styles.fixedInfo}>
        <Image
          source={{
            uri: playlist.cover
              ? playlist.cover.startsWith("http")
                ? playlist.cover
                : `${BASE_URL}${playlist.cover.startsWith("/") ? "" : "/"}${playlist.cover}`
              : "https://cdn-icons-png.flaticon.com/512/4825/4825038.png",
          }}
          style={styles.cover}
        />
        <Text style={styles.title}>{playlist.name}</Text>
        {playlist.description && (
          <Text style={styles.desc}>{playlist.description}</Text>
        )}
      </View>

      {/* Thanh tìm kiếm */}
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color="#6B7280" />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm bài hát để thêm..."
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {/* Nếu có tìm kiếm thì hiển thị danh sách bài hát toàn bộ */}
      {searchText.length > 0 ? (
        <FlatList
          data={filteredSongs}
          keyExtractor={(item) => item._id}
          renderItem={renderSearchSong}
          contentContainerStyle={{ paddingBottom: 100 }}
          ListEmptyComponent={
            <Text style={styles.noSongs}>Không tìm thấy bài hát nào.</Text>
          }
        />
      ) : loading ? (
        <ActivityIndicator size="large" color="#111827" style={{ marginTop: 40 }} />
      ) : songs.length === 0 ? (
        <Text style={styles.noSongs}>Playlist này chưa có bài hát nào.</Text>
      ) : (
        <FlatList
          data={songs}
          keyExtractor={(item) => item._id}
          renderItem={renderSong}
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  fixedInfo: {
    alignItems: "center",
    paddingHorizontal: 16,
  },
  cover: {
    width: 240,
    height: 240,
    borderRadius: 12,
    marginBottom: 15,
    backgroundColor: "#E5E7EB",
  },
  title: { fontSize: 26, fontWeight: "800", color: "#111827" },
  desc: { color: "#6B7280", fontSize: 14, marginTop: 6 },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginTop: 18,
    marginBottom: 10,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  searchInput: {
    flex: 1,
    fontSize: 15,
    marginLeft: 10,
    color: "#111827",
    paddingVertical: 4,
  },

  songRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 10,
    marginHorizontal: 16,
  },
  songImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: "#E5E7EB",
  },
  songTitle: { fontSize: 16, fontWeight: "600", color: "#1F2937" },
  songArtist: { fontSize: 13, color: "#6B7280" },
  noSongs: { color: "#6B7280", textAlign: "center", marginTop: 20 },

});
