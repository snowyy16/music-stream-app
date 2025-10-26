import { NavigatorScreenParams } from "@react-navigation/native";

export type RootStackParamList = {
  AuthStack: undefined;
  HomeStack: NavigatorScreenParams<BottomTabParamList>;
  PremiumSubscriptionScreen: undefined;
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
