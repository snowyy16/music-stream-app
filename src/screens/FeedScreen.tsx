// src/screens/FeedScreen.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { feedData } from "../utils/mockData";
import colors from "../theme/colors";

const FeedCard: React.FC<{ item: (typeof feedData)[0] }> = ({ item }) => (
  <View style={styles.card}>
    <View style={styles.row}>
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={{ flex: 1 }}>
        <Text style={styles.user}>{item.user}</Text>
        <Text style={styles.time}>{item.time}</Text>
      </View>
      <Ionicons name="ellipsis-horizontal" size={20} color="#777" />
    </View>

    <View style={styles.songRow}>
      <Image source={{ uri: item.cover }} style={styles.cover} />
      <View style={{ flex: 1, marginLeft: 10 }}>
        <Text style={styles.song}>{item.song}</Text>
        <Text style={styles.artist}>{item.artist}</Text>
      </View>
      <TouchableOpacity style={styles.playBtn}>
        <Ionicons name="play" size={20} color="#fff" />
      </TouchableOpacity>
    </View>

    <View style={styles.actions}>
      <TouchableOpacity>
        <Ionicons name="heart-outline" size={22} color="#444" />
      </TouchableOpacity>
      <TouchableOpacity>
        <Ionicons name="chatbubble-outline" size={22} color="#444" />
      </TouchableOpacity>
      <TouchableOpacity>
        <Ionicons name="share-social-outline" size={22} color="#444" />
      </TouchableOpacity>
    </View>
  </View>
);

export default function FeedScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Feed</Text>
      </View>

      <FlatList
        data={feedData}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => <FeedCard item={item} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    paddingTop: 45,
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 24, fontWeight: "800", color: colors.text },
  card: { padding: 16, borderBottomColor: "#f0f0f0", borderBottomWidth: 1 },
  row: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  avatar: { width: 46, height: 46, borderRadius: 23, marginRight: 12 },
  user: { fontSize: 16, fontWeight: "700", color: colors.text },
  time: { color: "#777", fontSize: 12 },
  songRow: { flexDirection: "row", alignItems: "center" },
  cover: { width: 70, height: 70, borderRadius: 8, backgroundColor: "#eee" },
  song: { fontSize: 16, fontWeight: "700", color: colors.text },
  artist: { color: "#777", marginTop: 2 },
  playBtn: {
    width: 40,
    height: 40,
    backgroundColor: colors.primary,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    paddingHorizontal: 60,
  },
});
