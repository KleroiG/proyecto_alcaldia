import { Attraction, AttractionCategory } from "./types";

export const categories: AttractionCategory[] = ["Todos", "Arqueología", "Naturaleza", "Patrimonio", "Aventura", "Bienestar"];

export const attractions: Attraction[] = [
  {
    id: 1,
    title: "Museo Arqueológico del Sol",
    description: "Explora el legado de la civilización Muisca...",
    image: "/images/attraction-museo-sol.jpg",
    rating: 4.9,
    category: "Arqueología",
    distance: "2 km",
    duration: "2-3 horas",
    featured: true,
  },
  // ... resto de los atractivos
];