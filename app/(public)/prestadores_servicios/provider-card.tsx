"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { MapPin, Phone, ArrowRight, Facebook, Instagram, Globe, Mail } from "lucide-react"
import { cn } from "@/lib/utils"

export type ProviderCategory =
  | "Hotel"
  | "Restaurante"
  | "Agencia"
  | "hotel"
  | "restaurante"
  | "agencia"

export interface Provider {
  id: string | number
  name: string
  category: ProviderCategory
  direccion: string
  correo?: string
  celular?: string
  imageUrl: string
  instagram?: string
  facebook?: string
  website?: string
}

const categoryLabels: Record<string, string> = {
  hotel: "Hotel",
  restaurante: "Restaurante",
  agencia: "Agencia de Viajes",
}

const categoryColors: Record<string, string> = {
  hotel: "bg-emerald-600",
  restaurante: "bg-amber-600",
  agencia: "bg-indigo-600",
}

interface ProviderCardProps {
  provider: Provider
}

export function ProviderCard({ provider }: ProviderCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const normalizedCategory =
    provider.category?.toLowerCase() || "hotel"

  const cleanId = String(provider.id).replace(
    /^[a-zA-Z_]+/,
    ""
  )

  const titleWords = provider.name.split(" ")

  const shortTitle =
    titleWords.slice(0, 6).join(" ") +
    (titleWords.length > 6 ? "..." : "")


  return (
    <Card
      onClick={() => setIsExpanded(!isExpanded)}
      className="group relative overflow-hidden rounded-3xl border border-white/10 bg-transparent p-0 shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:shadow-black/40 cursor-pointer"
    >
      <div className="relative h-[380px] overflow-hidden">

        {/* Imagen */}
        <Image
          src={
            provider.imageUrl ||
            "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800"
          }
          alt={provider.name}
          fill
          sizes="(max-width:768px)100vw,33vw"
          className={cn(
            "object-cover transition-all duration-700",
            isExpanded
              ? "scale-110 brightness-50"
              : "group-hover:scale-110 group-hover:brightness-50"
          )}
        />

        {/* Overlay */}
        <div
          className={cn(
            "absolute inset-0 transition-all duration-500",
            isExpanded
              ? "bg-gradient-to-t from-black/95 via-black/70 to-transparent"
              : "bg-gradient-to-t from-black/90 via-black/20 to-transparent group-hover:from-black/95 group-hover:via-black/70"
          )}
        />

        {/* Categoría */}
        <div
          className={cn(
            "absolute left-5 top-5 transition-all duration-500",
            isExpanded
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-2",
            "group-hover:opacity-100 group-hover:translate-y-0"
          )}
        >
          <Badge
            className={cn(
              "text-white border-0",
              categoryColors[normalizedCategory]
            )}
          >
            {categoryLabels[normalizedCategory]}
          </Badge>
        </div>

        {/* Título */}
        <div
          className={cn(
            "absolute left-6 right-6 z-20 transition-all duration-500",
            isExpanded ? "bottom-68" : "bottom-6",
            "group-hover:bottom-68"
          )}
        >
          <h3
            className={cn(
              "font-bold text-white drop-shadow-xl transition-all duration-500",
              isExpanded
                ? "text-xl"
                : "text-3xl",
              "group-hover:text-xl"
            )}
          >
            {shortTitle}
          </h3>
        </div>

        {/* Contenido */}
        <div className="absolute inset-x-0 bottom-0 p-6">

          <div
            className={cn(
              "rounded-2xl border border-white/10 bg-white/10 backdrop-blur-md p-4 overflow-hidden transition-all duration-500",
              isExpanded
                ? "max-h-80 opacity-100 mt-4"
                : "max-h-0 opacity-0",
              "group-hover:max-h-80 group-hover:opacity-100 group-hover:mt-4"
            )}
          >

            {/* Contacto */}
            <div className="space-y-3 text-sm text-white/85">

              {/* Dirección */}
              {provider.correo && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span className="line-clamp-1">{provider.correo}</span>
                </div>
              )}

              {/* Teléfono */}
              {provider.celular && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-green-400 shrink-0" />
                  <span>{provider.celular}</span>
                </div>
              )}

              {/* Redes y contacto */}
              {(provider.instagram ||
                provider.facebook ||
                provider.website ||
                provider.correo) ? (

                <div className="pt-3 border-t border-white/10">
                  <div className="flex items-center gap-3">

                    {provider.instagram && (
                      <a
                        href={provider.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/10 text-pink-400 backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-white/20"
                      >
                        <Instagram className="h-5 w-5" />
                      </a>
                    )}

                    {provider.facebook && (
                      <a
                        href={provider.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/10 text-blue-400 backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-white/20"
                      >
                        <Facebook className="h-5 w-5" />
                      </a>
                    )}

                    {provider.website && (
                      <a
                        href={provider.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/10 text-cyan-400 backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-white/20"
                      >
                        <Globe className="h-5 w-5" />
                      </a>
                    )}

                    {provider.correo && (
                      <a
                        href={`mailto:${provider.correo}`}
                        onClick={(e) => e.stopPropagation()}
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/10 text-yellow-400 backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-white/20"
                      >
                        <Mail className="h-5 w-5" />
                      </a>
                    )}

                  </div>
                </div>

              ) : (

                <div className="pt-3 border-t border-white/10">
                  <p className="text-xs text-white/50 italic">
                    No hay información de contacto disponible.
                  </p>
                </div>

              )}
            </div>
          </div>

          {/* Footer */}
          <div
            className={cn(
              "flex items-center justify-between pt-3 transition-all duration-500",
              isExpanded
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4",
              "group-hover:opacity-100 group-hover:translate-y-0"
            )}
          >
            <span className="text-xs uppercase tracking-widest text-white/50">
              Mas información
            </span>

            <Link
              href={`/prestadores_servicios/${cleanId}?type=${normalizedCategory}`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#60150F] shadow-2xl transition-all duration-300 hover:scale-110 hover:bg-yellow-400 hover:shadow-yellow-400/30">
                <ArrowRight className="h-5 w-5" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </Card>
  )
}