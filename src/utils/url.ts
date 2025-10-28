// utils/url.ts
import { BASE_URL } from "../config";

export const withFullUrl = (s: any) => {
  const clean = (v?: string) => (v ?? "").trim();
  const toImg = (v: string) =>
    v.startsWith("http") ? v : `${BASE_URL}/image/${encodeURIComponent(v)}`;
  const toMp3 = (v: string) =>
    v.startsWith("http") ? v : `${BASE_URL}/music/${encodeURIComponent(v)}`;

  return {
    ...s,
    image: toImg(clean(s.image)),
    url: toMp3(clean(s.url)),
  };
};

export const ensureHttpUrl = (u: string) => {
  try {
    const x = new URL(u.trim());
    return x.protocol === "http:" || x.protocol === "https:" ? u.trim() : "";
  } catch {
    return "";
  }
};
