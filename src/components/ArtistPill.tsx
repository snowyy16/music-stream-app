// src/components/ArtistPill.tsx
import React from "react";
import { View, Image, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function ArtistPill({
  item,
}: {
  item: { id: string; name: string; image: string };
}) {
  return (
    <View style={styles.artistWrap}>
      <Image source={{ uri: item.image }} style={styles.artistAvatar} />
      <Text numberOfLines={1} style={styles.artistName}>
        {item.name}
      </Text>
      <TouchableOpacity style={styles.followBtn}>
        <Text style={styles.followTxt}>Follow</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  artistWrap: {
    width: 160,
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#eceff3",
    paddingVertical: 14,
    marginRight: 12,
  },
  artistAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#eee",
  },
  artistName: { marginTop: 10, fontWeight: "700" },
  followBtn: {
    marginTop: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#171a1f",
  },
  followTxt: { color: "#fff", fontWeight: "700", fontSize: 12 },
});
