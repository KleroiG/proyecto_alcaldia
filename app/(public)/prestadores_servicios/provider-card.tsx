import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Phone } from "lucide-react"

// Soportamos minúsculas y mayúsculas para evitar colapsos con la BD
export type ProviderCategory = "Hotel" | "Restaurante" | "Agencia" | "hotel" | "restaurante" | "agencia"

export interface Provider {
  id: string | number
  name: string
  category: ProviderCategory
  description: string
  address: string
  phone: string
  imageUrl: string
  instagram?: string
  facebook?: string
  website?: string
}

// Diccionario normalizado con llaves en minúscula para evitar errores de mapeo
const categoryColors: Record<string, string> = {
  hotel: "bg-[#10B981] text-white",
  restaurante: "bg-[#F97316] text-white",
  agencia: "bg-[#6366F1] text-white",
}

// Diccionario de etiquetas visuales estéticas
const categoryLabels: Record<string, string> = {
  hotel: "Hotel",
  restaurante: "Restaurante",
  agencia: "Agencia de Viajes",
}

interface ProviderCardProps {
  provider: Provider
}

export function ProviderCard({ provider }: ProviderCardProps) {
  // 1. NORMALIZACIÓN: Pasamos la categoría a minúsculas
  const normalizedCategory = provider.category?.toLowerCase() || "hotel"

  // 2. DESINFECTAR ID: Si por alguna razón el ID conserva el prefijo "hotel_1", extrae solo el número
  const cleanId = String(provider.id).replace(/^[a-zA-Z_]+/, "")

  return (
    <article className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-lg transition-shadow group flex flex-col h-full">

      {/* Image */}
      <div className="relative h-48 overflow-hidden flex-shrink-0">
        <Image
          src={provider.imageUrl || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800"}
          alt={provider.name}
          fill
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, 33vw"
        />

        {/* Category Badge */}
        <Badge
          className={`absolute top-3 left-3 ${categoryColors[normalizedCategory] || "bg-gray-600 text-white"} border-0`}
        >
          {categoryLabels[normalizedCategory] || provider.category}
        </Badge>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1 justify-between">
        <div>
          {/* Name */}
          <div className="mb-2">
            <h3 className="font-bold text-lg text-gray-900 leading-tight line-clamp-1">
              {provider.name}
            </h3>
          </div>

          {/* Description */}
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {provider.description || "Sin descripción disponible."}
          </p>

          {/* Info */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4 text-[#d4a84b] shrink-0" />
              <span className="truncate">{provider.address}</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Phone className="h-4 w-4 text-[#d4a84b] shrink-0" />
              <span>{provider.phone || "No disponible"}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
          <span className="text-xs font-medium text-gray-400">
            Prestador turístico
          </span>

          {/* Redirección limpia forzando el ID numérico desinfectado */}
          <Link href={`/prestadores_servicios/${cleanId}?type=${normalizedCategory}`}>
            <Button
              size="sm"
              className="bg-[#10b981] hover:bg-[#059669] text-white cursor-pointer"
            >
              Más información
            </Button>
          </Link>
        </div>
      </div>
    </article>
  )
}