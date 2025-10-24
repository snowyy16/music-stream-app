// src/screens/LoginScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import {
  NativeStackScreenProps,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import { AuthStackParamList } from "../types/navigation";
import { RootStackParamList } from "../types/navigation";
type LoginScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "AuthStack"
>;
type Props = {
  navigation: LoginScreenNavigationProp;
  route: NativeStackScreenProps<AuthStackParamList, "Login">["route"];
};

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // Fake login check
    if (email && password) {
      navigation.replace("HomeStack");
    } else {
      alert("Please enter email & password");
    }
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image
        source={{
          uri: "https://storage.googleapis.com/pr-newsroom-wp/1/2023/05/Spotify_Primary_Logo_RGB_Green.png",
        }}
        style={styles.logo}
      />

      <Text style={styles.title}>Welcome to MusicApp</Text>
      <Text style={styles.subtitle}>Sign in to continue</Text>

      {/* Email Input */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#aaa"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      {/* Password Input */}
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {/* Login Button */}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>

      {/* Signup Link */}
      <TouchableOpacity style={styles.signupContainer}>
        <Text style={styles.signupText}>
          Don’t have an account? <Text style={styles.signupLink}>Sign Up</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
    color: "#000",
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 16,
    color: "#000",
    marginBottom: 30,
  },
  input: {
    width: "100%",
    backgroundColor: "#222",
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: "#fff",
    marginBottom: 16,
  },
  button: {
    width: "100%",
    backgroundColor: "#1DB954", // Spotify green
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
