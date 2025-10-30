// src/screens/FeedScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { BASE_URL } from "../config";
import colors from "../theme/colors";
import { withFullUrl } from "../utils/url";
import { useAuth } from "../context/AuthContext";
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from "react-native-popup-menu";
import Modal from "react-native-modal";

interface Song {
  _id: string;
  title: string;
  artist: string;
  image: string;
  url: string;
  category?: string;
}

export default function FeedScreen() {
  const navigation = useNavigation<any>();
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([
    { id: 1, name: "Jessica", text: "Bài này hay quá 😍" },
    { id: 2, name: "William", text: "Nghe chill thật sự!" },
    { id: 3, name: "Key", text: "Replay 100 lần rồi 🖤" },
  ]);
  const [commentText, setCommentText] = useState("");
  const handleLogout = () => {
    logout();
    navigation.reset({
      index: 0,
      routes: [{ name: "AuthStack" }],
    });
  };

  const handleSettings = () => {
    navigation.navigate("Settings");
  };




  const fetchSongs = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/api/songs`);
      const data: Song[] = await res.json();
      const normalized = data.map(withFullUrl).reverse();
      setSongs(normalized);
    } catch (err) {
      console.error("❌ Lỗi tải danh sách Feed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSongs();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchSongs();
    setRefreshing(false);
  };

  const renderItem = ({ item, index }: { item: Song; index: number }) => (
    <View style={styles.postCard}>
      {/* Header */}
      <View style={styles.userRow}>
        <Image
          source={{
            uri:
              index % 2 === 0
                ? "https://randomuser.me/api/portraits/women/45.jpg"
                : "https://randomuser.me/api/portraits/men/46.jpg",
          }}
          style={styles.avatar}
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.username}>
            {index % 2 === 0 ? "Jessica Gonzalez" : "William King"}
          </Text>
          <Text style={styles.posted}>Posted a track · {index + 2}d</Text>
        </View>
        <Ionicons name="ellipsis-horizontal" size={20} color="#777" />
      </View>

      {/* Ảnh bài hát */}
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() =>
          navigation.navigate("PlayScreen", {
            song: item,
            queue: songs,
            index,
          })
        }
      >
        <View style={styles.imageContainer}>
          <Image source={{ uri: item.image }} style={styles.coverImage} />
          <View style={styles.overlay}>
            <Text style={styles.songTitle}>{item.title}</Text>
            <View style={styles.songRowBottom}>
              <Text style={styles.songArtist}>{item.artist}</Text>
              <View style={styles.songStats}>
                <Ionicons
                  name="play"
                  size={13}
                  color="#fff"
                  style={{ marginRight: 4 }}
                />
                <Text style={styles.statText}>{120 + index * 10}</Text>
                <Text style={styles.dot}>•</Text>
                <Text style={styles.statText}>05:15</Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>

      {/* Action buttons */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionBtn}>
          <Ionicons name="heart-outline" size={20} color="#444" />
          <Text style={styles.actionText}>{20 + index * 3}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setShowComments(true)}
          style={styles.actionBtn}
        >
          <Ionicons name="chatbubble-outline" size={20} color="#444" />
          <Text style={styles.actionText}>3</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn}>
          <Ionicons name="repeat-outline" size={20} color="#444" />
          <Text style={styles.actionText}>{1 + index}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
  const handleAddComment = () => {
    if (!commentText.trim()) return; // nếu trống thì không gửi
    const newComment = {
      id: Date.now(),
      name: "You", // có thể thay bằng user thực từ context
      text: commentText,
    };
    setComments((prev) => [newComment, ...prev]); // thêm bình luận mới lên đầu
    setCommentText(""); // xoá input
  };


  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Feed</Text>
        <Menu>
          <MenuTrigger>
            {/* Ảnh đại diện làm nút kích hoạt Menu */}
            <Image
              style={styles.avatar}
              source={{ uri: "https://cdn-icons-png.flaticon.com/512/4825/4825038.png" }}
            />
          </MenuTrigger>

          <MenuOptions
            customStyles={{
              optionsContainer: {
                backgroundColor: "#1E1E1E",
                borderRadius: 12,
                paddingVertical: 8,
                marginTop: 50,
                marginRight: 10,
                width: 160,
                shadowColor: "#000",
                shadowOpacity: 0.2,
                shadowOffset: { width: 0, height: 3 },
                shadowRadius: 5,
                elevation: 5,
              },
            }}
          >
            <MenuOption
              onSelect={handleSettings}
              customStyles={{
                optionWrapper: styles.menuItem,
                optionText: styles.menuText,
              }}
            >
              <Ionicons name="settings-outline" size={18} color="#1DB954" />
              <Text style={styles.menuText}>  Cài đặt</Text>
            </MenuOption>

            <MenuOption
              onSelect={handleLogout}
              customStyles={{
                optionWrapper: styles.menuItem,
              }}
            >
              <Ionicons name="log-out-outline" size={18} color="#FF4C4C" />
              <Text style={[styles.menuText, { color: "#FF4C4C" }]}>  Đăng xuất</Text>
            </MenuOption>
          </MenuOptions>

        </Menu>
      </View>

      {/* Danh sách bài đăng */}
      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={songs}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={{ paddingBottom: 70 }}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Không có bài hát nào.</Text>
          }
        />
      )}

      {/* Modal bình luận */}
      <Modal
        isVisible={showComments}
        onBackdropPress={() => setShowComments(false)}
        onSwipeComplete={() => setShowComments(false)}
        swipeDirection="down"
        style={styles.modal}
      >
        <View style={styles.sheet}>
          <View style={styles.sheetHeader}>
            <View style={styles.dragBar} />
            <Text style={styles.sheetTitle}>Comments</Text>
          </View>

          <FlatList
            data={comments}
            keyExtractor={(i) => i.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.commentRow}>
                <Image
                  source={{
                    uri: "https://randomuser.me/api/portraits/men/21.jpg",
                  }}
                  style={styles.commentAvatar}
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.commentName}>{item.name}</Text>
                  <Text style={styles.commentText}>{item.text}</Text>
                </View>
              </View>
            )}
          />

          {/* Ô nhập bình luận */}
          <View style={styles.commentInput}>
            <Image
              source={{
                uri: "https://randomuser.me/api/portraits/men/32.jpg",
              }}
              style={styles.commentAvatar}
            />
            <TextInput
              placeholder="Write a comment..."
              placeholderTextColor="#999"
              value={commentText}
              onChangeText={setCommentText}
              style={styles.input}
            />
            <TouchableOpacity onPress={handleAddComment}>
              <Ionicons name="send" size={22} color="#1DB954" />
            </TouchableOpacity>

          </View>
        </View>
      </Modal>
    </View>
  );
}

// ---------- STYLES ----------
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    paddingTop: 55,
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: { fontSize: 22, fontWeight: "800", color: "#111" },
  loadingWrap: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { textAlign: "center", marginTop: 20, color: "#777" },

  // --- Post ---
  postCard: {
    marginBottom: 24,
    backgroundColor: "#fff",
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  avatar: { width: 42, height: 42, borderRadius: 21, marginRight: 10 },
  username: { fontSize: 15, fontWeight: "700", color: "#111" },
  posted: { fontSize: 12, color: "#777" },

  imageContainer: {
    position: "relative",
    marginHorizontal: 16,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#ddd",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  coverImage: { width: "100%", height: 220, resizeMode: "cover" },
  overlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  songTitle: { fontSize: 16, fontWeight: "700", color: "#fff" },
  songRowBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 3,
  },
  songArtist: { color: "#ddd", fontSize: 13 },
  songStats: { flexDirection: "row", alignItems: "center" },
  statText: { color: "#fff", fontSize: 12, marginHorizontal: 2 },
  dot: { color: "#fff", marginHorizontal: 4 },

  actions: {
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingHorizontal: 40,
    marginTop: 12,
  },
  actionBtn: { flexDirection: "row", alignItems: "center", marginRight: 20 },
  actionText: { marginLeft: 6, color: "#444", fontSize: 13 },
  icon: { width: 45, height: 45, borderRadius: 22 },

  // --- Modal ---
  modal: { justifyContent: "flex-end", margin: 0 },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 12,
    paddingHorizontal: 16,
    maxHeight: "75%",
  },
  sheetHeader: { alignItems: "center", marginBottom: 8 },
  dragBar: {
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#ccc",
    marginBottom: 8,
  },
  sheetTitle: { fontWeight: "700", fontSize: 16 },
  commentRow: { flexDirection: "row", marginVertical: 10 },
  commentAvatar: { width: 36, height: 36, borderRadius: 18, marginRight: 10 },
  commentName: { fontWeight: "700" },
  commentText: { color: "#333" },
  commentInput: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    borderTopWidth: 1,
    borderColor: "#eee",
    paddingVertical: 8,
  },
  input: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 10,
    color: "#111",
  },
  // --- STYLE MỚI CHO POP-UP MENU ---
  menuOptionsContainer: {
    marginTop: 40, // Điều chỉnh vị trí thả xuống
    width: 150,
    padding: 5,
    borderRadius: 8,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  menuText: {
    fontSize: 15,
    color: "#E5E7EB",
    fontWeight: "500",
  },
});
