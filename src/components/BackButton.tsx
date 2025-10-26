import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

interface BackButtonProps {
  label?: string; // Cho phép tùy chỉnh text nếu cần
  toScreen?: string; // Nếu muốn điều hướng tới screen cụ thể
}

const BackButton: React.FC<BackButtonProps> = ({
  label = "Quay lại",
  toScreen,
}) => {
  const navigation = useNavigation();

  const handlePress = () => {
    if (toScreen) {
      navigation.navigate(toScreen as never);
    } else {
      navigation.goBack();
    }
  };

  return (
    <TouchableOpacity style={styles.backButton} onPress={handlePress}>
      <Ionicons name="arrow-back" size={24} color="#111827" />
      <Text style={styles.backText}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  backText: {
    fontSize: 16,
    marginLeft: 5,
    color: "#111827",
    fontWeight: "500",
  },
});

export default BackButton;
