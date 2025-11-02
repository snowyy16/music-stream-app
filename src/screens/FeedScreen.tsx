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
  Alert,
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

interface Comment {
  _id: string;
  user: { username: string; avatar: string };
  text: string;
  createdAt: string;
}

export default function FeedScreen() {
  const navigation = useNavigation<any>();
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
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

  // 🧠 Fetch danh sách bài hát
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

  // 💬 Fetch bình luận theo bài hát
  const fetchComments = async (songId: string) => {
    try {
      const res = await fetch(`${BASE_URL}/api/comments/${songId}`);
      const data: Comment[] = await res.json();
      setComments(data);
    } catch (err) {
      console.error("❌ Lỗi tải bình luận:", err);
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

  const handleShowComments = async (song: Song) => {
    setSelectedSong(song);
    await fetchComments(song._id);
    setShowComments(true);
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return;

    try {
      const res = await fetch(`${BASE_URL}/api/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          song: selectedSong?._id,
          user: user?._id,
          text: commentText,
        }),
      });

      if (!res.ok) {
        Alert.alert("Lỗi", "Không thể thêm bình luận.");
        return;
      }

      const newComment = await res.json();
      setComments((prev) => [newComment, ...prev]);
      setCommentText("");
    } catch (err) {
      Alert.alert("Lỗi", "Không thể kết nối tới server.");
    }
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
          <Text style={styles.posted}>Đăng bài · {index + 1} ngày</Text>
        </View>
        <Ionicons name="ellipsis-horizontal" size={20} color="#777" />
      </View>

      {/* Ảnh bài hát */}
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() =>
          navigation.navigate("PlayScreen", { song: item, queue: songs, index })
        }
      >
        <View style={styles.imageContainer}>
          <Image source={{ uri: item.image }} style={styles.coverImage} />
          <View style={styles.overlay}>
            <Text style={styles.songTitle}>{item.title}</Text>
            <Text style={styles.songArtist}>{item.artist}</Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* Action */}
      <View style={styles.actions}>
        <TouchableOpacity onPress={() => handleShowComments(item)} style={styles.actionBtn}>
          <Ionicons name="chatbubble-outline" size={20} color="#444" />
          <Text style={styles.actionText}>Bình luận</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

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
              source={{
                uri: "https://cdn-icons-png.flaticon.com/512/4825/4825038.png",
              }}
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
              <Text style={styles.menuText}> Cài đặt</Text>
            </MenuOption>

            <MenuOption
              onSelect={handleLogout}
              customStyles={{
                optionWrapper: styles.menuItem,
              }}
            >
              <Ionicons name="log-out-outline" size={18} color="#FF4C4C" />
              <Text style={[styles.menuText, { color: "#FF4C4C" }]}>
                {" "}
                Đăng xuất
              </Text>
            </MenuOption>
          </MenuOptions>
        </Menu>
      </View>

      {/* Danh sách bài hát */}
      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={songs}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      )}

      {/* Modal bình luận */}
      <Modal isVisible={showComments} onBackdropPress={() => setShowComments(false)} style={styles.modal}>
        <View style={styles.sheet}>
          <Text style={styles.sheetTitle}>Bình luận</Text>

          <FlatList
            data={comments}
            keyExtractor={(i) => i._id}
            renderItem={({ item }) => (
              <View style={styles.commentRow}>
                <Image source={{ uri: item.user.avatar }} style={styles.commentAvatar} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.commentName}>{item.user.username}</Text>
                  <Text style={styles.commentText}>{item.text}</Text>
                </View>
              </View>
            )}
          />

          <View style={styles.commentInput}>
            <TextInput
              placeholder="Viết bình luận..."
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

// ========== STYLES ==========
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  header: { paddingTop: 55, paddingBottom: 16, paddingHorizontal: 16, flexDirection: "row", justifyContent: "space-between" },
  headerTitle: { fontSize: 32, fontWeight: "900", color: "#1F2937" },
  postCard: { marginBottom: 24 },
  userRow: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16 },
  avatar: { width: 42, height: 42, borderRadius: 21, marginRight: 10, marginBottom : 10 },
  username: { fontWeight: "700" },
  posted: { fontSize: 12, color: "#777" },
  imageContainer: { marginHorizontal: 16, borderRadius: 10, overflow: "hidden", backgroundColor: "#ddd" },
  coverImage: { width: "100%", height: 220 },
  overlay: { position: "absolute", bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", width: "100%", padding: 10 },
  songTitle: { color: "#fff", fontWeight: "700" },
  songArtist: { color: "#ddd" },
  actions: { flexDirection: "row", paddingHorizontal: 30, marginTop: 10 },
  actionBtn: { flexDirection: "row", alignItems: "center", marginRight: 20 },
  actionText: { marginLeft: 6, color: "#444" },
  modal: { justifyContent: "flex-end", margin: 0 },
  sheet: { backgroundColor: "#fff", padding: 16, borderTopLeftRadius: 16, borderTopRightRadius: 16, maxHeight: "70%" },
  sheetTitle: { fontSize: 16, fontWeight: "700", textAlign: "center", marginBottom: 10 },
  commentRow: { flexDirection: "row", marginVertical: 8 },
  commentAvatar: { width: 36, height: 36, borderRadius: 18, marginRight: 10 },
  commentName: { fontWeight: "700" },
  commentText: { color: "#333" },
  commentInput: { flexDirection: "row", alignItems: "center", borderTopWidth: 1, borderColor: "#eee", paddingTop: 8 },
  input: { flex: 1, backgroundColor: "#f2f2f2", borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8, marginRight: 10 },
  menuText: { fontSize: 15, color: "#E5E7EB", fontWeight: "500" },
});
