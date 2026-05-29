"use client"

import { useEffect, useMemo, useState } from "react"
import {
  CalendarCheck,
  DollarSign,
  ImagePlus,
  Loader2,
  Pencil,
  Plus,
  RefreshCcw,
  Trash2,
  Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  createEvent,
  deleteEvent,
  getEvents,
  updateEvent,
  type EventPayload,
  type EventRecord,
  type EventStatus,
} from "@/lib/events"

type EventFormState = Omit<EventPayload, "urlFoto" | "fotos" | "fotosAEliminar"> & {
  urlFoto: File | null
  fotos: File[]
}

const emptyForm: EventFormState = {
  nombre: "",
  descripcion: "",
  tipo: "",
  organizador: "",
  contacto: "",
  fechaInicio: "",
  fechaFin: "",
  asistentesEstimados: "",
  impactoEconomico: "",
  estado: "programado",
  observaciones: "",
  direccion: "",
  latitud: "",
  longitud: "",
  googlePlaceId: "",
  urlFoto: null,
  fotos: [],
}

function toFormState(event: EventRecord): EventFormState {
  return {
    nombre: event.nombre,
    descripcion: event.descripcion,
    tipo: event.tipo,
    organizador: event.organizador,
    contacto: event.contacto,
    fechaInicio: event.fechaInicio,
    fechaFin: event.fechaFin,
    asistentesEstimados: event.asistentesEstimados,
    impactoEconomico: event.impactoEconomico,
    estado: event.estado.toLowerCase(),
    observaciones: event.observaciones,
    direccion: event.direccion,
    latitud: event.latitud,
    longitud: event.longitud,
    googlePlaceId: event.googlePlaceId,
    urlFoto: null,
    fotos: [],
  }
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
  if (!dateString) {
    return "Sin fecha"
  }

  const date = new Date(`${dateString}T00:00:00`)

  if (Number.isNaN(date.getTime())) {
    return dateString
  }

  return new Intl.DateTimeFormat("es-CO", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date)
}

