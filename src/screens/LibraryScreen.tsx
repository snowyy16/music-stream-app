import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { BottomTabParamList } from "../types/navigation";
// Định nghĩa Props cho màn hình này
type Props = BottomTabScreenProps<BottomTabParamList, "Library">;

export default function LibraryScreen({ navigation }: Props) {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Thư Viện Của Bạn</Text>

      {/* 1. Phần Playlists */}
      <Text style={styles.sectionTitle}>Playlists</Text>
      {playlists.map((item, index) => (
        <TouchableOpacity key={index} style={styles.listItem}>
          <Image source={{ uri: item.image }} style={styles.listImageSquare} />
          <View style={styles.listInfo}>
            <Text style={styles.listTitle}>{item.title}</Text>
            <Text style={styles.listSubtitle}>
              Playlist • {item.count} bài hát
            </Text>
          </View>
        </TouchableOpacity>
      ))}

      {/* 2. Phần Artists */}
      <Text style={styles.sectionTitle}>Nghệ Sĩ</Text>
      {artists.map((item, index) => (
        <TouchableOpacity key={index} style={styles.listItem}>
          <Image
            source={{
              uri:
                item.image ||
                `https://picsum.photos/100?random=${index + 200}`, // fallback khi chưa có ảnh
            }}
            style={styles.listImageCircle}
          />
          <View style={styles.listInfo}>
            <Text style={styles.listTitle}>{item.name}</Text>
            <Text style={styles.listSubtitle}>Nghệ sĩ</Text>
          </View>
        </TouchableOpacity>
      ))}



      {/* 3. Phần Albums */}
      <Text style={styles.sectionTitle}>Albums</Text>
      {albums.map((item, index) => (
        <TouchableOpacity key={index} style={styles.listItem}>
          <View style={styles.listInfo}>
            <Text style={styles.listTitle}>{item.title}</Text>
            <Text style={styles.listSubtitle}>Album • {item.artist}</Text>
          </View>
        </TouchableOpacity>
      ))}

      {/* Khoảng cách cuối cùng */}
      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

// Dữ liệu giả định
const playlists = [
  {
    title: "My Liked Songs",
    image: "https://picsum.photos/100?random=101",
    count: 250,
  },
  {
    title: "Nhạc Ngủ",
    image: "https://picsum.photos/100?random=102",
    count: 45,
  },
  {
    title: "Running Mix 2024",
    image: "https://picsum.photos/100?random=103",
    count: 70,
  },
];

const artists = [
  {
    name: "The Weeknd",
    image: "https://upload.wikimedia.org/wikipedia/en/a/a0/The_Weeknd_-_After_Hours.png",
  },
  {
    name: "Taylor Swift",
    image: "https://upload.wikimedia.org/wikipedia/en/f/f6/Taylor_Swift_-_Midnights.png",
  },
  {
    name: "Đen Vâu",
    image: "https://upload.wikimedia.org/wikipedia/commons/f/f7/%C4%90en_Vau_2022.jpg",
  },
];


const albums = [
  {
    title: "After Hours",
    artist: "The Weeknd",
  },
  {
    title: "Midnights",
    artist: "Taylor Swift",
  },
];

const styles = StyleSheet.create({
  // 1. Container (Nền toàn bộ: Trắng)
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF", // Màu Trắng
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  // 2. Title (Màu chữ: Đen)
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#000000", // Màu Đen
    marginBottom: 20,
  },
  // 3. Section Title (Màu chữ: Đen)
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000000", // Màu Đen
    marginTop: 25,
    marginBottom: 10,
  },
  // 4. List Item (Nền: Trắng, thêm chút border/shadow để phân biệt)
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    backgroundColor: "#FFFFFF", // Nền Trắng
  },
  listImageSquare: {
    width: 60,
    height: 60,
    borderRadius: 6,
    marginRight: 15,
  },
  listImageCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  listInfo: {
    justifyContent: "center",
  },
  // 5. List Title (Màu chữ: Đen)
  listTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000", // Màu Đen
  },
  // 6. List Subtitle (Màu chữ: Xám đậm)
  listSubtitle: {
    fontSize: 14,
    color: "#6B7280", // Xám đậm
    marginTop: 2,
  },
});
