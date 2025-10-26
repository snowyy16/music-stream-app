import React from "react";
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList, BottomTabParamList } from "../types/navigation";

// Định nghĩa kiểu Navigation Prop chính xác cho màn hình này
type PremiumScreenNavigationProp = NavigationProp<
  RootStackParamList,
  "HomeStack" // Stack mà màn hình này sẽ điều hướng tới
>;

// --- Dữ liệu Quyền lợi Premium (Không đổi) ---
const premiumBenefits = [
  "Nghe nhạc không giới hạn",
  "Không quảng cáo (Ad-free listening)",
  "Tải xuống để nghe ngoại tuyến (Download to listen offline)",
  "Truy cập toàn bộ kho nhạc chất lượng cao",
  "Chất lượng âm thanh tuyệt đỉnh (High sound quality)",
  "Hủy bỏ bất cứ lúc nào",
];

const PremiumSubscriptionScreen: React.FC = () => {
  const navigation = useNavigation<PremiumScreenNavigationProp>();

  // Hàm điều hướng về màn hình Home trong BottomTab
  const navigateToHome = () => {
    // CÁCH GỌI ĐÚNG:
    // Điều hướng đến HomeStack, và trong HomeStack, chuyển sang tab Home
    navigation.navigate("HomeStack", {
      screen: "Home" as keyof BottomTabParamList, // Dùng 'Home' là tên tab trong BottomTab
    });
  };

  // Hàm xử lý Back (quay lại màn hình trước đó)
  const goBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={premiumStyles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#111827" />
      <ScrollView contentContainerStyle={premiumStyles.scrollViewContent}>
        {/* Header (Back button and Logo) */}
        <View style={premiumStyles.header}>
          <TouchableOpacity onPress={goBack} style={premiumStyles.backButton}>
            <Ionicons name="arrow-back-outline" size={24} color="#FFD700" />
          </TouchableOpacity>
          <Ionicons name="musical-notes" size={30} color="#FFD700" />
        </View>

        {/* ... (Các phần Title, Price Box, Benefits List không đổi) ... */}
        <View style={premiumStyles.titleSection}>
          <Text style={premiumStyles.mainTitle}>Unlimited</Text>
          <Text style={premiumStyles.mainTitle}>music selections</Text>
          <Text style={premiumStyles.tagline}>
            Nâng cấp lên <Text style={{ fontWeight: "bold" }}>Premium</Text>
          </Text>
        </View>

        <View style={premiumStyles.priceBox}>
          <Text style={premiumStyles.trialText}>Miễn phí 1 tháng</Text>
          <Text style={premiumStyles.priceText}>$12.99 / tháng</Text>
        </View>

        <View style={premiumStyles.benefitsList}>
          {premiumBenefits.map((benefit, index) => (
            <View key={index} style={premiumStyles.benefitItem}>
              <Ionicons name="checkmark-circle" size={20} color="#FFD700" />
              <Text style={premiumStyles.benefitText}>{benefit}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Sticky Footer CTA */}
      <View style={premiumStyles.footer}>
        <TouchableOpacity
          style={premiumStyles.subscribeButton}
          onPress={navigateToHome} // Điều hướng sau khi giả định đăng ký thành công
        >
          <Text style={premiumStyles.subscribeButtonText}>Đăng ký ngay</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={navigateToHome}>
          <Text style={premiumStyles.backHomeText}>Quay lại trang chủ</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
// ... (Phần premiumStyles không đổi)
// Sửa lỗi: Thay thế đoạn mã bị lỗi cũ bằng toàn bộ mã mới này.

// ... (Phần premiumStyles không đổi)

const premiumStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#111827", // Nền tối
  },
  scrollViewContent: {
    paddingHorizontal: 25,
    paddingBottom: 200, // Đủ chỗ cho footer cố định
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    paddingTop: 20,
  },
  backButton: {
    padding: 5,
  },
  titleSection: {
    marginTop: 40,
    marginBottom: 30,
  },
  mainTitle: {
    fontSize: 38,
    fontWeight: "900",
    color: "white",
    lineHeight: 40,
  },
  tagline: {
    fontSize: 16,
    color: "#FFD700", // Màu vàng accent
    marginTop: 10,
  },
  priceBox: {
    backgroundColor: "#1F2937",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    marginBottom: 40,
  },
  trialText: {
    fontSize: 16,
    color: "#DDD",
  },
  priceText: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#FFD700",
    marginTop: 5,
  },
  benefitsList: {
    marginBottom: 30,
  },
  benefitItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  benefitText: {
    fontSize: 16,
    color: "white",
    marginLeft: 15,
    fontWeight: "500",
  },
  // --- Sticky Footer ---
  footer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#111827",
    paddingHorizontal: 25,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: "#333",
  },
  subscribeButton: {
    backgroundColor: "#FFD700", // Nút vàng nổi bật
    padding: 18,
    borderRadius: 15,
    alignItems: "center",
    marginBottom: 10,
  },
  subscribeButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
  },
  backHomeText: {
    fontSize: 15,
    color: "#9CA3AF",
    textAlign: "center",
  },
});

export default PremiumSubscriptionScreen;
