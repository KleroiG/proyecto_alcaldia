// types.tsx
export type AttractionCategory = "Todos" | "Arqueología" | "Museo" | "Patrimonio" | "Parque Tematico" | "Sitio Turistico Cultural" | "Sitio Turistico Natural" | string;

// 1. INTERFAZ FRONTEND (Mantiene compatibilidad con tarjetas y añade soporte para el modal)
export interface Attraction {
  id: number | string;
  title?: string;         // Usado en las tarjetas
  name?: string;          // Usado en el administrador
  description: string;
  image?: string;         // Usado en las tarjetas
  imageUrl?: string;      // Usado en el administrador
  rating?: number;
  category: string;
  distance?: string;
  duration?: string;
  featured?: boolean;
  
  // --- Datos detallados traídos desde Laravel para el Modal ---
  address?: string;
  schedule?: string;
  price?: string;
  phone?: string;
  whatsapp?: string;
  isActive?: boolean;
}

// 2. INTERFACES BACKEND (Reflejan la estructura de Laravel)
export interface BackendFoto {
  id_foto: number;
  url_foto: string;
  id_atractivo_turistico: number;
}

export interface BackendDireccion {
  id_direccion: number;
  direccion: string;
  latitud?: string;
  longitud?: string;
  google_place_id?: string;
}

export interface BackendAtractivo {
  id_atractivo_turistico: number;
  nombre: string;
  descripcion: string;
  tipo: string;
  telefono?: string;
  precio?: string;
  horario?: string;
  direccion?: BackendDireccion;
  fotos: BackendFoto[];
}

export interface ApiResponse {
  success: boolean;
  data: BackendAtractivo[];
}