import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

// --- Data Mock ---
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

// --- Component: Banner Quảng cáo Premium (Không đổi) ---
const PremiumBanner = () => {
  const navigation = useNavigation<any>();

  return (
    <TouchableOpacity
      style={styles.premiumBanner}
      onPress={() => navigation.navigate("PremiumSubscriptionScreen")}
    >
      <View style={styles.bannerContent}>
        <Ionicons name="sparkles" size={24} color="#FFD700" />
        <View style={{ marginLeft: 10 }}>
          <Text style={styles.bannerTitle}>Nâng cấp lên Premium!</Text>
          <Text style={styles.bannerSubtitle}>
            Nghe nhạc không quảng cáo & ngoại tuyến.
          </Text>
        </View>
      </View>
      <Ionicons name="arrow-forward-circle" size={30} color="#FFD700" />
    </TouchableOpacity>
  );
};

// --- Màn hình chính ---
export default function HomeScreen() {
  const navigation = useNavigation<any>();

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Chào buổi sáng, Ashley Scott</Text>
          <Text style={styles.subtitle}>Khám phá âm nhạc hôm nay</Text>
        </View>
        <TouchableOpacity>
          <Image
            style={styles.avatar}
            source={{ uri: "https://picsum.photos/id/1025/150/150" }}
          />
        </TouchableOpacity>
      </View>

      {/* Banner Premium */}
      <PremiumBanner />

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
          <Ionicons name="ellipsis-vertical" size={20} color="#6B7280" />
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

// --- Styles (Không đổi) ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 20,
    paddingTop: 50,
    marginTop: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },
  subtitle: {
    fontSize: 14,
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
  songImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 12,
  },
  songInfo: {
    flex: 1,
    marginRight: 10,
  },
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
    marginBottom: 40,
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
  premiumBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#333",
    padding: 15,
    borderRadius: 12,
    marginTop: 10,
    marginBottom: 5,
    shadowColor: "#FFD700",
    shadowOpacity: 0.4,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  bannerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  bannerSubtitle: {
    fontSize: 13,
    color: "#DDD",
    marginTop: 2,
  },
});
