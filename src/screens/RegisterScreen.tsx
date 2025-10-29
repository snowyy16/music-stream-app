// src/screens/RegisterScreen.tsx
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
import { NativeStackNavigationProp } from "@react-navigation/native-stack"; // ⚠️ Import chung kiểu từ LoginScreen
import { BASE_URL } from "../config";
import type { AuthStackParamList } from "../types/navigation";

type RegisterScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  "Register"
>;

type Props = {
  navigation: RegisterScreenNavigationProp;
};

export default function RegisterScreen({ navigation }: Props) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const handleRegister = async () => {
    if (!username || !email || !password || !confirm) {
      Alert.alert("Thiếu thông tin", "Vui lòng điền đầy đủ các trường.");
      return;
    }
    if (password !== confirm) {
      Alert.alert("Lỗi mật khẩu", "Mật khẩu xác nhận không khớp.");
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();
      console.log("📥 Phản hồi server:", data);
      if (!res.ok) throw new Error(data.message);
      Alert.alert("🎉 Thành công", "Tài khoản đã được tạo!");
      navigation.navigate("Login");
    } catch (err: any) {
      Alert.alert("Lỗi đăng ký", err.message || "Không thể đăng ký.");
    }
  };

  const goToLogin = () => navigation.navigate("Login");

  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: "https://storage.googleapis.com/pr-newsroom-wp/1/2023/05/Spotify_Primary_Logo_RGB_Green.png",
        }}
        style={styles.logo}
      />

      <Text style={styles.title}>Tạo tài khoản mới</Text>

      <TextInput
        style={styles.input}
        placeholder="Tên người dùng"
        placeholderTextColor="#888"
        value={username}
        onChangeText={setUsername}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#888"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Mật khẩu"
        placeholderTextColor="#888"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TextInput
        style={styles.input}
        placeholder="Xác nhận mật khẩu"
        placeholderTextColor="#888"
        secureTextEntry
        value={confirm}
        onChangeText={setConfirm}
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Đăng ký</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.signupContainer} onPress={goToLogin}>
        <Text style={styles.signupText}>
          Đã có tài khoản? <Text style={styles.signupLink}>Đăng nhập ngay</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

// --- Styles giống LoginScreen ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  logo: {
    width: 90,
    height: 90,
    marginBottom: 30,
  },
  title: {
    fontSize: 26,
    color: "#fff",
    fontWeight: "700",
    marginBottom: 25,
  },
  input: {
    width: "100%",
    backgroundColor: "#1e1e1e",
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    color: "#fff",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#333",
  },
  button: {
    width: "100%",
    backgroundColor: "#1DB954",
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  signupContainer: {
    marginTop: 20,
  },
  signupText: {
    color: "#fff",
    fontSize: 14,
  },
  signupLink: {
    color: "#1DB954",
    fontWeight: "600",
  },
});
