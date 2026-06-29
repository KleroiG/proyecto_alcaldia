"use client"

import { useEffect, useState, useCallback } from "react"
import { CheckCircle2, Loader2, X, ArrowLeft, Upload, ImageIcon, CalendarDays, MapPin, User, Phone, Users, Landmark, FileText, ClipboardList, Images, } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { gdriveUrl, type EventPayload, type EventRecord } from "@/lib/events"

export type EventFormState = Omit<EventPayload, "urlFoto" | "fotos" | "fotosAEliminar"> & {
  urlFoto: File | null
  urlFotoExistente: string
  fotos: File[]
  fotosAEliminar: string[]
}

const emptyForm: EventFormState = {
  nombre: "", descripcion: "", tipo: "", organizador: "", contacto: "",
  fechaInicio: "", fechaFin: "", asistentesEstimados: "", impactoEconomico: "",
  estado: "programado", observaciones: "", direccion: "", latitud: "",
  longitud: "", googlePlaceId: "", urlFoto: null, urlFotoExistente: "",
  fotos: [], fotosAEliminar: [],
}

function toFormState(event: EventRecord): EventFormState {
  return {
    ...event,
    estado: event.estado.toLowerCase(),
    urlFoto: null,
    urlFotoExistente: "",
    fotos: [],
    fotosAEliminar: [],
  }
}

interface EventFormProps {
  editingEvent: EventRecord | null
  onSave: (payload: EventPayload) => Promise<void>
  isSaving: boolean
  onBack: () => void
}

