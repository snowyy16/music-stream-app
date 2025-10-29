// App.tsx
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { View, StyleSheet } from "react-native";
import AppNavigator from "./src/navigation/AppNavigator";

import { PlayerProvider } from "./src/player/store";
import MiniPlayer from "./src/components/MiniPlayer";
import { AuthProvider } from "./src/context/AuthContext";
import { MenuProvider } from "react-native-popup-menu";

export default function App() {
  return (
    <MenuProvider>
      <AuthProvider>
        <PlayerProvider>
          <NavigationContainer>
            <View style={styles.appRoot}>
              <StatusBar style="light" />
              <AppNavigator />
              <MiniPlayer />
            </View>
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
