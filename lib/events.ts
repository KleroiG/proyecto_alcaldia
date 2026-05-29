"use client";

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api"
).replace(/\/+$/, "");

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&h=500&fit=crop";

export type BackendEvent = {
  id_evento?: string | number;
  id?: string | number;
  nombre?: string;
  descripcion?: string;
  tipo?: string;
  organizador?: string;
  contacto?: string;
  fecha_inicio?: string;
  fecha_fin?: string;
  asistentes_estimados?: string | number;
  impacto_economico?: string | number;
  estado?: string;
  url_foto?: string;
  observaciones?: string;
  direccion?: string | { direccion?: string; [key: string]: unknown };
  latitud?: string | number;
  longitud?: string | number;
  google_place_id?: string;
  fotos?: Array<{
    id_foto?: string | number;
    id?: string | number;
    url_foto?: string;
    [key: string]: unknown;
  }>;
  [key: string]: unknown;
};

export type EventStatus = "Programado" | "En curso" | "Finalizado";

export type EventRecord = {
  id: string;
  nombre: string;
  descripcion: string;
  tipo: string;
  organizador: string;
  contacto: string;
  fechaInicio: string;
  fechaFin: string;
  asistentesEstimados: string;
  impactoEconomico: string;
  estado: EventStatus;
  observaciones: string;
  direccion: string;
  latitud: string;
  longitud: string;
  googlePlaceId: string;
  imageUrl: string;
  fotos: Array<{ id: string; url: string }>;
};

export type EventPayload = {
  nombre: string;
  descripcion: string;
  tipo: string;
  organizador: string;
  contacto: string;
  fechaInicio: string;
  fechaFin: string;
  asistentesEstimados: string;
  impactoEconomico: string;
  estado: string;
  observaciones: string;
  direccion: string;
  latitud: string;
  longitud: string;
  googlePlaceId: string;
  urlFoto?: File | null;
  fotos?: File[];
  fotosAEliminar?: string[];
};

function apiUrl(path: string) {
  const cleanPath = path.replace(/^\/+/, "");

  if (API_BASE_URL.endsWith("/api")) {
    return `${API_BASE_URL}/${cleanPath}`;
  }

  return `${API_BASE_URL}/api/${cleanPath}`;
}

async function readJsonResponse(response: Response) {
  const contentType = response.headers.get("content-type") || "";

  if (!contentType.includes("application/json")) {
    return null;
  }

  return response.json();
}

function getResponseMessage(data: unknown, fallback: string) {
  if (data && typeof data === "object") {
    const record = data as Record<string, unknown>;
    const message = record.message || record.error || record.mensaje;

    if (typeof message === "string") {
      return message;
    }
  }

  return fallback;
}

function extractEventList(data: unknown): BackendEvent[] {
  if (Array.isArray(data)) {
    return data as BackendEvent[];
  }

  if (!data || typeof data !== "object") {
    return [];
  }

  const record = data as Record<string, unknown>;
  const candidates = [record.data, record.events, record.eventos, record.event];
  const list = candidates.find(Array.isArray);

  return Array.isArray(list) ? (list as BackendEvent[]) : [];
}

function extractEvent(data: unknown): BackendEvent | null {
  if (!data || typeof data !== "object") {
    return null;
  }

  const record = data as Record<string, unknown>;
  const candidates = [record.data, record.event, record.evento, record];
  const event = candidates.find(
    (value) => value && typeof value === "object" && !Array.isArray(value),
  );

  return event ? (event as BackendEvent) : null;
}

function normalizeUrl(url: unknown) {
  if (typeof url !== "string" || !url.trim()) {
    return "";
  }

  const cleanUrl = url.trim();

  if (/^https?:\/\//i.test(cleanUrl)) {
    return cleanUrl;
  }

  const origin = API_BASE_URL.replace(/\/api$/, "");
  return `${origin}/${cleanUrl.replace(/^\/+/, "")}`;
}

function normalizeStatus(value: unknown, fechaInicio?: string, fechaFin?: string): EventStatus {
  const status = String(value || "").toLowerCase();

  if (status.includes("final")) {
    return "Finalizado";
  }

  if (status.includes("curso") || status.includes("activo")) {
    return "En curso";
  }

  const today = new Date();
  const start = fechaInicio ? new Date(fechaInicio) : null;
  const end = fechaFin ? new Date(fechaFin) : null;

  if (end && !Number.isNaN(end.getTime()) && end < today) {
    return "Finalizado";
  }

  if (
    start &&
    end &&
    !Number.isNaN(start.getTime()) &&
    !Number.isNaN(end.getTime()) &&
    start <= today &&
    end >= today
  ) {
    return "En curso";
  }

  return "Programado";
}

function getAddress(value: BackendEvent["direccion"]) {
  if (typeof value === "string") {
    return value;
  }

  if (value && typeof value === "object" && typeof value.direccion === "string") {
    return value.direccion;
  }

  return "Sogamoso, Boyaca";
}