export function EventosAdmin() {
  const [events, setEvents] = useState<EventRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<EventRecord | null>(null)
  const [eventToDelete, setEventToDelete] = useState<EventRecord | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<EventRecord | null>(null)
  const [postEventDialogOpen, setPostEventDialogOpen] = useState(false)
  const [form, setForm] = useState<EventFormState>(emptyForm)
  const [postEventData, setPostEventData] = useState({
    asistentesReales: "",
    impactoEconomico: "",
  })

  const sortedEvents = useMemo(
    () => [...events].sort((a, b) => a.fechaInicio.localeCompare(b.fechaInicio)),
    [events],
  )

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

  const updateField = (key: keyof EventFormState, value: string | File | File[] | null) => {
    setForm((current) => ({ ...current, [key]: value }))
  }

  const openCreateDialog = () => {
    setEditingEvent(null)
    setForm(emptyForm)
    setDialogOpen(true)
    setMessage("")
    setError("")
  }

  const openEditDialog = (event: EventRecord) => {
    setEditingEvent(event)
    setForm(toFormState(event))
    setDialogOpen(true)
    setMessage("")
    setError("")
  }

  const buildPayload = (): EventPayload => ({
    ...form,
    urlFoto: form.urlFoto,
    fotos: form.fotos,
  })

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsSaving(true)
    setMessage("")
    setError("")

    try {
      if (editingEvent) {
        await updateEvent(editingEvent.id, buildPayload())
        setMessage("Evento actualizado correctamente.")
      } else {
        await createEvent(buildPayload())
        setMessage("Evento creado correctamente.")
      }

      setDialogOpen(false)
      setEditingEvent(null)
      setForm(emptyForm)
      await loadEvents()
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar el evento.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!eventToDelete) {
      return
    }

    try {
      setError("")
      setMessage("")
      await deleteEvent(eventToDelete.id)
      setMessage("Evento eliminado correctamente.")
      setEventToDelete(null)
      await loadEvents()
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo eliminar el evento.")
    }
  }

  const handlePostEventSubmit = async () => {
    if (!selectedEvent) {
      return
    }

    try {
      await updateEvent(selectedEvent.id, {
        ...toFormState(selectedEvent),
        asistentesEstimados: postEventData.asistentesReales,
        impactoEconomico: postEventData.impactoEconomico,
        estado: "finalizado",
        urlFoto: null,
        fotos: [],
      })
      setPostEventDialogOpen(false)
      setPostEventData({ asistentesReales: "", impactoEconomico: "" })
      setMessage("Registro post-evento guardado correctamente.")
      await loadEvents()
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar el registro post-evento.")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Agenda de Eventos</h1>
          <p className="text-muted-foreground">
            Gestion de eventos culturales y turisticos de Sogamoso
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={loadEvents} disabled={isLoading}>
            <RefreshCcw className="size-4" />
            Actualizar
          </Button>
          <Button className="gap-2 bg-primary hover:bg-primary/90" onClick={openCreateDialog}>
            <Plus className="size-4" />
            Nuevo Evento
          </Button>
        </div>
      </div>

      {message && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
          {message}
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Listado de Eventos</CardTitle>
          <CardDescription>Todos los eventos registrados en el sistema</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center gap-2 py-8 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              Cargando eventos...
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[90px]">ID</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead className="hidden md:table-cell">Tipo</TableHead>
                  <TableHead className="hidden sm:table-cell">Fecha Inicio</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedEvents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                      No hay eventos registrados.
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedEvents.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell className="font-mono text-sm text-muted-foreground">
                        {event.id}
                      </TableCell>
                      <TableCell className="font-medium">
                        <span className="block">{event.nombre}</span>
                        <span className="block text-xs text-muted-foreground md:hidden">
                          {event.tipo}
                        </span>
                        <span className="block text-xs text-muted-foreground sm:hidden">
                          {formatDate(event.fechaInicio)}
                        </span>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{event.tipo}</TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {formatDate(event.fechaInicio)}
                      </TableCell>
                      <TableCell>{getStatusBadge(event.estado)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditDialog(event)}
                            className="size-8 text-accent hover:bg-accent/20 hover:text-accent-foreground"
                            aria-label={`Editar ${event.nombre}`}
                          >
                            <Pencil className="size-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setEventToDelete(event)}
                            className="size-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                            aria-label={`Eliminar ${event.nombre}`}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                          {event.estado === "Finalizado" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-8 text-primary hover:bg-primary/10 hover:text-primary"
                              onClick={() => {
                                setSelectedEvent(event)
                                setPostEventData({
                                  asistentesReales: event.asistentesEstimados,
                                  impactoEconomico: event.impactoEconomico,
                                })
                                setPostEventDialogOpen(true)
                              }}
                              aria-label={`Registro post-evento para ${event.nombre}`}
                            >
                              <CalendarCheck className="size-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>{editingEvent ? "Editar evento" : "Nuevo evento"}</DialogTitle>
            <DialogDescription>
              Completa los campos definidos por el backend para la agenda de eventos.
            </DialogDescription>
          </DialogHeader>
          <form className="grid gap-4" onSubmit={handleSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Nombre">
                <Input required value={form.nombre} onChange={(e) => updateField("nombre", e.target.value)} />
              </Field>
              <Field label="Tipo">
                <Input required value={form.tipo} onChange={(e) => updateField("tipo", e.target.value)} />
              </Field>
              <Field label="Organizador">
                <Input value={form.organizador} onChange={(e) => updateField("organizador", e.target.value)} />
              </Field>
              <Field label="Contacto">
                <Input value={form.contacto} onChange={(e) => updateField("contacto", e.target.value)} />
              </Field>
              <Field label="Fecha inicio">
                <Input required type="date" value={form.fechaInicio} onChange={(e) => updateField("fechaInicio", e.target.value)} />
              </Field>
              <Field label="Fecha fin">
                <Input required type="date" value={form.fechaFin} onChange={(e) => updateField("fechaFin", e.target.value)} />
              </Field>
              <Field label="Asistentes estimados">
                <Input type="number" value={form.asistentesEstimados} onChange={(e) => updateField("asistentesEstimados", e.target.value)} />
              </Field>
              <Field label="Impacto economico">
                <Input type="number" value={form.impactoEconomico} onChange={(e) => updateField("impactoEconomico", e.target.value)} />
              </Field>
              <Field label="Estado">
                <Select value={form.estado} onValueChange={(value) => updateField("estado", value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="programado">Programado</SelectItem>
                    <SelectItem value="en curso">En curso</SelectItem>
                    <SelectItem value="finalizado">Finalizado</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Direccion">
                <Input required value={form.direccion} onChange={(e) => updateField("direccion", e.target.value)} />
              </Field>
              <Field label="Latitud">
                <Input value={form.latitud} onChange={(e) => updateField("latitud", e.target.value)} />
              </Field>
              <Field label="Longitud">
                <Input value={form.longitud} onChange={(e) => updateField("longitud", e.target.value)} />
              </Field>
              <Field label="Google Place ID">
                <Input value={form.googlePlaceId} onChange={(e) => updateField("googlePlaceId", e.target.value)} />
              </Field>
              <Field label="Foto principal">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => updateField("urlFoto", e.target.files?.[0] || null)}
                />
              </Field>
              <Field label={editingEvent ? "Nuevas fotos" : "Fotos"}>
                <Input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => updateField("fotos", Array.from(e.target.files || []))}
                />
              </Field>
            </div>
            <Field label="Descripcion">
              <Textarea required value={form.descripcion} onChange={(e) => updateField("descripcion", e.target.value)} />
            </Field>
            <Field label="Observaciones">
              <Textarea value={form.observaciones} onChange={(e) => updateField("observaciones", e.target.value)} />
            </Field>
            <div className="flex items-center gap-2 rounded-lg border bg-muted/30 p-3 text-xs text-muted-foreground">
              <ImagePlus className="size-4" />
              En edicion, las fotos seleccionadas se envian como nuevas_fotos[].
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving && <Loader2 className="size-4 animate-spin" />}
                Guardar
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={postEventDialogOpen} onOpenChange={setPostEventDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registro Post-Evento</DialogTitle>
            <DialogDescription>
              Ingrese los datos finales del evento: {selectedEvent?.nombre}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Field label="Asistentes reales">
              <div className="relative">
                <Users className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-primary" />
                <Input
                  type="number"
                  className="pl-9"
                  value={postEventData.asistentesReales}
                  onChange={(e) =>
                    setPostEventData((prev) => ({ ...prev, asistentesReales: e.target.value }))
                  }
                />
              </div>
            </Field>
            <Field label="Impacto economico (COP)">
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-accent" />
                <Input
                  type="number"
                  className="pl-9"
                  value={postEventData.impactoEconomico}
                  onChange={(e) =>
                    setPostEventData((prev) => ({ ...prev, impactoEconomico: e.target.value }))
                  }
                />
              </div>
            </Field>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPostEventDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handlePostEventSubmit}>Guardar Registro</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!eventToDelete} onOpenChange={(open) => !open && setEventToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar evento</AlertDialogTitle>
            <AlertDialogDescription>
              Esta accion eliminara el evento {eventToDelete?.nombre}. No se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground" onClick={handleDelete}>
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-2">
      <Label>{label}</Label>
      {children}
    </div>
  )
}
