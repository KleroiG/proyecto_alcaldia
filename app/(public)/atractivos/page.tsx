"use client"

import { useState, useMemo } from "react"
import { AttractionCard } from "./attraction-card"
import { Button } from "@/components/ui/button"
import { MuiscaSunIcon } from "@/components/icon-sol"
import { Filter, ChevronRight } from "lucide-react"
import { attractions, categories } from "./data" 
// Importación corregida para usar el contrato de datos global
import type { AttractionCategory, Attraction } from "./types"

/**
 * COMPONENTE PRINCIPAL: Sección de Atractivos Turísticos
 * Se añade 'export default' para cumplir con la arquitectura de Next.js App Router.
 */
export default function AttractionsSection() {
  const [activeCategory, setActiveCategory] = useState<AttractionCategory>("Todos")

  // Memorización para evitar cálculos costosos en re-renders innecesarios
  const filteredAttractions = useMemo(() => (
    activeCategory === "Todos" 
      ? attractions 
      : attractions.filter((a: Attraction) => a.category === activeCategory)
  ), [activeCategory]);

  return (
    <section className="relative bg-background py-16 sm:py-24" aria-labelledby="attractions-title">
      {/* Elemento decorativo institucional con baja opacidad */}
      <div className="absolute top-0 right-0 opacity-5 pointer-events-none" aria-hidden="true">
        <MuiscaSunIcon className="h-64 w-64 text-gold" />
      </div>
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header de la Sección */}
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
          <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white transition-colors">
            Ver Mapa Turístico
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </header>

        {/* Barra de Navegación de Categorías (Accesibilidad mejorada) */}
        <nav className="mb-10 flex items-center gap-2 overflow-x-auto pb-4 scrollbar-hide" aria-label="Filtrar atractivos por categoría">
          <div className="flex items-center gap-2 bg-muted/50 p-1 rounded-lg">
            <Filter className="h-4 w-4 text-muted-foreground ml-2 mr-1 flex-shrink-0" />
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveCategory(category)}
                className={`flex-shrink-0 rounded-md transition-all ${
                  activeCategory === category
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                }`}
              >
                {category}
              </Button>
            ))}
          </div>
        </nav>

        {/* Grid Responsivo de Atractivos */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filteredAttractions.length > 0 ? (
            filteredAttractions.map((attraction) => (
              <AttractionCard
                key={attraction.id}
                attraction={attraction}
              />
            ))
          ) : (
            <div className="col-span-full py-20 text-center text-muted-foreground border-2 border-dashed rounded-xl">
              No se encontraron atractivos en esta categoría para Sogamoso.
            </div>
          )}
        </div>
      </div>
    </section>
  )
}