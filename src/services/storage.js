import { createClient } from "@supabase/supabase-js";
import { slugify } from "../utils/helpers";

const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL || "").trim();
const SUPABASE_KEY = (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || "").trim();
const STORAGE_BUCKET = (import.meta.env.VITE_SUPABASE_STORAGE_BUCKET || "terra-esperanca-arquivos").trim();

export const isStorageConfigured = Boolean(SUPABASE_URL && SUPABASE_KEY);

const storageClient = isStorageConfigured
  ? createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    })
  : null;

function toPathSegment(value, fallback) {
  return (slugify(value || fallback) || fallback)
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function sanitizeFileName(fileName) {
  const parts = String(fileName || "arquivo").split(".");
  const extension = parts.length > 1 ? parts.pop() : "";
  const base = slugify(parts.join(".") || "arquivo").replace(/[^a-z0-9-]/g, "-") || "arquivo";
  return extension ? `${base}.${extension.toLowerCase()}` : base;
}

function getPublicUrl(path) {
  if (!storageClient) return null;
  const { data } = storageClient.storage.from(STORAGE_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

async function uploadFile(path, file) {
  if (!storageClient) {
    throw new Error("O storage do Supabase nao esta configurado no frontend.");
  }

  if (!(file instanceof File) || !file.name) return null;

  const { error } = await storageClient.storage.from(STORAGE_BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: true,
    contentType: file.type || undefined
  });

  if (error) {
    throw new Error(error.message || "Nao foi possivel enviar o arquivo para o storage.");
  }

  return getPublicUrl(path);
}

export async function uploadUserPhoto(file, identifier) {
  if (!(file instanceof File) || !file.name) return null;

  const safeIdentifier = toPathSegment(identifier, "usuario");
  const safeFileName = sanitizeFileName(file.name);
  const path = `usuarios/${safeIdentifier}/perfil-${Date.now()}-${safeFileName}`;
  return uploadFile(path, file);
}
