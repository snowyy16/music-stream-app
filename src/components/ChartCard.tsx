// src/components/ChartCard.tsx
import React from "react";
import { TouchableOpacity, Image, Text, StyleSheet } from "react-native";

export default function ChartCard({
  item,
}: {
  item: { id: string; title: string; caption: string; image: string };
}) {
  return (
    <TouchableOpacity style={styles.chartCard}>
      <Image source={{ uri: item.image }} style={styles.chartImage} />
      <Text style={styles.chartTitle}>{item.title}</Text>
      <Text style={styles.chartCaption}>{item.caption}</Text>
      <Text style={styles.chartSub}>Daily chart-toppers update</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chartCard: {
    width: 140,
    borderRadius: 12,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#eceff3",
    overflow: "hidden",
    marginRight: 12,
  },
  chartImage: { width: "100%", height: 90 },
  chartTitle: {
    marginTop: 8,
    paddingHorizontal: 10,
    fontWeight: "800",
    fontSize: 16,
  },
  chartCaption: {
    paddingHorizontal: 10,
    color: "#6f7780",
    fontWeight: "700",
    marginTop: 2,
  },
  chartSub: {
    paddingHorizontal: 10,
    color: "#8a8f99",
    fontSize: 12,
    marginTop: 6,
    marginBottom: 10,
  },
});
