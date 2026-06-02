"use client"

import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Search, Plus, Pencil, Trash2, MapPin, ImageIcon, Star, Phone, Loader2 } from "lucide-react"
import { GuiaCard, type Guia } from "./seccion-guia"
import { PrestadorForm } from "./prestadores-form"
import { fetchAllPrestadoresYGuias, savePrestadorService, saveGuiaService, deletePrestadorService, deleteGuiaService, togglePrestadorVisibilityService } from "./controlador"
import { Switch } from "@/components/ui/switch"
import type { Prestador } from "../prestadores_servicios/types"



export default function AdminPrestadoresPage() {
    const [view, setView] = useState<"table" | "form">("table")
    const [prestadores, setPrestadores] = useState<Prestador[]>([])
    const [guias, setGuias] = useState<Guia[]>([])
    const [isLoading, setIsLoading] = useState(true)

    // Estados de edición
    const [currentPrestador, setCurrentPrestador] = useState<Prestador | null>(null)
    const [currentGuia, setCurrentGuia] = useState<Guia | null>(null)
    const [formType, setFormType] = useState<"prestador" | "guia">("prestador")


    const loadData = async () => {
        setIsLoading(true)
        try {
            const data = await fetchAllPrestadoresYGuias()
            setPrestadores(data.prestadores)
            setGuias(data.guias)
        } catch (error) {
            console.error("Error al cargar datos:", error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        loadData()
    }, [])

    const handleToggleActivePrestador = async (id: string, isvisible: boolean) => {
        const target = prestadores.find(p => p.id === id)
        if (!target) return

        setPrestadores(prev => prev.map(p => p.id === id ? { ...p, isvisible } : p))
        try {
            await togglePrestadorVisibilityService((target as any).rawId, target.categoria, isvisible)
        } catch (error) {
            setPrestadores(prev => prev.map(p => p.id === id ? { ...p, isvisible: !isvisible } : p))
            alert("No se pudo cambiar la visibilidad.")
        }
    }

    const handleDeletePrestador = async (id: string) => {
        const prestador = prestadores.find(p => p.id === id)
        if (prestador) {
            try {
                setPrestadores(prev => prev.filter(p => p.id !== id))
                await deletePrestadorService(prestador)
            } catch (error) {
                loadData()
                alert("Error al eliminar el prestador.")
            }
        }
    }

    const handleDeleteGuia = async (id: string) => {
        const guia = guias.find(g => g.id === id)
        if (guia) {
            try {
                setGuias(prev => prev.filter(g => g.id !== id))
                await deleteGuiaService(guia)
            } catch (error) {
                loadData()
                alert("Error al eliminar el guía.")
            }
        }
    }

    // Manejadores de Guardado
    const handleSavePrestador = async (data: Partial<Prestador> & { imageFiles?: File[] }) => {
        try {
            await savePrestadorService(data, currentPrestador)
            setView("table")
            setCurrentPrestador(null)
        } catch (error) {
            console.error(error)
            alert("Ocurrió un error al guardar el prestador.")
        }
    }

    const handleSaveGuia = async (data: Partial<Guia>) => {
        try {
            await saveGuiaService(data, currentGuia)
            setView("table")
            setCurrentGuia(null)
        } catch (error) {
            console.error(error)
            alert("Ocurrió un error al guardar el guía.")
        }
    }

    // Renderizado del Formulario
    if (view === "form") {
        return (
            <div className="container mx-auto p-6">
                <PrestadorForm
                    formType={formType}
                    prestador={currentPrestador}
                    guia={currentGuia}
                    onBack={() => {
                        setView("table")
                        setCurrentPrestador(null)
                        setCurrentGuia(null)
                    }}
                    onSavePrestador={handleSavePrestador}
                    onSaveGuia={handleSaveGuia}
                />
            </div>
        )
    }

    // Renderizado de la Tabla (La que me pasaste)
    return (
        <div className="container mx-auto p-6 space-y-6">
            <PrestadoresTable
                prestadores={prestadores}
                guias={guias}
                onToggleActive={handleToggleActivePrestador}
                isLoading={isLoading}
                onAdd={() => {
                    setFormType("prestador")
                    setCurrentPrestador(null)
                    setCurrentGuia(null)
                    setView("form")
                }}
                onEditPrestador={(p) => {
                    setCurrentPrestador(p)
                    setFormType("prestador")
                    setView("form")
                }}
                onDeletePrestador={handleDeletePrestador}
                onEditGuia={(g) => {
                    setCurrentGuia(g)
                    setFormType("guia")
                    setView("form")
                }}
                onDeleteGuia={handleDeleteGuia}
            />
        </div>
    )
}

// =========================================================================
// 2. COMPONENTE DE INTERFAZ DE USUARIO (El código exacto que enviaste)
// =========================================================================

interface PrestadoresTableProps {
    prestadores: Prestador[]
    guias: Guia[]
    isLoading: boolean
    onEditPrestador: (prestador: Prestador) => void
    onDeletePrestador: (id: string) => void
    onToggleActive: (id: string, isvisible: boolean) => void
    onEditGuia: (guia: Guia) => void
    onDeleteGuia: (id: string) => void
    onAdd: () => void
}

const categories = [
    { value: "all", label: "Todas las categorías" },
    { value: "Hotel", label: "Hoteles" },
    { value: "Restaurante", label: "Restaurantes" },
    { value: "Agencia", label: "Agencias de Viaje" },
    { value: "Guia", label: "Guías Turísticos" },
]

const categoryColors: Record<string, string> = {
    Hotel: "bg-blue-100 text-blue-800 border-blue-200",
    Restaurante: "bg-orange-100 text-orange-800 border-orange-200",
    Agencia: "bg-purple-100 text-purple-800 border-purple-200",
}

export function PrestadoresTable({
    prestadores,
    guias,
    isLoading,
    onEditPrestador,
    onDeletePrestador,
    onToggleActive,
    onEditGuia,
    onDeleteGuia,
    onAdd,
}: PrestadoresTableProps) {
    const [searchQuery, setSearchQuery] = useState("")
    const [categoryFilter, setCategoryFilter] = useState("all")
    const [deleteId, setDeleteId] = useState<string | null>(null)
    const [deleteType, setDeleteType] = useState<"prestador" | "guia">("prestador")

    const filteredPrestadores = useMemo(() => {
        if (categoryFilter === "Guia") return []

        return prestadores.filter((prestador) => {
            const matchesSearch =
                prestador.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
                prestador.direccion.toLowerCase().includes(searchQuery.toLowerCase())
            const matchesCategory =
                categoryFilter === "all" || prestador.categoria === categoryFilter
            return matchesSearch && matchesCategory
        })
    }, [prestadores, searchQuery, categoryFilter])

    const filteredGuias = useMemo(() => {
        if (categoryFilter !== "Guia") return []

        return guias.filter((guia) => {
            const fullName = `${guia.nombre} ${guia.apellido}`.toLowerCase()
            return fullName.includes(searchQuery.toLowerCase()) ||
                guia.documento.includes(searchQuery)
        })
    }, [guias, searchQuery, categoryFilter])

    const showGuias = categoryFilter === "Guia"

    const handleDeleteClick = (id: string, type: "prestador" | "guia") => {
        setDeleteId(id)
        setDeleteType(type)
    }

    const handleDeleteConfirm = () => {
        if (deleteId) {
            if (deleteType === "prestador") {
                onDeletePrestador(deleteId)
            } else {
                onDeleteGuia(deleteId)
            }
            setDeleteId(null)
        }
    }

    const getTotalCount = () => {
        if (categoryFilter === "Guia") return guias.length
        if (categoryFilter === "all") return prestadores.length
        return prestadores.filter(p => p.categoria === categoryFilter).length
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Table Header */}
            <div className="bg-gradient-to-r from-[#6b1d1d] to-[#8b2d2d] px-6 py-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-white">
                            Gestión de Prestadores de Servicios
                        </h2>
                        <p className="text-white/70 text-sm">
                            Administra hoteles, restaurantes, agencias y guías turísticos
                        </p>
                    </div>
                    <Button
                        onClick={onAdd}
                        className="bg-[#d4a84b] hover:bg-[#c49a3d] text-white font-semibold shadow-lg"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Agregar Prestador
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <div className="p-4 border-b border-gray-200 bg-gray-50">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder={showGuias ? "Buscar por nombre o documento..." : "Buscar por nombre o ubicación..."}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 bg-white"
                        />
                    </div>
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                        <SelectTrigger className="w-full sm:w-[220px] bg-white">
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

            {/* Content */}
            {showGuias ? (
                // Guias Grid - ID Card Style
                <div className="p-6">
                    {isLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {Array.from({ length: 6 }).map((_, index) => (
                                <div key={index} className="bg-white rounded-xl border border-gray-200 p-4">
                                    <Skeleton className="h-8 w-full mb-4" />
                                    <div className="flex gap-4">
                                        <Skeleton className="h-28 w-24 rounded-lg" />
                                        <div className="flex-1 space-y-2">
                                            <Skeleton className="h-5 w-3/4" />
                                            <Skeleton className="h-4 w-1/2" />
                                            <Skeleton className="h-4 w-full" />
                                            <Skeleton className="h-4 w-full" />
                                            <Skeleton className="h-4 w-full ml-10px" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : filteredGuias.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                                <svg
                                    className="w-8 h-8 text-gray-400"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                </svg>
                            </div>
                            <p className="font-medium">No se encontraron guías turísticos</p>
                            <p className="text-sm">Intenta con otros términos de búsqueda</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {filteredGuias.map((guia) => (
                                <GuiaCard
                                    key={guia.id}
                                    guia={guia}
                                    onEdit={onEditGuia}
                                    onDelete={(id) => handleDeleteClick(id, "guia")}
                                />
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                // Regular Table for Hotels, Restaurants, Agencies
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-gray-50 hover:bg-gray-50">
                                <TableHead className="w-[80px]">Imagen</TableHead>
                                <TableHead className="w-[180px] md:w-[250px]">Nombre</TableHead>
                                <TableHead className="hidden md:table-cell w-[120px]">Categoría</TableHead>
                                <TableHead className="hidden lg:table-cell w-[150px]">Ubicación</TableHead>
                                <TableHead className="hidden lg:table-cell w-[120px]">Contacto</TableHead>
                                <TableHead className="text-center w-[120px]">Estado</TableHead>
                                <TableHead className="text-right w-[100px] pr-8">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                Array.from({ length: 6 }).map((_, index) => (
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
                                        <TableCell className="hidden lg:table-cell">
                                            <Skeleton className="h-4 w-[120px]" />
                                        </TableCell>
                                        <TableCell className="hidden lg:table-cell">
                                            <Skeleton className="h-4 w-[120px]" />
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton className="h-8 w-20 ml-auto" />
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : filteredPrestadores.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-32 text-center">
                                        <div className="flex flex-col items-center justify-center text-gray-500">
                                            <ImageIcon className="h-10 w-10 mb-2 text-gray-300" />
                                            <p className="font-medium">No se encontraron prestadores</p>
                                            <p className="text-sm">
                                                Intenta con otros términos de búsqueda
                                            </p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredPrestadores.map((prestador) => (
                                    <TableRow
                                        key={prestador.id}
                                        className="group hover:bg-gray-50 transition-colors"
                                    >
                                        <TableCell>
                                            <div className="h-12 w-12 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                                                {prestador.imageUrl ? (
                                                    <img
                                                        src={prestador.imageUrl}
                                                        alt={prestador.nombre}
                                                        className="h-full w-full object-cover"
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
                                                <span
                                                    className="font-medium text-gray-900 max-w-[180px] md:max-w-[250px] truncate"
                                                    title={prestador.nombre}
                                                >
                                                    {prestador.nombre}
                                                </span>
                                                <span
                                                    className="text-xs text-gray-500 max-w-[150px] md:max-w-[250px] truncate"
                                                    title={prestador.nombre}
                                                >
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell">
                                            <Badge
                                                variant="outline"
                                                className={categoryColors[prestador.categoria] || ""}
                                            >
                                                {prestador.categoria}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="hidden lg:table-cell">
                                            <div className="flex items-center gap-1 text-gray-600">
                                                <MapPin className="h-3.5 w-3.5 text-[#d4a84b]" />
                                                <span className="text-sm truncate max-w-[180px]">
                                                    {prestador.direccion}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="hidden lg:table-cell">
                                            <div className="flex items-center gap-1 text-gray-600">
                                                <Phone className="h-3.5 w-3.5 text-[#d4a84b]" />
                                                <span className="text-sm">{prestador.telefono}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col items-center justify-center gap-1">
                                                <Switch
                                                    checked={prestador.isvisible}
                                                    onCheckedChange={(checked) => onToggleActive(prestador.id, checked)}
                                                    aria-label={`${prestador.isvisible ? "Desactivar" : "Activar"} ${prestador.nombre}`}
                                                />
                                                <span className={`text-[10px] font-medium uppercase tracking-wider ${prestador.isvisible ? "text-emerald-600" : "text-gray-400"}`}>
                                                    {prestador.isvisible ? "Activo" : "Inactivo"}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center justify-end gap-2 pr-4">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => onEditPrestador(prestador)}
                                                    className="text-gray-600 hover:text-[#6b1d1d] hover:bg-[#6b1d1d]/10"
                                                    aria-label={`Editar ${prestador.nombre}`}
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDeleteClick(prestador.id, "prestador")}
                                                    className="text-gray-600 hover:text-red-600 hover:bg-red-50"
                                                    aria-label={`Eliminar ${prestador.nombre}`}
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
            )}

            {/* Results count */}
            {!isLoading && (
                <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
                    <p className="text-sm text-gray-600">
                        Mostrando{" "}
                        <span className="font-medium">
                            {showGuias ? filteredGuias.length : filteredPrestadores.length}
                        </span>{" "}
                        de <span className="font-medium">{getTotalCount()}</span>{" "}
                        {showGuias ? "guías" : "prestadores"}
                    </p>
                </div>
            )}

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar eliminación</AlertDialogTitle>
                        <AlertDialogDescription>
                            ¿Estás seguro de que deseas eliminar este {deleteType === "guia" ? "guía turístico" : "prestador de servicios"}?
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