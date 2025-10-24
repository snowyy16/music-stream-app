import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function HomeScreen() {
  const navigation = useNavigation<any>();

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Chào mừng trở lại 👋</Text>
          <Text style={styles.subtitle}>Khám phá âm nhạc hôm nay</Text>
        </View>
        <TouchableOpacity>
          <Image
            style={styles.avatar}
            source={{ uri: "https://i.pravatar.cc/150?img=12" }}
          />
        </TouchableOpacity>
      </View>

      {/* Playlist đề xuất */}
      <Text style={styles.sectionTitle}>Dành riêng cho bạn</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {playlists.map((item, index) => (
          <TouchableOpacity key={index} style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.cardImage} />
            <Text style={styles.cardTitle}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Trending section */}
      <Text style={styles.sectionTitle}>Đang thịnh hành 🔥</Text>
      {trendingSongs.map((song, index) => (
        <TouchableOpacity key={index} style={styles.songRow}>
          <Image source={{ uri: song.image }} style={styles.songImage} />
          <View style={styles.songInfo}>
            <Text style={styles.songTitle}>{song.title}</Text>
            <Text style={styles.songArtist}>{song.artist}</Text>
          </View>
        </TouchableOpacity>
      ))}

      {/* Button sang Feed */}
      <TouchableOpacity
        style={styles.feedButton}
        onPress={() => navigation.navigate("Feed")}
      >
        <Text style={styles.feedButtonText}>🎧 Đi đến Feed</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const playlists = [
  { title: "Top Hits 2025", image: "https://picsum.photos/200?random=1" },
  { title: "Relax & Chill", image: "https://picsum.photos/200?random=2" },
  { title: "Workout Mix", image: "https://picsum.photos/200?random=3" },
];

const trendingSongs = [
  {
    title: "Shape of You",
    artist: "Ed Sheeran",
    image: "https://picsum.photos/100?random=4",
  },
  {
    title: "Blinding Lights",
    artist: "The Weeknd",
    image: "https://picsum.photos/100?random=5",
  },
  {
    title: "Levitating",
    artist: "Dua Lipa",
    image: "https://picsum.photos/100?random=6",
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
  },
  subtitle: {
    fontSize: 15,
    color: "#6B7280",
    marginTop: 4,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#E5E7EB",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111827",
    marginVertical: 16,
  },
  card: {
    alignItems: "center",
    marginRight: 16,
  },
  cardImage: {
    width: 135,
    height: 135,
    borderRadius: 14,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "500",
    color: "#374151",
    textAlign: "center",
  },
  songRow: {
    flexDirection: "row",
    alignItems: "center",
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
  songImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 12,
  },
  songInfo: { flex: 1 },
  songTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  songArtist: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 2,
  },
  feedButton: {
    marginTop: 30,
    backgroundColor: "#111827",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  feedButtonText: {
    color: "white",
    fontSize: 17,
    fontWeight: "700",
  },
});
