"use client"

import { useState, useEffect, useCallback } from "react"
import { Loader2, Settings, Globe, Instagram, Facebook, Youtube, Upload, X, ArrowLeft, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAlert } from "@/components/global-alert"
import { useConfirmation } from "@/components/confirmacion-alert"
import type { CulturalService, ArtisticArea, ProfileTypeSc } from "@/lib/cultural-services"

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
  previewUrl: string | null
}

const emptyForm: FormState = {
  id_area_artistica: "", id_tipo_perfil_sc: "", nombre_artistico: "", telefono: "", correo: "",
  contacto: "", biografia: "", tipo_servicio: "", publico_objetivo: "", reconocimientos: "",
  correo_publicar: "", telefono_publicar: "", sitio_web: "", instagram: "", facebook: "",
  youtube: "", tiktok: "", otra_red: "", fotoFile: null, fotoUrlExistente: "", previewUrl: null
}

interface CulturalServiceFormProps {
  initialData: CulturalService | null
  areas: ArtisticArea[]
  profiles: ProfileTypeSc[]
  onSave: (formData: FormData) => Promise<void>
  onBack: () => void
  onManageAreas: () => void
  onManageProfiles: () => void
}

export function CulturalServiceForm({
  initialData,
  areas,
  profiles,
  onSave,
  onBack,
  onManageAreas,
  onManageProfiles,
}: CulturalServiceFormProps) {
  const [form, setForm] = useState<FormState>(emptyForm)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, boolean>>({})
  const [dragActive, setDragActive] = useState(false)
  const [charCount, setCharCount] = useState(0)

  const { showAlert } = useAlert()
  const { confirm } = useConfirmation()

  useEffect(() => {
    if (initialData) {
      setForm({
        id_area_artistica: String(initialData.id_area_artistica),
        id_tipo_perfil_sc: String(initialData.id_tipo_perfil_sc),
        nombre_artistico: initialData.nombre_artistico,
        telefono: String(initialData.telefono),
        correo: initialData.correo,
        contacto: initialData.contacto,
        biografia: initialData.biografia,
        tipo_servicio: initialData.tipo_servicio,
        publico_objetivo: initialData.publico_objetivo,
        reconocimientos: initialData.reconocimientos || "",
        correo_publicar: initialData.correo_publicar || "",
        telefono_publicar: initialData.telefono_publicar ? String(initialData.telefono_publicar) : "",
        sitio_web: initialData.sitio_web || "",
        instagram: initialData.instagram || "",
        facebook: initialData.facebook || "",
        youtube: initialData.youtube || "",
        tiktok: initialData.tiktok || "",
        otra_red: initialData.otra_red || "",
        fotoFile: null,
        fotoUrlExistente: initialData.url_foto || "",
        previewUrl: null,
      })
      setCharCount(initialData.biografia.length)
    } else {
      setForm(emptyForm)
      setCharCount(0)
    }
  }, [initialData])

  const updateField = (field: keyof FormState, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: false }))
    if (field === "biografia") setCharCount(value.length)
  }

  // --- LÓGICA DE DRAG & DROP (1 Sola Imagen) ---
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true)
    else if (e.type === "dragleave") setDragActive(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith("image/")) {
      handleImageSelection(file)
    } else if (file) {
      showAlert("warning", "Formato inválido", "Solo se permiten archivos de imagen.")
    }
  }, [showAlert])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleImageSelection(file)
  }

  const handleImageSelection = (file: File) => {
    if (form.previewUrl) URL.revokeObjectURL(form.previewUrl)
    setForm(prev => ({
      ...prev,
      fotoFile: file,
      previewUrl: URL.createObjectURL(file)
    }))
  }

  const removeImage = () => {
    if (form.previewUrl) URL.revokeObjectURL(form.previewUrl)
    setForm(prev => ({ ...prev, fotoFile: null, previewUrl: null, fotoUrlExistente: "" }))
  }

  // --- VALIDACIÓN Y ENVÍO ---
  const validateForm = () => {
    const newErrors: Record<string, boolean> = {}
    if (!form.nombre_artistico.trim()) newErrors.nombre_artistico = true
    if (!form.id_area_artistica) newErrors.id_area_artistica = true
    if (!form.id_tipo_perfil_sc) newErrors.id_tipo_perfil_sc = true
    if (!form.contacto.trim()) newErrors.contacto = true
    if (!form.telefono.trim()) newErrors.telefono = true
    if (!form.correo.trim()) newErrors.correo = true
    if (!form.biografia.trim()) newErrors.biografia = true
    if (!form.tipo_servicio.trim()) newErrors.tipo_servicio = true
    if (!form.publico_objetivo.trim()) newErrors.publico_objetivo = true

    setErrors(newErrors)

    const isValid = Object.keys(newErrors).length === 0
    if (!isValid) {
      showAlert("warning", "Campos obligatorios", "Por favor, completa todos los campos marcados en rojo.")
    }
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    if (initialData) {
      const seguro = await confirm({
        title: "Actualizar Ficha Cultural",
        message: "Se guardarán todos los cambios realizados.",
        confirmText: "Actualizar",
        cancelText: "Cancelar",
        variant: "warning",
      })
      if (!seguro) return
    }

    setIsSubmitting(true)
    const formData = new FormData()
    Object.keys(form).forEach(key => {
      if (!['fotoFile', 'fotoUrlExistente', 'previewUrl'].includes(key)) {
        formData.append(key, form[key as keyof FormState] as string)
      }
    })

    if (form.fotoFile) {
      formData.append("url_foto", form.fotoFile)
    } else if (form.fotoUrlExistente) {
      formData.append("url_foto", form.fotoUrlExistente)
    }

    try {
      await onSave(formData)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getDriveImage = (url: string) => {
    if (!url) return ""
    const match = url.match(/[-\w]{25,}/)
    if (!match) return url
    return `https://drive.google.com/thumbnail?id=${match[0]}&sz=w800`
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
      {/* Form Header */}
      <div className="bg-gradient-to-r from-[#6b1d1d] to-[#8b2d2d] px-6 py-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack} className="text-white hover:bg-white/10 cursor-pointer">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <div>
            <h2 className="text-xl font-bold text-white">
              {initialData ? "Editar Ficha Cultural" : "Registro de Gestor Cultural"}
            </h2>
            <p className="text-white/70 text-sm">
              {initialData
                ? "Modifica la información artística y de contacto"
                : "Registra un nuevo actor cultural en el directorio"}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-8">
        
        {/* Section 1: Basic Info */}
        <section>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-[#d4a84b]/20 text-[#d4a84b] flex items-center justify-center text-sm font-bold">1</span>
            Información Artística
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="nombre_artistico" className="text-gray-700">
                Nombre Artístico / Colectivo <span className="text-red-500">*</span>
              </Label>
              <Input
                id="nombre_artistico"
                value={form.nombre_artistico}
                onChange={(e) => updateField("nombre_artistico", e.target.value)}
                placeholder="Ej: Colectivo Teatral Sogamoso"
                className={errors.nombre_artistico ? "border-red-500" : ""}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="id_area_artistica" className="text-gray-700">Área Artística <span className="text-red-500">*</span></Label>
              <div className="flex gap-1.5">
                <Select value={form.id_area_artistica} onValueChange={(val) => updateField("id_area_artistica", val)}>
                  <SelectTrigger className={errors.id_area_artistica ? "border-red-500 w-full" : "w-full"}>
                    <SelectValue placeholder="Seleccione..." />
                  </SelectTrigger>
                  <SelectContent>
                    {areas.map((a) => <SelectItem key={a.id} value={String(a.id)}>{a.nombre}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Button type="button" variant="outline" size="icon" onClick={onManageAreas} className="shrink-0 cursor-pointer">
                  <Settings className="size-4 text-gray-500" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="id_tipo_perfil_sc" className="text-gray-700">Tipo de Perfil <span className="text-red-500">*</span></Label>
              <div className="flex gap-1.5">
                <Select value={form.id_tipo_perfil_sc} onValueChange={(val) => updateField("id_tipo_perfil_sc", val)}>
                  <SelectTrigger className={errors.id_tipo_perfil_sc ? "border-red-500 w-full" : "w-full"}>
                    <SelectValue placeholder="Seleccione..." />
                  </SelectTrigger>
                  <SelectContent>
                    {profiles.map((p) => <SelectItem key={p.id} value={String(p.id)}>{p.nombre}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Button type="button" variant="outline" size="icon" onClick={onManageProfiles} className="shrink-0 cursor-pointer">
                  <Settings className="size-4 text-gray-500" />
                </Button>
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="biografia" className="text-gray-700">Biografía / Trayectoria <span className="text-red-500">*</span></Label>
              <Textarea
                id="biografia"
                value={form.biografia}
                onChange={(e) => updateField("biografia", e.target.value)}
                placeholder="Describe los años de experiencia, influencia artística, etc."
                rows={4}
                className={errors.biografia ? "border-red-500" : ""}
              />
            </div>
          </div>
        </section>

        {/* Section 2: Contacto Administrativo */}
        <section>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-[#d4a84b]/20 text-[#d4a84b] flex items-center justify-center text-sm font-bold">2</span>
            Contacto Administrativo
          </h3>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="contacto" className="text-gray-700">Nombre de Contacto <span className="text-red-500">*</span></Label>
              <Input id="contacto" value={form.contacto} onChange={(e) => updateField("contacto", e.target.value)} className={errors.contacto ? "border-red-500" : ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telefono" className="text-gray-700">Teléfono (Solo números) <span className="text-red-500">*</span></Label>
              <Input id="telefono" value={form.telefono} onChange={(e) => updateField("telefono", e.target.value.replace(/\D/g, ""))} className={errors.telefono ? "border-red-500" : ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="correo" className="text-gray-700">Correo Electrónico <span className="text-red-500">*</span></Label>
              <Input id="correo" type="email" value={form.correo} onChange={(e) => updateField("correo", e.target.value)} className={errors.correo ? "border-red-500" : ""} />
            </div>
          </div>
        </section>

        {/* Section 3: Servicios y Públicos */}
        <section>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-[#d4a84b]/20 text-[#d4a84b] flex items-center justify-center text-sm font-bold">3</span>
            Servicios y Redes
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="tipo_servicio" className="text-gray-700">Tipo de Servicio Ofrecido <span className="text-red-500">*</span></Label>
              <Input id="tipo_servicio" value={form.tipo_servicio} onChange={(e) => updateField("tipo_servicio", e.target.value)} placeholder="Ej: Muralismo, Talleres, Conciertos" className={errors.tipo_servicio ? "border-red-500" : ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="publico_objetivo" className="text-gray-700">Público Objetivo <span className="text-red-500">*</span></Label>
              <Input id="publico_objetivo" value={form.publico_objetivo} onChange={(e) => updateField("publico_objetivo", e.target.value)} placeholder="Ej: Familiar, Adultos, Infantil" className={errors.publico_objetivo ? "border-red-500" : ""} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="reconocimientos" className="text-gray-700">Reconocimientos (Opcional)</Label>
              <Textarea id="reconocimientos" value={form.reconocimientos} onChange={(e) => updateField("reconocimientos", e.target.value)} rows={2} placeholder="Premios ganados, becas..." />
            </div>

            {/* Redes */}
            <div className="space-y-2"><Label className="flex items-center gap-1.5"><Globe className="size-4 text-blue-500"/> Sitio Web</Label><Input value={form.sitio_web} onChange={(e) => updateField("sitio_web", e.target.value)} /></div>
            <div className="space-y-2"><Label className="flex items-center gap-1.5"><Instagram className="size-4 text-pink-500"/> Instagram</Label><Input value={form.instagram} onChange={(e) => updateField("instagram", e.target.value)} /></div>
            <div className="space-y-2"><Label className="flex items-center gap-1.5"><Facebook className="size-4 text-blue-600"/> Facebook</Label><Input value={form.facebook} onChange={(e) => updateField("facebook", e.target.value)} /></div>
            <div className="space-y-2"><Label className="flex items-center gap-1.5"><Youtube className="size-4 text-red-600"/> Youtube</Label><Input value={form.youtube} onChange={(e) => updateField("youtube", e.target.value)} /></div>
          </div>
        </section>

        {/* Section 4: Imagen */}
        <section>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-[#d4a84b]/20 text-[#d4a84b] flex items-center justify-center text-sm font-bold">4</span>
            Foto del Artista o Logo
          </h3>
          
          <div className="grid gap-6 md:grid-cols-2">
            {/* Dropzone */}
            <div
              onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors flex flex-col items-center justify-center min-h-[200px] ${dragActive ? "border-[#10b981] bg-[#10b981]/5" : "border-gray-300 hover:border-gray-400"}`}
            >
              <input type="file" accept="image/*" onChange={handleFileSelect} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                <Upload className="h-6 w-6 text-gray-400" />
              </div>
              <p className="text-sm font-medium text-gray-700">Arrastra y suelta una imagen aquí</p>
              <p className="text-xs text-gray-500 mt-1">o haz clic para buscar en tu equipo</p>
            </div>

            {/* Preview Area */}
            <div className="border border-gray-200 rounded-lg p-4 bg-slate-50 flex items-center justify-center min-h-[200px]">
              {(form.previewUrl || form.fotoUrlExistente) ? (
                <div className="relative group w-full h-full max-h-[250px] rounded-lg overflow-hidden shadow-sm">
                  {form.previewUrl && <div className="absolute top-2 left-2 bg-[#10b981] text-white text-[10px] font-bold px-2 py-0.5 rounded-sm z-10">NUEVA</div>}
                  <img
                    src={form.previewUrl || getDriveImage(form.fotoUrlExistente)}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button type="button" onClick={removeImage} className="bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors shadow-lg">
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-400">
                  <ImageIcon className="h-10 w-10 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No hay imagen seleccionada</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
          <Button type="button" variant="outline" onClick={onBack} className="cursor-pointer">Cancelar</Button>
          <Button type="submit" disabled={isSubmitting} className="bg-[#10b981] hover:bg-[#059669] text-white min-w-[140px] cursor-pointer">
            {isSubmitting ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Guardando...</>
            ) : (
              <><ImageIcon className="mr-2 h-4 w-4" /> {initialData ? "Actualizar" : "Crear Registro"}</>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}