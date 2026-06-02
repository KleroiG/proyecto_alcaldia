"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {Select,SelectContent,SelectItem,SelectTrigger,SelectValue,} from "@/components/ui/select"
import { X, Upload, ArrowLeft, Loader2, ImageIcon, Plus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { Prestador } from "../prestadores_servicios/types"
import type { Guia } from "../prestadores_servicios/seccion-guia"

type FormType = "prestador" | "guia"

interface PrestadorFormProps {
    prestador?: Prestador | null
    guia?: Guia | null
    formType: FormType
    onBack: () => void
    onSavePrestador: (data: Partial<Prestador> & { imageFiles?: File[], fotosAEliminar?: number[] }) => Promise<void>
    onSaveGuia: (data: Partial<Guia>) => Promise<void>
}

interface ImageFile {
    id: string
    file: File
    preview: string
}

const categorias = ["Hotel", "Restaurante", "Agencia"]
const idiomasDisponibles = ["Español", "Inglés", "Francés", "Alemán", "Italiano", "Portugués"]
const especialidadesDisponibles = [
    "Historia y cultura",
    "Naturaleza y ecoturismo",
    "Aventura",
    "Arqueología",
    "Gastronomía",
    "Fotografía",
    "Senderismo",
    "Observación de aves",
]

export function PrestadorForm({
    prestador,
    guia,
    formType,
    onBack,
    onSavePrestador,
    onSaveGuia
}: PrestadorFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [newImages, setNewImages] = useState<ImageFile[]>([])
    const [existingImages, setExistingImages] = useState<any[]>(prestador?.fotosOriginales || [])
    const [fotosAEliminar, setFotosAEliminar] = useState<number[]>([])
    const [errors, setErrors] = useState<Record<string, boolean>>({})
    const [dragActive, setDragActive] = useState(false)
    const [charCount, setCharCount] = useState(prestador?.descripcion?.length || 0)
    const [currentFormType, setCurrentFormType] = useState<FormType>(formType)

    // Prestador form data
    const [prestadorData, setPrestadorData] = useState({
        nombre: prestador?.nombre || "",
        descripcion: prestador?.descripcion || "",
        categoria: prestador?.categoria || "",
        horario: prestador?.horario || "",
        telefono: prestador?.telefono || "",
        email: prestador?.email || "",
        whatsapp: prestador?.whatsapp || "",
        instagram: prestador?.instagram || "",
        facebook: prestador?.facebook || "",
        website: prestador?.website || "",
        direccion: prestador?.direccion || "",
    })

    // Guia form data
    const [guiaData, setGuiaData] = useState({
        nombre: guia?.nombre || "",
        apellido: guia?.apellido || "",
        documento: guia?.documento || "",
        tipo_documento: guia?.tipo_documento || "CC",
        telefono: guia?.telefono || "",
        email: guia?.email || "",
        direccion: guia?.direccion || "",
        idiomas: guia?.idiomas || [] as string[],
        especialidades: guia?.especialidades || [] as string[],
    })

    const handlePrestadorChange = (field: string, value: string) => {
        setPrestadorData((prev) => ({ ...prev, [field]: value }))
        if (errors[field]) setErrors((prev) => ({ ...prev, [field]: false }))
        if (field === "descripcion") setCharCount(value.length)
    }

    const handleGuiaChange = (field: string, value: string | string[]) => {
        setGuiaData((prev) => ({ ...prev, [field]: value }))
        if (errors[field]) setErrors((prev) => ({ ...prev, [field]: false }))
    }

    const toggleIdioma = (idioma: string) => {
        setGuiaData((prev) => ({
            ...prev,
            idiomas: prev.idiomas.includes(idioma)
                ? prev.idiomas.filter((i) => i !== idioma)
                : [...prev.idiomas, idioma],
        }))
    }

    const toggleEspecialidad = (esp: string) => {
        setGuiaData((prev) => ({
            ...prev,
            especialidades: prev.especialidades.includes(esp)
                ? prev.especialidades.filter((e) => e !== esp)
                : [...prev.especialidades, esp],
        }))
    }

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true)
        } else if (e.type === "dragleave") {
            setDragActive(false)
        }
    }, [])

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)
        const files = Array.from(e.dataTransfer.files).filter((file) =>
            file.type.startsWith("image/")
        )
        addImages(files)
    }, [])

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files)
            addImages(files)
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

    const removeNewImage = (id: string) => {
        setNewImages((prev) => {
            const imageToRemove = prev.find((img) => img.id === id)
            if (imageToRemove) URL.revokeObjectURL(imageToRemove.preview)
            return prev.filter((img) => img.id !== id)
        })
    }

    const removeExistingImage = (idFoto: number) => {
        setExistingImages((prev) => prev.filter((img) => img.id_foto !== idFoto))
        setFotosAEliminar((prev) => [...prev, idFoto])
    }

    const validatePrestadorForm = () => {
        const newErrors: Record<string, boolean> = {}
        if (!prestadorData.nombre.trim()) newErrors.nombre = true
        if (!prestadorData.descripcion.trim()) newErrors.descripcion = true
        if (!prestadorData.categoria) newErrors.categoria = true
        if (!prestadorData.direccion.trim()) newErrors.direccion = true
        if (!prestadorData.telefono.trim()) newErrors.telefono = true
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const validateGuiaForm = () => {
        const newErrors: Record<string, boolean> = {}
        if (!guiaData.nombre.trim()) newErrors.nombre = true
        if (!guiaData.apellido.trim()) newErrors.apellido = true
        if (!guiaData.documento.trim()) newErrors.documento = true
        if (!guiaData.telefono.trim()) newErrors.telefono = true
        if (!guiaData.email.trim()) newErrors.email = true
        if (guiaData.idiomas.length === 0) newErrors.idiomas = true
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (currentFormType === "prestador") {
            if (!validatePrestadorForm()) return
            setIsSubmitting(true)
            try {
                // Extraemos los archivos físicos del estado 'images'
                const imageFiles = newImages.map((img) => img.file)

                await onSavePrestador({
                    ...prestadorData,
                    categoria: prestadorData.categoria as "Hotel" | "Restaurante" | "Agencia",
                    imageFiles, // <--- Pasamos los archivos físicos
                })
            } finally {
                setIsSubmitting(false)
            }
        } else {
            if (!validateGuiaForm()) return
            setIsSubmitting(true)
            try {
                await onSaveGuia({
                    ...guiaData,
                    fecha_registro: guia?.fecha_registro || new Date().toISOString(),
                    numero_tarjeta: guia?.numero_tarjeta || `GT-${Date.now().toString().slice(-8)}`,
                })
            } finally {
                setIsSubmitting(false)
            }
        }
    }

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
                    <div className="flex-1">
                        <h2 className="text-xl font-bold text-white">
                            {currentFormType === "guia"
                                ? guia ? "Editar Guía Turístico" : "Nuevo Guía Turístico"
                                : prestador ? "Editar Prestador" : "Nuevo Prestador"}
                        </h2>
                        <p className="text-white/70 text-sm">
                            {currentFormType === "guia"
                                ? "Registra la información del guía turístico"
                                : "Registra la información del prestador de servicios"}
                        </p>
                    </div>
                </div>
            </div>

            {/* Form Type Selector (only for new entries) */}
            {!prestador && !guia && (
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">
                        Tipo de Registro
                    </Label>
                    <div className="flex gap-2">
                        <Button
                            type="button"
                            variant={currentFormType === "prestador" ? "default" : "outline"}
                            onClick={() => setCurrentFormType("prestador")}
                            className={currentFormType === "prestador" ? "bg-[#6b1d1d] hover:bg-[#5a1919]" : ""}
                        >
                            Hotel / Restaurante / Agencia
                        </Button>
                        <Button
                            type="button"
                            variant={currentFormType === "guia" ? "default" : "outline"}
                            onClick={() => setCurrentFormType("guia")}
                            className={currentFormType === "guia" ? "bg-[#6b1d1d] hover:bg-[#5a1919]" : ""}
                        >
                            Guía Turístico
                        </Button>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="p-6 space-y-8">
                {currentFormType === "prestador" ? (
                    <>
                        {/* Section 1: Basic Info - Prestador */}
                        <section>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-full bg-[#d4a84b]/20 text-[#d4a84b] flex items-center justify-center text-sm font-bold">
                                    1
                                </span>
                                Información Básica
                            </h3>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="nombre" className="text-gray-700">
                                        Nombre del Establecimiento <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="nombre"
                                        value={prestadorData.nombre}
                                        onChange={(e) => handlePrestadorChange("nombre", e.target.value)}
                                        placeholder="Ej: Hotel Plaza Sogamoso"
                                        className={errors.nombre ? "border-red-500 focus-visible:ring-red-500" : ""}
                                    />
                                    {errors.nombre && (
                                        <p className="text-red-500 text-xs">Este campo es obligatorio</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="categoria" className="text-gray-700">
                                        Categoría <span className="text-red-500">*</span>
                                    </Label>
                                    <Select
                                        value={prestadorData.categoria}
                                        onValueChange={(value) => handlePrestadorChange("categoria", value)}
                                    >
                                        <SelectTrigger className={errors.categoria ? "border-red-500" : ""}>
                                            <SelectValue placeholder="Selecciona una categoría" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categorias.map((cat) => (
                                                <SelectItem key={cat} value={cat}>
                                                    {cat}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.categoria && (
                                        <p className="text-red-500 text-xs">Selecciona una categoría</p>
                                    )}
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="descripcion" className="text-gray-700">
                                        Descripción <span className="text-red-500">*</span>
                                    </Label>
                                    <Textarea
                                        id="descripcion"
                                        value={prestadorData.descripcion}
                                        onChange={(e) => handlePrestadorChange("descripcion", e.target.value)}
                                        placeholder="Describe el establecimiento..."
                                        rows={4}
                                        maxLength={500}
                                        className={errors.descripcion ? "border-red-500 focus-visible:ring-red-500" : ""}
                                    />
                                    <div className="flex justify-between text-xs">
                                        {errors.descripcion ? (
                                            <p className="text-red-500">Este campo es obligatorio</p>
                                        ) : (
                                            <span />
                                        )}
                                        <span className="text-gray-500">{charCount}/500 caracteres</span>
                                    </div>
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="direccion" className="text-gray-700">
                                        Dirección <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="direccion"
                                        value={prestadorData.direccion}
                                        onChange={(e) => handlePrestadorChange("direccion", e.target.value)}
                                        placeholder="Ej: Carrera 11 # 14-45, Centro"
                                        className={errors.direccion ? "border-red-500 focus-visible:ring-red-500" : ""}
                                    />
                                    {errors.direccion && (
                                        <p className="text-red-500 text-xs">Este campo es obligatorio</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="horario" className="text-gray-700">
                                        Horarios de Atención
                                    </Label>
                                    <Input
                                        id="horario"
                                        value={prestadorData.horario}
                                        onChange={(e) => handlePrestadorChange("horario", e.target.value)}
                                        placeholder="Ej: Lunes a Domingo 6:00 AM - 10:00 PM"
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Section 2: Contact - Prestador */}
                        <section>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-full bg-[#d4a84b]/20 text-[#d4a84b] flex items-center justify-center text-sm font-bold">
                                    2
                                </span>
                                Contacto y Redes Sociales
                            </h3>
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                <div className="space-y-2">
                                    <Label htmlFor="telefono" className="text-gray-700">
                                        Teléfono <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="telefono"
                                        value={prestadorData.telefono}
                                        onChange={(e) => handlePrestadorChange("telefono", e.target.value)}
                                        placeholder="Ej: +57 8 7700000"
                                        className={errors.telefono ? "border-red-500 focus-visible:ring-red-500" : ""}
                                    />
                                    {errors.telefono && (
                                        <p className="text-red-500 text-xs">Este campo es obligatorio</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-gray-700">
                                        Correo Electrónico
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={prestadorData.email}
                                        onChange={(e) => handlePrestadorChange("email", e.target.value)}
                                        placeholder="correo@ejemplo.com"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="whatsapp" className="text-gray-700">
                                        WhatsApp
                                    </Label>
                                    <Input
                                        id="whatsapp"
                                        value={prestadorData.whatsapp}
                                        onChange={(e) => handlePrestadorChange("whatsapp", e.target.value)}
                                        placeholder="Ej: +57 300 0000000"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="instagram" className="text-gray-700">
                                        Instagram
                                    </Label>
                                    <Input
                                        id="instagram"
                                        value={prestadorData.instagram}
                                        onChange={(e) => handlePrestadorChange("instagram", e.target.value)}
                                        placeholder="@usuario"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="facebook" className="text-gray-700">
                                        Facebook
                                    </Label>
                                    <Input
                                        id="facebook"
                                        value={prestadorData.facebook}
                                        onChange={(e) => handlePrestadorChange("facebook", e.target.value)}
                                        placeholder="facebook.com/pagina"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="website" className="text-gray-700">
                                        Sitio Web
                                    </Label>
                                    <Input
                                        id="website"
                                        value={prestadorData.website}
                                        onChange={(e) => handlePrestadorChange("website", e.target.value)}
                                        placeholder="https://www.ejemplo.com"
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Section 3: Images - Prestador */}
                        <section>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-full bg-[#d4a84b]/20 text-[#d4a84b] flex items-center justify-center text-sm font-bold">
                                    3
                                </span>
                                Galería de Imágenes
                            </h3>

                            <div
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                                className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${dragActive
                                        ? "border-[#10b981] bg-[#10b981]/5"
                                        : "border-gray-300 hover:border-gray-400"
                                    }`}
                            >
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleFileSelect}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    aria-label="Seleccionar imágenes"
                                />
                                <div className="flex flex-col items-center gap-2">
                                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                                        <Upload className="h-6 w-6 text-gray-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-700">
                                            Arrastra y suelta imágenes aquí
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            o haz clic para seleccionar archivos
                                        </p>
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
                                                src={
                                                    img.url_foto?.includes("drive.google.com")
                                                        ? `https://drive.google.com/thumbnail?sz=w1000&id=${img.url_foto.match(/(?:id=|\/d\/)([a-zA-Z0-9_-]+)/)?.[1] || ""}`
                                                        : (img.url_foto || img.url)
                                                }
                                                alt="Imagen guardada"
                                                className="w-full h-full object-cover"
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
                    </>
                ) : (
                    <>
                        {/* Section 1: Personal Info - Guia */}
                        <section>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-full bg-[#d4a84b]/20 text-[#d4a84b] flex items-center justify-center text-sm font-bold">
                                    1
                                </span>
                                Información Personal
                            </h3>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="guia-nombre" className="text-gray-700">
                                        Nombres <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="guia-nombre"
                                        value={guiaData.nombre}
                                        onChange={(e) => handleGuiaChange("nombre", e.target.value)}
                                        placeholder="Ej: Juan Carlos"
                                        className={errors.nombre ? "border-red-500 focus-visible:ring-red-500" : ""}
                                    />
                                    {errors.nombre && (
                                        <p className="text-red-500 text-xs">Este campo es obligatorio</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="guia-apellido" className="text-gray-700">
                                        Apellidos <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="guia-apellido"
                                        value={guiaData.apellido}
                                        onChange={(e) => handleGuiaChange("apellido", e.target.value)}
                                        placeholder="Ej: Pérez González"
                                        className={errors.apellido ? "border-red-500 focus-visible:ring-red-500" : ""}
                                    />
                                    {errors.apellido && (
                                        <p className="text-red-500 text-xs">Este campo es obligatorio</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="tipo-documento" className="text-gray-700">
                                        Tipo de Documento
                                    </Label>
                                    <Select
                                        value={guiaData.tipo_documento}
                                        onValueChange={(value) => handleGuiaChange("tipo_documento", value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Tipo de documento" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="CC">Cédula de Ciudadanía</SelectItem>
                                            <SelectItem value="CE">Cédula de Extranjería</SelectItem>
                                            <SelectItem value="PA">Pasaporte</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="documento" className="text-gray-700">
                                        Número de Documento <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="documento"
                                        value={guiaData.documento}
                                        onChange={(e) => handleGuiaChange("documento", e.target.value)}
                                        placeholder="Ej: 1234567890"
                                        className={errors.documento ? "border-red-500 focus-visible:ring-red-500" : ""}
                                    />
                                    {errors.documento && (
                                        <p className="text-red-500 text-xs">Este campo es obligatorio</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="guia-telefono" className="text-gray-700">
                                        Teléfono <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="guia-telefono"
                                        value={guiaData.telefono}
                                        onChange={(e) => handleGuiaChange("telefono", e.target.value)}
                                        placeholder="Ej: +57 300 0000000"
                                        className={errors.telefono ? "border-red-500 focus-visible:ring-red-500" : ""}
                                    />
                                    {errors.telefono && (
                                        <p className="text-red-500 text-xs">Este campo es obligatorio</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="guia-email" className="text-gray-700">
                                        Correo Electrónico <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="guia-email"
                                        type="email"
                                        value={guiaData.email}
                                        onChange={(e) => handleGuiaChange("email", e.target.value)}
                                        placeholder="correo@ejemplo.com"
                                        className={errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}
                                    />
                                    {errors.email && (
                                        <p className="text-red-500 text-xs">Este campo es obligatorio</p>
                                    )}
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="guia-direccion" className="text-gray-700">
                                        Dirección de Residencia
                                    </Label>
                                    <Input
                                        id="guia-direccion"
                                        value={guiaData.direccion}
                                        onChange={(e) => handleGuiaChange("direccion", e.target.value)}
                                        placeholder="Ej: Carrera 11 # 14-45, Sogamoso"
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Section 2: Skills - Guia */}
                        <section>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-full bg-[#d4a84b]/20 text-[#d4a84b] flex items-center justify-center text-sm font-bold">
                                    2
                                </span>
                                Habilidades y Especialidades
                            </h3>

                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <Label className={`text-gray-700 ${errors.idiomas ? "text-red-500" : ""}`}>
                                        Idiomas que domina <span className="text-red-500">*</span>
                                    </Label>
                                    <div className="flex flex-wrap gap-2">
                                        {idiomasDisponibles.map((idioma) => (
                                            <Badge
                                                key={idioma}
                                                variant={guiaData.idiomas.includes(idioma) ? "default" : "outline"}
                                                className={`cursor-pointer transition-colors ${guiaData.idiomas.includes(idioma)
                                                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                                                    : "hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300"
                                                    }`}
                                                onClick={() => toggleIdioma(idioma)}
                                            >
                                                {guiaData.idiomas.includes(idioma) && (
                                                    <Plus className="h-3 w-3 mr-1 rotate-45" />
                                                )}
                                                {idioma}
                                            </Badge>
                                        ))}
                                    </div>
                                    {errors.idiomas && (
                                        <p className="text-red-500 text-xs">Selecciona al menos un idioma</p>
                                    )}
                                </div>

                                <div className="space-y-3">
                                    <Label className="text-gray-700">
                                        Especialidades turísticas
                                    </Label>
                                    <div className="flex flex-wrap gap-2">
                                        {especialidadesDisponibles.map((esp) => (
                                            <Badge
                                                key={esp}
                                                variant={guiaData.especialidades.includes(esp) ? "default" : "outline"}
                                                className={`cursor-pointer transition-colors ${guiaData.especialidades.includes(esp)
                                                    ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                                                    : "hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300"
                                                    }`}
                                                onClick={() => toggleEspecialidad(esp)}
                                            >
                                                {guiaData.especialidades.includes(esp) && (
                                                    <Plus className="h-3 w-3 mr-1 rotate-45" />
                                                )}
                                                {esp}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </section>
                    </>
                )}

                {/* Form Actions */}
                <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
                    <Button type="button" variant="outline" onClick={onBack}>
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-[#10b981] hover:bg-[#059669] text-white min-w-[140px]"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Guardando...
                            </>
                        ) : (
                            <>
                                <ImageIcon className="mr-2 h-4 w-4" />
                                {currentFormType === "guia"
                                    ? guia ? "Actualizar Guía" : "Registrar Guía"
                                    : prestador ? "Actualizar" : "Crear Prestador"}
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    )
}
