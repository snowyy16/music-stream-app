// src/screens/PlaylistDetail.tsx
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { BASE_URL } from "../config";
import { withFullUrl } from "../utils/url";

type Song = {
  _id: string;
  title: string;
  artist: string;
  image: string;
  url: string;
  // ... các field khác nếu có
};

type Playlist = {
  _id: string;
  name: string;
  owner: string;
  cover: string;
  songCount?: number;
};

type RouteParams = {
  playlist: Playlist;
};

const MOCK_SONGS: Song[] = [
  {
    _id: "s1",
    title: "Shape of You",
    artist: "Ed Sheeran",
    image: "ShapeOfYou.jpg",
    url: "ShapeOfYou.mp3",
  },
  {
    _id: "s2",
    title: "Memories",
    artist: "Maroon 5",
    image: "Memories.jpg",
    url: "Memories.mp3",
  },
  {
    _id: "s3",
    title: "Perfect Duet",
    artist: "Ed Sheeran & Beyoncé",
    image: "PerfectDuet.jpg",
    url: "PerfectDuet.mp3",
  },
  {
    _id: "s4",
    title: "Ghost",
    artist: "Justin Bieber",
    image: "Ghost.jpg",
    url: "Ghost.mp3",
  },
];

export default function PlaylistDetail() {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<Record<string, RouteParams>, string>>();
  const playlist = route.params?.playlist;

  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- Fetch playlist songs ---
  const loadSongs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Nếu bạn có API thật, bật đoạn dưới và xoá fallback:
      // const res = await fetch(`${BASE_URL}/api/playlists/${playlist._id}/songs`);
      // if (!res.ok) throw new Error(`HTTP ${res.status}`);
      // const data: Song[] = await res.json();

      // Fallback mock (kèm normalize URL):
      const data = MOCK_SONGS;

      setSongs(data.map(withFullUrl));
    } catch (err: any) {
      console.error("Load playlist songs error:", err?.message || err);
      setError("Không tải được danh sách bài hát.");
      // Fallback vẫn hiển thị mock để demo
      setSongs(MOCK_SONGS.map(withFullUrl));
    } finally {
      setLoading(false);
    }
  }, [playlist?._id]);

  useEffect(() => {
    loadSongs();
  }, [loadSongs]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadSongs();
    setRefreshing(false);
  }, [loadSongs]);

  const headerInfo = useMemo(
    () => ({
      title: playlist?.name || "Playlist",
      owner: playlist?.owner || "Unknown",
      cover: playlist?.cover,
      count: songs.length || playlist?.songCount || 0,
    }),
    [playlist, songs.length]
  );

  const handlePlayAll = () => {
    if (songs.length === 0) return;
    navigation.navigate("PlayScreen", { queue: songs, index: 0 });
  };

  const handleShuffle = () => {
    if (songs.length === 0) return;
    const idx = Math.floor(Math.random() * songs.length);
    navigation.navigate("PlayScreen", { queue: songs, index: idx });
  };

  const renderSong = ({ item, index }: { item: Song; index: number }) => (
    <TouchableOpacity
      style={styles.songRow}
      onPress={() => navigation.navigate("PlayScreen", { queue: songs, index })}
      activeOpacity={0.8}
    >
      <Image source={{ uri: item.image }} style={styles.songImage} />
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={styles.songTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.songArtist} numberOfLines={1}>
          {item.artist}
        </Text>
      </View>
      <Ionicons name="play-circle" size={26} color="#111827" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Ionicons name="chevron-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {headerInfo.title}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Top section: Cover + info + actions */}
      <View style={styles.top}>
        <Image
          source={
            headerInfo.cover
              ? { uri: headerInfo.cover }
              : { uri: "https://placehold.co/300x300/png" }
          }
          style={styles.cover}
        />
        <Text style={styles.playlistName} numberOfLines={2}>
          {headerInfo.title}
        </Text>
        <Text style={styles.ownerText}>
          {headerInfo.owner} • {headerInfo.count} songs
        </Text>

        <View style={styles.actionRow}>
          <TouchableOpacity style={[styles.btn, styles.btnPrimary]} onPress={handlePlayAll} activeOpacity={0.9}>
            <Ionicons name="play" size={18} color="#fff" />
            <Text style={styles.btnPrimaryText}>Play All</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.btn, styles.btnGhost]} onPress={handleShuffle} activeOpacity={0.9}>
            <Ionicons name="shuffle" size={18} color="#111827" />
            <Text style={styles.btnGhostText}>Shuffle</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* List songs */}
      {loading ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator size="large" color="#111827" />
        </View>
      ) : (
        <FlatList
          data={songs}
          keyExtractor={(it) => it._id}
          renderItem={renderSong}
          contentContainerStyle={{ paddingHorizontal: 18, paddingBottom: 24 }}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#111827" />
          }
          ListHeaderComponent={<Text style={styles.sectionTitle}>Songs</Text>}
          ListEmptyComponent={
            <Text style={{ textAlign: "center", color: "#6B7280" }}>
              Chưa có bài hát trong playlist này.
            </Text>
          }
        />
      )}

      {/* Error toast đơn giản */}
      {error ? (
        <View style={styles.errorBar}>
          <Ionicons name="alert-circle" size={16} color="#fff" />
          <Text style={styles.errorText} numberOfLines={2}>
            {error}
          </Text>
        </View>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  header: {
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: { fontSize: 18, fontWeight: "600", color: "#111827", flex: 1, textAlign: "center" },
  top: { alignItems: "center", paddingHorizontal: 18 },
  cover: { width: 220, height: 220, borderRadius: 16, marginTop: 8, backgroundColor: "#E5E7EB" },
  playlistName: { fontSize: 22, fontWeight: "700", color: "#111827", textAlign: "center", marginTop: 12 },
  ownerText: { fontSize: 14, color: "#6B7280", marginTop: 6 },
  actionRow: { flexDirection: "row", alignItems: "center", gap: 12, marginTop: 14 },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    height: 40,
    borderRadius: 24,
  },
  btnPrimary: { backgroundColor: "#111827" },
  btnPrimaryText: { color: "#fff", fontWeight: "600" },
  btnGhost: { backgroundColor: "#F3F4F6" },
  btnGhostText: { color: "#111827", fontWeight: "600" },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginTop: 6,
    marginBottom: 12,
  },
  songRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 12,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  songImage: { width: 56, height: 56, borderRadius: 8, backgroundColor: "#E5E7EB" },
  songTitle: { fontSize: 16, fontWeight: "600", color: "#111827" },
  songArtist: { fontSize: 13, color: "#6B7280", marginTop: 2 },
  errorBar: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 24,
    backgroundColor: "#EF4444",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  errorText: { color: "#fff", fontSize: 13, flex: 1 },
});
