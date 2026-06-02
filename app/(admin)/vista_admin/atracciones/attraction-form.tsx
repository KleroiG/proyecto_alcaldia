"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useAlert } from "@/components/global-alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, Upload, ArrowLeft, Loader2, ImageIcon } from "lucide-react"
import { useConfirmation } from "@/components/confirmacion-alert"
import { Attraction } from "./page"


// Ajustamos la interfaz para recibir fotos previas y el array de eliminación
interface AttractionFormProps {
  attraction?: any | null
  onBack: () => void
  onSave: (data: Partial<Attraction> & {
    imageFiles?: File[],
    fotosAEliminar?: number[]
  }) => Promise<void>
}

interface ImageFile {
  id: string
  file: File
  preview: string
}

const categories = [
  "Arqueología",
  "Museo",
  "Parque Tematico",
  "Patrimonio",
  "Sitio Turistico Cultural",
  "Sitio Turistico Natural",
]

export function AttractionForm({ attraction, onBack, onSave }: AttractionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, boolean>>({})
  const [dragActive, setDragActive] = useState(false)
  const [charCount, setCharCount] = useState(attraction?.description?.length || 0)

  //Alertas
  const { showAlert } = useAlert()
  const { confirm } = useConfirmation()

  // 1. ESTADOS PARA LAS IMÁGENES
  // Imágenes que el usuario acaba de seleccionar desde su PC
  const [newImages, setNewImages] = useState<ImageFile[]>([])

  // Imágenes que ya vienen de la base de datos (pasadas desde la tabla)
  const [existingImages, setExistingImages] = useState<any[]>(attraction?.fotosOriginales || [])

  // IDs de las imágenes existentes que el usuario quiere eliminar
  const [fotosAEliminar, setFotosAEliminar] = useState<number[]>([])

  const [formData, setFormData] = useState({
    name: attraction?.name || "",
    description: attraction?.description || "",
    category: attraction?.category || "",
    schedule: attraction?.schedule || "",
    price: attraction?.price || "",
    phone: attraction?.phone || "",
    whatsapp: attraction?.whatsapp || "",
    instagram: attraction?.instagram || "",
    facebook: attraction?.facebook || "",
    website: attraction?.website || "",
    address: attraction?.address || "",
    coordinates: attraction?.coordinates || "",
    mapsLink: attraction?.mapsLink || "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: false }))
    }
    if (field === "description") {
      setCharCount(value.length)
    }
  }

  // --- LÓGICA DE DRAG & DROP ---
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

    const allFiles = Array.from(e.dataTransfer.files)
    const validFiles = allFiles.filter((file) => file.type.startsWith("image/"))

    if (validFiles.length < allFiles.length) {
      showAlert("warning", "Archivos omitidos", "Solo se permiten imágenes. Se ignoraron los formatos no válidos.")
    }

    if (validFiles.length > 0) {
      addImages(validFiles)
    }
  }, [showAlert])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addImages(Array.from(e.target.files))
    }
  }

  const addImages = (files: File[]) => {
    const newFiles = files.map((file) => ({
      id: Math.random().toString(36).substring(7),
      file,
      preview: URL.createObjectURL(file),
    }))
    setNewImages((prev) => [...prev, ...newFiles])
  }

  // --- LÓGICA DE ELIMINACIÓN ---
  const removeNewImage = (id: string) => {
    setNewImages((prev) => {
      const imageToRemove = prev.find((img) => img.id === id)
      if (imageToRemove) URL.revokeObjectURL(imageToRemove.preview)
      return prev.filter((img) => img.id !== id)
    })
  }

  const removeExistingImage = async (idFoto: number) => {
    const ok = await confirm({
      title: "Eliminar fotografía",
      message:
        "Esta imagen se eliminará permanentemente al guardar los cambios.",
      confirmText: "Eliminar",
      cancelText: "Cancelar",
      variant: "danger",
    })

    if (!ok) return

    setExistingImages((prev) =>
      prev.filter((img) => img.id_foto !== idFoto)
    )

    setFotosAEliminar((prev) => [...prev, idFoto])
  }

  // --- VALIDACIÓN Y ENVÍO ---
  const validateForm = () => {
    const newErrors: Record<string, boolean> = {}
    if (!formData.name.trim()) newErrors.name = true
    if (!formData.description.trim()) newErrors.description = true
    if (!formData.category) newErrors.category = true
    if (!formData.address.trim()) newErrors.address = true

    setErrors(newErrors)

    const isValid = Object.keys(newErrors).length === 0

    if (!isValid) {
      showAlert("warning", "Campos obligatorios", "Por favor, completa todos los campos marcados en rojo antes de guardar.")
    }

    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    // Advertencia al momento de actualizar la información (solo cuando existe attraction)
    if (attraction) {
      const seguroActualizar = await confirm({
        title: "Actualizar atractivo",
        message:
          "Se guardarán todos los cambios realizados, incluyendo las fotografías eliminadas.",
        confirmText: "Actualizar",
        cancelText: "Cancelar",
        variant: "warning",
      })
      if (!seguroActualizar) return
    }

    setIsSubmitting(true)
    try {
      const imageFiles = newImages.map((img) => img.file)
      await onSave({
        ...formData,
        imageFiles,
        fotosAEliminar,
      })
      showAlert("success", "Atractivo guardado", "La información se ha registrado correctamente en el sistema.")

    } catch (error) {
      console.error("Error al guardar el atractivo:", error)
      showAlert("error", "Error de conexión", "Ocurrió un problema al intentar guardar los datos. Inténtalo nuevamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const getDriveImage = (url: string) => {
    console.log("URL ORIGINAL:", url);

    const match = url.match(/[-\w]{25,}/);

    console.log("MATCH:", match?.[0]);

    if (!match) return url;

    const finalUrl =
      `https://drive.google.com/thumbnail?id=${match[0]}&sz=w2000`;

    console.log("FINAL URL:", finalUrl);

    return finalUrl;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Form Header */}
      <div className="bg-gradient-to-r from-[#6b1d1d] to-[#8b2d2d] px-6 py-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <div>
            <h2 className="text-xl font-bold text-white">
              {attraction ? "Editar Atractivo" : "Nuevo Atractivo"}
            </h2>
            <p className="text-white/70 text-sm">
              {attraction
                ? "Modifica la información del atractivo turístico"
                : "Registra un nuevo atractivo turístico para el portal"}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-8">
        {/* Section 1: Basic Info */}
        <section>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-[#d4a84b]/20 text-[#d4a84b] flex items-center justify-center text-sm font-bold">
              1
            </span>
            Información Básica
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-700">
                Nombre del Atractivo <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Ej: Museo Arqueológico de Sogamoso"
                className={errors.name ? "border-red-500 focus-visible:ring-red-500" : ""}
              />
              {errors.name && (
                <p className="text-red-500 text-xs">Este campo es obligatorio</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category" className="text-gray-700">
                Categoría <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleInputChange("category", value)}
              >
                <SelectTrigger
                  className={errors.category ? "border-red-500 focus:ring-red-500" : ""}
                >
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-red-500 text-xs">Selecciona una categoría</p>
              )}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description" className="text-gray-700">
                Descripción <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Describe el atractivo turístico de manera detallada..."
                rows={4}
                maxLength={500}
                className={errors.description ? "border-red-500 focus-visible:ring-red-500" : ""}
              />
              <div className="flex justify-between text-xs">
                {errors.description ? (
                  <p className="text-red-500">Este campo es obligatorio</p>
                ) : (
                  <span />
                )}
                <span className="text-gray-500">{charCount}/500 caracteres</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="schedule" className="text-gray-700">
                Horarios de Atención
              </Label>
              <Input
                id="schedule"
                value={formData.schedule}
                onChange={(e) => handleInputChange("schedule", e.target.value)}
                placeholder="Ej: Lunes a Viernes 8:00 AM - 5:00 PM"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price" className="text-gray-700">
                Precios / Tarifas
              </Label>
              <Input
                id="price"
                value={formData.price}
                onChange={(e) => handleInputChange("price", e.target.value)}
                placeholder="Ej: Entrada general $10.000 COP"
              />
            </div>
          </div>
        </section>

        {/* Section 2: Contact & Social */}
        <section>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-[#d4a84b]/20 text-[#d4a84b] flex items-center justify-center text-sm font-bold">
              2
            </span>
            Contacto y Redes Sociales
          </h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-gray-700">
                Teléfono
              </Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => {
                  // Reemplaza todo lo que NO sea un número por un string vacío
                  const limpio = e.target.value.replace(/[^0-9]/g, "")
                  handleInputChange("phone", limpio)
                }}
                placeholder="Ej: 6087700000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="whatsapp" className="text-gray-700">
                WhatsApp
              </Label>
              <Input
                id="whatsapp"
                value={formData.whatsapp}
                onChange={(e) => {
                  // Reemplaza todo lo que NO sea un número por un string vacío
                  const limpio = e.target.value.replace(/[^0-9]/g, "")
                  handleInputChange("whatsapp", limpio)
                }}
                placeholder="Ej: 3100000000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="instagram" className="text-gray-700">
                Instagram
              </Label>
              <Input
                id="instagram"
                value={formData.instagram}
                onChange={(e) => handleInputChange("instagram", e.target.value)}
                placeholder="@usuario"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="facebook" className="text-gray-700">
                Facebook
              </Label>
              <Input
                id="facebook"
                value={formData.facebook}
                onChange={(e) => handleInputChange("facebook", e.target.value)}
                placeholder="https://www.facebook.com/pagina"
              />
            </div>

            <div className="space-y-2 lg:col-span-2">
              <Label htmlFor="website" className="text-gray-700">
                Sitio Web
              </Label>
              <Input
                id="website"
                value={formData.website}
                onChange={(e) => handleInputChange("website", e.target.value)}
                placeholder="https://www.ejemplo.com"
              />
            </div>
          </div>
        </section>

        {/* Section 3: Location */}
        <section>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-[#d4a84b]/20 text-[#d4a84b] flex items-center justify-center text-sm font-bold">
              3
            </span>
            Ubicación Geográfica
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address" className="text-gray-700">
                Dirección Física <span className="text-red-500">*</span>
              </Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                placeholder="Ej: Carrera 9 # 6-45, Centro, Sogamoso"
                className={errors.address ? "border-red-500 focus-visible:ring-red-500" : ""}
              />
              {errors.address && (
                <p className="text-red-500 text-xs">Este campo es obligatorio</p>
              )}
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-[#d4a84b]/20 text-[#d4a84b] flex items-center justify-center text-sm font-bold">4</span>
            Galería de Imágenes
          </h3>

          {/* Dropzone */}
          <div
            onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${dragActive ? "border-[#10b981] bg-[#10b981]/5" : "border-gray-300 hover:border-gray-400"}`}
          >
            <input
              type="file" multiple accept="image/*" onChange={handleFileSelect}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              aria-label="Seleccionar imágenes"
            />
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                <Upload className="h-6 w-6 text-gray-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Arrastra y suelta imágenes aquí</p>
                <p className="text-xs text-gray-500 mt-1">o haz clic para seleccionar archivos</p>
              </div>
            </div>
          </div>

          {/* GALERÍA UNIFICADA: Muestra las imágenes existentes y las nuevas */}
          {(existingImages.length > 0 || newImages.length > 0) && (
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">

              {/* 1. Renderizar imágenes que vienen de la Base de Datos */}
              {existingImages.map((img) => (
                <div key={`existing-${img.id_foto}`} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                  <img
                    src={getDriveImage(img.url_foto || img.url || "")}
                    alt="Imagen"
                    className="w-full h-full object-cover"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-start justify-end p-2">
                    <button
                      type="button"
                      onClick={() => removeExistingImage(img.id_foto)}
                      className="w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                      title="Eliminar de la base de datos"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}

              {/* 2. Renderizar imágenes nuevas a subir */}
              {newImages.map((image, index) => (
                <div key={`new-${image.id}-${index}`} className="relative group aspect-square rounded-lg overflow-hidden border-2 border-[#10b981] shadow-sm">
                  <div className="absolute top-1 left-1 bg-[#10b981] text-white text-[10px] font-bold px-2 py-0.5 rounded-sm z-10">
                    NUEVA
                  </div>
                  <img
                    src={image.preview}
                    alt={`Preview nueva ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-start justify-end p-2">
                    <button
                      type="button"
                      onClick={() => removeNewImage(image.id)}
                      className="w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Form Actions (Sin cambios) */}
        <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
          <Button type="button" variant="outline" onClick={onBack}>Cancelar</Button>
          <Button type="submit" disabled={isSubmitting} className="bg-[#10b981] hover:bg-[#059669] text-white min-w-[140px]">
            {isSubmitting ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Guardando...</>
            ) : (
              <><ImageIcon className="mr-2 h-4 w-4" /> {attraction ? "Actualizar" : "Crear Atractivo"}</>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}