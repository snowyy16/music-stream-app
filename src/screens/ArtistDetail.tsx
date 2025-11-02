import React, { useEffect, useState } from "react";
import { withFullUrl } from "../utils/url";

import {
    View,
    Text,
    StyleSheet,
    Image,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { BASE_URL } from "../config";

type Artist = {
    _id: string;
    name: string;
    avatar: string;
    country?: string;
    followers?: number;
};

type Song = {
    _id: string;
    title: string;
    artist: string;
    image: string;
    url: string;
};

type RouteParams = {
    artist: Artist;
};

export default function ArtistDetail() {
    const route = useRoute<RouteProp<Record<string, RouteParams>, string>>();
    const navigation = useNavigation<any>();
    const artist = route.params?.artist;

    const [songs, setSongs] = useState<Song[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadSongsByArtist = async () => {
            if (!artist?.name) return;
            setLoading(true);
            try {
                const res = await fetch(`${BASE_URL}/api/songs`);
                const data: Song[] = await res.json();

                // Chuẩn hoá URL ảnh và nhạc
                const songsWithUrl = data.map(withFullUrl);

                // Lọc bài hát theo tên nghệ sĩ (không phân biệt hoa/thường)
                const filtered = songsWithUrl.filter((s) =>
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



    return (
        <ScrollView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={26} color="#111827" />
                </TouchableOpacity>
                <View style={{ width: 26 }} />
            </View>

            {/* Artist Info */}
            <View style={styles.info}>
                <Image source={{ uri: artist?.avatar }} style={styles.avatar} />
                <Text style={styles.name}>{artist?.name}</Text>
                <Text style={styles.meta}>
                    {artist?.country || "Vietnam"} • {artist?.followers || 0} followers
                </Text>

                <TouchableOpacity style={styles.followBtn}>
                    <Ionicons name="person-add" size={16} color="#fff" />
                    <Text style={styles.followText}>Follow</Text>
                </TouchableOpacity>
            </View>

            {/* Songs Section */}
            <Text style={styles.sectionTitle}>Songs</Text>
            {loading ? (
                <ActivityIndicator size="large" color="#111827" style={{ marginTop: 20 }} />
            ) : songs.length === 0 ? (
                <Text style={styles.noSongs}>Nghệ sĩ này chưa có bài hát.</Text>
            ) : (
                songs.map((song) => (
                    <TouchableOpacity
                        key={song._id}
                        style={styles.songCard}
                        onPress={() => navigation.navigate("PlayScreen", { song })}
                    >
                        <Image source={{ uri: song.image }} style={styles.songImage} />
                        <View style={{ flex: 1 }}>
                            <Text style={styles.songTitle}>{song.title}</Text>
                            <Text style={styles.songArtist}>{song.artist}</Text>
                        </View>
                        <Ionicons name="play" size={22} color="#1DB954" />
                    </TouchableOpacity>
                ))
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff", padding: 18 },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 16,
    },
    headerTitle: { fontSize: 20, fontWeight: "700", color: "#111827" },
    info: { alignItems: "center", marginBottom: 30 },
    avatar: { width: 130, height: 130, borderRadius: 65, marginBottom: 10 },
    name: { fontSize: 26, fontWeight: "800", color: "#111827" },
    meta: { color: "#6B7280", fontSize: 14, marginBottom: 10 },
    followBtn: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#111827",
        borderRadius: 25,
        paddingHorizontal: 18,
        paddingVertical: 8,
    },
    followText: { color: "#fff", fontWeight: "600", marginLeft: 6 },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#111827",
        marginBottom: 12,
    },
    songCard: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
        backgroundColor: "#F9FAFB",
        borderRadius: 12,
        padding: 10,
    },
    songImage: { width: 55, height: 55, borderRadius: 8, marginRight: 12 },
    songTitle: { fontSize: 15, fontWeight: "600", color: "#111827" },
    songArtist: { fontSize: 13, color: "#6B7280" },
    noSongs: { color: "#6B7280", textAlign: "center", marginTop: 20 },
});
