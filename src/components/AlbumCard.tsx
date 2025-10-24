// src/components/AlbumCard.tsx
import React from "react";
import { TouchableOpacity, Image, Text, StyleSheet } from "react-native";

export default function AlbumCard({
  item,
}: {
  item: { id: string; title: string; artist: string; image: string };
}) {
  return (
    <TouchableOpacity style={styles.albumCard}>
      <Image source={{ uri: item.image }} style={styles.albumImage} />
      <Text numberOfLines={1} style={styles.albumTitle}>
        {item.title}
      </Text>
      <Text numberOfLines={1} style={styles.albumArtist}>
        {item.artist}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  albumCard: { width: 140, marginRight: 12 },
  albumImage: {
    width: 140,
    height: 140,
    borderRadius: 12,
    backgroundColor: "#eee",
  },
  albumTitle: { marginTop: 8, fontWeight: "700" },
  albumArtist: { color: "#6f7780", fontSize: 12, marginTop: 2 },
});
