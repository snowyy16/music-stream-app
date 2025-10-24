// src/components/TopBar.tsx
import React from "react";
import { View, Image, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../theme/color";

export default function TopBar() {
  return (
    <View style={styles.topbar}>
      <View style={styles.logoDot} />
      <View style={{ flexDirection: "row", gap: 16, alignItems: "center" }}>
        <Ionicons name="notifications-outline" size={22} color="#2b2b2b" />
        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=240&auto=format&fit=crop",
          }}
          style={styles.avatar}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topbar: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logoDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#e74d5b",
  },
  avatar: { width: 28, height: 28, borderRadius: 14, backgroundColor: "#ddd" },
});
