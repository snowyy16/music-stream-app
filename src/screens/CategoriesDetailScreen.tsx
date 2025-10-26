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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import { Button } from "react-native-paper";

// ================== TYPE DEFINITIONS ==================
type Track = {
  id: number;
  title: string;
  artist: string;
  duration: string;
};

type CategoryName =
  | "Top Hits"
  | "Relax"
  | "Workout"
  | "Acoustic"
  | "Jazz"
  | "Trending";

type MockTracksType = Record<CategoryName, Track[]>;

type CategoryDetailRouteProp = RouteProp<
  { CategoryDetail: { categoryName: CategoryName } },
  "CategoryDetail"
>;

// ================== MOCK DATA ==================
const mockTracks: MockTracksType = {
  "Top Hits": [
    { id: 1, title: "FLOWER", artist: "Jessica Gonzalez", duration: "3:36" },
    { id: 2, title: "Blinding Lights", artist: "The Weeknd", duration: "4:39" },
    { id: 3, title: "Levitating", artist: "Dua Lipa", duration: "7:48" },
    { id: 4, title: "Shape of You", artist: "Ed Sheeran", duration: "4:23" },
    { id: 5, title: "Uptown Funk", artist: "Bruno Mars", duration: "4:30" },
  ],
  Relax: [
    { id: 6, title: "Weightless", artist: "Marconi Union", duration: "8:00" },
    { id: 7, title: "Watermark", artist: "Enya", duration: "3:25" },
    { id: 8, title: "Sunset Lover", artist: "Petit Biscuit", duration: "3:55" },
    { id: 9, title: "Letting Go", artist: "BT", duration: "6:12" },
    { id: 10, title: "Bloom", artist: "Odesza", duration: "4:00" },
  ],
  Workout: [
    { id: 11, title: "Eye of the Tiger", artist: "Survivor", duration: "4:04" },
    { id: 12, title: "Stronger", artist: "Kanye West", duration: "5:11" },
    { id: 13, title: "Titanium", artist: "David Guetta", duration: "4:05" },
    { id: 14, title: "Can't Hold Us", artist: "Macklemore", duration: "4:18" },
    { id: 15, title: "Don't Stop Me Now", artist: "Queen", duration: "3:29" },
  ],
  Acoustic: [
    { id: 16, title: "Photograph", artist: "Ed Sheeran", duration: "4:19" },
    { id: 17, title: "Let Her Go", artist: "Passenger", duration: "4:12" },
    { id: 18, title: "Someone Like You", artist: "Adele", duration: "4:45" },
    { id: 19, title: "Hero", artist: "Enrique Iglesias", duration: "4:24" },
    { id: 20, title: "The A Team", artist: "Ed Sheeran", duration: "4:18" },
  ],
  Jazz: [
    { id: 21, title: "So What", artist: "Miles Davis", duration: "9:22" },
    { id: 22, title: "Take Five", artist: "Dave Brubeck", duration: "5:24" },
    { id: 23, title: "Blue in Green", artist: "Bill Evans", duration: "5:37" },
    { id: 24, title: "Feeling Good", artist: "Nina Simone", duration: "2:54" },
    {
      id: 25,
      title: "My Favorite Things",
      artist: "John Coltrane",
      duration: "13:41",
    },
  ],
  Trending: [
    { id: 26, title: "Cruel Summer", artist: "Taylor Swift", duration: "2:58" },
    {
      id: 27,
      title: "Paint The Town Red",
      artist: "Doja Cat",
      duration: "3:50",
    },
    { id: 28, title: "Vampire", artist: "Olivia Rodrigo", duration: "3:40" },
    { id: 29, title: "Bad Habit", artist: "Steve Lacy", duration: "3:52" },
    { id: 30, title: "As It Was", artist: "Harry Styles", duration: "2:47" },
  ],
};

// ================== COMPONENT ==================
const CategoryDetailScreen: React.FC = (navgation) => {
  const route = useRoute<CategoryDetailRouteProp>();
  const navigation = useNavigation();
  const categoryName = route.params?.categoryName ?? "Top Hits";

  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const fetchedTracks = mockTracks[categoryName] || [];
      setTracks(fetchedTracks);
      setLoading(false);
    }, 800);
  }, [categoryName]);

  return (
    <View style={styles.container}>
      <Pressable
        android_ripple={{
          color: "#fff",
          borderless: true,
        }}
        style={({ pressed }) => [
          styles.button,
          pressed && Platform.OS === "ios" ? { opacity: 0.1 } : null,
        ]}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="chevron-back" size={24} color="white" />
      </Pressable>
      <Text style={styles.title}>{categoryName} Tracks</Text>

      <Text style={styles.subtitle}>{tracks.length} bài hát</Text>

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
              <TouchableOpacity key={track.id} style={styles.trackItem}>
                <Text style={styles.trackIndex}>{index + 1}.</Text>
                <View style={styles.trackInfo}>
                  <Text style={styles.trackTitle}>{track.title}</Text>
                  <Text style={styles.trackArtist}>{track.artist}</Text>
                </View>
                <Text style={styles.trackDuration}>{track.duration}</Text>
                <Ionicons
                  name="ellipsis-vertical"
                  size={20}
                  color="#6B7280"
                  style={{ marginLeft: 10 }}
                />
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
};

// ================== STYLES ==================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 50,
    marginTop: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#111827",
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 20,
  },
  listContainer: {
    paddingTop: 10,
  },
  trackItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  trackIndex: {
    fontSize: 16,
    color: "#6B7280",
    marginRight: 15,
  },
  trackInfo: {
    flex: 1,
  },
  trackTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  trackArtist: {
    fontSize: 13,
    color: "#6B7280",
  },
  trackDuration: {
    fontSize: 14,
    color: "#6B7280",
  },
  emptyText: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 50,
  },
  button: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.6)", // nền mờ như Spotify
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 10,
    left: 10,
    zIndex: 10,

    // Shadow iOS
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 4 },
    // shadowOpacity: 0.3,
    // shadowRadius: 4,

    // Shadow Android
    elevation: 6,
  },
});

export default CategoryDetailScreen;
