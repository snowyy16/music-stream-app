import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    SafeAreaView,
    StatusBar,
    Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRoute, useNavigation } from "@react-navigation/native";
import { BASE_URL } from "../config";
import { withFullUrl } from "../utils/url";

type Song = {
    _id: string;
    title: string;
    artist: string;
    image: string;
    url: string;
    album?: string;
};

export default function AlbumDetailScreen() {
    const route = useRoute();
    const navigation = useNavigation<any>();
    const { album }: any = route.params;
    const [songs, setSongs] = useState<Song[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSongs = async () => {
            try {
                const res = await fetch(`${BASE_URL}/api/songs/by-album/${encodeURIComponent(album.name)}`);
                const data: Song[] = await res.json();
                setSongs(data.map(withFullUrl));
            } catch (err) {
                console.error("❌ Lỗi tải bài hát:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchSongs();
    }, [album.name]);

    const renderSong = ({ item }: { item: Song }) => (
        <TouchableOpacity
            style={styles.songRow}
            onPress={() =>
                navigation.navigate("PlayScreen", {
                    song: item,
                    queue: songs,
                    index: songs.findIndex((s) => s._id === item._id),
                })

            }
        >
            <Image source={{ uri: item.image }} style={styles.songImage} />
            <View style={{ flex: 1 }}>
                <Text style={styles.songTitle} numberOfLines={1}>
                    {item.title}
                </Text>
                <Text style={styles.songArtist}>{item.artist}</Text>
            </View>
            <Ionicons name="play-circle" size={26} color="#1DB954" />
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Image source={{ uri: album.cover }} style={styles.albumCover} />
                <Text style={styles.albumName}>{album.name}</Text>
                <Text style={styles.albumArtist}>{album.artist}</Text>

                <Text style={styles.sectionTitle}>Tracks</Text>
                {loading ? (
                    <ActivityIndicator size="large" color="#1DB954" />
                ) : songs.length === 0 ? (
                    <Text style={styles.emptyText}>Không có bài hát nào trong album này.</Text>
                ) : (
                    <FlatList
                        data={songs}
                        keyExtractor={(item) => item._id}
                        renderItem={renderSong}
                        contentContainerStyle={{ paddingBottom: 80 }}
                    />
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#F9FAFB",
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    },
    container: {
        flex: 1,
        backgroundColor: "#F9FAFB",
        paddingHorizontal: 16,
    },
    albumCover: {
        width: "100%",
        height: 250,
        borderRadius: 12,
        marginTop: 10,
    },
    albumName: {
        fontSize: 28,
        fontWeight: "800",
        color: "#111827",
        marginTop: 15,
    },
    albumArtist: {
        fontSize: 16,
        color: "#6B7280",
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "700",
        marginVertical: 10,
    },
    songRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
        borderBottomWidth: 0.5,
        borderColor: "#E5E7EB",
    },
    songImage: {
        width: 50,
        height: 50,
        borderRadius: 6,
        marginRight: 12,
    },
    songTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#111827",
    },
    songArtist: {
        fontSize: 14,
        color: "#6B7280",
    },
    emptyText: {
        textAlign: "center",
        marginTop: 30,
        color: "#6B7280",
    },
});
