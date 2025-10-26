import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert, // Dùng Alert thay vì alert()
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { NavigatorScreenParams } from "@react-navigation/native";

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};
export type BottomTabParamList = {
  Home: undefined;
  Search: undefined;
  Feed: undefined;
  Library: undefined;
};
export type RootStackParamList = {
  AuthStack: undefined;
  // Dùng NavigatorScreenParams để cho phép truyền tham số điều hướng tab lồng nhau
  HomeStack: NavigatorScreenParams<BottomTabParamList>;
};
// -------------------------------------------------------------------

// Định nghĩa kiểu Navigation Prop chính xác
type LoginScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "AuthStack"
>;

type Props = {
  navigation: LoginScreenNavigationProp;
  // route: NativeStackScreenProps<AuthStackParamList, "Login">["route"]; // Không dùng route nên bỏ qua
};

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (email && password) {
      // 💡 SỬA LỖI TYPESCRIPT:
      // HomeStack hiện đã được định nghĩa là có thể nhận tham số (NavigatorScreenParams<BottomTabParamList>)
      // Vì thế, ta truyền tham số để điều hướng đến tab 'Home' bên trong HomeStack.
      navigation.navigate("HomeStack", {
        screen: "Home", // Màn hình Home trong BottomTabParamList
      });
    } else {
      Alert.alert("Lỗi Đăng nhập", "Vui lòng nhập Email và Mật khẩu.");
    }
  };

  // Điều hướng đến màn hình đăng ký
  const navigateToRegister = () => {
    // Vì Login và Register ở cùng một stack AuthStack, ta gọi trực tiếp
    navigation.navigate("AuthStack");
  };

  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: "https://storage.googleapis.com/pr-newsroom-wp/1/2023/05/Spotify_Primary_Logo_RGB_Green.png",
        }}
        style={styles.logo}
      />

      <Text style={styles.title}>Chào mừng trở lại</Text>

      {/* Email Input */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#888"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      {/* Password Input */}
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#888"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {/* Login Button */}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Đăng nhập</Text>
      </TouchableOpacity>

      {/* Signup Link */}
      <TouchableOpacity
        style={styles.signupContainer}
        onPress={navigateToRegister}
      >
        <Text style={styles.signupText}>
          Chưa có tài khoản? <Text style={styles.signupLink}>Đăng ký ngay</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

// --- Styles Đã Sửa cho Dark/Semi-Dark Theme ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212", // Nền tối (Dark Theme)
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
    fontSize: 28,
    color: "#fff", // Chữ trắng
    fontWeight: "700",
    marginBottom: 30,
  },
  input: {
    width: "100%",
    backgroundColor: "#1e1e1e", // Màu nền input tối hơn nền chung
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    color: "#fff", // Chữ trắng
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#333",
  },
  button: {
    width: "100%",
    backgroundColor: "#1DB954", // Màu xanh Spotify nổi bật
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
    color: "#fff", // Chữ trắng
    fontSize: 14,
  },
  signupLink: {
    color: "#1DB954", // Link màu xanh nổi bật
    fontWeight: "600",
  },
});
