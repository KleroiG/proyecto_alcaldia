import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Phone } from "lucide-react"

export type ProviderCategory = "Hotel" | "Restaurante" | "Agencia"

export interface Provider {
  id: string
  name: string
  category: ProviderCategory
  description: string
  address: string
  phone: string
  imageUrl: string
}

// 2. Paleta de colores ajustada e institucional
const categoryColors: Record<ProviderCategory, string> = {
  Hotel: "bg-[#10B981] text-white",
  Restaurante: "bg-[#F97316] text-white",
  Agencia: "bg-[#6366F1] text-white",
}

interface ProviderCardProps {
  provider: Provider
}

export function ProviderCard({ provider }: ProviderCardProps) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-md transition-shadow hover:shadow-lg md:flex-row">
      {/* Image Section */}
      <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden md:aspect-auto md:h-auto md:w-1/3">
        <Image
          src={provider.imageUrl}
          alt={provider.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>

      {/* Info Section */}
      <div className="flex flex-1 flex-col p-4 md:p-5">
        {/* Category Badge */}
        <div className="mb-2 flex justify-end">
          <Badge className={`${categoryColors[provider.category]} border-0 text-xs font-semibold`}>
            {provider.category}
          </Badge>
        </div>

        {/* Name & Description */}
        <h3 className="mb-1 text-lg font-bold text-[#1a1a1a]">{provider.name}</h3>
        <p className="mb-4 text-sm text-gray-600 line-clamp-2">{provider.description}</p>

        {/* Contact Info */}
        <div className="mt-auto space-y-2">
          <div className="flex items-start gap-2 text-sm text-gray-500">
            <MapPin className="mt-0.5 size-4 shrink-0 text-[#6b1d1d]" />
            <span className="line-clamp-1">{provider.address}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Phone className="size-4 shrink-0 text-[#6b1d1d]" />
            <span>{provider.phone}</span>
          </div>
        </div>

        {/* CTA Button */}
        <div className="mt-4 flex justify-end">
          <Button className="bg-[#10B981] text-white hover:bg-[#059669]">
            Ver Perfil
          </Button>
        </div>
      </div>
    </article>
  )
}
