"use client"

import { useState, useEffect } from "react"
import { Loader2, Settings, Globe, Instagram, Facebook, Youtube } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { CulturalService, ArtisticArea, ProfileTypeSc } from "@/lib/cultural-services"
import { gdriveUrl } from "@/lib/events"

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
  id_area_artistica: "", id_tipo_perfil_sc: "", nombre_artistico: "", telefono: "", correo: "",
  contacto: "", biografia: "", tipo_servicio: "", publico_objetivo: "", reconocimientos: "",
  correo_publicar: "", telefono_publicar: "", sitio_web: "", instagram: "", facebook: "",
  youtube: "", tiktok: "", otra_red: "", fotoFile: null, fotoUrlExistente: "",
}

interface CulturalServiceFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData: CulturalService | null
  areas: ArtisticArea[]
  profiles: ProfileTypeSc[]
  onSave: (formData: FormData) => Promise<void>
  onManageAreas: () => void
  onManageProfiles: () => void
}

export function CulturalServiceForm({
  open,
  onOpenChange,
  initialData,
  areas,
  profiles,
  onSave,
  onManageAreas,
  onManageProfiles,
}: CulturalServiceFormProps) {
  const [form, setForm] = useState<FormState>(emptyForm)
  const [isSaving, setIsSaving] = useState(false)

  // Cargar datos si estamos editando
  useEffect(() => {
    if (initialData && open) {
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
      })
    } else if (!initialData && open) {
      setForm(emptyForm)
    }
  }, [initialData, open])

  const updateField = (key: keyof FormState, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    const formData = new FormData()
    
    // Adjuntar todos los campos
    Object.keys(form).forEach(key => {
      if (key !== 'fotoFile' && key !== 'fotoUrlExistente') {
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
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-4xl rounded-2xl bg-white p-6 shadow-xl">
        <DialogHeader className="border-b border-slate-100 pb-4">
          <DialogTitle className="text-xl font-bold text-gray-900">
            {initialData ? "Modificar Ficha Cultural" : "Registro de Gestor Cultural"}
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Completa la información artística, perfiles, información de contacto y enlaces de difusión.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-6 pt-4" onSubmit={handleSubmit}>
          <div className="grid gap-6 sm:grid-cols-2">
            {/* Información Básica */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-gray-800 border-l-4 border-[#60150F] pl-2">Información Artística</h3>
              <div className="space-y-1.5">
                <Label htmlFor="nombre_artistico">Nombre Artístico / Colectivo <span className="text-red-500">*</span></Label>
                <Input required value={form.nombre_artistico} onChange={(e) => updateField("nombre_artistico", e.target.value)} className="border-slate-200" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="id_area_artistica">Área Artística <span className="text-red-500">*</span></Label>
                  <div className="flex gap-1.5">
                    <Select value={form.id_area_artistica} onValueChange={(val) => updateField("id_area_artistica", val)}>
                      <SelectTrigger className="w-full border-slate-200"><SelectValue placeholder="Seleccione..." /></SelectTrigger>
                      <SelectContent>
                        {areas.map((a) => (<SelectItem key={a.id} value={String(a.id)}>{a.nombre}</SelectItem>))}
                      </SelectContent>
                    </Select>
                    <Button type="button" variant="outline" size="icon" onClick={onManageAreas} className="shrink-0 border-slate-200 hover:bg-slate-50 cursor-pointer">
                      <Settings className="size-4 text-gray-500" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="id_tipo_perfil_sc">Tipo de Perfil <span className="text-red-500">*</span></Label>
                  <div className="flex gap-1.5">
                    <Select value={form.id_tipo_perfil_sc} onValueChange={(val) => updateField("id_tipo_perfil_sc", val)}>
                      <SelectTrigger className="w-full border-slate-200"><SelectValue placeholder="Seleccione..." /></SelectTrigger>
                      <SelectContent>
                        {profiles.map((p) => (<SelectItem key={p.id} value={String(p.id)}>{p.nombre}</SelectItem>))}
                      </SelectContent>
                    </Select>
                    <Button type="button" variant="outline" size="icon" onClick={onManageProfiles} className="shrink-0 border-slate-200 hover:bg-slate-50 cursor-pointer">
                      <Settings className="size-4 text-gray-500" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="contacto">Nombre de Contacto <span className="text-red-500">*</span></Label>
                <Input required value={form.contacto} onChange={(e) => updateField("contacto", e.target.value)} className="border-slate-200" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="telefono">Teléfono Administrativo <span className="text-red-500">*</span></Label>
                  <Input type="tel" required value={form.telefono} onChange={(e) => updateField("telefono", e.target.value.replace(/\D/g, ""))} className="border-slate-200" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="correo">Correo Administrativo <span className="text-red-500">*</span></Label>
                  <Input type="email" required value={form.correo} onChange={(e) => updateField("correo", e.target.value)} className="border-slate-200" />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="biografia">Biografía / Trayectoria <span className="text-red-500">*</span></Label>
                <Textarea required value={form.biografia} onChange={(e) => updateField("biografia", e.target.value)} rows={4} className="border-slate-200 resize-none" placeholder="Describe los años de experiencia, influencia artística, etc." />
              </div>
            </div>

            {/* Detalles y Difusión */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-gray-800 border-l-4 border-[#60150F] pl-2">Servicios y Publicación</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="tipo_servicio">Tipo de Servicio <span className="text-red-500">*</span></Label>
                  <Input required value={form.tipo_servicio} onChange={(e) => updateField("tipo_servicio", e.target.value)} placeholder="Muralismo, Taller, Concierto..." className="border-slate-200" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="publico_objetivo">Público Objetivo <span className="text-red-500">*</span></Label>
                  <Input required value={form.publico_objetivo} onChange={(e) => updateField("publico_objetivo", e.target.value)} placeholder="Infantil, Adultos..." className="border-slate-200" />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="reconocimientos">Reconocimientos o Premios</Label>
                <Textarea value={form.reconocimientos} onChange={(e) => updateField("reconocimientos", e.target.value)} rows={2} className="border-slate-200 resize-none" placeholder="Premios ganados, becas..." />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="telefono_publicar">Teléfono Público</Label>
                  <Input type="tel" value={form.telefono_publicar} onChange={(e) => updateField("telefono_publicar", e.target.value.replace(/\D/g, ""))} className="border-slate-200" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="correo_publicar">Correo Público</Label>
                  <Input type="email" value={form.correo_publicar} onChange={(e) => updateField("correo_publicar", e.target.value)} className="border-slate-200" />
                </div>
              </div>

              {/* Foto */}
              <div className="space-y-2 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <Label className="text-xs font-semibold text-gray-700">Foto del Artista / Logo</Label>
                {form.fotoUrlExistente && !form.fotoFile && (
                  <div className="flex items-center gap-3">
                    <img src={gdriveUrl(form.fotoUrlExistente)} alt="" className="size-10 object-cover rounded-lg border border-slate-200" referrerPolicy="no-referrer" />
                    <span className="text-xs text-gray-500 truncate max-w-[150px]">Imagen actual guardada</span>
                  </div>
                )}
                <Input type="file" accept="image/*" onChange={(e) => updateField("fotoFile", e.target.files?.[0] || null)} className="bg-white border-slate-200 text-xs" />
              </div>
            </div>
          </div>

          {/* Redes Sociales */}
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <h3 className="text-sm font-bold text-gray-800 border-l-4 border-[#60150F] pl-2">Redes Sociales y Enlaces</h3>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-1.5">
                <Label htmlFor="sitio_web" className="flex items-center gap-1.5"><Globe className="size-4 text-blue-500" /> Sitio Web</Label>
                <Input value={form.sitio_web} onChange={(e) => updateField("sitio_web", e.target.value)} placeholder="https://..." className="border-slate-200" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="instagram" className="flex items-center gap-1.5"><Instagram className="size-4 text-pink-500" /> Instagram</Label>
                <Input value={form.instagram} onChange={(e) => updateField("instagram", e.target.value)} placeholder="https://instagram.com/..." className="border-slate-200" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="facebook" className="flex items-center gap-1.5"><Facebook className="size-4 text-blue-600" /> Facebook</Label>
                <Input value={form.facebook} onChange={(e) => updateField("facebook", e.target.value)} placeholder="https://facebook.com/..." className="border-slate-200" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="youtube" className="flex items-center gap-1.5"><Youtube className="size-4 text-red-600" /> YouTube</Label>
                <Input value={form.youtube} onChange={(e) => updateField("youtube", e.target.value)} placeholder="https://youtube.com/..." className="border-slate-200" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="tiktok" className="flex items-center gap-1.5">TikTok</Label>
                <Input value={form.tiktok} onChange={(e) => updateField("tiktok", e.target.value)} placeholder="tiktok.com/@..." className="border-slate-200" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="otra_red" className="flex items-center gap-1.5">Otra Red Link</Label>
                <Input value={form.otra_red} onChange={(e) => updateField("otra_red", e.target.value)} className="border-slate-200" />
              </div>
            </div>
          </div>

          <DialogFooter className="border-t border-slate-100 pt-4">
            <Button type="button" variant="outline" className="border-slate-200 cursor-pointer" onClick={() => onOpenChange(false)}>
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
  )
}