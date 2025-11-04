import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import colors from "../theme/colors";



import type {
  RootStackParamList,
  AuthStackParamList,
  BottomTabParamList,
} from "../types/navigation";

import RegisterScreen from "../screens/RegisterScreen";
import LoginScreen from "../screens/LoginScreen";
import HomeScreen from "../screens/HomeScreen";
import FeedScreen from "../screens/FeedScreen";
import PlaylistDetail from "../screens/PlaylistDetail"; // ⬅️ thêm
import SettingsScreen from "../screens/SettingsScreen";
import AddPlaylistScreen from "../screens/AddPlaylistScreen";
import ArtistDetail from "../screens/ArtistDetail";
import AlbumDetailScreen from "../screens/AlbumDetailScreen";
import ChartDetail from "../screens/ChartDetail";
import CommentDetailScreen from "../screens/CommentDetailScreen";



import LibraryScreen from "../screens/LibraryScreen";
import PremiumSubscriptionScreen from "../screens/PremiumSubscriptionScreen";
import SearchScreen from "../screens/SearchScreen";
import CategoryDetailScreen from "../screens/CategoriesDetailScreen";
import PlayScreen from "../screens/PlayScreen";

const RootStack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const Tab = createBottomTabNavigator<BottomTabParamList>();

// Auth stack (Login + Register)
function AuthStackNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />

    </AuthStack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarShowLabel: true,
        tabBarStyle: { height: 64, paddingBottom: 6, paddingTop: 6 },
        tabBarIcon: ({ color, size }) => {
          switch (route.name) {
            case "Home":
              return <Ionicons name="home" size={size} color={color} />;
            case "Search":
              return <Ionicons name="search" size={size} color={color} />;
            case "Feed":
              return <Ionicons name="albums" size={size} color={color} />;
            case "Library":
              return <Ionicons name="library" size={size} color={color} />;
            default:
              return null;
          }
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Feed" component={FeedScreen} />
      <Tab.Screen name="Library" component={LibraryScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <RootStack.Navigator
      initialRouteName="AuthStack"
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
        gestureEnabled: true,
      }}
    >

      <RootStack.Screen name="AuthStack" component={AuthStackNavigator} />
      <RootStack.Screen name="HomeStack" component={MainTabs} />
      <RootStack.Screen
        name="PremiumSubscriptionScreen"
        component={PremiumSubscriptionScreen}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="CategoryDetail"
        component={CategoryDetailScreen}
        options={{ headerShown: false }}
      />
      <RootStack.Screen name="PlayScreen" component={PlayScreen} />
      <RootStack.Screen
        name="PlaylistDetail"
        component={PlaylistDetail}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="AddPlaylistScreen"
        component={AddPlaylistScreen}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="ArtistDetail"
        component={ArtistDetail}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="AlbumDetail"
        component={AlbumDetailScreen}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="ChartDetail"
        component={ChartDetail}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="CommentDetail"
        component={CommentDetailScreen}
        options={{ headerShown: false }}
      />


    </RootStack.Navigator>

  );
}
