"use client";

import { apiUrl as _apiUrl } from "./api";

export const AUTH_TOKEN_KEY = "sogamoso_auth_token";
export const AUTH_USER_KEY = "sogamoso_auth_user";
export const AUTH_RESPONSE_KEY = "sogamoso_auth_response";

export type AuthProfile = {
  id_perfil?: string | number;
  id?: string | number;
  nombre?: string;
  apellido?: string;
  correo?: string;
  role?: string | number;
  rol?: string | number;
  estado?: string;
  [key: string]: unknown;
};

export type LoginPayload = {
  correo: string;
  password: string;
};

export type RegisterPayload = {
  id_perfil: string;
  nombre: string;
  apellido: string;
  correo: string;
  fecha_nacimiento: string;
  genero: string;
  telefono: string;
  tipo_identificacion: string;
  password: string;
};

function apiUrl(path: string) {
  return _apiUrl(path);
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

function extractToken(data: unknown) {
  if (!data || typeof data !== "object") {
    return null;
  }

  const record = data as Record<string, unknown>;
  const candidates = [
    record.token,
    record.access_token,
    record.accessToken,
    (record.authorization as Record<string, unknown> | undefined)?.token,
    (record.data as Record<string, unknown> | undefined)?.token,
    (record.data as Record<string, unknown> | undefined)?.access_token,
  ];

  const token = candidates.find((value) => typeof value === "string");
  return typeof token === "string" ? token : null;
}

function extractProfile(data: unknown): AuthProfile | null {
  if (!data || typeof data !== "object") {
    return null;
  }

  const record = data as Record<string, unknown>;
  const dataRecord =
    record.data && typeof record.data === "object"
      ? (record.data as Record<string, unknown>)
      : null;
  const candidates = [
    record.user,
    record.usuario,
    record.profile,
    record.perfil,
    dataRecord?.user,
    dataRecord?.usuario,
    dataRecord?.profile,
    dataRecord?.perfil,
    dataRecord,
  ];

  const profile = candidates.find(
    (value) => value && typeof value === "object" && !Array.isArray(value),
  );

  return profile ? (profile as AuthProfile) : null;
}

export async function login(payload: LoginPayload) {
  const response = await fetch(apiUrl("/login"), {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await readJsonResponse(response);

  if (!response.ok) {
    throw new Error(getResponseMessage(data, "No se pudo iniciar sesion."));
  }

  const token = extractToken(data);
  let profile = extractProfile(data);

  // Always fetch the full profile to ensure perm_* fields are included,
  // since some login responses omit permission fields.
  const fullProfile = await getProfileByEmail(payload.correo).catch(() => null);
  if (fullProfile) {
    profile = { ...profile, ...fullProfile };
  } else if (!profile) {
    profile = null;
  }

  saveSession(token, profile, data);

  return { token, profile, data };
}

export async function registerProfile(payload: RegisterPayload) {
  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    formData.append(key, value);
  });

  const response = await fetch(apiUrl("/profiles/registro"), {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
    body: formData,
  });

  const data = await readJsonResponse(response);

  if (!response.ok) {
    throw new Error(getResponseMessage(data, "No se pudo registrar el usuario."));
  }

  return data;
}

export async function getProfileByEmail(correo: string) {
  const response = await fetch(apiUrl(`/profiles/e/${encodeURIComponent(correo)}`), {
    headers: {
      Accept: "application/json",
    },
  });

  const data = await readJsonResponse(response);

  if (!response.ok) {
    throw new Error(getResponseMessage(data, "No se pudo cargar el perfil."));
  }

  return extractProfile(data) || (data as AuthProfile);
}

export function saveSession(
  token: string | null,
  profile: AuthProfile | null,
  responseData: unknown,
) {
  if (token) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    localStorage.setItem("token", token);
  }

  if (profile) {
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(profile));
  }

  localStorage.setItem(AUTH_RESPONSE_KEY, JSON.stringify(responseData));
}

export function getStoredToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY) || localStorage.getItem("token");
}

export function getStoredProfile(): AuthProfile | null {
  const raw = localStorage.getItem(AUTH_USER_KEY);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as AuthProfile;
  } catch {
    return null;
  }
}

export function clearSession() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
  localStorage.removeItem(AUTH_RESPONSE_KEY);
  localStorage.removeItem("token");
}

export function getProfileName(profile: AuthProfile | null) {
  if (!profile) {
    return "Administrador";
  }

  const fullName = [profile.nombre, profile.apellido]
    .filter((value) => typeof value === "string" && value.trim())
    .join(" ");

  return fullName || String(profile.correo || "Administrador");
}

export function getProfileRole(profile: AuthProfile | null) {
  const role = getRoleValue(profile);

  if (role === 1 || role === "1" || role === "superadmin") {
    return "Superadministrador";
  }

  if (role === 0 || role === "0" || role === 2 || role === "2" || role === "admin") {
    return "Administrador";
  }

  return "Usuario";
}

function getRoleValue(profile: AuthProfile | null) {
  return profile?.role ?? profile?.rol;
}

export function isSuperAdmin(profile: AuthProfile | null) {
  const role = getRoleValue(profile);
  return role === 1 || role === "1" || role === "superadmin";
}

export function isAdmin(profile: AuthProfile | null) {
  const role = getRoleValue(profile);

  return (
    role === 0 ||
    role === "0" ||
    role === 2 ||
    role === "2" ||
    role === "admin"
  );
}

function isPermissionEnabled(value: unknown) {
  return value === true || value === "true" || value === 1 || value === "1";
}

export function hasFullAdminPermissions(profile: AuthProfile | null) {
  if (!profile) {
    return false;
  }

  if (isSuperAdmin(profile)) {
    return true;
  }

  const hasStatisticsPermission = Object.prototype.hasOwnProperty.call(
    profile,
    "perm_estadisticas",
  );

  return (
    isPermissionEnabled(profile.perm_atractivos) &&
    isPermissionEnabled(profile.perm_prestadores_servicios) &&
    isPermissionEnabled(profile.perm_servicios_culturales) &&
    isPermissionEnabled(profile.perm_agenda_eventos) &&
    (!hasStatisticsPermission || isPermissionEnabled(profile.perm_estadisticas))
  );
}

export function canManageUsers(profile: AuthProfile | null) {
  return hasFullAdminPermissions(profile);
}

export function canAccessAdmin(profile: AuthProfile | null) {
  if (isSuperAdmin(profile) || isAdmin(profile)) {
    return true;
  }

  return getAllowedAdminSections(profile).length > 0;
}

export function getAllowedAdminSections(profile: AuthProfile | null) {
  if (!profile) {
    return [];
  }

  if (canManageUsers(profile)) {
    return ["roles", "dashboard", "attractions", "providers", "cultural", "events"];
  }

  const sections: string[] = [];

  if (isPermissionEnabled(profile.perm_atractivos)) {
    sections.push("attractions");
  }

  if (isPermissionEnabled(profile.perm_prestadores_servicios)) {
    sections.push("providers");
  }

  if (isPermissionEnabled(profile.perm_servicios_culturales)) {
    sections.push("cultural");
  }

  if (isPermissionEnabled(profile.perm_agenda_eventos)) {
    sections.push("events");
  }

  if (isPermissionEnabled(profile.perm_estadisticas)) {
    sections.unshift("dashboard");
  }

  return sections;
}

export function getInitialAdminSection(profile: AuthProfile | null) {
  if (canManageUsers(profile)) {
    return "roles";
  }

  return getAllowedAdminSections(profile)[0] || "sin-permisos";
}
