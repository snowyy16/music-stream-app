import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Pressable,
  Platform,
  Image,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../types/navigation";
import { Ionicons } from "@expo/vector-icons";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import { BASE_URL } from "../config";
import { withFullUrl } from "../utils/url";
import { usePlayer } from "../player/store";

interface Song {
  _id: string;
  title: string;
  artist: string;
  image: string;
  url: string;
  category?: string;
}

type CategoryDetailRouteProp = RouteProp<
  { CategoryDetail: { categoryName: string } },
  "CategoryDetail"
>;

type CategoryDetailNavProp = StackNavigationProp<
  RootStackParamList,
  "CategoryDetail"
>;

export default function CategoryDetailScreen() {
  const insets = useSafeAreaInsets();
  const route = useRoute<CategoryDetailRouteProp>();
  const navigation = useNavigation<CategoryDetailNavProp>();
  const categoryName = route.params?.categoryName ?? "Top Hits";

  const [tracks, setTracks] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const { song: currentSong } = usePlayer();

  useEffect(() => {
    const fetchSongsByCategory = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${BASE_URL}/api/songs?category=${encodeURIComponent(categoryName)}`
        );
        const data: Song[] = await res.json();
        setTracks(data.map(withFullUrl));
      } catch (error) {
        console.error("❌ Lỗi tải bài hát theo thể loại:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSongsByCategory();
  }, [categoryName]);

  return (

    <View style={styles.container}>
      <View style={[styles.headerContainer, { marginTop: insets.top + 5 }]}>
        <Pressable
          android_ripple={{ color: "#fff", borderless: true }}
          style={styles.button}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color="white" />
        </Pressable>

        <View style={styles.titleContainer}>
          <Text style={styles.title}>{categoryName}</Text>
          <Text style={styles.subtitle}>{tracks.length} bài hát</Text>
        </View>
      </View>



      {loading ? (
        <ActivityIndicator
          size="large"
          color="#1DB954"
          style={{ marginTop: 50 }}
        />
      ) : (
        <ScrollView contentContainerStyle={styles.listContainer}>
          {tracks.length === 0 ? (
            <Text style={styles.emptyText}>
              Không có bài hát nào trong thể loại này.
            </Text>
          ) : (
            tracks.map((track, index) => (
              <TouchableOpacity
                key={track._id}
                style={styles.trackItem}
                onPress={() =>
                  navigation.navigate("PlayScreen", {
                    queue: tracks,
                    index,
                  })
                }
              >
                <Image source={{ uri: track.image }} style={styles.songImage} />
                <View style={styles.trackInfo}>
                  <Text style={styles.trackTitle}>{track.title}</Text>
                  <Text style={styles.trackArtist}>{track.artist}</Text>
                </View>
                <Ionicons name="play-circle" size={28} color="#111827" />
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#fff", 
    paddingHorizontal: 20,
  },

  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    marginBottom: 16,
  },

  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },

  titleContainer: {
    flex: 1,
    alignItems: "center",
    marginRight: 40, // bù lại đúng bằng kích thước nút back
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
  },

  subtitle: {
    fontSize: 14,
    color: "#6B7280",
  },

  listContainer: { paddingTop: 10 },

  trackItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    borderRadius: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
    marginBottom: 8,
  },

  songImage: { width: 60, height: 60, borderRadius: 10, marginRight: 12 },
  trackInfo: { flex: 1, marginRight: 10 },
  trackTitle: { fontSize: 16, fontWeight: "600", color: "#111827" },
  trackArtist: { fontSize: 13, color: "#6B7280" },
  emptyText: { fontSize: 16, color: "#6B7280", textAlign: "center", marginTop: 50 },
});