export function mapBackendEvent(event: BackendEvent): EventRecord {
  const fotos = (event.fotos || [])
    .map((foto) => ({
      id: String(foto.id_foto || foto.id || foto.url_foto || ""),
      url: normalizeUrl(foto.url_foto),
    }))
    .filter((foto) => foto.url);

  const imageUrl = normalizeUrl(event.url_foto) || fotos[0]?.url || FALLBACK_IMAGE;
  const fechaInicio = String(event.fecha_inicio || "");
  const fechaFin = String(event.fecha_fin || "");

  return {
    id: String(event.id_evento || event.id || ""),
    nombre: String(event.nombre || "Evento sin nombre"),
    descripcion: String(event.descripcion || ""),
    tipo: String(event.tipo || "General"),
    organizador: String(event.organizador || ""),
    contacto: String(event.contacto || ""),
    fechaInicio,
    fechaFin,
    asistentesEstimados: String(event.asistentes_estimados || ""),
    impactoEconomico: String(event.impacto_economico || ""),
    estado: normalizeStatus(event.estado, fechaInicio, fechaFin),
    observaciones: String(event.observaciones || ""),
    direccion: getAddress(event.direccion),
    latitud: String(event.latitud || ""),
    longitud: String(event.longitud || ""),
    googlePlaceId: String(event.google_place_id || ""),
    imageUrl,
    fotos,
  };
}

export async function getEvents() {
  const response = await fetch(apiUrl("/event"), {
    headers: { Accept: "application/json" },
  });
  const data = await readJsonResponse(response);

  if (!response.ok) {
    throw new Error(getResponseMessage(data, "No se pudieron cargar los eventos."));
  }

  return extractEventList(data).map(mapBackendEvent);
}

export async function getEventById(id: string) {
  const response = await fetch(apiUrl(`/event/${encodeURIComponent(id)}`), {
    headers: { Accept: "application/json" },
  });
  const data = await readJsonResponse(response);

  if (!response.ok) {
    throw new Error(getResponseMessage(data, "No se pudo cargar el evento."));
  }

  const event = extractEvent(data);
  return event ? mapBackendEvent(event) : null;
}

function appendEventPayload(formData: FormData, payload: EventPayload, isUpdate: boolean) {
  formData.append("nombre", payload.nombre);
  formData.append("descripcion", payload.descripcion);
  formData.append("tipo", payload.tipo);
  formData.append("organizador", payload.organizador);
  formData.append("contacto", payload.contacto);
  formData.append("fecha_inicio", payload.fechaInicio);
  formData.append("fecha_fin", payload.fechaFin);
  formData.append("asistentes_estimados", payload.asistentesEstimados || "0");
  formData.append("impacto_economico", payload.impactoEconomico || "0");
  formData.append("estado", payload.estado);
  formData.append("observaciones", payload.observaciones);
  formData.append("direccion", payload.direccion);
  formData.append("latitud", payload.latitud);
  formData.append("longitud", payload.longitud);
  formData.append("google_place_id", payload.googlePlaceId);

  if (payload.urlFoto) {
    formData.append("url_foto", payload.urlFoto);
  }

  payload.fotos?.forEach((foto) => {
    formData.append(isUpdate ? "nuevas_fotos[]" : "fotos[]", foto);
  });

  payload.fotosAEliminar?.forEach((fotoId) => {
    formData.append("fotos_a_eliminar[]", fotoId);
  });
}

export async function createEvent(payload: EventPayload) {
  const formData = new FormData();
  appendEventPayload(formData, payload, false);

  const response = await fetch(apiUrl("/event/register"), {
    method: "POST",
    headers: { Accept: "application/json" },
    body: formData,
  });
  const data = await readJsonResponse(response);

  if (!response.ok) {
    throw new Error(getResponseMessage(data, "No se pudo crear el evento."));
  }

  return data;
}

export async function updateEvent(id: string, payload: EventPayload) {
  const formData = new FormData();
  formData.append("_method", "PUT");
  appendEventPayload(formData, payload, true);

  const response = await fetch(apiUrl(`/event/${encodeURIComponent(id)}`), {
    method: "POST",
    headers: { Accept: "application/json" },
    body: formData,
  });
  const data = await readJsonResponse(response);

  if (!response.ok) {
    throw new Error(getResponseMessage(data, "No se pudo actualizar el evento."));
  }

  return data;
}

export async function deleteEvent(id: string) {
  const response = await fetch(apiUrl(`/event/${encodeURIComponent(id)}`), {
    method: "DELETE",
    headers: { Accept: "application/json" },
  });
  const data = await readJsonResponse(response);

  if (!response.ok) {
    throw new Error(getResponseMessage(data, "No se pudo eliminar el evento."));
  }

  return data;
}
