"use client"

import { useState, useEffect } from "react"
import { EventsTable } from "./events-table"
import { EventForm } from "./event-form"
import { PostEventForm } from "./post-event-form"
import { type EventRecord, type EventPayload, getEvents } from "@/lib/events"

export default function AdminEventsPage() {
  const [view, setView] = useState<"table" | "form" | "post-event">("table")
  const [events, setEvents] = useState<EventRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")

  // Estados de edición
  const [currentEvent, setCurrentEvent] = useState<EventRecord | null>(null)

  const loadEvents = async () => {
    try {
      setIsLoading(true)
      setError("")
      const data = await getEvents()
      setEvents(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudieron cargar los eventos.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadEvents()
  }, [])

  const handleDeleteEvent = async (event: EventRecord) => {
    try {
      // Optimistic UI update
      setEvents(prev => prev.filter(e => e.id !== event.id))
      // await deleteEventService(event.id)
    } catch (error) {
      loadEvents() // Revert on failure
      alert("Error al eliminar el evento.")
    }
  }

  const handleSaveEvent = async (payload: EventPayload) => {
    setIsSaving(true)
    try {
      // await saveEventService(payload, currentEvent)
      await loadEvents()
      setView("table")
      setCurrentEvent(null)
    } catch (error) {
      console.error(error)
      alert("Ocurrió un error al guardar el evento.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleSavePostEvent = async (asistentes: string, impacto: string) => {
    try {
      // await savePostEventService(currentEvent?.id, asistentes, impacto)
      await loadEvents()
      setView("table")
      setCurrentEvent(null)
    } catch (error) {
      console.error(error)
      alert("Error al guardar el registro post-evento.")
    }
  }

  // Renderizado del Formulario de Creación/Edición
  if (view === "form") {
    return (
      <div className="container mx-auto p-6">
        <EventForm
          isOpen={true}
          onOpenChange={(open) => {
            if (!open) {
              setView("table")
              setCurrentEvent(null)
            }
          }}
          editingEvent={currentEvent}
          onSave={handleSaveEvent}
          isSaving={isSaving}
        />
      </div>
    )
  }

  // Renderizado del Formulario Post-Evento
  if (view === "post-event") {
    return (
      <div className="container mx-auto p-6">
        <PostEventForm
          isOpen={true}
          onOpenChange={(open) => {
            if (!open) {
              setView("table")
              setCurrentEvent(null)
            }
          }}
          selectedEvent={currentEvent}
          onSave={handleSavePostEvent}
        />
      </div>
    )
  }

  // Renderizado de la Tabla Principal con el nuevo diseño
  return (
    <div className="container mx-auto p-6 space-y-6">
      <EventsTable
        events={events}
        isLoading={isLoading}
        onAdd={() => {
          setCurrentEvent(null)
          setView("form")
        }}
        onEdit={(event) => {
          setCurrentEvent(event)
          setView("form")
        }}
        onDelete={handleDeleteEvent}
        onPostEvent={(event) => {
          setCurrentEvent(event)
          setView("post-event")
        }}
      />
    </div>
  )
}