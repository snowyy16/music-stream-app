import { NavigatorScreenParams } from "@react-navigation/native";

export type RootStackParamList = {
  AuthStack: NavigatorScreenParams<AuthStackParamList>;
  HomeStack: NavigatorScreenParams<BottomTabParamList>;
  PremiumSubscriptionScreen: undefined;
  CategoryDetail: { categoryName: string };
  PlayScreen: { queue: any[]; index: number }; 
  PlaylistDetail: { queue: any[]; index: number }; 
  Settings: undefined;
  AddPlaylistScreen: undefined;
  ArtistDetail: { artist: any };
};

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
