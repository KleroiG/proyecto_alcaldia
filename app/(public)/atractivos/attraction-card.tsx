"use client"

import Image from "next/image"
import { Star, MapPin, Clock, ArrowRight } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useState } from "react"
import type { Attraction } from "./types"

interface AttractionCardProps {
  attraction: Attraction;
  onLearnMore?: () => void;
}

// 1. Añadimos onLearnMore a la desestructuración de las Props
export function AttractionCard({ attraction, onLearnMore }: AttractionCardProps) {
  // Desestructuración para limpieza de código
  const { title, description, image, rating, category, distance, duration, featured } = attraction;
  const displayImage = image || "https://images.unsplash.com/photo-1590001155093-a3c66ab0c3ff?q=80&w=800";
  const [imageSrc, setImageSrc] = useState(displayImage);
  const [isExpanded, setIsExpanded] = useState(false);
  const expandedClasses = isExpanded
    ? "opacity-100 translate-y-0 max-h-60"
    : "opacity-0 translate-y-4 max-h-0";
  // 2. Manejo de fallback (valores por defecto) para TypeScript
  // Si no hay imagen, usamos un placeholder. Si no hay rating, asumimos 0.
  const displayRating = rating || 0;
  const titleWords = title?.split(" ") ?? [];
  const shortTitle = titleWords.slice(0, 5).join(" ") + (titleWords.length > 5 ? "..." : "");
  const shortDuration = duration && duration.length > 55 ? duration.slice(0, 55) + "..." : duration;
  


  return (
    <Card
      onClick={() => setIsExpanded(!isExpanded)}
      className={cn(
        "group relative overflow-hidden rounded-3xl border border-white/10 bg-transparent p-0 shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:shadow-black/40 cursor-pointer",
        featured && "md:col-span-2"
      )}
      role="article"
    >
      {/* Imagen */}
      <div className={cn("relative overflow-hidden", featured ? "h-[420px]" : "h-[380px]")}>
        <Image
          src={imageSrc}
          alt={`Imagen representativa de ${title || "Atractivo Turístico"}`}
          fill
          priority={featured}
          loading="lazy"
          className=" object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-75 "
          sizes={featured ? "(max-width: 768px) 100vw, 66vw" : "(max-width: 640px) 100vw, 33vw"}
          onError={() => {
            setImageSrc(
              "https://images.unsplash.com/photo-1590001155093-a3c66ab0c3ff?q=80&w=800"
            )
          }}
        />

        {/* Overlay */}
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-t transition-all duration-500",
            isExpanded
              ? "from-black/95 via-black/85 to-black/40"
              : "from-black/90 via-black/20 to-transparent",
            "group-hover:from-black/95 group-hover:via-black/85 group-hover:to-black/40"
          )}
        />
        <div
          className={cn(
            "absolute left-5 top-5 transition-all duration-500",
            isExpanded
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-2",
            "group-hover:opacity-100 group-hover:translate-y-0"
          )}
        >
          <Badge className="border border-white/10 bg-[#60150F]/90 text-white backdrop-blur-md px-4 py-1 text-xs font-semibold shadow-md">
            {category || "Patrimonio"}
          </Badge>
        </div>
      </div>

      {/* Título */}
      <div className={cn(
        "absolute left-6 right-6 z-20 transition-all duration-500",
        isExpanded ? "bottom-64" : "bottom-6",
        "group-hover:bottom-64"
      )}>
        <h3
          className={cn(
            "font-bold text-white drop-shadow-xl transition-all duration-500",
            isExpanded
              ? "text-2xl"
              : featured
                ? "text-4xl md:text-5xl"
                : "text-3xl",
            "group-hover:text-2xl"
          )}
        >
          {shortTitle || "Atractivo Turístico"}
        </h3>
      </div>

      {/* Contenido principal */}
      <div className="absolute inset-x-0 bottom-0 p-8">
        <div className=" space-y-4 transition-all duration-500 group-hover:-translate-y-5" >

          {/* Descripción Glass */}
          <div className={cn(
            "rounded-2xl border border-white/10 bg-black/30 p-4 backdrop-blur-xl overflow-hidden transition-all duration-500",
            isExpanded
              ? "max-h-60 opacity-100 mt-4"
              : "max-h-0 opacity-0",
            "group-hover:max-h-80 group-hover:opacity-100 group-hover:mt-4"
            )}>
            <p className="line-clamp-3 text-sm leading-relaxed text-white/85">
              {description}
            </p>

            {/* Horario */}
            {duration && (
              <div className="mt-3 flex items-center gap-2 text-sm text-white/70">
                <Clock className="h-4 w-4 text-yellow-400" />
                <span>{shortDuration}</span>
              </div>
            )}
          </div>
        </div>
        {/* Footer */}
        <div className={cn(
          "flex items-center justify-between pt-1 transition-all duration-500 delay-100",
          isExpanded
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4",
          "group-hover:opacity-100 group-hover:translate-y-0"
        )} >

          {/* Texto pequeño */}
          <span className="text-xs uppercase tracking-widest text-white/50">
            Explorar destino
          </span>

          {/* Botón circular */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onLearnMore?.();
            }}
            aria-label={`Ver más detalles sobre ${title}`}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#60150F] shadow-2xl transition-all duration-300 hover:scale-110 hover:bg-yellow-400 hover:shadow-yellow-400/30"
          >
            <ArrowRight className="h-6 w-6" />
          </button>
        </div>
      </div>
    </Card >
  )
}