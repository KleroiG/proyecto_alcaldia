"use client"

import { useState, useMemo } from "react"
import { Search, Plus, Pencil, Trash2, CalendarCheck, ImageIcon, MapPin, CalendarDays } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
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
import type { EventRecord } from "@/lib/events"

// Función auxiliar para optimizar imágenes de Google Drive
const getDriveImage = (url: string) => {
  if (!url) return "";
  const match = url.match(/[-\w]{25,}/);
  if (!match) return url;
  return `https://drive.google.com/thumbnail?id=${match[0]}&sz=w400`;
};


interface EventsTableProps {
  events: EventRecord[]
  isLoading: boolean
  onEdit: (event: EventRecord) => void
  onDelete: (event: EventRecord) => void
  onPostEvent: (event: EventRecord) => void
  onAdd: () => void
}

function getStatusBadge(estado: string) {
  const normalizedStatus = estado?.toLowerCase() || ""

  switch (normalizedStatus) {
    case "programado":
      return <Badge variant="outline" className="bg-gradient-to-r from-sky-100 to-blue-200 text-blue-900 border border-blue-300 shadow-sm">Programado</Badge>
    case "en curso":
      return <Badge variant="outline" className="bg-gradient-to-r from-cyan-100 to-teal-200 text-teal-900 border border-teal-300 shadow-sm">En curso</Badge>
    case "finalizado":
      return <Badge variant="secondary" className="bg-gradient-to-r from-orange-100 to-red-200 text-red-900 border border-red-300 shadow-sm">Finalizado</Badge>
    default:
      return <Badge variant="outline">{estado}</Badge>
  }
}

function formatDate(dateString: string) {
  if (!dateString) return "Sin fecha"
  const date = new Date(`${dateString}T00:00:00`)
  if (Number.isNaN(date.getTime())) return dateString

  return new Intl.DateTimeFormat("es-CO", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date)
}

