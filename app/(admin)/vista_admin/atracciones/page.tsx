"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, } from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Search, Plus, Pencil, Trash2, MapPin, ImageIcon } from "lucide-react"
import { Switch } from "@/components/ui/switch"

export interface Attraction {
  id: string
  name: string
  description: string
  category: string
  imageUrl: string
  address: string
  schedule?: string
  price?: string
  phone?: string
  whatsapp?: string
  instagram?: string
  facebook?: string
  isvisible?: boolean
  website?: string
  coordinates?: string
  mapsLink?: string

}

interface AttractionsTableProps {
  attractions: Attraction[]
  isLoading: boolean
  onEdit: (attraction: Attraction) => void
  onToggleActive: (id: string, isvisible: boolean) => void
  onDelete: (id: string) => void
  onAddClick: () => void
}

const categories = [
  { value: "all", label: "Todas las categorías" },
  { value: "Arqueología", label: "Arqueología" },
  { value: "Museo", label: "Museo" },
  { value: "Parque Tematico", label: "Parque Tematico" },
  { value: "Patrimonio", label: "Patrimonio" },
  { value: "Sitio Turistico Cultural", label: "Sitio Turistico Cultural" },
  { value: "Sitio Turistico Natural", label: "Sitio Turistico Natural" },
]

const categoryColors: Record<string, string> = {
  Arqueología: "bg-gradient-to-r from-yellow-100 to-amber-200 text-amber-900 border border-amber-300 shadow-sm",
  Museo: "bg-gradient-to-r from-cyan-100 to-teal-200 text-teal-900 border border-teal-300 shadow-sm",
  Patrimonio: "bg-gradient-to-r from-pink-100 to-rose-200 text-rose-900 border border-rose-300 shadow-sm",
  "Parque Tematico": "bg-gradient-to-r from-violet-100 to-fuchsia-200 text-fuchsia-900 border border-fuchsia-300 shadow-sm",
  "Sitio Turistico Cultural": "bg-gradient-to-r from-orange-100 to-red-200 text-red-900 border border-red-300 shadow-sm",
  "Sitio Turistico Natural": "bg-gradient-to-r from-sky-100 to-blue-200 text-blue-900 border border-blue-300 shadow-sm",
}

