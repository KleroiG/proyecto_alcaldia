// types/attraction.ts
export type AttractionCategory = "Todos" | "Arqueología" | "Naturaleza" | "Patrimonio" | "Aventura" | "Bienestar";

export interface Attraction {
  id: number;
  title: string;
  description: string;
  image: string;
  rating: number;
  category: Exclude<AttractionCategory, "Todos">;
  distance: string;
  duration: string;
  featured: boolean;
}