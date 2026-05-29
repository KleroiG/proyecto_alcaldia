import Image from "next/image"
import Link from "next/link"
import { CalendarDays, Clock, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export type EventStatus = "upcoming" | "ongoing" | "finished" | "last-spots"

interface EventCardProps {
  title: string
  date: string
  endDate?: string
  location: string
  description: string
  imageUrl: string
  status: EventStatus
  detailHref?: string
  organizer?: string
  contact?: string
  category?: string
}

const statusConfig: Record<EventStatus, { label: string; className: string }> = {
  upcoming: {
    label: "Próximamente",
    className: "bg-emerald-500 text-white border-emerald-500",
  },
  ongoing: {
    label: "En Curso",
    className: "bg-[#d4a84b] text-white border-[#d4a84b]",
  },
  finished: {
    label: "Finalizado",
    className: "bg-red-500 text-white border-red-500",
  },
  "last-spots": {
    label: "Últimos Cupos",
    className: "bg-red-500 text-white border-red-500",
  },
}

export function EventCard({
  title,
  date,
  endDate,
  location,
  description,
  imageUrl,
  status,
  detailHref,
  organizer,
  contact,
  category,
}: EventCardProps) {
  const statusInfo = statusConfig[status]

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl bg-white shadow-md transition-shadow hover:shadow-lg">
      {/* Image Section */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {/* Status Badge */}
        <Badge
          className={cn(
            "absolute top-3 right-3 px-3 py-1 text-xs font-semibold",
            statusInfo.className
          )}
        >
          {statusInfo.label}
        </Badge>
      </div>

      {/* Content Section */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="mb-3 text-lg font-bold text-gray-900 line-clamp-2">
          {title}
        </h3>

        {/* Date and Time */}
        <div className="mb-2 flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1.5">
            <CalendarDays className="h-4 w-4 text-[#d4a84b]" />
            <span>{date}</span>
          </div>
          {endDate && (
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-[#d4a84b]" />
            <span>{endDate}</span>
          </div>
          )}
        </div>

        {/* Location */}
        <div className="mb-3 flex items-center gap-1.5 text-sm text-gray-600">
          <MapPin className="h-4 w-4 shrink-0 text-[#d4a84b]" />
          <span>{location}</span>
        </div>

        {/* Description */}
        <p className="mb-4 flex-1 text-sm text-gray-500 line-clamp-2">
          {description}
        </p>

        {(category || organizer || contact) && (
          <div className="mb-4 space-y-1 text-xs text-gray-500">
            {category && <p>Categoria: {category}</p>}
            {organizer && <p>Organiza: {organizer}</p>}
            {contact && <p>Contacto: {contact}</p>}
          </div>
        )}

        {/* Action Button */}
        {detailHref ? (
          <Button asChild className="w-full bg-emerald-500 text-white hover:bg-emerald-600">
            <Link href={detailHref}>Ver Detalles</Link>
          </Button>
        ) : (
          <Button className="w-full bg-emerald-500 text-white hover:bg-emerald-600">
            Ver Detalles
          </Button>
        )}
      </div>
    </article>
  )
}
