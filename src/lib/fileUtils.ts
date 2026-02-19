import { getApiInvokeUrl } from "@/config";

/**
 * Dosya tipleri - Question/Header medya tipleri ve upload kısıtlamaları için.
 * Her tip için accept string ve MIME/uzantı sınıflandırması.
 */
export const FILE_TYPE_CATEGORIES = {
  image: {
    accept: "image/*",
    mimePrefix: "image/",
    extensions: ["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp"],
  },
  video: {
    accept: "video/*",
    mimePrefix: "video/",
    extensions: ["mp4", "webm", "ogg", "mov", "avi", "mkv"],
  },
  audio: {
    accept: "audio/*",
    mimePrefix: "audio/",
    extensions: ["mp3", "wav", "ogg", "m4a", "aac", "webm"],
  },
  pdf: {
    accept: "application/pdf",
    mimePrefix: "application/pdf",
    extensions: ["pdf"],
  },
  document: {
    accept: ".doc,.docx,.odt,.txt,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain",
    mimePrefix: "",
    extensions: ["doc", "docx", "odt", "txt"],
  },
  other: {
    accept: "*/*",
    mimePrefix: "",
    extensions: [],
  },
} as const;

export type FileTypeCategory = keyof typeof FILE_TYPE_CATEGORIES;

/** Tek bir kategori veya karma (örn. image | video) için accept string */
export function getAcceptForTypes(types: FileTypeCategory[]): string {
  if (types.length === 0) return "*/*";
  const set = new Set(types);
  return types
    .map((t) => FILE_TYPE_CATEGORIES[t].accept)
    .filter(Boolean)
    .join(",");
}

/**
 * Upload API'den dönen path ile dosya sunma (serve) URL'i.
 * FileController: GET /api/files/serve/{path} — path, yükleme cevabındaki path alanıdır.
 */
export function getFilePreviewUrl(path: string): string {
  if (!path) return "";
  const base = getApiInvokeUrl();
  const normalized = path.startsWith("/") ? path.slice(1) : path;
  return `${base}/files/serve/${normalized}`;
}

/**
 * API'den gelen medya content'i için URL.
 * Zaten tam URL (http/https veya //) ise olduğu gibi döner;
 * path ise FileRestController serve URL'ine çevirir (GET /files/serve/{path}).
 */
export function getMediaServeUrl(content: string | undefined | null): string {
  if (!content) return "";
  if (content.startsWith("http") || content.startsWith("//")) return content;
  return getFilePreviewUrl(content);
}

/** Dosyanın MIME tipine göre kategori */
export function getCategoryFromFile(file: File): FileTypeCategory {
  const type = file.type.toLowerCase();
  if (type.startsWith("image/")) return "image";
  if (type.startsWith("video/")) return "video";
  if (type.startsWith("audio/")) return "audio";
  if (type === "application/pdf") return "pdf";
  if (
    type.includes("word") ||
    type.includes("document") ||
    type === "text/plain" ||
    /\.(doc|docx|odt|txt)$/i.test(file.name)
  )
    return "document";
  return "other";
}

/** Belirtilen kategorilere göre dosya kabul edilir mi */
export function isFileAccepted(file: File, allowedTypes: FileTypeCategory[]): boolean {
  if (allowedTypes.length === 0 || allowedTypes.includes("other")) return true;
  const category = getCategoryFromFile(file);
  return allowedTypes.includes(category);
}
