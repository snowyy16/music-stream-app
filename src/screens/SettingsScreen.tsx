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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "../context/AuthContext";
import { BASE_URL } from "../config";


if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function SettingsScreen({ navigation }: any) {
  const { user, logout } = useAuth();
  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [avatar, setAvatar] = useState("https://picsum.photos/id/1027/200/200");
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPass, setIsChangingPass] = useState(false);

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
      base64: true,
    });
    if (!result.canceled) setAvatar(result.assets[0].uri);
  };

const handleUpdateInfo = async () => {
  try {
    const res = await fetch(`${BASE_URL}/api/auth/update`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        username,
        avatar, // ✅ Gửi avatar mới
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message);

    Alert.alert("✅ Thành công", "Cập nhật thông tin thành công!");
  } catch (err: any) {
    Alert.alert("❌ Lỗi", err.message || "Không thể cập nhật thông tin.");
  }
};


  const handleChangePassword = async () => {
    if (!password || !newPassword)
      return Alert.alert("Thiếu thông tin", "Vui lòng nhập đầy đủ mật khẩu.");

    try {
      const res = await fetch(`${BASE_URL}/api/auth/change-password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, oldPassword: password, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      Alert.alert("🔑 Thành công", "Đổi mật khẩu thành công!");
      setPassword("");
      setNewPassword("");
      setIsChangingPass(false);
    } catch (err: any) {
      Alert.alert("❌ Lỗi", err.message || "Không thể đổi mật khẩu.");
    }
  };

  const toggleEdit = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsEditing(!isEditing);
  };

  const togglePassword = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsChangingPass(!isChangingPass);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.profileHeader}>
        <TouchableOpacity onPress={pickImage}>
          <Image source={{ uri: avatar }} style={styles.avatar} />
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
          <TouchableOpacity style={styles.saveBtn} onPress={handleUpdateInfo}>
            <Text style={styles.saveText}>Lưu thay đổi</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Nút đổi mật khẩu */}
      <TouchableOpacity style={styles.toggleBtn} onPress={togglePassword}>
        <Ionicons name="key-outline" size={20} color="#1DB954" />
        <Text style={styles.toggleText}>Đổi mật khẩu</Text>
      </TouchableOpacity>

      {/* Form đổi mật khẩu */}
      {isChangingPass && (
        <View style={styles.section}>
          <TextInput
            style={styles.input}
            placeholder="Mật khẩu cũ"
            placeholderTextColor="#777"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <TextInput
            style={styles.input}
            placeholder="Mật khẩu mới"
            placeholderTextColor="#777"
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
          />
          <TouchableOpacity style={styles.saveBtn} onPress={handleChangePassword}>
            <Text style={styles.saveText}>Đổi mật khẩu</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Footer actions */}
      <TouchableOpacity
        style={[styles.saveBtn, { backgroundColor: "#333", marginTop: 20 }]}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.saveText}>⬅ Quay lại</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.saveBtn, { backgroundColor: "#FF4C4C", marginTop: 10 }]}
        onPress={logout}
      >
        <Text style={styles.saveText}>Đăng xuất</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212", padding: 20 },
  profileHeader: { alignItems: "center", marginTop: 30, marginBottom: 20 },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: "#1DB954",
    marginBottom: 10,
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
  toggleBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 25,
  },
  toggleText: { color: "#1DB954", fontSize: 16, fontWeight: "600", marginLeft: 8 },
});
