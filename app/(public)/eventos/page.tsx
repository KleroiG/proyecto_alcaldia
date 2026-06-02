"use client"

import { useEffect, useMemo, useState } from "react"
import { EventFilters } from "@/app/(public)/eventos/event-filters"
import { EventCard, type EventStatus } from "@/app/(public)/eventos/event-card"
import { getEvents, type EventRecord } from "@/lib/events"
import { MuiscaSunIcon } from "@/components/icon-sol"

function toPublicStatus(status: EventRecord["estado"]): EventStatus {
  if (status === "Finalizado") {
    return "finished"
  }

  if (status === "En curso") {
    return "ongoing"
  }

  return "upcoming"
}

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

function isSameDay(dateString: string, selectedDate: Date) {
  const date = new Date(`${dateString}T00:00:00`)

  if (Number.isNaN(date.getTime())) {
    return false
  }

  return date.toDateString() === selectedDate.toDateString()
}

export default function EventsPage() {
  const [events, setEvents] = useState<EventRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [searchQuery, setSearchQuery] = useState("")
  const [category, setCategory] = useState("all")

  useEffect(() => {
    let isMounted = true

    async function loadEvents() {
      try {
        setIsLoading(true)
        setError("")
        const data = await getEvents()

        if (isMounted) {
          setEvents(data)
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "No se pudieron cargar los eventos.")
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadEvents()

    return () => {
      isMounted = false
    }
  }, [])

  const categories = useMemo(
    () => Array.from(new Set(events.map((event) => event.tipo).filter(Boolean))).sort(),
    [events],
  )

  const filteredEvents = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()

    return events.filter((event) => {
      const matchesSearch =
        !query ||
        event.nombre.toLowerCase().includes(query) ||
        event.descripcion.toLowerCase().includes(query) ||
        event.direccion.toLowerCase().includes(query) ||
        event.organizador.toLowerCase().includes(query)
      const matchesCategory = category === "all" || event.tipo === category
      const matchesDate = !date || isSameDay(event.fechaInicio, date)

      return matchesSearch && matchesCategory && matchesDate
    })
  }, [events, searchQuery, category, date])

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="mx-auto max-w-[1370px] pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <span className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-primary mb-2">
              <MuiscaSunIcon className="h-5 w-5 text-gold" />
              Sogamoso Ciudad del Sol
            </span>
            <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
              Agenda Cultural y de Eventos
            </h1>
            <p className="mt-2 text-gray-600">
              Descubre los eventos culturales que hacen de Sogamoso un destino unico
            </p>
          </div>

          <div className="mb-10">
            <EventFilters
              categories={categories}
              date={date}
              searchQuery={searchQuery}
              category={category}
              onDateChange={setDate}
              onSearchChange={setSearchQuery}
              onCategoryChange={setCategory}
            />
          </div>

          {isLoading && (
            <div className="rounded-lg border border-gray-200 bg-white p-6 text-sm text-gray-600">
              Cargando eventos...
            </div>
          )}

          {!isLoading && error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-sm text-red-700">
              {error}
            </div>
          )}

          {!isLoading && !error && events.length === 0 && (
            <div className="rounded-lg border border-gray-200 bg-white p-6 text-sm text-gray-600">
              Aun no hay eventos registrados en el backend.
            </div>
          )}

          {!isLoading && !error && events.length > 0 && filteredEvents.length === 0 && (
            <div className="rounded-lg border border-gray-200 bg-white p-6 text-sm text-gray-600">
              No hay eventos que coincidan con los filtros seleccionados.
            </div>
          )}

          {!isLoading && !error && events.length > 0 && filteredEvents.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredEvents.map((event) => (
                <EventCard
                  key={event.id}
                  title={event.nombre}
                  date={formatDate(event.fechaInicio)}
                  endDate={event.fechaFin ? formatDate(event.fechaFin) : undefined}
                  location={event.direccion}
                  description={event.descripcion}
                  imageUrl={event.imageUrl}
                  status={toPublicStatus(event.estado)}
                  detailHref={`/eventos/${event.id}`}
                  organizer={event.organizador}
                  contact={event.contacto}
                  category={event.tipo}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
