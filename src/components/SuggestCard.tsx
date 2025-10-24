// src/components/SuggestionCard.tsx
import React from "react";
import {
  TouchableOpacity,
  Image,
  View,
  Text,
  StyleSheet,
  Dimensions,
} from "react-native";

export type Suggestion = {
  id: string;
  title: string;
  subtitle: string;
  image: string;
};
const { width } = Dimensions.get("window");
const GRID_CARD_W = (width - 32 - 12) / 2;

export default function SuggestionCard({ item }: { item: Suggestion }) {
  return (
    <TouchableOpacity style={[styles.suggestCard, { width: GRID_CARD_W }]}>
      <Image source={{ uri: item.image }} style={styles.suggestImage} />
      <View style={styles.suggestOverlay} />
      <View style={styles.suggestTextWrap}>
        <Text numberOfLines={1} style={styles.suggestTitle}>
          {item.title}
        </Text>
        <Text numberOfLines={1} style={styles.suggestSubtitle}>
          {item.subtitle}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  suggestCard: {
    height: GRID_CARD_W * 1.05,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#ddd",
    marginRight: 12,
  },
  suggestImage: { width: "100%", height: "100%" },
  suggestOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  suggestTextWrap: { position: "absolute", left: 12, right: 12, bottom: 12 },
  suggestTitle: { color: "#fff", fontWeight: "800", fontSize: 16 },
  suggestSubtitle: { color: "#f0f0f0", marginTop: 2, fontSize: 12 },
});
