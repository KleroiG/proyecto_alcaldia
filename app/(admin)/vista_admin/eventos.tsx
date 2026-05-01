"use client"

import { useState } from "react"
import { Plus, Pencil, Trash2, Users, DollarSign, CalendarCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {Table,TableBody,TableCell,TableHead,TableHeader,TableRow,} from "@/components/ui/table"
import {Dialog,DialogContent,DialogDescription,DialogFooter,DialogHeader,DialogTitle,DialogTrigger,} from "@/components/ui/dialog"

// Sample events data
const eventsData = [
  {
    id: "EVT-001",
    nombre: "Festival del Sol y del Acero",
    fechaInicio: "2026-04-15",
    estado: "Programado" as const,
  },
  {
    id: "EVT-002",
    nombre: "Semana Cultural Muisca",
    fechaInicio: "2026-04-05",
    estado: "En curso" as const,
  },
  {
    id: "EVT-003",
    nombre: "Feria Gastronómica Regional",
    fechaInicio: "2026-03-20",
    estado: "Finalizado" as const,
  },
  {
    id: "EVT-004",
    nombre: "Concierto de Música Andina",
    fechaInicio: "2026-04-22",
    estado: "Programado" as const,
  },
  {
    id: "EVT-005",
    nombre: "Exposición de Artesanías",
    fechaInicio: "2026-03-28",
    estado: "Finalizado" as const,
  },
  {
    id: "EVT-006",
    nombre: "Tour Nocturno Museo Arqueológico",
    fechaInicio: "2026-04-10",
    estado: "En curso" as const,
  },
]

type EventStatus = "Programado" | "En curso" | "Finalizado"

interface Event {
  id: string
  nombre: string
  fechaInicio: string
  estado: EventStatus
}

function getStatusBadge(estado: EventStatus) {
  switch (estado) {
    case "Programado":
      return (
        <Badge variant="outline" className="border-primary/50 bg-primary/10 text-primary">
          Programado
        </Badge>
      )
    case "En curso":
      return (
        <Badge variant="outline" className="border-accent/50 bg-accent/20 text-accent-foreground">
          En curso
        </Badge>
      )
    case "Finalizado":
      return (
        <Badge variant="secondary" className="bg-muted text-muted-foreground">
          Finalizado
        </Badge>
      )
  }
}

function formatDate(dateString: string) {
  const months = [
    "Ene", "Feb", "Mar", "Abr", "May", "Jun",
    "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"
  ]
  const [year, month, day] = dateString.split("-")
  const monthIndex = parseInt(month, 10) - 1
  return `${parseInt(day, 10)} ${months[monthIndex]} ${year}`
}

export function EventosAdmin() {
  const [events] = useState<Event[]>(eventsData)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [postEventDialogOpen, setPostEventDialogOpen] = useState(false)
  const [postEventData, setPostEventData] = useState({
    asistentesReales: "",
    impactoEconomico: "",
  })

  const handleEdit = (event: Event) => {
    console.log("Edit event:", event.id)
  }

  const handleDelete = (event: Event) => {
    console.log("Delete event:", event.id)
  }

  const handlePostEventSubmit = () => {
    console.log("Post-event data:", {
      eventId: selectedEvent?.id,
      ...postEventData,
    })
    setPostEventDialogOpen(false)
    setPostEventData({ asistentesReales: "", impactoEconomico: "" })
  }

  return (
    <div className="space-y-6">
      {/* Page Header with New Event Button */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Agenda de Eventos</h1>
          <p className="text-muted-foreground">
            Gestión de eventos culturales y turísticos de Sogamoso
          </p>
        </div>
        <Button className="gap-2 bg-primary hover:bg-primary/90">
          <Plus className="size-4" />
          Nuevo Evento
        </Button>
      </div>

      {/* Events Table */}
      <Card>
        <CardHeader>
          <CardTitle>Listado de Eventos</CardTitle>
          <CardDescription>
            Todos los eventos registrados en el sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead className="hidden sm:table-cell">Fecha Inicio</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.map((event) => (
                <TableRow key={event.id}>
                  <TableCell className="font-mono text-sm text-muted-foreground">
                    {event.id}
                  </TableCell>
                  <TableCell className="font-medium">
                    <div>
                      <span className="block">{event.nombre}</span>
                      <span className="block sm:hidden text-xs text-muted-foreground">
                        {formatDate(event.fechaInicio)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {formatDate(event.fechaInicio)}
                  </TableCell>
                  <TableCell>{getStatusBadge(event.estado)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {/* Edit Button - Yellow/Accent */}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(event)}
                        className="size-8 text-accent hover:bg-accent/20 hover:text-accent-foreground"
                        aria-label={`Editar ${event.nombre}`}
                      >
                        <Pencil className="size-4" />
                      </Button>
                      {/* Delete Button - Red/Destructive */}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(event)}
                        className="size-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                        aria-label={`Eliminar ${event.nombre}`}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                      {/* Post-Event Registration - Only for Finalizado events */}
                      {event.estado === "Finalizado" && (
                        <Dialog open={postEventDialogOpen && selectedEvent?.id === event.id} onOpenChange={(open) => {
                          setPostEventDialogOpen(open)
                          if (open) setSelectedEvent(event)
                        }}>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-8 text-primary hover:bg-primary/10 hover:text-primary"
                              aria-label={`Registro post-evento para ${event.nombre}`}
                            >
                              <CalendarCheck className="size-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Registro Post-Evento</DialogTitle>
                              <DialogDescription>
                                Ingrese los datos finales del evento: {event.nombre}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid gap-2">
                                <Label htmlFor="asistentes" className="flex items-center gap-2">
                                  <Users className="size-4 text-primary" />
                                  Asistentes Reales
                                </Label>
                                <Input
                                  id="asistentes"
                                  type="number"
                                  placeholder="Ej: 1500"
                                  value={postEventData.asistentesReales}
                                  onChange={(e) =>
                                    setPostEventData((prev) => ({
                                      ...prev,
                                      asistentesReales: e.target.value,
                                    }))
                                  }
                                />
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="impacto" className="flex items-center gap-2">
                                  <DollarSign className="size-4 text-accent" />
                                  Impacto Económico (COP)
                                </Label>
                                <Input
                                  id="impacto"
                                  type="number"
                                  placeholder="Ej: 50000000"
                                  value={postEventData.impactoEconomico}
                                  onChange={(e) =>
                                    setPostEventData((prev) => ({
                                      ...prev,
                                      impactoEconomico: e.target.value,
                                    }))
                                  }
                                />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button
                                variant="outline"
                                onClick={() => setPostEventDialogOpen(false)}
                              >
                                Cancelar
                              </Button>
                              <Button
                                onClick={handlePostEventSubmit}
                                className="bg-primary hover:bg-primary/90"
                              >
                                Guardar Registro
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Post-Event Registration Form (Mockup Card) */}
      <Card className="border-dashed border-2">
        <CardHeader>
          <div className="flex items-center gap-2">
            <CalendarCheck className="size-5 text-primary" />
            <CardTitle>Registro Post-Evento</CardTitle>
          </div>
          <CardDescription>
            Formulario para registrar datos finales de eventos finalizados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="mockup-asistentes" className="flex items-center gap-2">
                <Users className="size-4 text-primary" />
                Asistentes Reales
              </Label>
              <Input
                id="mockup-asistentes"
                type="number"
                placeholder="Número de asistentes confirmados"
              />
              <p className="text-xs text-muted-foreground">
                Ingrese el total de asistentes que participaron en el evento
              </p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="mockup-impacto" className="flex items-center gap-2">
                <DollarSign className="size-4 text-accent" />
                Impacto Económico (COP)
              </Label>
              <Input
                id="mockup-impacto"
                type="number"
                placeholder="Valor en pesos colombianos"
              />
              <p className="text-xs text-muted-foreground">
                Estimación del impacto económico generado por el evento
              </p>
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <Button variant="outline">Cancelar</Button>
            <Button className="bg-primary hover:bg-primary/90">
              Guardar Registro
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
