// src/screens/SearchScreen.tsx

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

// 💡 IMPORT COMPONENT MỚI
import CategoryCard from "../components/CategoryCard";

// --- Dữ liệu Thể loại (Mock Data) ---
const categories = [
  { name: "Top Hits", color: "#6A5ACD" },
  { name: "Relax", color: "#4682B4" },
  { name: "Workout", color: "#DC143C" },
  { name: "Acoustic", color: "#FF8C00" },
  { name: "Jazz", color: "#3CB371" },
  { name: "Trending", color: "#FF4500" },
  // Thêm các category khác nếu muốn điền đủ lưới
];

const SearchScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [searchText, setSearchText] = useState("");

  // Hàm điều hướng đến màn hình chi tiết
  const handleCategoryPress = (categoryName: string) => {
    // 💡 Đảm bảo tên route "CategoryDetail" đã được đăng ký trong Stack Navigator
    navigation.navigate("CategoryDetail", { categoryName });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Tìm kiếm</Text>
        <TouchableOpacity
          onPress={() => {
            /* Điều hướng đến Profile */
          }}
        >
          <Ionicons name="person-circle-outline" size={32} color="#111827" />
        </TouchableOpacity>
      </View>

      {/* Input Tìm kiếm */}
      <View style={styles.searchBox}>
        <Ionicons
          name="search"
          size={20}
          color="#6B7280"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.input}
          placeholder="Tìm bài hát, nghệ sĩ hoặc album..."
          placeholderTextColor="#6B7280"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {/* Khám phá Danh mục */}
      <Text style={styles.sectionTitle}>Khám phá âm nhạc</Text>

      {/* 💡 SỬ DỤNG COMPONENT MỚI */}
      <View style={styles.grid}>
        {categories.map((category, index) => (
          <CategoryCard
            key={index}
            categoryName={category.name}
            backgroundColor={category.color}
            onPress={() => handleCategoryPress(category.name)}
          />
        ))}
      </View>
    </ScrollView>
  );
};

// --- Styles cho SearchScreen ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#111827",
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 25,
  },
  searchIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: "#111827",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 10,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 10,
  },
  // Lưu ý: CategoryCard styles đã được chuyển sang file riêng.
});

export default SearchScreen;
