// src/screens/AddPlaylistScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";

export default function AddPlaylistScreen({ navigation }: any) {
  const [name, setName] = useState("");
  const [cover, setCover] = useState<string | null>(null);

  // 📸 Chọn ảnh bìa playlist
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Quyền bị từ chối", "Bạn cần cấp quyền truy cập ảnh.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (!result.canceled) {
      setCover(result.assets[0].uri);
    }
  };

  // 💾 Lưu playlist (demo local)
  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert("Thiếu thông tin", "Hãy nhập tên playlist!");
      return;
    }

    // 👉 Ở đây có thể gọi API để lưu playlist thật vào DB
    Alert.alert("🎉 Thành công", `Playlist "${name}" đã được tạo.`);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tạo playlist mới</Text>

      <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
        {cover ? (
          <Image source={{ uri: cover }} style={styles.coverImage} />
        ) : (
          <Ionicons name="image-outline" size={60} color="#9CA3AF" />
        )}
        <Text style={styles.imageText}>
          {cover ? "Đổi ảnh bìa" : "Chọn ảnh bìa"}
        </Text>
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Nhập tên playlist"
        placeholderTextColor="#999"
        value={name}
        onChangeText={setName}
      />

      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveText}>Lưu playlist</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.saveBtn, { backgroundColor: "#444", marginTop: 10 }]}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.saveText}>Hủy</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 60,
  },
  title: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 30,
  },
  imagePicker: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  coverImage: {
    width: 160,
    height: 160,
    borderRadius: 12,
    marginBottom: 10,
  },
  imageText: {
    color: "#1DB954",
    fontSize: 14,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "#1E1E1E",
    color: "#fff",
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#333",
    marginBottom: 20,
  },
  saveBtn: {
    backgroundColor: "#1DB954",
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
  },
  saveText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
