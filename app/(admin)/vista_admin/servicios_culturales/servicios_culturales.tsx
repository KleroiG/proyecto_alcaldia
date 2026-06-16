"use client"

import { useEffect, useMemo, useState } from "react"
import {
  Loader2,
  Pencil,
  Plus,
  RefreshCcw,
  Trash2,
  X,
  Settings,
  Globe,
  Instagram,
  Facebook,
  Youtube,
  Phone,
  Mail,
  User,
  Heart,
  Palette,
  Award,
} from "lucide-react"
import { cn } from "@/lib/utils"
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
  getCulturalServices,
  getCulturalServiceById,
  createCulturalService,
  updateCulturalService,
  deleteCulturalService,
  getArtisticAreas,
  createArtisticArea,
  deleteArtisticArea,
  getProfileTypesSc,
  createProfileTypeSc,
  deleteProfileTypeSc,
  type CulturalService,
  type ArtisticArea,
  type ProfileTypeSc,
} from "@/lib/cultural-services"
import { gdriveUrl } from "@/lib/events"
import { useAlert } from "@/components/global-alert"

type FormState = {
  id_area_artistica: string
  id_tipo_perfil_sc: string
  nombre_artistico: string
  telefono: string
  correo: string
  contacto: string
  biografia: string
  tipo_servicio: string
  publico_objetivo: string
  reconocimientos: string
  correo_publicar: string
  telefono_publicar: string
  sitio_web: string
  instagram: string
  facebook: string
  youtube: string
  tiktok: string
  otra_red: string
  fotoFile: File | null
  fotoUrlExistente: string
}

const emptyForm: FormState = {
  id_area_artistica: "",
  id_tipo_perfil_sc: "",
  nombre_artistico: "",
  telefono: "",
  correo: "",
  contacto: "",
  biografia: "",
  tipo_servicio: "",
  publico_objetivo: "",
  reconocimientos: "",
  correo_publicar: "",
  telefono_publicar: "",
  sitio_web: "",
  instagram: "",
  facebook: "",
  youtube: "",
  tiktok: "",
  otra_red: "",
  fotoFile: null,
  fotoUrlExistente: "",
}

