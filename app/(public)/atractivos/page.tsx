"use client"

import { useState, useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { MuiscaSunIcon } from "@/components/icon-sol"
import { Filter, ChevronRight, Loader2 } from "lucide-react"
import { categories } from "./data"
import type { AttractionCategory, Attraction } from "./types"
import { AttractionCard } from "./attraction-card"
import { useAlert } from "@/components/global-alert"
import { ROUTES } from "@/lib/routes"

// Definimos la estructura exacta que viene de tu backend en Laravel
interface BackendFoto {
  id_foto: number;
  url_foto: string;
  id_atractivo_turistico: number;
}

interface BackendAtractivo {
  id_atractivo_turistico: number;
  nombre: string;
  tipo: string;
  descripcion: string | null;
  horario: string | null;
  direccion?: {
    direccion: string;
  };
  fotos?: BackendFoto[];
}

export default function AttractionsSection() {
  const [activeCategory, setActiveCategory] = useState<AttractionCategory>("Todos")
  const [attractions, setAttractions] = useState<Attraction[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const router = useRouter()

  const { showAlert } = useAlert()

  const handleNavigateToDetail = (id: number | string) => {
    router.push(`${ROUTES.atractivos}/${id}`)
  }




  useEffect(() => {
    const fetchAtractivos = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
        const response = await fetch(`${baseUrl}/api/tourism`);

        if (!response.ok) throw new Error('Error en la red');

        const result = await response.json();

        if (result.success && result.data) {
          const visibleItems = result.data.filter((item: any) => {
            if (!item) return false;
            return item.isvisible === undefined || Boolean(item.isvisible) === true;
          });


          const mappedData: Attraction[] = (visibleItems || []).map((item: BackendAtractivo) => {

            let imageUrl = "https://images.unsplash.com/photo-1590001155093-a3c66ab0c3ff?q=80&w=800";

            if (item.fotos && item.fotos.length > 0) {
              const rawUrl = item.fotos[0].url_foto;

              if (rawUrl.includes("drive.google.com")) {
                // Regex mejorada: Captura el ID clonado entre /d/ y la siguiente barra o fin de la cadena
                const matches = rawUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);

                if (matches && matches[1]) {
                  const driveId = matches[1];
                  // Endpoint nativo de Google Fotos/Drive optimizado para visualización web directa
                  imageUrl = `https://lh3.googleusercontent.com/u/0/d/${driveId}`;
                } else {
                  imageUrl = rawUrl;
                }
              } else {
                imageUrl = rawUrl;
              }
            }

            return {
              id: item.id_atractivo_turistico,
              title: item.nombre,
              description: item.descripcion || "Sin descripción disponible.",
              image: imageUrl,
              category: (item.tipo as any) || "Patrimonio",
              distance: item.direccion ? item.direccion.direccion : "Sogamoso, Boyacá",
              duration: item.horario || "Horario flexible",
              featured: false,
            };
          });

          setAttractions(mappedData);
        }
      } catch (error) {
        console.error("Error al obtener los atractivos:", error);
        showAlert("error", "Error de conexión", "No se pudieron cargar los datos del servidor.")
      } finally {
        setIsLoading(false);
      }
    };

    fetchAtractivos();
  }, []);

  const filteredAttractions = useMemo(() => (
    activeCategory === "Todos"
      ? attractions
      : attractions.filter((a: Attraction) => a.category === activeCategory)
  ), [activeCategory, attractions]);

  if (isLoading) {
    return (
      <div className="flex flex-col h-96 items-center justify-center gap-2">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground text-sm">Cargando atractivos desde la alcaldía...</p>
      </div>
    );
  }

  return (
    <section className="relative bg-background py-16 sm:py-24" aria-labelledby="attractions-title">
      <div className="absolute top-0 right-0 opacity-5 pointer-events-none" aria-hidden="true">
        <MuiscaSunIcon className="h-64 w-64 text-gold" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-12">
          <div>
            <span className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-primary mb-2">
              <MuiscaSunIcon className="h-5 w-5 text-gold" />
              Sogamoso Ciudad del Sol
            </span>
            <h2 id="attractions-title" className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Atractivos Turísticos
            </h2>
            <p className="mt-2 text-muted-foreground max-w-2xl">
              Descubre la riqueza histórica, natural y arqueológica del principal centro cultural de Boyacá.
            </p>
          </div>
        </header>

        <nav className="mb-10 flex items-center gap-2 overflow-x-auto pb-4 scrollbar-hide" aria-label="Filtrar atractivos por categoría">
          <div className="flex items-center gap-2 bg-muted/50 p-1 rounded-lg">
            <Filter className="h-4 w-4 text-muted-foreground ml-2 mr-1 flex-shrink-0" />
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveCategory(category)}
                className={`flex-shrink-0 rounded-md transition-all ${activeCategory === category
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                  }`}
              >
                {category}
              </Button>
            ))}
          </div>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAttractions.map((attraction) => (
            <AttractionCard
              key={attraction.id}
              attraction={attraction}
              onLearnMore={() => handleNavigateToDetail(attraction.id)}
            />
          ))}
        </div>

      </div>

    </section>
  )
}