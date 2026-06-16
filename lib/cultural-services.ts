"use client";

import { apiUrl, API_ORIGIN } from "./api";

function getAuthHeaders(): HeadersInit {
  const token =
    typeof window !== "undefined"
      ? (localStorage.getItem("sogamoso_auth_token") ?? localStorage.getItem("token"))
      : null;

  const headers: Record<string, string> = { Accept: "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

async function readJson(response: Response) {
  const ct = response.headers.get("content-type") || "";
  return ct.includes("application/json") ? response.json() : null;
}

function getMessage(data: unknown, fallback: string) {
  if (data && typeof data === "object") {
    const r = data as Record<string, unknown>;
    const m = r.message || r.error || r.mensaje;
    if (typeof m === "string") return m;
  }
  return fallback;
}

export type ArtisticArea = {
  id: number;
  nombre: string;
};

export type ProfileTypeSc = {
  id: number;
  nombre: string;
};

export type CulturalService = {
  id: number;
  id_area_artistica: number;
  id_tipo_perfil_sc: number;
  nombre_artistico: string;
  telefono: number | string;
  correo: string;
  contacto: string;
  url_foto: string;
  biografia: string;
  tipo_servicio: string;
  publico_objetivo: string;
  reconocimientos?: string;
  correo_publicar?: string;
  telefono_publicar?: number | string;
  sitio_web?: string;
  instagram?: string;
  facebook?: string;
  youtube?: string;
  tiktok?: string;
  otra_red?: string;
  area_artistica?: ArtisticArea;
  tipo_perfil_sc?: ProfileTypeSc;
};

// 1. GET ALL SERVICES
export async function getCulturalServices(): Promise<CulturalService[]> {
  const response = await fetch(apiUrl("cultural-services"), {
    headers: { Accept: "application/json" },
  });
  const data = await readJson(response);

  if (!response.ok) {
    throw new Error(getMessage(data, "No se pudieron cargar los servicios culturales."));
  }

  return (data?.data || data || []) as CulturalService[];
}

// 2. GET BY ID
export async function getCulturalServiceById(id: number | string): Promise<CulturalService> {
  const response = await fetch(apiUrl(`cultural-services/${id}`), {
    headers: { Accept: "application/json" },
  });
  const data = await readJson(response);

  if (!response.ok) {
    throw new Error(getMessage(data, "No se pudo cargar el servicio cultural."));
  }

  return (data?.data || data) as CulturalService;
}

// 3. CREATE SERVICE
export async function createCulturalService(formData: FormData): Promise<any> {
  const response = await fetch(apiUrl("cultural-services/register"), {
    method: "POST",
    headers: getAuthHeaders(),
    body: formData,
  });
  const data = await readJson(response);

  if (!response.ok) {
    throw new Error(getMessage(data, "No se pudo registrar el servicio cultural."));
  }

  return data;
}

// 4. UPDATE SERVICE
export async function updateCulturalService(id: number | string, formData: FormData): Promise<any> {
  // Laravel usualmente requiere POST con _method = PUT para peticiones multipart/form-data
  formData.append("_method", "PUT");
  const response = await fetch(apiUrl(`cultural-services/${id}`), {
    method: "POST",
    headers: getAuthHeaders(),
    body: formData,
  });
  const data = await readJson(response);

  if (!response.ok) {
    throw new Error(getMessage(data, "No se pudo actualizar el servicio cultural."));
  }

  return data;
}

// 5. DELETE SERVICE
export async function deleteCulturalService(id: number | string): Promise<any> {
  const response = await fetch(apiUrl(`cultural-services/${id}`), {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  const data = await readJson(response);

  if (!response.ok) {
    throw new Error(getMessage(data, "No se pudo eliminar el servicio cultural."));
  }

  return data;
}

// --- AREAS ARTISTICAS ---
export async function getArtisticAreas(): Promise<ArtisticArea[]> {
  const response = await fetch(apiUrl("areas-artisticas"), {
    headers: { Accept: "application/json" },
  });
  const data = await readJson(response);

  if (!response.ok) {
    throw new Error(getMessage(data, "No se pudieron cargar las áreas artísticas."));
  }

  return (data?.data || data || []) as ArtisticArea[];
}

export async function createArtisticArea(nombre: string): Promise<ArtisticArea> {
  const response = await fetch(apiUrl("areas-artisticas/register"), {
    method: "POST",
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ nombre }),
  });
  const data = await readJson(response);

  if (!response.ok) {
    throw new Error(getMessage(data, "No se pudo registrar el área artística."));
  }

  return (data?.data || data) as ArtisticArea;
}

export async function deleteArtisticArea(id: number | string): Promise<any> {
  const response = await fetch(apiUrl(`areas-artisticas/${id}`), {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  const data = await readJson(response);

  if (!response.ok) {
    throw new Error(getMessage(data, "No se pudo eliminar el área artística."));
  }

  return data;
}

// --- TIPOS PERFILES SC ---
export async function getProfileTypesSc(): Promise<ProfileTypeSc[]> {
  const response = await fetch(apiUrl("tipos-perfiles-sc"), {
    headers: { Accept: "application/json" },
  });
  const data = await readJson(response);

  if (!response.ok) {
    throw new Error(getMessage(data, "No se pudieron cargar los tipos de perfil."));
  }

  return (data?.data || data || []) as ProfileTypeSc[];
}

export async function createProfileTypeSc(nombre: string): Promise<ProfileTypeSc> {
  const response = await fetch(apiUrl("tipos-perfiles-sc/register"), {
    method: "POST",
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ nombre }),
  });
  const data = await readJson(response);

  if (!response.ok) {
    throw new Error(getMessage(data, "No se pudo registrar el tipo de perfil."));
  }

  return (data?.data || data) as ProfileTypeSc;
}

export async function deleteProfileTypeSc(id: number | string): Promise<any> {
  const response = await fetch(apiUrl(`tipos-perfiles-sc/${id}`), {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  const data = await readJson(response);

  if (!response.ok) {
    throw new Error(getMessage(data, "No se pudo eliminar el tipo de perfil."));
  }

  return data;
}
