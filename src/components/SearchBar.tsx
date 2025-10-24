// src/components/SearchBar.tsx
import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../theme/colors";

export default function SearchBar() {
  return (
    <View style={styles.searchWrap}>
      <Ionicons name="search" size={18} color="#9aa1ac" />
      <TextInput
        placeholder="What you want to listen to"
        placeholderTextColor="#9aa1ac"
        style={styles.searchInput}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  searchWrap: {
    marginTop: 14,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: "#e6e8ec",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f7f8fa",
  },
  searchInput: { flex: 1, fontSize: 14, color: "#1e1f24" },
});
