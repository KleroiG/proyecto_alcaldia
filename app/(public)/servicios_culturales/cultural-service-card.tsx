"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Phone, Mail, ArrowRight, Palette, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { type CulturalService } from "@/lib/cultural-services"
import { gdriveUrl } from "@/lib/events"
import { ROUTES } from "@/lib/routes"

interface CulturalServiceCardProps {
  service: CulturalService
}

export function CulturalServiceCard({ service }: CulturalServiceCardProps) {
  const displayImage = service.url_foto
    ? gdriveUrl(service.url_foto)
    : "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=600"

  const bioShort =
    service.biografia.length > 130
      ? service.biografia.slice(0, 130) + "..."
      : service.biografia

  return (
    <Card className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1">
      {/* Photo Header */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
        <img
          src={displayImage}
          alt={service.nombre_artistico}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={(e) => {
            e.currentTarget.src = "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=600"
          }}
        />
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          {service.area_artistica?.nombre && (
            <Badge className="bg-[#60150F] text-white border-none text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 shadow-sm">
              {service.area_artistica.nombre}
            </Badge>
          )}
        </div>
      </div>

      <CardContent className="p-5 space-y-4">
        {/* Name and Profile Type */}
        <div>
          <span className="text-[10px] font-bold text-yellow-600 uppercase tracking-widest block mb-1">
            {service.tipo_perfil_sc?.nombre || "Gestor Cultural"}
          </span>
          <h3 className="text-lg font-bold text-gray-900 tracking-tight line-clamp-1 group-hover:text-[#60150F] transition-colors">
            {service.nombre_artistico}
          </h3>
        </div>

        {/* Short Biography */}
        <p className="text-sm text-gray-600 leading-relaxed text-justify h-[60px] overflow-hidden">
          {bioShort || "Artista y promotor cultural de la ciudad de Sogamoso."}
        </p>

        {/* Contacts */}
        <div className="pt-3 border-t border-slate-50 space-y-1.5 text-xs text-gray-500">
          {service.telefono_publicar && (
            <div className="flex items-center gap-2">
              <Phone className="size-3.5 text-emerald-600" />
              <span className="font-medium text-gray-700">{service.telefono_publicar}</span>
            </div>
          )}
          {service.correo_publicar && (
            <div className="flex items-center gap-2">
              <Mail className="size-3.5 text-[#60150F]" />
              <span className="truncate max-w-[200px]">{service.correo_publicar}</span>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <Link href={`${ROUTES.serviciosCulturales}/${service.id}`}>
            <Button
              className="w-full bg-[#60150F]/5 hover:bg-[#60150F] text-[#60150F] hover:text-white rounded-xl text-xs font-semibold group/btn transition-all duration-300 py-4 cursor-pointer"
            >
              Conocer trayectoria
              <ArrowRight className="size-3.5 ml-2 transition-transform duration-300 group-hover/btn:translate-x-1" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
