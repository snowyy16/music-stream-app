import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    ScrollView,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { BASE_URL } from "../config";
import { withFullUrl } from "../utils/url";
import { useAuth } from "../context/AuthContext";

type Song = {
    _id: string;
    title: string;
    artist: string;
    image: string;
    url: string;
};

type Comment = {
    _id: string;
    user: { username: string; avatar: string };
    text: string;
    createdAt: string;
};

export default function CommentDetailScreen() {
    const navigation = useNavigation<any>();
    const route = useRoute<RouteProp<{ params: { song: Song; user?: any } }, "params">>();
    const { song, user } = route.params;
    const [comments, setComments] = useState<Comment[]>([]);
    const [commentText, setCommentText] = useState("");
    const [loading, setLoading] = useState(true);


    const fetchComments = async () => {
        try {
            const res = await fetch(`${BASE_URL}/api/comments/${song._id}`);
            const data: Comment[] = await res.json();
            setComments(data);
        } catch (err) {
            console.error("❌ Lỗi tải bình luận:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSend = async () => {
        if (!user?._id) {
            alert("⚠️ Bạn cần đăng nhập để bình luận!");
            return;
        }

        if (!commentText.trim()) return;

        try {
            const res = await fetch(`${BASE_URL}/api/comments`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    song: song._id,
                    user: user._id,
                    text: commentText,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.message || "❌ Không thể thêm bình luận.");
                return;
            }

            setComments((prev) => [data, ...prev]);
            setCommentText("");
        } catch (err) {
            console.error("❌ Lỗi gửi bình luận:", err);
            alert("Không thể kết nối tới máy chủ.");
        }
    };


    useEffect(() => {
        fetchComments();
    }, []);

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 0 : -10}
        >
            <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
                {/* 🔙 Nút Back sát tai thỏ */}
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={26} color="#111" />
                </TouchableOpacity>

                <ScrollView
                    style={styles.container}
                    contentContainerStyle={{ paddingBottom: 100 }}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    {/* Ảnh bài hát */}
                    <View style={styles.songSection}>
                        <Image
                            source={{
                                uri:
                                    song.image && song.image.startsWith("http")
                                        ? song.image
                                        : song.image
                                            ? `${BASE_URL}/image/${song.image}`
                                            : "https://placehold.co/600x400/png?text=No+Image",
                            }}
                            style={styles.songImageLarge}
                        />

                        <Text style={styles.songTitle}>{song.title}</Text>
                        <Text style={styles.songArtist}>{song.artist}</Text>
                    </View>

                    {/* Danh sách bình luận */}
                    {loading ? (
                        <ActivityIndicator size="large" color="#1DB954" />
                    ) : comments.length === 0 ? (
                        <Text style={styles.empty}>Chưa có bình luận nào</Text>
                    ) : (
                        comments.map((c, i) => (
                            <View key={i} style={styles.commentRow}>
                                <Image
                                    source={{
                                        uri:
                                            c.user?.avatar && c.user.avatar.startsWith("http")
                                                ? c.user.avatar
                                                : c.user?.avatar
                                                    ? `${BASE_URL}/uploads/avatars/${c.user.avatar}`
                                                    : "https://cdn-icons-png.flaticon.com/512/4825/4825038.png",
                                    }}
                                    style={styles.commentAvatar}
                                />


                                <View>
                                    <Text style={styles.commentName}>{c.user?.username || "Người dùng ẩn"}</Text>
                                    <Text style={styles.commentText}>{c.text}</Text>

                                </View>
                            </View>
                        ))
                    )}
                </ScrollView>

                {/* Ô nhập bình luận */}
                <View style={styles.commentInput}>
                    <TextInput
                        style={styles.input}
                        placeholder="Viết bình luận..."
                        placeholderTextColor="#9CA3AF"
                        value={commentText}
                        onChangeText={setCommentText}
                    />
                    <TouchableOpacity onPress={handleSend}>
                        <Ionicons name="send" size={26} color="#1DB954" />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    backButton: {
        position: "absolute",
        top: Platform.OS === "ios" ? 50 : 20,
        left: 16,
        zIndex: 10,
        backgroundColor: "rgba(255,255,255,0.8)",
        borderRadius: 20,
        padding: 6,
    },
    container: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 16 },
    songSection: {
        alignItems: "center",
        justifyContent: "center",
        marginTop: 80,
        marginBottom: 20,
    },
    songImageLarge: {
        width: "100%",
        height: 280,
        borderRadius: 16,
        marginBottom: 15,
    },
    songTitle: {
        fontWeight: "700",
        fontSize: 22,
        color: "#111",
        textAlign: "center",
    },
    songArtist: {
        fontSize: 16,
        color: "#6B7280",
        textAlign: "center",
    },
    commentRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginVertical: 8,
    },
    commentAvatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        marginRight: 10,
    },
    commentName: { fontWeight: "700" },
    commentText: { color: "#333" },
    commentInput: {
        flexDirection: "row",
        alignItems: "center",
        borderTopWidth: 1,
        borderColor: "#eee",
        paddingHorizontal: 10,
        paddingVertical: 14,
        backgroundColor: "#fff",
        paddingBottom: 0
    },
    input: {
        flex: 1,
        backgroundColor: "#f2f2f2",
        borderRadius: 25,
        paddingHorizontal: 18,
        paddingVertical: 14,
        fontSize: 16,
        color: "#111",
        marginRight: 10,
    },
    empty: { textAlign: "center", color: "#999", marginTop: 30 },
});
