import { NavigatorScreenParams } from "@react-navigation/native";

export type RootStackParamList = {
  AuthStack: NavigatorScreenParams<AuthStackParamList>;
  HomeStack: NavigatorScreenParams<BottomTabParamList>;
  PremiumSubscriptionScreen: undefined;
  CategoryDetail: { categoryName: string };
  PlayScreen: { song?: any };
  PlaylistDetail: { song?: any };
  Settings: undefined;
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
