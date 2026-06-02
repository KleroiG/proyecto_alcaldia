// data.tsx
import { Attraction, BackendAtractivo, AttractionCategory } from "./types";

export const categories: AttractionCategory[] = ["Todos" , "Arqueología" , "Museo" , "Patrimonio" , "Parque Tematico" , "Sitio Turistico Cultural" , "Sitio Turistico Natural"];

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
      category: item.tipo,
      distance: item.direccion ? item.direccion.direccion : "Sogamoso",
      duration: item.horario || "Abierto al público", 
      featured: index === 0,
    };
  });
};