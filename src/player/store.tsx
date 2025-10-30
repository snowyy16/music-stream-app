import React, { createContext, useContext, useState, useMemo } from "react";
import type { ImageSourcePropType } from "react-native";
import { activeSoundRef, stopActiveSound, loadAndPlay } from "./manager";

export type Song = {
  _id?: string;
  title: string;
  artist: string;
  image: string; // URL
  url: string; // URL
};

type PlayerState = {
  song?: Song;
  queue: Song[];
  index: number;
  isPlaying: boolean;
  position: number;
  duration: number;
};

type PlayerActions = {
  setNowPlaying: (p: Partial<PlayerState> & { song?: Song }) => void;
  updateProgress: (p: {
    position?: number;
    duration?: number;
    isPlaying?: boolean;
  }) => void;
  togglePlayPause: () => Promise<void>;
  next: () => Promise<void>;
  prev: () => Promise<void>;
  clear: () => Promise<void>;
};

const PlayerContext = createContext<(PlayerState & PlayerActions) | null>(null);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<PlayerState>({
    song: undefined,
    queue: [],
    index: 0,
    isPlaying: false,
    position: 0,
    duration: 1,
  });

  const actions: PlayerActions = useMemo(
    () => ({
      setNowPlaying: (p) =>
        setState((s) => ({
          song: p.song ?? s.song,
          queue: (p as any).queue ?? s.queue,
          index: (p as any).index ?? s.index,
          isPlaying:
            (p as any) && "isPlaying" in p ? (p as any).isPlaying : s.isPlaying,
          position: (p as any).position ?? s.position,
          duration: (p as any).duration ?? s.duration,
        })),
      updateProgress: ({ position, duration, isPlaying }) =>
        setState((s) => ({
          ...s,
          position: position ?? s.position,
          duration: duration ?? s.duration,
          isPlaying: typeof isPlaying === "boolean" ? isPlaying : s.isPlaying,
        })),
      togglePlayPause: async () => {
        const snd = activeSoundRef.sound;
        if (!snd) return;
        const st: any = await snd.getStatusAsync();
        if (!st.isLoaded) return;
        if (st.isPlaying) {
          await snd.pauseAsync();
          setState((s) => ({ ...s, isPlaying: false }));
        } else {
          await snd.playAsync();
          setState((s) => ({ ...s, isPlaying: true }));
        }
      },

      // ✅ Khi chuyển bài -> phát luôn, không cần bấm play
      next: async () => {
        if (!state.queue.length) return;
        const ni = (state.index + 1) % state.queue.length;
        const nextSong = state.queue[ni];

        await stopActiveSound();
        await loadAndPlay(nextSong);

        setState({
          ...state,
          index: ni,
          song: nextSong,
          position: 0,
          isPlaying: true,
        });
      },

      prev: async () => {
        if (!state.queue.length) return;
        const ni = (state.index - 1 + state.queue.length) % state.queue.length;
        const prevSong = state.queue[ni];

        await stopActiveSound();
        await loadAndPlay(prevSong);

        setState({
          ...state,
          index: ni,
          song: prevSong,
          position: 0,
          isPlaying: true,
        });
      },

      clear: async () => {
        await stopActiveSound();
        setState({
          song: undefined,
          queue: [],
          index: 0,
          isPlaying: false,
          position: 0,
          duration: 1,
        });
      },
    }),
    [state] // để state được cập nhật đúng
  );

  return (
    <PlayerContext.Provider value={{ ...state, ...actions }}>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be used within PlayerProvider");
  return ctx;
}
