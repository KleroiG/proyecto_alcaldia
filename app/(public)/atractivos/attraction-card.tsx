"use client"

import Image from "next/image"
import { Star, MapPin, Clock, ArrowRight } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
// Importación del contrato de datos centralizado
import type { Attraction } from "./types" // Asegúrate de usar 'type'

interface AttractionCardProps {
  attraction: Attraction;
  onLearnMore?: () => void;
}

// 1. Añadimos onLearnMore a la desestructuración de las Props
export function AttractionCard({ attraction, onLearnMore }: AttractionCardProps) {
  // Desestructuración para limpieza de código
  const { title, description, image, rating, category, distance, duration, featured } = attraction;

  // 2. Manejo de fallback (valores por defecto) para TypeScript
  // Si no hay imagen, usamos un placeholder. Si no hay rating, asumimos 0.
  const displayImage = image || "https://images.unsplash.com/photo-1590001155093-a3c66ab0c3ff?q=80&w=800";
  const displayRating = rating || 0;

  return (
    <Card
      className={cn(
        "group relative overflow-hidden border border-border bg-card shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer",
        featured && "md:col-span-2 md:row-span-1"
      )}
      role="article"
    >
      {/* Image Container */}
      <div className={cn("relative overflow-hidden", featured ? "h-64 md:h-72" : "h-52")}>
        <Image
          src={displayImage} // 👈 Usamos el fallback seguro
          alt={`Imagen representativa de ${title || "Atractivo Turístico"}`}
          fill
          priority={featured}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes={featured ? "(max-width: 768px) 100vw, 66vw" : "(max-width: 640px) 100vw, 33vw"}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        {/* Category Badge */}
        <Badge
          className="absolute top-4 left-4 bg-primary text-primary-foreground border-0 font-semibold"
        >
          {category || "Patrimonio"}
        </Badge>

        {/* Rating con contraste mejorado */}
        {displayRating > 0 && ( // 👈 Solo muestra el rating si es mayor a 0
          <div className="absolute top-4 right-4 flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-sm font-bold shadow-sm">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span className="text-slate-900">{displayRating.toFixed(1)}</span>
          </div>
        )}

        {/* Info superpuesta en la imagen */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <h3 className={cn(
            "font-bold text-white text-balance leading-tight",
            featured ? "text-2xl md:text-3xl" : "text-xl"
          )}>
            {title || "Atractivo Turístico"}
          </h3>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
          {description}
        </p>

        <div className="flex items-center justify-between border-t pt-4">
          <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground">
            {distance && (
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-primary" />
                {distance}
              </span>
            )}
            {duration && (
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-primary" />
                {duration}
              </span>
            )}
          </div>

          {/* Botón Detalles */}
          <div
            className="flex items-center gap-1 text-primary font-bold text-sm transition-all group-hover:translate-x-1 cursor-pointer"
            aria-label={`Ver más detalles sobre ${title}`}
            onClick={onLearnMore} // 👈 Ahora TypeScript sabe qué es
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && onLearnMore) {
                onLearnMore();
              }
            }}
          >
            <span>Detalles</span>
            <ArrowRight className="h-4 w-4" />
          </div>
        </div>
      </div>
    </Card>
  )
}