"use client"

import { useState } from "react"
import { AttractionCard } from "./attraction-card"
import { Button } from "@/components/ui/button"
import { MuiscaSunIcon } from "./icon-sol"
import { Filter, ChevronRight } from "lucide-react"

const categories = [
  "Todos",
  "Arqueología",
  "Naturaleza",
  "Patrimonio",
  "Aventura",
  "Bienestar",
]

const attractions = [
  {
    id: 1,
    title: "Museo Arqueológico del Sol",
    description: "Explora el legado de la civilización Muisca en el sitio ceremonial más importante del altiplano cundiboyacense. Reconstrucción del Templo del Sol.",
    image: "/images/attraction-museo-sol.jpg",
    rating: 4.9,
    category: "Arqueología",
    distance: "2 km",
    duration: "2-3 horas",
    featured: true,
  },
  {
    id: 2,
    title: "Lago de Tota",
    description: "El lago más grande de Colombia, rodeado de montañas y playas de arena blanca. Deportes acuáticos y paisajes impresionantes.",
    image: "/images/attraction-lago-tota.jpg",
    rating: 4.8,
    category: "Naturaleza",
    distance: "25 km",
    duration: "Día completo",
    featured: false,
  },
  {
    id: 3,
    title: "Monguí",
    description: "Uno de los pueblos más hermosos de Colombia. Arquitectura colonial, artesanías de balones y la Basílica de Nuestra Señora de Monguí.",
    image: "/images/attraction-mongui.jpg",
    rating: 4.7,
    category: "Patrimonio",
    distance: "15 km",
    duration: "4-5 horas",
    featured: false,
  },
  {
    id: 4,
    title: "Páramo de Ocetá",
    description: "Ecosistema único de alta montaña con frailejones centenarios. Senderos místicos entre la niebla y paisajes de otro mundo.",
    image: "/images/attraction-paramo.jpg",
    rating: 4.9,
    category: "Aventura",
    distance: "20 km",
    duration: "6-8 horas",
    featured: false,
  },
  {
    id: 5,
    title: "Termales de Iza",
    description: "Aguas termales naturales con propiedades medicinales. Relájate en piscinas de agua caliente rodeadas de naturaleza.",
    image: "/images/attraction-iza.jpg",
    rating: 4.6,
    category: "Bienestar",
    distance: "12 km",
    duration: "3-4 horas",
    featured: false,
  },
  {
    id: 6,
    title: "Catedral San Martín de Tours",
    description: "Imponente templo colonial en el corazón de Sogamoso. Arte religioso y arquitectura histórica del siglo XVII.",
    image: "/images/attraction-catedral.jpg",
    rating: 4.5,
    category: "Patrimonio",
    distance: "Centro",
    duration: "1 hora",
    featured: false,
  },
]

export function AttractionsSection() {
  const [activeCategory, setActiveCategory] = useState("Todos")

  const filteredAttractions = activeCategory === "Todos"
    ? attractions
    : attractions.filter(a => a.category === activeCategory)

  return (
    <section className="relative bg-background py-16 sm:py-24">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 opacity-5 pointer-events-none">
        <MuiscaSunIcon className="h-64 w-64 text-gold" />
      </div>
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-8">
          <div>
            <span className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-emerald mb-2">
              <MuiscaSunIcon className="h-5 w-5 text-gold" />
              Explora
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
              Atractivos Turísticos
            </h2>
            <p className="mt-2 text-muted-foreground max-w-xl">
              Descubre los destinos más fascinantes de Sogamoso y sus alrededores
            </p>
          </div>
          <Button variant="outline" className="self-start sm:self-auto border-emerald text-emerald hover:bg-emerald hover:text-white">
            Ver todos
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>

        {/* Category Filters */}
        <div className="mb-8 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <Filter className="h-5 w-5 text-muted-foreground flex-shrink-0" />
          {categories.map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory(category)}
              className={
                activeCategory === category
                  ? "bg-emerald text-white hover:bg-emerald-light flex-shrink-0"
                  : "border-border text-muted-foreground hover:border-emerald hover:text-emerald flex-shrink-0"
              }
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Attractions Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredAttractions.map((attraction, index) => (
            <AttractionCard
              key={attraction.id}
              {...attraction}
              featured={index === 0 && activeCategory === "Todos"}
            />
          ))}
        </div>

        {/* View More CTA */}
        <div className="mt-12 text-center">
          <Button
            size="lg"
            className="bg-red-vibrant text-white hover:opacity-90 font-semibold px-8"
          >
            Descubrir más destinos
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  )
}
