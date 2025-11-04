import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  LayoutAnimation,
  Platform,
  UIManager,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "../context/AuthContext";
import { BASE_URL } from "../config";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function SettingsScreen({ navigation }: any) {
  const { user, logout, setUser } = useAuth();
  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [avatar, setAvatar] = useState<string>(
    user?.avatar
      ? user.avatar.startsWith("http")
        ? user.avatar
        : `${BASE_URL}/image/avatars/${user.avatar}`
      : "https://cdn-icons-png.flaticon.com/512/4825/4825038.png"
  );

  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Hiệu ứng mượt khi mở form chỉnh sửa
  const toggleEdit = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsEditing(!isEditing);
  };

  // ====== Chọn ảnh từ thư viện ======
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Quyền bị từ chối", "Bạn cần cấp quyền truy cập ảnh.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: true,
    });

    if (!result.canceled) setAvatar(result.assets[0].uri);
  };

  // ====== Upload ảnh + cập nhật thông tin ======
  const handleUpdateInfo = async () => {
    try {
      if (!user?._id) throw new Error("Không xác định được người dùng");
      setUploading(true);

      const formData = new FormData();
      const imageFile: any = {
        uri: avatar,
        name: "avatar.jpg",
        type: "image/jpeg",
      };
      formData.append("avatar", imageFile);
      formData.append("email", email);
      formData.append("username", username);

      const res = await fetch(`${BASE_URL}/api/users/upload-avatar/${user._id}`, {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Không thể tải ảnh");

      // ✅ Cập nhật context và tránh cache ảnh cũ
      setUser((prevUser) =>
        prevUser
          ? {
            ...prevUser,
            username,
            email,
            avatar: data.avatar ? `${data.avatar}?v=${Date.now()}` : prevUser.avatar,
          }
          : null
      );

      Alert.alert("✅ Thành công", "Cập nhật thông tin & ảnh đại diện thành công!");
      setIsEditing(false);
    } catch (err: any) {
      Alert.alert("❌ Lỗi", err.message || "Không thể cập nhật thông tin.");
    } finally {
      setUploading(false);
    }
  };

  // ====== Xác nhận đăng xuất ======
  const confirmLogout = () => {
    Alert.alert("Đăng xuất", "Bạn có chắc chắn muốn đăng xuất?", [
      { text: "Hủy", style: "cancel" },
      { text: "Đăng xuất", style: "destructive", onPress: logout },
    ]);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Header */}
      <View style={styles.profileHeader}>
        <TouchableOpacity
          onPress={isEditing ? pickImage : undefined}
          activeOpacity={isEditing ? 0.8 : 1}
        >
          <Image
            source={{ uri: avatar }}
            style={[styles.avatar, uploading && { opacity: 0.5 }]}
          />
          {uploading && (
            <View style={styles.overlay}>
              <ActivityIndicator color="#fff" />
            </View>
          )}
        </TouchableOpacity>


        <Text style={styles.username}>{username}</Text>
        <Text style={styles.email}>{email}</Text>

        <TouchableOpacity style={styles.editBtn} onPress={toggleEdit}>
          <Ionicons name="create-outline" size={18} color="#fff" />
          <Text style={styles.editText}>Chỉnh sửa thông tin</Text>
        </TouchableOpacity>
      </View>

      {/* Form chỉnh sửa */}
      {isEditing && (
        <View style={styles.section}>
          <TextInput
            style={styles.input}
            placeholder="Tên người dùng"
            placeholderTextColor="#777"
            value={username}
            onChangeText={setUsername}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#777"
            value={email}
            onChangeText={setEmail}
          />
          <TouchableOpacity
            style={[styles.saveBtn, uploading && { opacity: 0.7 }]}
            onPress={handleUpdateInfo}
            disabled={uploading}
          >
            {uploading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.saveText}>Lưu thay đổi</Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity
        style={[styles.saveBtn, { backgroundColor: "#FF4C4C", marginTop: 20 }]}
        onPress={confirmLogout}
      >
        <Text style={styles.saveText}>Đăng xuất</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212", padding: 20 },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 10,
  },
  profileHeader: { alignItems: "center", marginTop: 80, marginBottom: 20 },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: "#1DB954",
    marginBottom: 10,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  username: { color: "#fff", fontSize: 20, fontWeight: "700" },
  email: { color: "#9CA3AF", fontSize: 14, marginBottom: 10 },
  editBtn: {
    flexDirection: "row",
    backgroundColor: "#1DB954",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  editText: { color: "#fff", fontWeight: "600", marginLeft: 6 },
  section: { marginTop: 15 },
  input: {
    backgroundColor: "#1E1E1E",
    borderRadius: 8,
    padding: 12,
    color: "#fff",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#333",
  },
  saveBtn: {
    backgroundColor: "#1DB954",
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: "center",
  },
  saveText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
