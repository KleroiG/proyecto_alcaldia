"use client"

import { useState } from "react"
import Link from "next/link"
import { gdriveUrl } from "@/lib/events"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { MapPin, Phone, ArrowRight, Facebook, Instagram, Globe, Mail, Languages, Award } from "lucide-react"
import { cn } from "@/lib/utils"

export type ProviderCategory =
  | "Hotel"
  | "Restaurante"
  | "Agencia"
  | "Guia"
  | "hotel"
  | "restaurante"
  | "agencia"
  | "guia"

export interface Provider {
  isvisible: boolean
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
  // Nuevos campos opcionales específicos para Guías Turísticos
  apellido?: string
  telefono?: string
  email?: string
  numero_tarjeta?: string
  idiomas?: string[]
  especialidades?: string[]
  tipo_documento?: string
  documento?: string
  fecha_registro?: string
}

const categoryLabels: Record<string, string> = {
  hotel: "Hotel",
  restaurante: "Restaurante",
  agencia: "Agencia de Viajes",
  guia: "Guía Turístico",
}

const categoryColors: Record<string, string> = {
  hotel: "bg-emerald-600",
  restaurante: "bg-amber-600",
  agencia: "bg-indigo-600",
  guia: "bg-[#d4a84b]",
}

interface ProviderCardProps {
  provider: Provider
}

