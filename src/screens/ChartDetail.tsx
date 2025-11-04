import React, { useCallback, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { BASE_URL } from "../config";
import { withFullUrl } from "../utils/url";

export default function ChartDetail() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { chart } = route.params;
  const [songs, setSongs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadSongs = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/api/charts/${chart._id}`);
      const data = await res.json();
      if (data?.songs) {
        setSongs(data.songs.map(withFullUrl));
      } else {
        setSongs(chart.songs || []);
      }
    } catch (err) {
      console.error("❌ Lỗi tải bài hát từ chart:", err);
      setSongs(chart.songs || []);
    } finally {
      setLoading(false);
    }
  }, [chart]);

  useEffect(() => {
    loadSongs();
  }, [loadSongs]);

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
      <Image
        source={{
          uri: item.image?.startsWith("http")
            ? item.image
            : `${BASE_URL}/image/${encodeURIComponent(item.image)}`,
        }}
        style={styles.songImage}
      />

      <View style={{ flex: 1 }}>
        <Text style={styles.songTitle}>{item.title}</Text>
        <Text style={styles.songArtist}>{item.artist}</Text>
      </View>
      <Ionicons name="play-circle-outline" size={26} color="#1DB954" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header cố định */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={26} color="#111827" />
        </TouchableOpacity>
        <View style={{ width: 26 }} />
      </View>

      {/* Thông tin Chart cố định */}
      <View style={styles.fixedInfo}>
        <Image
          source={{
            uri: chart.cover?.startsWith("http")
              ? chart.cover
              : `${BASE_URL}/image/${chart.cover}`,
          }}
          style={styles.cover}
        />

        <Text style={styles.title}>{chart.name}</Text>
        {chart.description && <Text style={styles.desc}>{chart.description}</Text>}

        <TouchableOpacity
          style={styles.playAllBtn}
          onPress={() => {
            if (songs.length > 0) {
              navigation.navigate("PlayScreen", {
                song: songs[0],
                queue: songs,
                index: 0,
              });
            }
          }}
        >
          <Ionicons name="play" size={18} color="#fff" />
          <Text style={styles.playAllText}>Play All</Text>
        </TouchableOpacity>
      </View>

      {/* Danh sách bài hát */}
      {loading ? (
        <ActivityIndicator size="large" color="#111827" style={{ marginTop: 40 }} />
      ) : songs.length === 0 ? (
        <Text style={styles.noSongs}>Chart này chưa có bài hát nào.</Text>
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
    marginBottom: 10,
  },
  cover: {
    width: 250,
    height: 250,
    borderRadius: 12,
    marginBottom: 15,
    backgroundColor: "#E5E7EB",
  },
  title: { fontSize: 26, fontWeight: "800", color: "#111827", textAlign: "center" },
  desc: { color: "#6B7280", fontSize: 14, marginTop: 6, textAlign: "center" },
  playAllBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2e312fff",
    borderRadius: 30,
    paddingHorizontal: 22,
    paddingVertical: 10,
    marginTop: 14,
  },
  playAllText: { color: "#fff", fontWeight: "700", fontSize: 15, marginLeft: 8 },
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
  },
  songTitle: { fontSize: 16, fontWeight: "600", color: "#1F2937" },
  songArtist: { fontSize: 13, color: "#6B7280" },
  noSongs: { color: "#6B7280", textAlign: "center", marginTop: 20 },
});
