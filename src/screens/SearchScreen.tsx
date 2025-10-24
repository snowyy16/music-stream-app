import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const categories = [
  { id: 1, title: "Top Hits", image: "https://i.imgur.com/KT7aQKp.jpg" },
  { id: 2, title: "Relax", image: "https://i.imgur.com/FSvwN2b.jpg" },
  { id: 3, title: "Workout", image: "https://i.imgur.com/b5Y6aBj.jpg" },
  { id: 4, title: "Acoustic", image: "https://i.imgur.com/4Dq2Vdj.jpg" },
  { id: 5, title: "Jazz", image: "https://i.imgur.com/D4fOH9l.jpg" },
  { id: 6, title: "Trending", image: "https://i.imgur.com/Fi7kqUM.jpeg" },
];

export const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <ScrollView style={styles.container}>
      {/* Search Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Tìm kiếm</Text>
        <Ionicons name="person-circle-outline" size={40} color="#1F2937" />
      </View>

      {/* Search Bar */}
      <View style={styles.searchBar}>
        <Ionicons name="search-outline" size={22} color="#6B7280" />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm bài hát, nghệ sĩ hoặc album..."
          placeholderTextColor="#9CA3AF"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Suggested Categories */}
      <Text style={styles.sectionTitle}>Khám phá âm nhạc</Text>
      <View style={styles.grid}>
        {categories.map((item) => (
          <TouchableOpacity key={item.id} style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.cardImage} />
            <Text style={styles.cardTitle}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB", paddingHorizontal: 20 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 50,
    marginBottom: 20,
  },
  title: { fontSize: 28, fontWeight: "700", color: "#111827" },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    marginBottom: 24,
  },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 16, color: "#111827" },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 12,
    color: "#111827",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    marginBottom: 16,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  cardImage: { width: "100%", height: 120 },
  cardTitle: {
    padding: 10,
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
});

export default SearchScreen;
