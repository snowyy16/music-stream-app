
import React from "react";
import { StyleSheet, Text, TouchableOpacity, ViewStyle } from "react-native";

// 1. Định nghĩa kiểu dữ liệu cho props của component
interface CategoryCardProps {
  categoryName: string;
  backgroundColor: string;
  onPress: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  categoryName,
  backgroundColor,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor }]}
      onPress={onPress}
    >
      {/* Bạn có thể thêm Icon hoặc Image ở đây nếu cần */}
      <Text style={styles.cardText}>{categoryName}</Text>
    </TouchableOpacity>
    
  );
};

const styles = StyleSheet.create({
  card: {
    // Cần đảm bảo component này chiếm đúng 48% chiều rộng
    width: "48%",
    height: 100,
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    justifyContent: "flex-end",
    // Thiết lập Shadow để thẻ nổi lên (giống như UI Spotify/Apple Music)
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 5,
  },
  cardText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
});

export default CategoryCard;