export function ServiciosCulturalesPage() {
  const [services, setServices] = useState<CulturalService[]>([])
  const [areas, setAreas] = useState<ArtisticArea[]>([])
  const [profiles, setProfiles] = useState<ProfileTypeSc[]>([])
  
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  
  // Modales principales
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingService, setEditingService] = useState<CulturalService | null>(null)
  const [serviceToDelete, setServiceToDelete] = useState<CulturalService | null>(null)
  
  // Modales de administración secundaria (selects)
  const [manageAreasOpen, setManageAreasOpen] = useState(false)
  const [manageProfilesOpen, setManageProfilesOpen] = useState(false)
  
  // Estados para agregar opciones secundarias
  const [newAreaName, setNewAreaName] = useState("")
  const [newProfileName, setNewProfileName] = useState("")
  const [isManagingSec, setIsManagingSec] = useState(false)

  const [form, setForm] = useState<FormState>(emptyForm)
  const { showAlert } = useAlert()

  // Carga inicial de datos
  const loadAllData = async () => {
    try {
      setIsLoading(true)
      const [servicesData, areasData, profilesData] = await Promise.all([
        getCulturalServices(),
        getArtisticAreas(),
        getProfileTypesSc(),
      ])
      setServices(servicesData)
      setAreas(areasData)
      setProfiles(profilesData)
    } catch (err: any) {
      console.error(err)
      showAlert("error", "Error de Carga", err.message || "No se pudieron obtener los datos.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadAllData()
  }, [])

  const updateField = (key: keyof FormState, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const openCreateDialog = () => {
    setEditingService(null)
    setForm(emptyForm)
    setDialogOpen(true)
  }

  const openEditDialog = async (service: CulturalService) => {
    try {
      setIsLoading(true)
      const data = await getCulturalServiceById(service.id)
      setEditingService(data)
      setForm({
        id_area_artistica: String(data.id_area_artistica),
        id_tipo_perfil_sc: String(data.id_tipo_perfil_sc),
        nombre_artistico: data.nombre_artistico,
        telefono: String(data.telefono),
        correo: data.correo,
        contacto: data.contacto,
        biografia: data.biografia,
        tipo_servicio: data.tipo_servicio,
        publico_objetivo: data.publico_objetivo,
        reconocimientos: data.reconocimientos || "",
        correo_publicar: data.correo_publicar || "",
        telefono_publicar: data.telefono_publicar ? String(data.telefono_publicar) : "",
        sitio_web: data.sitio_web || "",
        instagram: data.instagram || "",
        facebook: data.facebook || "",
        youtube: data.youtube || "",
        tiktok: data.tiktok || "",
        otra_red: data.otra_red || "",
        fotoFile: null,
        fotoUrlExistente: data.url_foto || "",
      })
      setDialogOpen(true)
    } catch (err: any) {
      showAlert("error", "Error", "No se pudo cargar el detalle del servicio.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      const formData = new FormData()
      formData.append("id_area_artistica", form.id_area_artistica)
      formData.append("id_tipo_perfil_sc", form.id_tipo_perfil_sc)
      formData.append("nombre_artistico", form.nombre_artistico)
      formData.append("telefono", form.telefono)
      formData.append("correo", form.correo)
      formData.append("contacto", form.contacto)
      formData.append("biografia", form.biografia)
      formData.append("tipo_servicio", form.tipo_servicio)
      formData.append("publico_objetivo", form.publico_objetivo)
      formData.append("reconocimientos", form.reconocimientos)
      formData.append("correo_publicar", form.correo_publicar)
      formData.append("telefono_publicar", form.telefono_publicar)
      formData.append("sitio_web", form.sitio_web)
      formData.append("instagram", form.instagram)
      formData.append("facebook", form.facebook)
      formData.append("youtube", form.youtube)
      formData.append("tiktok", form.tiktok)
      formData.append("otra_red", form.otra_red)

      if (form.fotoFile) {
        formData.append("url_foto", form.fotoFile)
      } else if (form.fotoUrlExistente) {
        formData.append("url_foto", form.fotoUrlExistente)
      }

      if (editingService) {
        await updateCulturalService(editingService.id, formData)
        showAlert("success", "Actualizado", "Servicio cultural actualizado con éxito.")
      } else {
        await createCulturalService(formData)
        showAlert("success", "Registrado", "Servicio cultural registrado con éxito.")
      }

      setDialogOpen(false)
      await loadAllData()
    } catch (err: any) {
      showAlert("error", "Error al guardar", err.message || "Ocurrió un error en el servidor.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!serviceToDelete) return
    try {
      setIsLoading(true)
      await deleteCulturalService(serviceToDelete.id)
      showAlert("success", "Eliminado", "Servicio cultural eliminado con éxito.")
      setServiceToDelete(null)
      await loadAllData()
    } catch (err: any) {
      showAlert("error", "Error al eliminar", err.message || "Ocurrió un error en el servidor.")
    } finally {
      setIsLoading(false)
    }
  }

  // Métodos rápidos para agregar/eliminar Áreas Artísticas
  const handleAddArea = async () => {
    if (!newAreaName.trim()) return
    setIsManagingSec(true)
    try {
      await createArtisticArea(newAreaName)
      setNewAreaName("")
      const updated = await getArtisticAreas()
      setAreas(updated)
      showAlert("success", "Creado", "Área artística agregada.")
    } catch (err: any) {
      showAlert("error", "Error", err.message)
    } finally {
      setIsManagingSec(false)
    }
  }

  const handleDeleteArea = async (id: number) => {
    setIsManagingSec(true)
    try {
      await deleteArtisticArea(id)
      const updated = await getArtisticAreas()
      setAreas(updated)
      showAlert("success", "Eliminado", "Área artística eliminada con éxito.")
    } catch (err: any) {
      showAlert("error", "Error", err.message)
    } finally {
      setIsManagingSec(false)
    }
  }

  // Métodos rápidos para agregar/eliminar Tipos de Perfil
  const handleAddProfile = async () => {
    if (!newProfileName.trim()) return
    setIsManagingSec(true)
    try {
      await createProfileTypeSc(newProfileName)
      setNewProfileName("")
      const updated = await getProfileTypesSc()
      setProfiles(updated)
      showAlert("success", "Creado", "Tipo de perfil agregado.")
    } catch (err: any) {
      showAlert("error", "Error", err.message)
    } finally {
      setIsManagingSec(false)
    }
  }

  const handleDeleteProfile = async (id: number) => {
    setIsManagingSec(true)
    try {
      await deleteProfileTypeSc(id)
      const updated = await getProfileTypesSc()
      setProfiles(updated)
      showAlert("success", "Eliminado", "Tipo de perfil eliminado con éxito.")
    } catch (err: any) {
      showAlert("error", "Error", err.message)
    } finally {
      setIsManagingSec(false)
    }
  }

  // Filtrado reactivo en frontend
  const filteredServices = useMemo(() => {
    return services.filter((item) => {
      const query = searchQuery.toLowerCase()
      return (
        item.nombre_artistico.toLowerCase().includes(query) ||
        item.contacto.toLowerCase().includes(query) ||
        (item.area_artistica?.nombre || "").toLowerCase().includes(query) ||
        (item.tipo_perfil_sc?.nombre || "").toLowerCase().includes(query)
      )
    })
  }, [services, searchQuery])

  return (
    <div className="space-y-6 p-4 sm:p-6 bg-slate-50 min-h-screen">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Palette className="h-6 w-6 text-[#60150F]" />
            Gestión de Servicios Culturales
          </h1>
          <p className="text-sm text-gray-500">
            Administra los artistas, colectivos, formaciones y gestores culturales de Sogamoso
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2 cursor-pointer border-gray-200" onClick={loadAllData} disabled={isLoading}>
            <RefreshCcw className="size-4 text-gray-500" />
            Actualizar
          </Button>
          <Button className="gap-2 bg-[#60150F] hover:bg-[#470f0b] text-white cursor-pointer" onClick={openCreateDialog}>
            <Plus className="size-4" />
            Registrar Gestor Cultural
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="relative flex-1">
          <Input
            placeholder="Buscar por nombre artístico, contacto, área artística..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border-slate-200 focus-visible:ring-[#60150F]"
          />
        </div>
      </div>

      <Card className="border-gray-200 shadow-sm overflow-hidden bg-white rounded-xl">
        <CardHeader className="bg-gradient-to-r from-[#60150F] to-[#8b2d2d] text-white py-4 px-6">
          <CardTitle className="text-lg">Gestores y Artistas</CardTitle>
          <CardDescription className="text-white/70 text-xs">
            Listado completo de actores culturales en la base de datos
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-20 text-sm text-gray-500 gap-2">
              <Loader2 className="size-5 animate-spin text-[#60150F]" />
              Cargando registros culturales...
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead className="w-[80px]">Foto</TableHead>
                    <TableHead>Nombre Artístico</TableHead>
                    <TableHead className="hidden md:table-cell">Área Artística</TableHead>
                    <TableHead className="hidden sm:table-cell">Tipo Perfil</TableHead>
                    <TableHead className="hidden lg:table-cell">Contacto</TableHead>
                    <TableHead className="text-right pr-6">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredServices.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-32 text-center text-gray-400 italic">
                        No hay gestores culturales registrados que coincidan con la búsqueda.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredServices.map((service) => (
                      <TableRow key={service.id} className="hover:bg-slate-50/50">
                        <TableCell>
                          <div className="size-12 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center shrink-0">
                            {service.url_foto ? (
                              <img
                                src={gdriveUrl(service.url_foto)}
                                alt=""
                                className="h-full w-full object-cover animate-fade-in"
                                referrerPolicy="no-referrer"
                                onError={(e) => {
                                  e.currentTarget.src = "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=200"
                                }}
                              />
                            ) : (
                              <Palette className="h-5 w-5 text-gray-400" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-semibold text-gray-800">
                          {service.nombre_artistico}
                          <span className="block text-xs font-normal text-gray-500 md:hidden mt-0.5">
                            {service.area_artistica?.nombre || "No especificada"}
                          </span>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <Badge variant="outline" className="border-[#60150F]/20 bg-[#60150F]/5 text-[#60150F]">
                            {service.area_artistica?.nombre || "No especificada"}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-gray-600">
                          {service.tipo_perfil_sc?.nombre || "No especificado"}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <div className="text-xs text-gray-600 space-y-0.5">
                            <p className="font-medium text-gray-800">{service.contacto}</p>
                            <p className="text-gray-500">{service.correo}</p>
                            <p className="text-gray-500">{service.telefono}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-right pr-6">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEditDialog(service)}
                              className="size-8 text-[#d4a84b] hover:bg-amber-50 rounded-lg cursor-pointer"
                              aria-label={`Editar ${service.nombre_artistico}`}
                            >
                              <Pencil className="size-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setServiceToDelete(service)}
                              className="size-8 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                              aria-label={`Eliminar ${service.nombre_artistico}`}
                            >
                              <Trash2 className="size-4" />
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
        </CardContent>
      </Card>

      {/* CRUD Dialog (Nuevo / Editar) */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-4xl rounded-2xl bg-white p-6 shadow-xl">
          <DialogHeader className="border-b border-slate-100 pb-4">
            <DialogTitle className="text-xl font-bold text-gray-900">
              {editingService ? "Modificar Ficha Cultural" : "Registro de Gestor Cultural"}
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              Completa la información artística, perfiles, información de contacto y enlaces de difusión.
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-6 pt-4" onSubmit={handleSave}>
            <div className="grid gap-6 sm:grid-cols-2">
              {/* Información Básica */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-800 border-l-4 border-[#60150F] pl-2">Información Artística</h3>
                <div className="space-y-1.5">
                  <Label htmlFor="nombre_artistico">Nombre Artístico / Colectivo <span className="text-red-500">*</span></Label>
                  <Input
                    id="nombre_artistico"
                    required
                    value={form.nombre_artistico}
                    onChange={(e) => updateField("nombre_artistico", e.target.value)}
                    className="border-slate-200"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="id_area_artistica">Área Artística <span className="text-red-500">*</span></Label>
                    <div className="flex gap-1.5">
                      <Select
                        value={form.id_area_artistica}
                        onValueChange={(val) => updateField("id_area_artistica", val)}
                      >
                        <SelectTrigger className="w-full border-slate-200">
                          <SelectValue placeholder="Seleccione..." />
                        </SelectTrigger>
                        <SelectContent>
                          {areas.map((a) => (
                            <SelectItem key={a.id} value={String(a.id)}>
                              {a.nombre}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="shrink-0 border-slate-200 hover:bg-slate-50 cursor-pointer"
                        onClick={() => setManageAreasOpen(true)}
                        title="Gestionar áreas"
                      >
                        <Settings className="size-4 text-gray-500" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="id_tipo_perfil_sc">Tipo de Perfil <span className="text-red-500">*</span></Label>
                    <div className="flex gap-1.5">
                      <Select
                        value={form.id_tipo_perfil_sc}
                        onValueChange={(val) => updateField("id_tipo_perfil_sc", val)}
                      >
                        <SelectTrigger className="w-full border-slate-200">
                          <SelectValue placeholder="Seleccione..." />
                        </SelectTrigger>
                        <SelectContent>
                          {profiles.map((p) => (
                            <SelectItem key={p.id} value={String(p.id)}>
                              {p.nombre}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="shrink-0 border-slate-200 hover:bg-slate-50 cursor-pointer"
                        onClick={() => setManageProfilesOpen(true)}
                        title="Gestionar perfiles"
                      >
                        <Settings className="size-4 text-gray-500" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="contacto">Nombre de Contacto <span className="text-red-500">*</span></Label>
                  <Input
                    id="contacto"
                    required
                    value={form.contacto}
                    onChange={(e) => updateField("contacto", e.target.value)}
                    className="border-slate-200"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="telefono">Teléfono Administrativo <span className="text-red-500">*</span></Label>
                    <Input
                      id="telefono"
                      type="tel"
                      required
                      value={form.telefono}
                      onChange={(e) => updateField("telefono", e.target.value.replace(/\D/g, ""))}
                      className="border-slate-200"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="correo">Correo Administrativo <span className="text-red-500">*</span></Label>
                    <Input
                      id="correo"
                      type="email"
                      required
                      value={form.correo}
                      onChange={(e) => updateField("correo", e.target.value)}
                      className="border-slate-200"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="biografia">Biografía / Trayectoria <span className="text-red-500">*</span></Label>
                  <Textarea
                    id="biografia"
                    required
                    value={form.biografia}
                    onChange={(e) => updateField("biografia", e.target.value)}
                    rows={4}
                    className="border-slate-200 resize-none"
                    placeholder="Describe los años de experiencia, influencia artística, etc."
                  />
                </div>
              </div>

              {/* Detalles y Difusión */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-800 border-l-4 border-[#60150F] pl-2">Servicios y Publicación</h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="tipo_servicio">Tipo de Servicio <span className="text-red-500">*</span></Label>
                    <Input
                      id="tipo_servicio"
                      required
                      value={form.tipo_servicio}
                      onChange={(e) => updateField("tipo_servicio", e.target.value)}
                      placeholder="Muralismo, Taller, Concierto..."
                      className="border-slate-200"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="publico_objetivo">Público Objetivo <span className="text-red-500">*</span></Label>
                    <Input
                      id="publico_objetivo"
                      required
                      value={form.publico_objetivo}
                      onChange={(e) => updateField("publico_objetivo", e.target.value)}
                      placeholder="Infantil, Adultos, General..."
                      className="border-slate-200"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="reconocimientos">Reconocimientos o Premios</Label>
                  <Textarea
                    id="reconocimientos"
                    value={form.reconocimientos}
                    onChange={(e) => updateField("reconocimientos", e.target.value)}
                    rows={2}
                    className="border-slate-200 resize-none"
                    placeholder="Premios ganados, becas, exposiciones destacadas..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="telefono_publicar">Teléfono Público</Label>
                    <Input
                      id="telefono_publicar"
                      type="tel"
                      value={form.telefono_publicar}
                      onChange={(e) => updateField("telefono_publicar", e.target.value.replace(/\D/g, ""))}
                      className="border-slate-200"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="correo_publicar">Correo Público</Label>
                    <Input
                      id="correo_publicar"
                      type="email"
                      value={form.correo_publicar}
                      onChange={(e) => updateField("correo_publicar", e.target.value)}
                      className="border-slate-200"
                    />
                  </div>
                </div>

                {/* Foto */}
                <div className="space-y-2 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <Label className="text-xs font-semibold text-gray-700">Foto del Artista / Logo</Label>
                  {form.fotoUrlExistente && !form.fotoFile && (
                    <div className="flex items-center gap-3">
                      <img
                        src={gdriveUrl(form.fotoUrlExistente)}
                        alt=""
                        className="size-10 object-cover rounded-lg border border-slate-200"
                        referrerPolicy="no-referrer"
                      />
                      <span className="text-xs text-gray-500 truncate max-w-[150px]">Imagen actual guardada</span>
                    </div>
                  )}
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => updateField("fotoFile", e.target.files?.[0] || null)}
                    className="bg-white border-slate-200 text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Redes Sociales */}
            <div className="space-y-4 pt-2 border-t border-slate-100">
              <h3 className="text-sm font-bold text-gray-800 border-l-4 border-[#60150F] pl-2">Redes Sociales y Enlaces</h3>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-1.5">
                  <Label htmlFor="sitio_web" className="flex items-center gap-1.5"><Globe className="size-4 text-blue-500" /> Sitio Web</Label>
                  <Input
                    id="sitio_web"
                    value={form.sitio_web}
                    onChange={(e) => updateField("sitio_web", e.target.value)}
                    placeholder="https://..."
                    className="border-slate-200"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="instagram" className="flex items-center gap-1.5"><Instagram className="size-4 text-pink-500" /> Instagram</Label>
                  <Input
                    id="instagram"
                    value={form.instagram}
                    onChange={(e) => updateField("instagram", e.target.value)}
                    placeholder="https://instagram.com/..."
                    className="border-slate-200"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="facebook" className="flex items-center gap-1.5"><Facebook className="size-4 text-blue-600" /> Facebook</Label>
                  <Input
                    id="facebook"
                    value={form.facebook}
                    onChange={(e) => updateField("facebook", e.target.value)}
                    placeholder="https://facebook.com/..."
                    className="border-slate-200"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="youtube" className="flex items-center gap-1.5"><Youtube className="size-4 text-red-600" /> YouTube</Label>
                  <Input
                    id="youtube"
                    value={form.youtube}
                    onChange={(e) => updateField("youtube", e.target.value)}
                    placeholder="https://youtube.com/..."
                    className="border-slate-200"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="tiktok" className="flex items-center gap-1.5">TikTok</Label>
                  <Input
                    id="tiktok"
                    value={form.tiktok}
                    onChange={(e) => updateField("tiktok", e.target.value)}
                    placeholder="tiktok.com/@..."
                    className="border-slate-200"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="otra_red" className="flex items-center gap-1.5">Otra Red Link</Label>
                  <Input
                    id="otra_red"
                    value={form.otra_red}
                    onChange={(e) => updateField("otra_red", e.target.value)}
                    className="border-slate-200"
                  />
                </div>
              </div>
            </div>

            <DialogFooter className="border-t border-slate-100 pt-4">
              <Button type="button" variant="outline" className="border-slate-200 cursor-pointer" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSaving} className="bg-[#60150F] hover:bg-[#470f0b] text-white cursor-pointer gap-2">
                {isSaving && <Loader2 className="size-4 animate-spin" />}
                {isSaving ? "Guardando..." : "Guardar Ficha"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog para administrar Áreas Artísticas */}
      <Dialog open={manageAreasOpen} onOpenChange={setManageAreasOpen}>
        <DialogContent className="sm:max-w-md bg-white rounded-2xl p-6 shadow-xl">
          <DialogHeader>
            <DialogTitle>Administrar Áreas Artísticas</DialogTitle>
            <DialogDescription>
              Agrega o elimina categorías de áreas artísticas del sistema.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="flex gap-2">
              <Input
                placeholder="Nombre del área (ej. Escultura)"
                value={newAreaName}
                onChange={(e) => setNewAreaName(e.target.value)}
                className="border-slate-200"
              />
              <Button onClick={handleAddArea} disabled={isManagingSec || !newAreaName.trim()} className="bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer">
                Agregar
              </Button>
            </div>

            <div className="border border-slate-100 rounded-xl overflow-hidden max-h-60 overflow-y-auto divide-y divide-slate-100">
              {areas.map((a) => (
                <div key={a.id} className="flex items-center justify-between px-3 py-2 text-sm text-gray-700 bg-white hover:bg-slate-50">
                  <span>{a.nombre}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteArea(a.id)}
                    className="size-8 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                    disabled={isManagingSec}
                  >
                    <X className="size-4" />
                  </Button>
                </div>
              ))}
              {areas.length === 0 && (
                <p className="text-center py-4 text-xs text-gray-400 italic">No hay áreas artísticas.</p>
              )}
            </div>
          </div>
          <DialogFooter className="pt-4 border-t border-slate-100">
            <Button onClick={() => setManageAreasOpen(false)} className="bg-slate-100 hover:bg-slate-200 text-gray-800 cursor-pointer">
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para administrar Tipos de Perfil */}
      <Dialog open={manageProfilesOpen} onOpenChange={setManageProfilesOpen}>
        <DialogContent className="sm:max-w-md bg-white rounded-2xl p-6 shadow-xl">
          <DialogHeader>
            <DialogTitle>Administrar Tipos de Perfil</DialogTitle>
            <DialogDescription>
              Agrega o elimina tipos de perfil de gestores culturales.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="flex gap-2">
              <Input
                placeholder="Nombre del perfil (ej. Colectivo)"
                value={newProfileName}
                onChange={(e) => setNewProfileName(e.target.value)}
                className="border-slate-200"
              />
              <Button onClick={handleAddProfile} disabled={isManagingSec || !newProfileName.trim()} className="bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer">
                Agregar
              </Button>
            </div>

            <div className="border border-slate-100 rounded-xl overflow-hidden max-h-60 overflow-y-auto divide-y divide-slate-100">
              {profiles.map((p) => (
                <div key={p.id} className="flex items-center justify-between px-3 py-2 text-sm text-gray-700 bg-white hover:bg-slate-50">
                  <span>{p.nombre}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteProfile(p.id)}
                    className="size-8 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                    disabled={isManagingSec}
                  >
                    <X className="size-4" />
                  </Button>
                </div>
              ))}
              {profiles.length === 0 && (
                <p className="text-center py-4 text-xs text-gray-400 italic">No hay tipos de perfil.</p>
              )}
            </div>
          </div>
          <DialogFooter className="pt-4 border-t border-slate-100">
            <Button onClick={() => setManageProfilesOpen(false)} className="bg-slate-100 hover:bg-slate-200 text-gray-800 cursor-pointer">
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert */}
      <AlertDialog open={!!serviceToDelete} onOpenChange={(open) => !open && setServiceToDelete(null)}>
        <AlertDialogContent className="bg-white rounded-2xl p-6 shadow-xl">
          <AlertDialogHeader>
            <AlertDialogTitle>¿Está seguro de eliminar este registro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará la ficha cultural de{" "}
              <strong>{serviceToDelete?.nombre_artistico}</strong> permanentemente de la base de datos municipal.
              No se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-slate-200 cursor-pointer">Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white cursor-pointer">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}