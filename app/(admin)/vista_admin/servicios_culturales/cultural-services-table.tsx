"use client"

import { useState, useMemo } from "react"
import { Loader2, Pencil, Trash2, Search, ImageIcon, Palette, Plus, MapPin, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { CulturalService, ArtisticArea, ProfileTypeSc } from "@/lib/cultural-services"
import { gdriveUrl } from "@/lib/events"


interface CulturalServicesTableProps {
  services: CulturalService[]
  areas: ArtisticArea[]
  profiles: ProfileTypeSc[]
  isLoading: boolean
  fetchingServiceId: number | null
  onEdit: (service: CulturalService) => void
  onDelete: (service: CulturalService) => void
  onAdd: () => void
}

export function CulturalServicesTable({
  services,
  areas,
  profiles,
  isLoading,
  fetchingServiceId,
  onEdit,
  onDelete,
  onAdd
}: CulturalServicesTableProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedArea, setSelectedArea] = useState<string>("all")
  const [selectedProfile, setSelectedProfile] = useState<string>("all")

  // Filtrado de servicios
  const filteredServices = useMemo(() => {
    return services.filter((item) => {
      const query = searchQuery.toLowerCase()
      const matchesSearch =
        item.nombre_artistico.toLowerCase().includes(query) ||
        item.contacto.toLowerCase().includes(query)
      const matchesArea = selectedArea === "all" || String(item.id_area_artistica) === selectedArea
      const matchesProfile = selectedProfile === "all" || String(item.id_tipo_perfil_sc) === selectedProfile
      return matchesSearch && matchesArea && matchesProfile
    })
  }, [services, searchQuery, selectedArea, selectedProfile])

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Cabecera idéntica a Prestadores */}
      <div className="bg-gradient-to-r from-[#6b1d1d] to-[#8b2d2d] px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Gestión de Servicios Culturales
            </h2>
            <p className="text-white/70 text-sm">
              Administra artistas, colectivos, formaciones y gestores culturales
            </p>
          </div>
          <Button
            onClick={onAdd}
            className="bg-[#d4a84b] hover:bg-[#c49a3d] text-white font-semibold shadow-lg transition-colors cursor-pointer"
          >
            <Plus className="mr-2 h-4 w-4" />
            Agregar Registro
          </Button>
        </div>
      </div>

      {/* Tarjetas de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5 mx-5 mt-5">
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm transition-all hover:shadow-md">
          <p className="text-sm font-medium text-gray-500 mb-1">Total Registros</p>
          <p className="text-2xl font-bold text-gray-900">
            {isLoading ? "..." : services.length}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm transition-all hover:shadow-md">
          <p className="text-sm font-medium text-gray-500 mb-1">Áreas Artísticas</p>
          <p className="text-2xl font-bold text-emerald-600">
            {isLoading ? "..." : areas.length}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm transition-all hover:shadow-md">
          <p className="text-sm font-medium text-gray-500 mb-1">Tipos de Perfil</p>
          <p className="text-2xl font-bold text-[#d4a84b]">
            {isLoading ? "..." : profiles.length}
          </p>
        </div>
      </div>

      {/* Barra de Filtros */}
      <div className="p-4 border-b border-t border-gray-200 bg-gray-50">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por nombre artístico o contacto..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white"
            />
          </div>
          <Select value={selectedArea} onValueChange={setSelectedArea}>
            <SelectTrigger className="w-full sm:w-[220px] bg-white">
              <SelectValue placeholder="Todas las Áreas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las Áreas</SelectItem>
              {areas.map((a) => <SelectItem key={a.id} value={String(a.id)}>{a.nombre}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={selectedProfile} onValueChange={setSelectedProfile}>
            <SelectTrigger className="w-full sm:w-[220px] bg-white">
              <SelectValue placeholder="Todos los Perfiles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los Perfiles</SelectItem>
              {profiles.map((p) => <SelectItem key={p.id} value={String(p.id)}>{p.nombre}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tabla de Datos */}
      <div className="overflow-x-auto">
        <Table className="table-fixed w-full">
          <TableHeader>
            <TableRow className="bg-gray-50 hover:bg-gray-50">
              <TableHead className="w-[70px]">Foto</TableHead>
              <TableHead className="w-[200px]">Nombre Artístico</TableHead>
              <TableHead className="hidden md:table-cell w-[120px]">Área</TableHead>
              <TableHead className="hidden lg:table-cell w-[150px]">Perfil</TableHead>
              <TableHead className="hidden lg:table-cell w-[150px]">Contacto</TableHead>
              <TableHead className="text-right w-[120px] pr-8">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-12 w-12 rounded-lg" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-[200px]" /></TableCell>
                  <TableCell className="hidden md:table-cell"><Skeleton className="h-6 w-24 rounded-full" /></TableCell>
                  <TableCell className="hidden lg:table-cell"><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[120px]" />
                      <Skeleton className="h-3 w-[80px]" />
                    </div>
                  </TableCell>
                  <TableCell><Skeleton className="h-8 w-16 ml-auto rounded-md mr-5" /></TableCell>
                </TableRow>
              ))
            ) : filteredServices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-500">
                    <ImageIcon className="h-10 w-10 mb-2 text-gray-300" />
                    <p className="font-medium">No se encontraron registros culturales</p>
                    <p className="text-sm">Intenta con otros términos de búsqueda</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredServices.map((service) => (
                <TableRow key={service.id} className="group hover:bg-gray-50 transition-colors">
                  <TableCell>
                    <div className="h-12 w-12 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                      {service.url_foto ? (
                        <img
                          src={gdriveUrl(service.url_foto)}
                          alt={service.nombre_artistico}
                          className="h-full w-full object-cover animate-fade-in"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            e.currentTarget.src = "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=200"
                          }}
                        />
                      ) : (
                        <ImageIcon className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-900 max-w-[180px] md:max-w-[250px] truncate" title={service.nombre_artistico}>
                        {service.nombre_artistico}
                      </span>
                      <span className="text-sm text-gray-600 md:hidden">
                        {service.area_artistica?.nombre || "N/A"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge variant="outline" className="bg-slate-100 text-gray-700 border-slate-200 font-normal">
                      {service.area_artistica?.nombre || "N/A"}
                    </Badge>
                  </TableCell>
                  <TableCell
                    className="hidden lg:table-cell text-sm text-gray-600 max-w-[180px] truncate"
                    title={service.tipo_perfil_sc?.nombre || "N/A"}
                  >
                    {service.tipo_perfil_sc?.nombre || "N/A"}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <div className="flex flex-col text-sm text-gray-600 min-w-0">
                      <span
                        className="font-medium text-gray-800 truncate"
                        title={service.contacto}
                      >
                        {service.contacto}
                      </span>
                      <span className="text-xs flex items-center gap-1 mt-0.5">
                        <Phone className="h-3 w-3 text-gray-400" /> {service.telefono}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right pr-4">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(service)}
                        disabled={fetchingServiceId !== null}
                        className="text-gray-600 hover:text-[#6b1d1d] hover:bg-[#6b1d1d]/10 cursor-pointer"
                      >
                        {fetchingServiceId === service.id ? <Loader2 className="size-4 animate-spin" /> : <Pencil className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-600 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                        onClick={() => onDelete(service)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Contador inferior */}
      {!isLoading && (
        <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
          <p className="text-sm text-gray-600">
            Mostrando <span className="font-medium">{filteredServices.length}</span> de <span className="font-medium">{services.length}</span> registros culturales
          </p>
        </div>
      )}
    </div>
  )
}