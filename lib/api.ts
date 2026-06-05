"use client";

const _raw = (process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api").replace(/\/+$/, "");

// Garantiza que siempre termine en /api, sin importar qué venga en la env
export const API_BASE = _raw.endsWith("/api") ? _raw : `${_raw}/api`;

/** Construye una URL completa hacia el backend sin duplicar /api */
export function apiUrl(path: string): string {
  return `${API_BASE}/${path.replace(/^\/+/, "")}`;
}

/** Origen del servidor (sin /api), útil para normalizar URLs de imágenes */
export const API_ORIGIN = API_BASE.replace(/\/api$/, "");
