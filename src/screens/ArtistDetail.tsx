import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
    SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRoute, useNavigation } from "@react-navigation/native";
import { BASE_URL } from "../config";
import { withFullUrl } from "../utils/url";
import { useAuth } from "../context/AuthContext";

type Song = {
    _id: string;
    title: string;
    artist: string;
    image: string;
    url: string;
    category?: string;
};


export default function ArtistDetail() {
    const route = useRoute<any>();
    const navigation = useNavigation<any>();
    const { artist } = route.params;
    const { user } = useAuth();

    const [followers, setFollowers] = useState<number>(artist?.followers || 0);
    const [isFollowing, setIsFollowing] = useState(false);
    const [songs, setSongs] = useState<Song[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkFollowStatus = async () => {
            if (!artist?._id || !user?._id) return;
            try {
                const res = await fetch(`${BASE_URL}/api/artists/${artist._id}/isFollowed?userId=${user._id}`);
                const data = await res.json();
                setIsFollowing(data.followed);
            } catch (err) {
                console.error("❌ Error checking follow status:", err);
            }
        };
        checkFollowStatus();
    }, [artist, user]);

    const handleFollow = async () => {
        if (!artist?._id || !user?._id) return;
        try {
            const res = await fetch(`${BASE_URL}/api/artists/${artist._id}/follow`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: user._id }),
            });
            const data = await res.json();
            if (data.success) {
                setFollowers(data.followers);
                setIsFollowing(data.followed);
            }
        } catch (err) {
            console.error("❌ Lỗi follow/unfollow:", err);
        }
    };

    useEffect(() => {
        const loadSongsByArtist = async () => {
            try {
                const res = await fetch(`${BASE_URL}/api/songs`);
                const data = await res.json();
                const songsWithUrl = data.map(withFullUrl);
                const filtered = songsWithUrl.filter((s: Song) =>
                    s.artist.trim().toLowerCase().includes(artist.name.trim().toLowerCase())
                );
                setSongs(filtered);
            } catch (err) {
                console.error("❌ Error loading songs:", err);
            } finally {
                setLoading(false);
            }
        };
        loadSongsByArtist();
    }, [artist]);

    const renderSong = ({ item, index }: any) => (
        <TouchableOpacity
            key={item._id}
            style={styles.songRow}
            onPress={() =>
                navigation.navigate("PlayScreen", {
                    song: item,
                    queue: songs,
                    index,
                })
            }
        >
            <Image source={{ uri: item.image }} style={styles.songImage} />
            <View style={{ flex: 1 }}>
                <Text style={styles.songTitle}>{item.title}</Text>
                <Text style={styles.songArtist}>{item.artist}</Text>
            </View>
            <Ionicons name="play-circle-outline" size={26} color="#1DB954" />
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            {/* Header cố định */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={26} color="#111827" />
                </TouchableOpacity>
                <View style={{ width: 26 }} />
            </View>

            {/* Thông tin nghệ sĩ cố định */}
            <View style={styles.fixedInfo}>
                <Image
                    source={{
                        uri: artist.avatar?.startsWith("http")
                            ? artist.avatar
                            : `${BASE_URL}/image/${artist.avatar}`,
                    }}
                    style={styles.avatar}
                />

                <Text style={styles.name}>{artist.name}</Text>
                <Text style={styles.meta}>
                    {artist.country || "Vietnam"} • {followers} followers
                </Text>

                <TouchableOpacity
                    style={[
                        styles.followBtn,
                        isFollowing ? { backgroundColor: "#6B7280" } : { backgroundColor: "#111827" },
                    ]}
                    onPress={handleFollow}
                >
                    <Ionicons
                        name={isFollowing ? "person-remove" : "person-add"}
                        size={16}
                        color="#fff"
                    />
                    <Text style={styles.followText}>
                        {isFollowing ? "Unfollow" : "Follow"}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Danh sách bài hát */}
            {loading ? (
                <ActivityIndicator size="large" color="#111827" style={{ marginTop: 40 }} />
            ) : songs.length === 0 ? (
                <Text style={styles.noSongs}>Nghệ sĩ này chưa có bài hát.</Text>
            ) : (
                <FlatList
                    data={songs}
                    keyExtractor={(item) => item._id}
                    renderItem={renderSong}
                    contentContainerStyle={{ paddingBottom: 100 }}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: "#fff" },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 16,
    },
    fixedInfo: {
        alignItems: "center",
        paddingHorizontal: 16,
        marginBottom: 10,
    },
    avatar: { width: 150, height: 150, borderRadius: 75, marginBottom: 10 },
    name: { fontSize: 26, fontWeight: "800", color: "#111827" },
    meta: { color: "#6B7280", fontSize: 14, marginBottom: 10 },
    followBtn: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 25,
        paddingHorizontal: 20,
        paddingVertical: 8,
    },
    followText: { color: "#fff", fontWeight: "600", marginLeft: 6 },
    songRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
        backgroundColor: "#F9FAFB",
        borderRadius: 12,
        padding: 10,
        marginHorizontal: 16,
    },
    songImage: {
        width: 60,
        height: 60,
        borderRadius: 8,
        marginRight: 12,
    },
    songTitle: { fontSize: 16, fontWeight: "600", color: "#1F2937" },
    songArtist: { fontSize: 13, color: "#6B7280" },
    noSongs: { color: "#6B7280", textAlign: "center", marginTop: 20 },
});
