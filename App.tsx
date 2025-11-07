// App.tsx
import React from "react";
import { LogBox } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { View, StyleSheet } from "react-native";
import AppNavigator from "./src/navigation/AppNavigator";

import { PlayerProvider } from "./src/player/store";
import MiniPlayer from "./src/components/MiniPlayer";
import { AuthProvider, useAuth } from "./src/context/AuthContext"; // 🧩 thêm useAuth
import { MenuProvider } from "react-native-popup-menu";

LogBox.ignoreLogs([
  "The action 'RESET' with payload", 
  "The action 'NAVIGATE' with payload",
  "This is a development-only warning"
]);

function AppContent() {
  const { user } = useAuth(); // 🧠 lấy trạng thái đăng nhập

  return (
    <View style={styles.appRoot}>
      <StatusBar style="light" />
      <AppNavigator />
      {/* ✅ chỉ hiện MiniPlayer khi đã đăng nhập */}
      {user && <MiniPlayer />}
    </View>
  );
}

export default function App() {
  return (
    <MenuProvider>
      <AuthProvider>
        <PlayerProvider>
          <NavigationContainer>
            <AppContent />
          </NavigationContainer>
        </PlayerProvider>
      </AuthProvider>
    </MenuProvider>
  );
}

const styles = StyleSheet.create({
  appRoot: {
    flex: 1,
  },
});