export function AttractionsTable({
  attractions,
  isLoading,
  onToggleActive,
  onEdit,
  onDelete,
  onAddClick,
}: AttractionsTableProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const filteredAttractions = useMemo(() => {
    return attractions.filter((attraction) => {
      const matchesSearch =
        attraction.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        attraction.address.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory =
        categoryFilter === "all" || attraction.category === categoryFilter
      return matchesSearch && matchesCategory
    })
  }, [attractions, searchQuery, categoryFilter])

  const handleDeleteConfirm = () => {
    if (deleteId) {
      onDelete(deleteId)
      setDeleteId(null)
    }
  }

  const getDriveImage = (url: string) => {
    const match = url.match(/[-\w]{25,}/);
    if (!match) return url;
    return `https://drive.google.com/thumbnail?id=${match[0]}&sz=w2000`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">

      {/* Table Header */}
      <div className="bg-gradient-to-r from-[#6b1d1d] to-[#8b2d2d] px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white">
              Gestión de Atractivos Turísticos
            </h2>
            <p className="text-white/70 text-sm">
              Administra los destinos turísticos de Sogamoso
            </p>
          </div>
          <Button
            onClick={onAddClick}
            className="bg-[#d4a84b] hover:bg-[#c49a3d] text-white font-semibold shadow-lg"
          >
            <Plus className="mr-2 h-4 w-4" />
            Agregar Atractivo
          </Button>
        </div>
      </div> 
      <br />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5 mr-5 ml-5">
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Total Atractivos</p>
          <p className="text-2xl font-bold text-gray-900">
            {isLoading ? "..." : attractions.length}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Activos</p>
          <p className="text-2xl font-bold text-emerald-600">
            {isLoading ? "..." : attractions.filter((a) => a.isvisible).length}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Inactivos</p>
          <p className="text-2xl font-bold text-gray-400">
            {isLoading ? "..." : attractions.filter((a) => !a.isvisible).length}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Categorías</p>
          <p className="text-2xl font-bold text-[#d4a84b]">
            {isLoading ? "..." : new Set(attractions.map((a) => a.category)).size}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por nombre o ubicación..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-[200px] bg-white">
              <SelectValue placeholder="Filtrar por categoría" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table className="table-fixed w-full">
          <TableHeader>
            <TableRow className="bg-gray-50 hover:bg-gray-50">
              <TableHead className="w-[80px]">Imagen</TableHead>
              <TableHead className="w-[28%]" >Nombre</TableHead>
              <TableHead className="hidden md:table-cell w-[18%]">Categoría</TableHead>
              <TableHead className="hidden lg:table-cell">Ubicación</TableHead>
              <TableHead className="text-center">Estado</TableHead>
              <TableHead className="text-right w-[160px] pr-10">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // Loading skeletons
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton className="h-12 w-12 rounded-lg" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[180px]" />
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Skeleton className="h-6 w-[100px] rounded-full" />
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <Skeleton className="h-4 w-[150px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-8 w-20 ml-auto mr-11" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-8 w-20 ml-auto mr-3" />
                  </TableCell>
                </TableRow>
              ))
            ) : filteredAttractions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-500">
                    <ImageIcon className="h-10 w-10 mb-2 text-gray-300" />
                    <p className="font-medium">No se encontraron atractivos</p>
                    <p className="text-sm">
                      Intenta con otros términos de búsqueda
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredAttractions.map((attraction) => (
                <TableRow
                  key={attraction.id}
                  className="group hover:bg-gray-50 transition-colors"
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200 flex items-center justify-center">
                        {attraction.imageUrl ? (
                          <img
                            src={getDriveImage(attraction.imageUrl)}
                            alt="Imagen"
                            loading="lazy"
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              // Fallback en caso de que tarde en responder
                              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1590001155093-a3c66ab0c3ff?q=80&w=800";
                            }}
                          />
                        ) : (
                          <ImageIcon className="h-5 w-5 text-gray-400" />
                        )}
                      </div>

                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-gray-900">
                        {attraction.name}
                      </p>
                      <p className="text-sm text-gray-500 md:hidden">
                        {attraction.category}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge
                      variant="outline"
                      className={categoryColors[attraction.category] || ""}
                    >
                      {attraction.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <div className="flex items-center gap-1 text-gray-600">
                      <MapPin className="h-3.5 w-3.5 text-[#d4a84b]" />
                      <span className="text-sm truncate max-w-[140px]">
                        {attraction.address}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-2">
                      <Switch
                        checked={attraction.isvisible}
                        onCheckedChange={(checked) =>
                          onToggleActive(attraction.id, checked)
                        }
                        aria-label={`${attraction.isvisible ? "Desactivar" : "Activar"} ${attraction.name}`}
                      />
                      <span
                        className={`text-xs font-medium ${attraction.isvisible
                          ? "text-emerald-600"
                          : "text-gray-400"
                          }`}
                      >
                        {attraction.isvisible ? "Activo" : "Inactivo"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end pr-7">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(attraction)}
                        className="text-gray-600 hover:text-[#6b1d1d] hover:bg-[#6b1d1d]/10"
                        aria-label={`Editar ${attraction.name}`}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteId(attraction.id)}
                        className="text-gray-600 hover:text-red-600 hover:bg-red-50 pr-20"
                        aria-label={`Eliminar ${attraction.name}`}
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

      {/* Results count */}
      {!isLoading && (
        <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
          <p className="text-sm text-gray-600">
            Mostrando{" "}
            <span className="font-medium">{filteredAttractions.length}</span> de{" "}
            <span className="font-medium">{attractions.length}</span> atractivos
          </p>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar eliminación</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas eliminar este atractivo turístico?
              Esta acción no se puede deshacer y el atractivo dejará de aparecer
              en el portal público.
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

export default function AttractionsPage() {
  return null
}