export function ProviderCard({ provider }: ProviderCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const normalizedCategory = provider.category?.toLowerCase() || "hotel"
  const cleanId = String(provider.id).replace(/^[a-zA-Z_]+/, "")

  // =========================================================================
  // 1. RENDERIZADO EXCLUSIVO PARA GUÍAS TURÍSTICOS (Sin foto, diseño admin)
  // =========================================================================
  if (normalizedCategory === "guia") {
    const fullName = `${provider.name || ""} ${provider.apellido || ""}`.trim()
    const idiomas = provider.idiomas || []
    const especialidades = provider.especialidades || []
    const contactoTelefono = provider.celular || provider.telefono
    const contactoCorreo = provider.correo || provider.email

    return (
      <Link href={`/prestadores_servicios/${cleanId}?type=guia`} className="block group">
        <div className="relative bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 h-full">
          {/* Header tipo carnet institucional */}
          <div className="bg-gradient-to-r from-[#6b1d1d] to-[#8b2d2d] px-5 py-4 transition-colors duration-500 group-hover:from-[#8b2d2d] group-hover:to-[#6b1d1d]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg
                  className="h-6 w-6 text-[#d4a84b] group-hover:rotate-180 transition-transform duration-700"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <circle cx="12" cy="12" r="5" />
                  <path
                    d="M12 1v3M12 20v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M1 12h3M20 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
                <span className="text-xs font-semibold text-white/90 tracking-wider">
                  SOGAMOSO
                </span>
              </div>
              <Badge className="bg-[#d4a84b] text-white border-0 text-[10px] shadow-md group-hover:bg-yellow-500 transition-colors">
                GUÍA TURÍSTICO
              </Badge>
            </div>
          </div>

          {/* Cuerpo de la tarjeta */}
          <div className="p-6">
            <div className="flex gap-5">
              {/* Placeholder de Foto con animación */}
              <div className="flex-shrink-0">
                <div className="w-24 h-28 bg-gradient-to-b from-gray-100 to-gray-200 rounded-xl border-2 border-gray-300 flex items-center justify-center overflow-hidden transition-all duration-500 group-hover:scale-105 group-hover:border-[#d4a84b]/50 group-hover:shadow-lg">
                  <svg
                    className="w-14 h-14 text-gray-400 group-hover:text-[#6b1d1d]/60 transition-colors duration-500"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
                {provider.numero_tarjeta && (
                  <div className="mt-3 text-center">
                    <Badge variant="outline" className="text-[10px] font-mono bg-white text-gray-600 border-gray-200 shadow-sm">
                      ID: {provider.numero_tarjeta}
                    </Badge>
                  </div>
                )}
              </div>

              {/* Información General */}
              <div className="flex-1 min-w-0 flex flex-col justify-center">
                <h3 className="font-bold text-gray-900 text-xl leading-tight group-hover:text-[#6b1d1d] transition-colors duration-300">
                  {fullName}
                </h3>

                <div className="mt-4 space-y-2.5">
                  {contactoTelefono && (
                    <div className="flex items-center gap-3 text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                      <div className="p-1.5 rounded-full bg-green-50/80 text-green-600 group-hover:bg-green-100 group-hover:scale-110 transition-all">
                        <Phone className="h-3.5 w-3.5" />
                      </div>
                      <span className="truncate">{contactoTelefono}</span>
                    </div>
                  )}
                  {contactoCorreo && (
                    <div className="flex items-center gap-3 text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                      <div className="p-1.5 rounded-full bg-blue-50/80 text-blue-600 group-hover:bg-blue-100 group-hover:scale-110 transition-all">
                        <Mail className="h-3.5 w-3.5" />
                      </div>
                      <span className="truncate">{contactoCorreo}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Habilidades e Idiomas */}
            {(idiomas.length > 0 || especialidades.length > 0) && (
              <div className="mt-6 pt-5 border-t border-dashed border-gray-200">
                <div className="grid grid-cols-2 gap-4">
                  {idiomas.length > 0 && (
                    <div className="transform transition-all duration-500 group-hover:translate-x-1">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 mb-2">
                        <Languages className="h-4 w-4 text-[#6b1d1d]" />
                        Idiomas
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {idiomas.map((idioma) => (
                          <Badge key={idioma} variant="secondary" className="text-[10px] bg-blue-50 text-blue-700 border border-blue-100 hover:bg-blue-100 transition-colors">
                            {idioma}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {especialidades.length > 0 && (
                    <div className="transform transition-all duration-500 group-hover:translate-x-1 delay-75">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 mb-2">
                        <Award className="h-4 w-4 text-[#6b1d1d]" />
                        Especialidades
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {especialidades.slice(0, 2).map((esp) => (
                          <Badge key={esp} variant="secondary" className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-100 hover:bg-emerald-100 transition-colors">
                            {esp}
                          </Badge>
                        ))}
                        {especialidades.length > 2 && (
                          <Badge variant="outline" className="text-[10px] bg-gray-50 text-gray-600 border border-gray-200">
                            +{especialidades.length - 2}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Franja animada inferior y botón flotante de acción */}
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#d4a84b] via-[#6b1d1d] to-[#d4a84b] transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-out" />
          
          <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-500">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#6b1d1d] text-white shadow-lg">
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        </div>
      </Link>
    )
  }

  // =========================================================================
  // 2. RENDERIZADO ORIGINAL (Hoteles, Restaurantes, Agencias - con foto)
  // =========================================================================
  const fallback = "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800";
  const titleWords = provider.name.split(" ")
  const shortTitle = titleWords.slice(0, 6).join(" ") + (titleWords.length > 6 ? "..." : "")

  return (
    <Card
      onClick={() => setIsExpanded(!isExpanded)}
      className="group relative overflow-hidden rounded-3xl border border-white/10 bg-transparent p-0 shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:shadow-black/40 cursor-pointer h-[380px]"
    >
      <div className="relative h-full overflow-hidden">
        {/* Imagen */}
        <img
          src={gdriveUrl(provider.imageUrl) || fallback}
          alt={provider.name}
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={(e) => { e.currentTarget.src = fallback }}
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-all duration-700 group-hover:scale-110",
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
            isExpanded ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2",
            "group-hover:opacity-100 group-hover:translate-y-0"
          )}
        >
          <Badge className={cn("text-white border-0", categoryColors[normalizedCategory])}>
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
              isExpanded ? "text-xl" : "text-3xl",
              "group-hover:text-xl"
            )}
          >
            {shortTitle}
          </h3>
        </div>

        {/* Contenido Expandible */}
        <div className="absolute inset-x-0 bottom-0 p-6 duration-500 group-hover:-translate-y-3">
          <div
            className={cn(
              "rounded-2xl border border-white/10 bg-white/10 backdrop-blur-md p-4 overflow-hidden transition-all duration-500",
              isExpanded ? "max-h-80 opacity-100 mt-4" : "max-h-0 opacity-0",
              "group-hover:max-h-80 group-hover:opacity-100 group-hover:mt-4"
            )}
          >
            {/* Contacto */}
            <div className="space-y-3 text-sm text-white/85">
              {provider.correo && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span className="line-clamp-1">{provider.correo}</span>
                </div>
              )}

              {provider.celular && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-green-400 shrink-0" />
                  <span>{provider.celular}</span>
                </div>
              )}

              {(provider.instagram || provider.facebook || provider.website || provider.correo) ? (
                <div className="pt-3 border-t border-white/10">
                  <div className="flex items-center gap-3">
                    {provider.instagram && (
                      <a href={provider.instagram} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/10 text-pink-400 backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-white/20">
                        <Instagram className="h-5 w-5" />
                      </a>
                    )}
                    {provider.facebook && (
                      <a href={provider.facebook} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/10 text-blue-400 backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-white/20">
                        <Facebook className="h-5 w-5" />
                      </a>
                    )}
                    {provider.website && (
                      <a href={provider.website} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/10 text-cyan-400 backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-white/20">
                        <Globe className="h-5 w-5" />
                      </a>
                    )}
                    {provider.correo && (
                      <a href={`mailto:${provider.correo}`} onClick={(e) => e.stopPropagation()} className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/10 text-yellow-400 backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-white/20">
                        <Mail className="h-5 w-5" />
                      </a>
                    )}
                  </div>
                </div>
              ) : (
                <div className="pt-3 border-t border-white/10">
                  <p className="text-xs text-white/50 italic">No hay información de contacto disponible.</p>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div
            className={cn(
              "flex items-center justify-between pt-3 transition-all duration-500",
              isExpanded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
              "group-hover:opacity-100 group-hover:translate-y-0"
            )}
          >
            <span className="text-xs uppercase tracking-widest text-white/50">Mas información</span>
            <Link href={`/prestadores_servicios/${cleanId}?type=${normalizedCategory}`} onClick={(e) => e.stopPropagation()}>
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