"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import {
  ArrowLeft,
  CalendarDays,
  DollarSign,
  MapPin,
  Phone,
  Tag,
  UserRound,
  Users,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { gdriveUrl, getEventById, type EventRecord } from "@/lib/events"

function formatDate(dateString: string) {
  if (!dateString) {
    return "Fecha por confirmar"
  }

  const date = new Date(`${dateString}T00:00:00`)

  if (Number.isNaN(date.getTime())) {
    return dateString
  }

  return new Intl.DateTimeFormat("es-CO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date)
}

function formatCurrency(value: string) {
  const amount = Number(value)

  if (!Number.isFinite(amount) || amount <= 0) {
    return ""
  }

  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(amount)
}

function getStatusClass(status: EventRecord["estado"]) {
  if (status === "Finalizado") {
    return "bg-red-500 text-white"
  }

  if (status === "En curso") {
    return "bg-[#d4a84b] text-white"
  }

  return "bg-emerald-500 text-white"
}

export default function EventDetailPage() {
  const params = useParams<{ id: string }>()
  const [event, setEvent] = useState<EventRecord | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    let isMounted = true

    async function loadEvent() {
      try {
        setIsLoading(true)
        setError("")
        const data = await getEventById(params.id)

        if (isMounted) {
          setEvent(data)
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "No se pudo cargar el evento.")
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    if (params.id) {
      loadEvent()
    }

    return () => {
      isMounted = false
    }
  }, [params.id])

  const impact = event ? formatCurrency(event.impactoEconomico) : ""

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="pt-24 pb-16">
        <div className="container mx-auto max-w-6xl px-4">
          <Button asChild variant="ghost" className="mb-6 gap-2">
            <Link href="/eventos">
              <ArrowLeft className="size-4" />
              Volver a eventos
            </Link>
          </Button>

          {isLoading && (
            <div className="rounded-lg border border-gray-200 bg-white p-6 text-sm text-gray-600">
              Cargando evento...
            </div>
          )}

          {!isLoading && error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-sm text-red-700">
              {error}
            </div>
          )}

          {!isLoading && !error && !event && (
            <div className="rounded-lg border border-gray-200 bg-white p-6 text-sm text-gray-600">
              No se encontro el evento solicitado.
            </div>
          )}

          {!isLoading && !error && event && (
            <article className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
              <div className="relative aspect-[16/7] min-h-[260px] overflow-hidden bg-gray-200">
                <img
                  src={gdriveUrl(event.imageUrl)}
                  alt={event.nombre}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white md:p-8">
                  <Badge className={getStatusClass(event.estado)}>{event.estado}</Badge>
                  <h1 className="mt-4 max-w-4xl text-3xl font-bold md:text-5xl">
                    {event.nombre}
                  </h1>
                </div>
              </div>

              <div className="grid gap-8 p-6 md:grid-cols-[1fr_320px] md:p-8">
                <div className="space-y-8">
                  <section>
                    <h2 className="text-xl font-semibold text-gray-900">Descripcion</h2>
                    <p className="mt-3 whitespace-pre-line text-gray-600">
                      {event.descripcion || "Este evento aun no tiene descripcion."}
                    </p>
                  </section>

                  {event.observaciones && (
                    <section>
                      <h2 className="text-xl font-semibold text-gray-900">Observaciones</h2>
                      <p className="mt-3 whitespace-pre-line text-gray-600">{event.observaciones}</p>
                    </section>
                  )}

                  {event.fotos.length > 0 && (
                    <section>
                      <h2 className="text-xl font-semibold text-gray-900">Galeria</h2>
                      <div className="mt-4 grid gap-4 sm:grid-cols-2">
                        {event.fotos.map((foto) => (
                          <div key={foto.id || foto.url} className="relative aspect-video overflow-hidden rounded-lg bg-gray-100">
                            <img
                              src={gdriveUrl(foto.url)}
                              alt={event.nombre}
                              loading="lazy"
                              referrerPolicy="no-referrer"
                              className="absolute inset-0 h-full w-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </section>
                  )}
                </div>

                <aside className="space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-5">
                  <DetailItem icon={<CalendarDays />} label="Inicio" value={formatDate(event.fechaInicio)} />
                  <DetailItem icon={<CalendarDays />} label="Fin" value={formatDate(event.fechaFin)} />
                  <DetailItem icon={<MapPin />} label="Lugar" value={event.direccion} />
                  <DetailItem icon={<Tag />} label="Categoria" value={event.tipo} />
                  <DetailItem icon={<UserRound />} label="Organizador" value={event.organizador} />
                  <DetailItem icon={<Phone />} label="Contacto" value={event.contacto} />
                  <DetailItem icon={<Users />} label="Asistentes estimados" value={event.asistentesEstimados} />
                  {impact && <DetailItem icon={<DollarSign />} label="Impacto economico" value={impact} />}
                </aside>
              </div>
            </article>
          )}
        </div>
      </main>
    </div>
  )
}

function DetailItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  if (!value) {
    return null
  }

  return (
    <div className="flex gap-3 rounded-md bg-white p-3 text-sm">
      <div className="mt-0.5 text-[#d4a84b] [&_svg]:size-4">{icon}</div>
      <div>
        <p className="font-medium text-gray-900">{label}</p>
        <p className="mt-1 text-gray-600">{value}</p>
      </div>
    </div>
  )
}