export function EventsTable({ events, isLoading, onEdit, onDelete, onPostEvent, onAdd }: EventsTableProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [eventToDelete, setEventToDelete] = useState<EventRecord | null>(null)

  // Cálculo de métricas
  const countTotal = events.length
  const countProgramados = events.filter((e) => e.estado?.toLowerCase() === "programado").length
  const countEnCurso = events.filter((e) => e.estado?.toLowerCase() === "en curso").length
  const countFinalizados = events.filter((e) => e.estado?.toLowerCase() === "finalizado").length

  // Filtrado de eventos
  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesSearch =
        event.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.tipo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.direccion?.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus = statusFilter === "all" || event.estado?.toLowerCase() === statusFilter.toLowerCase()

      return matchesSearch && matchesStatus
    })
  }, [events, searchQuery, statusFilter])

  const handleDeleteConfirm = () => {
    if (eventToDelete) {
      onDelete(eventToDelete)
      setEventToDelete(null)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Encabezado Institucional */}
      <div className="bg-gradient-to-r from-[#6b1d1d] to-[#8b2d2d] px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white">Gestión de Eventos</h2>
            <p className="text-white/70 text-sm">
              Administra la agenda cultural, institucional y turística
            </p>
          </div>
          <Button
            onClick={onAdd}
            className="bg-[#d4a84b] hover:bg-[#c49a3d] text-white font-semibold shadow-lg"
          >
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Evento
          </Button>
        </div>
      </div>

      <br />

      {/* Tarjetas de Métricas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5 mr-5 ml-5">
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm transition-all hover:shadow-md">
          <p className="text-sm font-medium text-gray-500 mb-1">Total Eventos</p>
          <p className="text-2xl font-bold text-gray-900">{isLoading ? "..." : countTotal}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm transition-all hover:shadow-md">
          <p className="text-sm font-medium text-gray-500 mb-1">Programados</p>
          <p className="text-2xl font-bold text-blue-600">{isLoading ? "..." : countProgramados}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm transition-all hover:shadow-md">
          <p className="text-sm font-medium text-gray-500 mb-1">En Curso</p>
          <p className="text-2xl font-bold text-emerald-600">{isLoading ? "..." : countEnCurso}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm transition-all hover:shadow-md">
          <p className="text-sm font-medium text-gray-500 mb-1">Finalizados</p>
          <p className="text-2xl font-bold text-gray-500">{isLoading ? "..." : countFinalizados}</p>
        </div>
      </div>

      {/* Barra de Búsqueda y Filtros */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por nombre, tipo o ubicación..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[220px] bg-white">
              <SelectValue placeholder="Filtrar por estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="programado">Programados</SelectItem>
              <SelectItem value="en curso">En Curso</SelectItem>
              <SelectItem value="finalizado">Finalizados</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tabla Principal */}
      <div className="overflow-x-auto">
        <Table className="table-fixed w-full">
          <TableHeader>
            <TableRow className="bg-gray-50 hover:bg-gray-50">
              <TableHead className="w-[70px]">Imagen</TableHead>
              <TableHead className="w-[200px]">Nombre</TableHead>
              <TableHead className="hidden md:table-cell w-[140px]">Tipo</TableHead>
              <TableHead className="hidden md:table-cell w-[140px]">Dirección</TableHead>
              <TableHead className="hidden lg:table-cell w-[180px]">Fechas</TableHead>
              <TableHead className="w-[120px]">Estado</TableHead>
              <TableHead className="text-right w-[140px] pr-8">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 6 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell><Skeleton className="h-12 w-12 rounded-lg" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-full max-w-[200px]" /></TableCell>
                  <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-20 rounded-full" /></TableCell>
                  <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-30 rounded-full" /></TableCell>
                  <TableCell className="hidden lg:table-cell"><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                  <TableCell><div className="flex justify-end gap-2 pr-4"><Skeleton className="h-8 w-8 rounded-md" /></div></TableCell>
                </TableRow>
              ))
            ) : filteredEvents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-500">
                    <CalendarDays className="h-10 w-10 mb-2 text-gray-300" />
                    <p className="font-medium">No se encontraron eventos</p>
                    <p className="text-sm">Intenta con otros términos de búsqueda o filtros</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredEvents.map((event) => {
                const isFinalizado = event.estado?.toLowerCase() === "finalizado";
                // Tomar imageUrl si existe, sino intentar tomar la primera del array fotos
                const mainImage = event.imageUrl || (event.fotos?.length > 0 ? event.fotos[0].url : "");

                return (
                  <TableRow key={event.id} className="group hover:bg-gray-50 transition-colors">
                    <TableCell>
                      <div className="h-12 w-12 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                        {mainImage ? (
                          <img
                            src={getDriveImage(mainImage)}
                            alt={event.nombre}
                            className="h-full w-full object-cover"
                            loading="lazy"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center">
                            <ImageIcon className="h-5 w-5 text-gray-400" />
                          </div>
                        )}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900 max-w-[200px] md:max-w-[240px] truncate" title={event.nombre}>
                          {event.nombre}
                        </span>
                        <span className="text-sm text-gray-600 md:hidden">{event.tipo}</span>
                      </div>
                    </TableCell>

                    <TableCell className="hidden md:table-cell">
                      <span className="text-sm text-gray-600">{event.tipo}</span>
                    </TableCell>

                    <TableCell className="hidden md:table-cell">
                      <div className="flex items-center gap-1 text-gray-500 mt-0.5">
                        <MapPin className="h-3 w-3 text-[#d4a84b]" />
                        <span className="text-xs truncate max-w-[180px] ">{event.direccion}</span>
                      </div>
                    </TableCell>
                    
                    <TableCell className="hidden lg:table-cell">
                      <div className="flex flex-col text-sm text-gray-600">
                        <span><strong className="font-medium">Inicio:</strong> {formatDate(event.fechaInicio)}</span>
                        <span><strong className="font-medium">Fin:</strong> {formatDate(event.fechaFin)}</span>
                      </div>
                    </TableCell>

                    <TableCell>
                      {getStatusBadge(event.estado)}
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center justify-end gap-1 pr-4">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEdit(event)}
                          className="size-8 text-gray-600 hover:text-[#6b1d1d] hover:bg-[#6b1d1d]/10"
                          title={`Editar ${event.nombre}`}
                        >
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setEventToDelete(event)}
                          className="size-8 text-gray-600 hover:text-red-600 hover:bg-red-50"
                          title={`Eliminar ${event.nombre}`}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                        {isFinalizado && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onPostEvent(event)}
                            className="size-8 text-gray-700 hover:bg-blue-100 hover:text-blue-700"
                            title={`Registro post-evento`}
                          >
                            <CalendarCheck className="size-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Contador Inferior */}
      {!isLoading && (
        <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
          <p className="text-sm text-gray-600">
            Mostrando <span className="font-medium">{filteredEvents.length}</span> de <span className="font-medium">{countTotal}</span> eventos
          </p>
        </div>
      )}

      {/* Modal de Confirmación de Eliminación */}
      <AlertDialog open={!!eventToDelete} onOpenChange={() => setEventToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar eliminación</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas eliminar el evento <strong>{eventToDelete?.nombre}</strong>?
              Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}