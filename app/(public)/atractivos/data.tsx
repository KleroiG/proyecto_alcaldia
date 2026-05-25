// data.tsx
import { Attraction, BackendAtractivo, AttractionCategory } from "./types";

export const categories: AttractionCategory[] = ["Todos", "Arqueología", "Naturaleza", "Patrimonio", "Aventura", "Bienestar"];

/**
 * Función Adaptadora: Convierte la respuesta de Laravel al formato visual de Next.js
 */
export const mapBackendToFrontend = (backendData: BackendAtractivo[]): Attraction[] => {
  return backendData.map((item, index) => {
    // Obtenemos la primera foto de Google Drive, si no hay, usamos un placeholder
    const imageUrl = item.fotos && item.fotos.length > 0 
      ? item.fotos[0].url_foto 
      : "/images/attraction-catedral.jpg";

    return {
      id: item.id_atractivo_turistico,
      title: item.nombre,
      description: item.descripcion || "Sin descripción disponible.",
      image: imageUrl,
      // Los siguientes datos se simulan o adaptan porque no están en la BD original
      rating: 4.5, // Valor por defecto o podrías agregar un sistema de reviews luego
      category: item.tipo,
      distance: item.direccion ? item.direccion.direccion : "Sogamoso",
      duration: item.horario || "Abierto al público", 
      featured: index === 0, // Hacemos que el primer registro sea el destacado visualmente
    };
  });
};