export function EventForm({ editingEvent, onSave, isSaving, onBack }: EventFormProps) {
  const [form, setForm] = useState<EventFormState>(emptyForm)
  const [dragActive, setDragActive] = useState(false)
  const [previewMainUrl, setPreviewMainUrl] = useState<string | null>(null)
  const [galleryPreviews, setGalleryPreviews] = useState<{ file: File, url: string }[]>([])

  useEffect(() => {
    if (editingEvent) {
      setForm(toFormState(editingEvent))
    } else {
      setForm(emptyForm)
    }
  }, [editingEvent])

  const updateField = (key: keyof EventFormState, value: any) => {
    setForm((current) => ({ ...current, [key]: value }))
  }

  const toggleFotoEliminar = (id: string) => {
    setForm((prev) => ({
      ...prev,
      fotosAEliminar: prev.fotosAEliminar.includes(id)
        ? prev.fotosAEliminar.filter((f) => f !== id)
        : [...prev.fotosAEliminar, id],
    }))
  }

  // --- Lógica Drag & Drop (Foto Principal) ---
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
      handleMainImageSelection(file)
    }
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleMainImageSelection(file)
  }

  const handleMainImageSelection = (file: File) => {
    if (previewMainUrl) URL.revokeObjectURL(previewMainUrl)
    updateField("urlFoto", file)
    updateField("urlFotoExistente", "")
    setPreviewMainUrl(URL.createObjectURL(file))
  }

  const removeMainImage = () => {
    if (previewMainUrl) URL.revokeObjectURL(previewMainUrl)
    setPreviewMainUrl(null)
    updateField("urlFoto", null)
    updateField("urlFotoExistente", "")
  }

  // --- Lógica Galería Adicional ---
  const handleGallerySelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      const newPreviews = files.map(file => ({ file, url: URL.createObjectURL(file) }))
      setGalleryPreviews(prev => [...prev, ...newPreviews])
      updateField("fotos", [...form.fotos, ...files])
    }
  }

  const removeGalleryPreview = (indexToRemove: number) => {
    setGalleryPreviews(prev => {
      const newPreviews = [...prev]
      URL.revokeObjectURL(newPreviews[indexToRemove].url)
      newPreviews.splice(indexToRemove, 1)
      return newPreviews
    })
    const newFotos = [...form.fotos]
    newFotos.splice(indexToRemove, 1)
    updateField("fotos", newFotos)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload: EventPayload = {
      ...form,
      urlFoto: form.urlFoto ?? (form.urlFotoExistente || null),
      fotos: form.fotos,
      fotosAEliminar: form.fotosAEliminar,
    }
    await onSave(payload)
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
      {/* Header Institucional */}
      <div className="bg-gradient-to-r from-[#6b1d1d] to-[#8b2d2d] px-6 py-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack} className="text-white hover:bg-white/10 cursor-pointer">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <div>
            <h2 className="text-xl font-bold text-white">
              {editingEvent ? "Editar Evento" : "Registro de Evento"}
            </h2>
            <p className="text-white/70 text-sm">
              {editingEvent
                ? "Modifica la información y multimedia del evento"
                : "Registra un nuevo evento en la agenda municipal"}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-8">

        {/* Section 1: Información Básica */}
        <section>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-[#d4a84b]/20 text-[#d4a84b] flex items-center justify-center text-sm font-bold">1</span>
            Información Principal
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="nombre" className="text-gray-700">Nombre del Evento <span className="text-red-500">*</span></Label>
              <Input id="nombre" required value={form.nombre} onChange={(e) => updateField("nombre", e.target.value)} placeholder="Ej: Festival del Sol y del Acero" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tipo" className="text-gray-700">Tipo de Evento <span className="text-red-500">*</span></Label>
              <Input id="tipo" required value={form.tipo} onChange={(e) => updateField("tipo", e.target.value)} placeholder="Ej: Cultural, Deportivo, Concierto" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="estado" className="text-gray-700">Estado Actual</Label>
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
            </div>
          </div>
        </section>

        {/* Section 2: Fechas y Ubicación */}
        <section>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-[#d4a84b]/20 text-[#d4a84b] flex items-center justify-center text-sm font-bold">2</span>
            Fechas y Ubicación
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fechaInicio" className="flex items-center gap-1.5 text-gray-700"><CalendarDays className="size-4 text-blue-500" /> Fecha Inicio <span className="text-red-500">*</span></Label>
              <Input id="fechaInicio" required type="date" value={form.fechaInicio} onChange={(e) => updateField("fechaInicio", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fechaFin" className="flex items-center gap-1.5 text-gray-700"><CalendarDays className="size-4 text-red-500" /> Fecha Fin <span className="text-red-500">*</span></Label>
              <Input id="fechaFin" required type="date" value={form.fechaFin} onChange={(e) => updateField("fechaFin", e.target.value)} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="direccion" className="flex items-center gap-1.5 text-gray-700"><MapPin className="size-4 text-green-500" /> Dirección / Lugar <span className="text-red-500">*</span></Label>
              <Input id="direccion" required value={form.direccion} onChange={(e) => updateField("direccion", e.target.value)} placeholder="Ej: Plaza de la Villa" />
            </div>
          </div>
        </section>

        {/* Section 3: Detalles y Datos Administrativos */}
        <section className="space-y-6">
          {/* Encabezado */}
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-[#d4a84b]/20 text-[#d4a84b] flex items-center justify-center text-sm font-bold">3</span>
            Detalles y Contacto
          </h3>

          <div className="grid gap-5 md:grid-cols-2">

            {/* Organizador */}

            <div className="rounded-xl border bg-white p-4 shadow-sm hover:shadow-md transition-all">
              <Label
                htmlFor="organizador"
                className="flex items-center gap-2 mb-2"
              >
                <User className="w-4 h-4 text-[#d4a84b]" />
                Organizador
              </Label>

              <Input
                id="organizador"
                placeholder="Secretaría de Cultura"
                value={form.organizador}
                onChange={(e) =>
                  updateField("organizador", e.target.value)
                }
                className="focus-visible:ring-[#d4a84b]"
              />
            </div>

            {/* Contacto */}

            <div className="rounded-xl border bg-white p-4 shadow-sm hover:shadow-md transition-all">
              <Label
                htmlFor="contacto"
                className="flex items-center gap-2 mb-2"
              >
                <Phone className="w-4 h-4 text-green-600" />
                Número de Contacto
              </Label>

              <Input
                id="contacto"
                inputMode="numeric"
                maxLength={10}
                placeholder="3001234567"
                value={form.contacto}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "")
                  updateField("contacto", value)
                }}
                className="focus-visible:ring-green-500"
              />

              <p className="text-xs text-gray-500 mt-1">
                Solo números.
              </p>
            </div>

            {/* Asistentes */}

            <div className="rounded-xl border bg-white p-4 shadow-sm hover:shadow-md transition-all">
              <Label
                htmlFor="asistentes"
                className="flex items-center gap-2 mb-2"
              >
                <Users className="w-4 h-4 text-blue-500" />
                Asistentes Estimados
              </Label>

              <Input
                id="asistentes"
                type="number"
                min={0}
                step={1}
                value={form.asistentesEstimados}
                onChange={(e) =>
                  updateField(
                    "asistentesEstimados",
                    Math.max(0, Number(e.target.value))
                  )
                }
                className="focus-visible:ring-blue-500"
              />

              <p className="text-xs text-gray-500 mt-1">
                No se permiten números negativos.
              </p>
            </div>

            {/* Impacto */}

            <div className="rounded-xl border bg-white p-4 shadow-sm hover:shadow-md transition-all">
              <Label
                htmlFor="impacto"
                className="flex items-center gap-2 mb-2"
              >
                <Landmark className="w-4 h-4 text-emerald-600" />
                Impacto Económico
              </Label>

              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  $
                </span>

                <Input
                  id="impacto"
                  type="number"
                  min={0}
                  className="pl-7 focus-visible:ring-emerald-500"
                  value={form.impactoEconomico}
                  onChange={(e) =>
                    updateField(
                      "impactoEconomico",
                      Math.max(0, Number(e.target.value))
                    )
                  }
                />
              </div>
            </div>

            {/* Descripción */}

            <div className="md:col-span-2 rounded-xl border bg-white p-4 shadow-sm hover:shadow-md transition-all">
              <Label
                htmlFor="descripcion"
                className="flex items-center gap-2 mb-2"
              >
                <FileText className="w-4 h-4 text-[#d4a84b]" />
                Descripción del Evento
                <span className="text-red-500">*</span>
              </Label>

              <Textarea
                id="descripcion"
                rows={4}
                maxLength={500}
                required
                value={form.descripcion}
                onChange={(e) =>
                  updateField("descripcion", e.target.value)
                }
                className="resize-none focus-visible:ring-[#d4a84b]"
              />

              <div className="flex justify-between mt-2 text-xs text-gray-500">
                <span>Describe brevemente el evento.</span>

                <span>
                  {form.descripcion.length}/500
                </span>
              </div>
            </div>

            {/* Observaciones */}

            <div className="md:col-span-2 rounded-xl border bg-white p-4 shadow-sm hover:shadow-md transition-all">
              <Label
                htmlFor="observaciones"
                className="flex items-center gap-2 mb-2"
              >
                <ClipboardList className="w-4 h-4 text-indigo-500" />
                Observaciones Adicionales
              </Label>

              <Textarea
                id="observaciones"
                rows={3}
                maxLength={300}
                value={form.observaciones}
                onChange={(e) =>
                  updateField("observaciones", e.target.value)
                }
                className="resize-none focus-visible:ring-indigo-500"
              />

              <div className="text-right text-xs text-gray-500 mt-2">
                {form.observaciones.length}/300
              </div>
            </div>

          </div>
        </section>

        {/* Section 4: Multimedia */}
        <section>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-[#d4a84b]/20 text-[#d4a84b] flex items-center justify-center text-sm font-bold">4</span>
            Foto Principal (Afiche / Banner)
          </h3>

          <div className="grid gap-6 md:grid-cols-2 mb-8">
            {/* Dropzone */}
            <div
              onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors flex flex-col items-center justify-center min-h-[200px] ${dragActive ? "border-[#10b981] bg-[#10b981]/5" : "border-gray-300 hover:border-gray-400"}`}
            >
              <input type="file" accept="image/*" onChange={handleFileSelect} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                <Upload className="h-6 w-6 text-gray-400" />
              </div>
              <p className="text-sm font-medium text-gray-700">Arrastra y suelta el afiche principal aquí</p>
              <p className="text-xs text-gray-500 mt-1">o haz clic para buscar en tu equipo</p>
            </div>

            {/* Preview Area */}
            <div className="border border-gray-200 rounded-lg p-4 bg-slate-50 flex items-center justify-center min-h-[200px] flex-col">
              {(previewMainUrl || form.urlFotoExistente || (editingEvent?.imageUrl && !form.urlFoto)) ? (
                <div className="relative group w-full h-full max-h-[250px] rounded-lg overflow-hidden shadow-sm">
                  {previewMainUrl && <div className="absolute top-2 left-2 bg-[#10b981] text-white text-[10px] font-bold px-2 py-0.5 rounded-sm z-10">NUEVA</div>}
                  <img
                    src={previewMainUrl || gdriveUrl(form.urlFotoExistente || editingEvent?.imageUrl || "")}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button type="button" onClick={removeMainImage} className="bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors shadow-lg">
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-400">
                  <ImageIcon className="h-10 w-10 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No hay afiche seleccionado</p>
                </div>
              )}
            </div>
          </div>

          <h3 className="text-md font-semibold text-gray-900 mb-4 flex items-center gap-2">
            Galería Adicional (Opcional)
          </h3>

          <div className="space-y-4 rounded-lg border border-gray-200 bg-slate-50 p-4">
            {/* Galería Existente */}
            {editingEvent && editingEvent.fotos.length > 0 && (
              <div className="space-y-4 mb-6">
                <div>
                  <h4 className="flex items-center gap-2 text-base font-semibold text-gray-800">
                    <Images className="w-5 h-5 text-emerald-600" />
                    Galería Guardada
                  </h4>

                  <p className="text-sm text-gray-500 mt-1">
                    Haz clic en la <X className="inline h-3 w-3" /> para eliminar una imagen.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-5">
                  {editingEvent.fotos.map((foto) => (
                    <div
                      key={foto.id}
                      className="border border-gray-200 rounded-lg p-2 bg-slate-50 flex items-center justify-center"
                    >
                      <div className="relative group w-full aspect-square rounded-lg overflow-hidden shadow-sm">

                        {/* Badge */}
                        <div className="absolute top-2 left-2 bg-[#10b981] text-white text-[10px] font-bold px-2 py-0.5 rounded-sm z-10">
                          GUARDADA
                        </div>

                        <img
                          src={gdriveUrl(foto.url)}
                          alt=""
                          loading="lazy"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />

                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            type="button"
                            onClick={() => toggleFotoEliminar(foto.id)}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors shadow-lg">
                            <X className="h-5 w-5" />
                          </button>

                        </div>

                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Agregar Nuevas a Galería */}
            <div className="space-y-5">
              <div>
                <Label className="flex items-center gap-2 text-base font-semibold text-gray-800">
                  <Images className="w-5 h-5 text-indigo-500" />
                  Galería del Evento
                </Label>
                <p className="text-sm text-gray-500 mt-1">
                  Agrega fotografías adicionales para mostrar los mejores momentos del evento.
                </p>
              </div>
              <label
                className="group relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-gradient-to-br from-gray-50 to-white p-10 transition-all hover:border-indigo-400 hover:bg-indigo-50/30 hover:shadow-lg"
              >
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleGallerySelect}
                  className="hidden"
                />
                <div className="w-16 h-16 rounded-2xl bg-indigo-100 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <Images className="w-8 h-8 text-indigo-600" />
                </div>

                <h4 className="font-semibold text-gray-800 text-lg">
                  Arrastra imágenes aquí
                </h4>
                <p className="text-sm text-gray-500 mt-2">
                  o haz clic para seleccionar archivos
                </p>
                <div className="mt-5 text-xs text-gray-400">
                  PNG · JPG · JPEG · WEBP
                </div>
              </label>
            </div>
          </div>

        </section>


        {/* Acciones Finales */}
        <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
          <Button type="button" variant="outline" onClick={onBack} className="cursor-pointer">
            Cancelar
          </Button>
          <Button type="submit" disabled={isSaving} className="bg-[#10b981] hover:bg-[#059669] text-white min-w-[140px] cursor-pointer">
            {isSaving ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Guardando...</>
            ) : (
              <><CheckCircle2 className="mr-2 h-4 w-4" /> {editingEvent ? "Actualizar Evento" : "Crear Registro"}</>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}