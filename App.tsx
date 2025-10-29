// App.tsx
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { View, StyleSheet } from "react-native";
import AppNavigator from "./src/navigation/AppNavigator";

// ⬇️ thêm 2 import này
import { PlayerProvider } from "./src/player/store";
import MiniPlayer from "./src/components/MiniPlayer";

export default function App() {
  return (
    <PlayerProvider>
      <NavigationContainer>
        <View style={styles.appRoot}>
          <StatusBar style="light" />
          <AppNavigator />
        </View>
      </NavigationContainer>
    </PlayerProvider>
  );
}

const styles = StyleSheet.create({
  appRoot: {
    flex: 1,
  },
});
