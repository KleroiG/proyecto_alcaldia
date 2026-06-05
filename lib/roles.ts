"use client";

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api"
).replace(/\/+$/, "");

function apiUrl(path: string) {
  return `${API_BASE_URL}/${path.replace(/^\/+/, "")}`;
}

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

export type AdminPermissions = {
  perm_atractivos: boolean;
  perm_prestadores_servicios: boolean;
  perm_servicios_culturales: boolean;
  perm_agenda_eventos: boolean;
  perm_estadisticas: boolean;
};

export type AdminUser = {
  id: string;
  nombre: string;
  apellido: string;
  correo: string;
  role: "superadmin" | "admin";
  avatar: string;
  permissions: AdminPermissions;
};

export type CreateAdminPayload = {
  nombre: string;
  apellido: string;
  correo: string;
  password: string;
  fecha_nacimiento: string;
  genero: string;
  telefono: string;
  tipo_identificacion: string;
  id_perfil?: string;
};

function boolVal(v: unknown): boolean {
  return v === true || v === 1 || v === "1" || v === "true";
}

function mapRole(v: unknown): "superadmin" | "admin" {
  if (v === 1 || v === "1" || v === "superadmin") return "superadmin";
  return "admin";
}

function normalizeUrl(url: unknown): string {
  if (typeof url !== "string" || !url.trim()) return "";
  const clean = url.trim();
  if (/^https?:\/\//i.test(clean)) return clean;
  const origin = API_BASE_URL.replace(/\/api$/, "");
  return `${origin}/${clean.replace(/^\/+/, "")}`;
}

function mapUser(raw: Record<string, unknown>): AdminUser {
  const id = String(raw.id_perfil ?? raw.id ?? "");
  const nombre = String(raw.nombre ?? "");
  const apellido = String(raw.apellido ?? "");
  const correo = String(raw.correo ?? "");
  const role = mapRole(raw.role ?? raw.rol ?? raw.id_perfil);
  const avatar = normalizeUrl(raw.url_foto ?? raw.foto ?? raw.avatar);

  return {
    id,
    nombre,
    apellido,
    correo,
    role,
    avatar,
    permissions: {
      perm_atractivos: boolVal(raw.perm_atractivos),
      perm_prestadores_servicios: boolVal(raw.perm_prestadores_servicios),
      perm_servicios_culturales: boolVal(raw.perm_servicios_culturales),
      perm_agenda_eventos: boolVal(raw.perm_agenda_eventos),
      perm_estadisticas: boolVal(raw.perm_estadisticas),
    },
  };
}

function extractList(data: unknown): Record<string, unknown>[] {
  if (Array.isArray(data)) return data as Record<string, unknown>[];
  if (data && typeof data === "object") {
    const r = data as Record<string, unknown>;
    for (const key of ["data", "profiles", "perfiles", "users", "usuarios"]) {
      if (Array.isArray(r[key])) return r[key] as Record<string, unknown>[];
    }
  }
  return [];
}

export async function getAdminUsers(): Promise<AdminUser[]> {
  const response = await fetch(apiUrl("/profiles"), {
    headers: getAuthHeaders(),
  });
  const data = await readJson(response);

  if (!response.ok) {
    throw new Error(getMessage(data, "No se pudieron cargar los usuarios."));
  }

  const list = extractList(data);
  return list
    .map(mapUser)
    .filter((u) => u.role === "superadmin" || u.role === "admin");
}

export async function updateUserPermissions(
  user: AdminUser,
  permissions: AdminPermissions,
): Promise<void> {
  // The backend update route requires id_perfil and correo alongside permissions
  const formData = new FormData();
  formData.append("_method", "PUT");
  formData.append("id_perfil", user.id);
  formData.append("correo", user.correo);
  formData.append("nombre", user.nombre);
  formData.append("apellido", user.apellido);
  formData.append("perm_atractivos", permissions.perm_atractivos ? "1" : "0");
  formData.append("perm_prestadores_servicios", permissions.perm_prestadores_servicios ? "1" : "0");
  formData.append("perm_servicios_culturales", permissions.perm_servicios_culturales ? "1" : "0");
  formData.append("perm_agenda_eventos", permissions.perm_agenda_eventos ? "1" : "0");
  formData.append("perm_estadisticas", permissions.perm_estadisticas ? "1" : "0");

  const response = await fetch(apiUrl(`/profiles/${encodeURIComponent(user.id)}`), {
    method: "POST",
    headers: getAuthHeaders(),
    body: formData,
  });
  const data = await readJson(response);

  if (!response.ok) {
    const detail = typeof data === "object" && data !== null
      ? JSON.stringify((data as Record<string, unknown>).errors ?? data)
      : String(data ?? "");
    throw new Error(
      getMessage(data, "No se pudieron guardar los permisos.") + (detail ? ` — ${detail}` : ""),
    );
  }
}

export async function createAdminUser(payload: CreateAdminPayload): Promise<void> {
  const formData = new FormData();
  formData.append("nombre", payload.nombre);
  formData.append("apellido", payload.apellido);
  formData.append("correo", payload.correo);
  formData.append("password", payload.password);
  formData.append("fecha_nacimiento", payload.fecha_nacimiento);
  formData.append("genero", payload.genero);
  formData.append("telefono", payload.telefono);
  formData.append("tipo_identificacion", payload.tipo_identificacion);
  if (payload.id_perfil) formData.append("id_perfil", payload.id_perfil);

  const response = await fetch(apiUrl("/profiles/registro"), {
    method: "POST",
    headers: { Accept: "application/json" },
    body: formData,
  });
  const data = await readJson(response);

  if (!response.ok) {
    throw new Error(getMessage(data, "No se pudo crear el administrador."));
  }
}

export async function changeUserPassword(
  user: AdminUser,
  newPassword: string,
): Promise<void> {
  const formData = new FormData();
  formData.append("_method", "PUT");
  formData.append("id_perfil", user.id);
  formData.append("correo", user.correo);
  formData.append("nombre", user.nombre);
  formData.append("apellido", user.apellido);
  formData.append("password", newPassword);

  const response = await fetch(apiUrl(`/profiles/${encodeURIComponent(user.id)}`), {
    method: "POST",
    headers: getAuthHeaders(),
    body: formData,
  });
  const data = await readJson(response);

  if (!response.ok) {
    const detail = typeof data === "object" && data !== null
      ? JSON.stringify((data as Record<string, unknown>).errors ?? data)
      : String(data ?? "");
    throw new Error(
      getMessage(data, "No se pudo cambiar la contraseña.") + (detail ? ` — ${detail}` : ""),
    );
  }
}

export async function deleteAdminUser(id: string): Promise<void> {
  const response = await fetch(apiUrl(`/profiles/${encodeURIComponent(id)}`), {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  const data = await readJson(response);

  if (!response.ok) {
    throw new Error(getMessage(data, "No se pudo eliminar el usuario."));
  }
}
