"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, ArrowLeft, Save, Utensils } from "lucide-react"
import { GaleriaForm } from "../components/galeria-form"
import type { Restaurante } from "../types"
import { motion } from "framer-motion"

interface ImageFile {
    id: string
    file: File
    preview: string
}

interface RestauranteFormProps {
    restaurante?: Restaurante & { fotosOriginales?: any[] } | null
    onBack: () => void
    onSave: (data: Partial<Restaurante> & { imageFiles?: File[], fotosAEliminar?: number[] }) => Promise<void>
}

export function RestauranteForm({ restaurante, onBack, onSave }: RestauranteFormProps) {

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [errors, setErrors] = useState<Record<string, boolean>>({})

    const [newImages, setNewImages] = useState<ImageFile[]>([])
    const [existingImages, setExistingImages] = useState<any[]>([])
    const [fotosAEliminar, setFotosAEliminar] = useState<number[]>([])

    useEffect(() => {
        if (restaurante?.fotosOriginales) {
            setExistingImages(restaurante.fotosOriginales)
        }
    }, [restaurante])

    const [data, setData] = useState({
        nombre: restaurante?.nombre || "",
        celular: restaurante?.telefono || "",
        correo: restaurante?.correo || "",
        direccion: restaurante?.direccion || "",
        tipo_cocina: restaurante?.tipo_cocina || "",
        horarios: restaurante?.horarios || "",
        propietario: restaurante?.propietario || "",
        capacidad: restaurante?.capacidad || 0,
        platos_principales: restaurante?.platos_principales || "",
        instagram: restaurante?.instagram || "",
        facebook: restaurante?.facebook || "",
        whatsapp: restaurante?.whatsapp || "",
        web: restaurante?.web || "",
    })

    type DataKeys = keyof typeof data

    const setField = <K extends DataKeys>(key: K, value: typeof data[K]) => {
        setData((prev) => ({ ...prev, [key]: value }))
        if (errors[key]) setErrors((prev) => ({ ...prev, [key]: false }))
    }

    const getString = (key: DataKeys) => String(data[key] ?? "")
    const getNumber = (key: DataKeys) => Number(data[key] ?? 0)

    const validate = () => {
        const newErrors: Record<string, boolean> = {}

        if (!getString("nombre").trim()) newErrors.nombre = true
        if (!getString("celular").trim()) newErrors.celular = true
        if (!getString("direccion").trim()) newErrors.direccion = true
        if (!getString("tipo_cocina").trim()) newErrors.tipo_cocina = true

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!validate()) return

        setIsSubmitting(true)

        try {
            await onSave({
                ...data,
                categoria: "Restaurante" as const,
                imageFiles: newImages.map((img) => img.file),
                fotosAEliminar
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    const container = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.08 } }
    }

    const item = {
        hidden: { opacity: 0, y: 15 },
        show: { opacity: 1, y: 0 }
    }

    return (
        <div className="bg-slate-50 rounded-2xl border shadow-lg overflow-hidden">

            {/* HEADER */}
            <div className="relative bg-gradient-to-br from-[#651b1b] via-[#842828] to-[#b83d3d] p-6 overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 blur-3xl rounded-full" />
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 blur-3xl rounded-full" />

                <div className="flex justify-between items-center relative z-10">
                    <div>
                        <h2 className="text-3xl font-bold text-white flex items-center gap-2">
                            <Utensils className="h-7 w-7" />
                            {restaurante ? "Editar Restaurante" : "Nuevo Restaurante"}
                        </h2>
                        <p className="text-white/80 mt-1">
                            Gestión profesional de la oferta gastronómica
                        </p>
                    </div>

                    <Button
                        type="button"
                        onClick={onBack}
                        className="bg-white/10 hover:bg-white/20 text-white rounded-xl"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Volver
                    </Button>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-8">

                {/* 1. INFORMACIÓN GENERAL */}
                <motion.section
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="bg-white p-6 rounded-2xl border shadow-sm"
                >
                    <h3 className="text-lg font-semibold mb-4">
                        Información Comercial
                    </h3>
                    <p className="text-sm text-gray-500 mb-6">
                        Completa la información básica del establecimiento
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        <motion.div variants={item}>
                            <Label>Nombre *</Label>
                            <Input
                                placeholder="Restaurante La Casona"
                                value={getString("nombre")}
                                onChange={(e) => setField("nombre", e.target.value)}
                                className={`h-11 rounded-xl placeholder:text-gray-300 ${errors.nombre ? "border-red-500" : ""}`}
                            />
                        </motion.div>

                        <motion.div variants={item}>
                            <Label>Propietario / Representante</Label>
                            <Input
                                placeholder="María Gómez"
                                value={getString("propietario")}
                                onChange={(e) => setField("propietario", e.target.value)}
                                className="h-11 rounded-xl placeholder:text-gray-300"
                            />
                        </motion.div>

                        <motion.div variants={item}>
                            <Label>Dirección *</Label>
                            <Input
                                placeholder="Cra 14 #12-30 Sogamoso"
                                value={getString("direccion")}
                                onChange={(e) => setField("direccion", e.target.value)}
                                className={`h-11 rounded-xl placeholder:text-gray-300 ${errors.direccion ? "border-red-500" : ""}`}
                            />
                        </motion.div>

                        <motion.div variants={item}>
                            <Label>Capacidad (Personas)</Label>
                            <Input
                                type="number"
                                placeholder="50"
                                value={getNumber("capacidad")}
                                onChange={(e) => {
                                    const value = Math.max(0, Number(e.target.value))
                                    setField("capacidad", value)
                                }}
                                className="h-11 rounded-xl placeholder:text-gray-300"
                            />
                        </motion.div>
                    </div>
                </motion.section>

                {/* 2. PROPUESTA GASTRONÓMICA */}
                <motion.section
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="bg-white p-6 rounded-2xl border shadow-sm"
                >
                    <h3 className="text-lg font-semibold mb-4">
                        Gastronomía y Operación
                    </h3>

                    <div className="grid md:grid-cols-2 gap-4">
                        <motion.div variants={item}>
                            <Label>Tipo de Cocina *</Label>
                            <Input
                                placeholder="Ej: Tradicional boyacense, Internacional, Parrilla..."
                                value={getString("tipo_cocina")}
                                onChange={(e) => setField("tipo_cocina", e.target.value)}
                                className={`h-11 rounded-xl placeholder:text-gray-300 ${errors.tipo_cocina ? "border-red-500" : ""}`}
                            />
                        </motion.div>

                        <motion.div variants={item}>
                            <Label>Horarios de Atención</Label>
                            <Input
                                placeholder="Ej: Lunes a Sábado 11:00 AM - 9:00 PM"
                                value={getString("horarios")}
                                onChange={(e) => setField("horarios", e.target.value)}
                                className="h-11 rounded-xl placeholder:text-gray-300"
                            />
                        </motion.div>

                        <motion.div variants={item} className="md:col-span-2 mt-2">
                            <Label>Platos Principales / Especialidades</Label>
                            <Textarea
                                placeholder="Describe los platos característicos, menús especiales o la esencia de la oferta del restaurante..."
                                value={getString("platos_principales")}
                                onChange={(e) => setField("platos_principales", e.target.value)}
                                rows={3}
                                className="rounded-xl mt-1 resize-none placeholder:text-gray-300"
                            />
                        </motion.div>
                    </div>
                </motion.section>

                {/* 3. CONTACTO Y REDES */}
                <motion.section className="bg-white p-6 rounded-2xl border">
                    <h3 className="text-lg font-semibold mb-4">
                        Contacto y Redes Digitales
                    </h3>

                    <div className="grid md:grid-cols-3 gap-4">

                        <div>
                            <Label>Celular *</Label>
                            <Input
                                value={getString("celular")}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, "")
                                    setField("celular", value)
                                }}
                                className={`h-11 rounded-xl placeholder:text-gray-300 ${errors.celular ? "border-red-500" : ""}`}
                                placeholder="3001234567"
                            />
                        </div>

                        <div>
                            <Label>Correo</Label>
                            <Input
                                placeholder="restaurante@email.com"
                                value={getString("correo")}
                                onChange={(e) => setField("correo", e.target.value)}
                                className="h-11 rounded-xl placeholder:text-gray-300"
                            />
                        </div>

                        <div>
                            <Label>WhatsApp</Label>
                            <Input
                                value={getString("whatsapp")}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, "")
                                    setField("whatsapp", value)
                                }}
                                className="h-11 rounded-xl placeholder:text-gray-300"
                                placeholder="3001234567"
                            />
                        </div>

                        <div>
                            <Label>Instagram</Label>
                            <Input
                                placeholder="@restaurante_ejemplo"
                                value={getString("instagram")}
                                onChange={(e) => setField("instagram", e.target.value)}
                                className="h-11 rounded-xl placeholder:text-gray-300"
                            />
                        </div>

                        <div>
                            <Label>Facebook</Label>
                            <Input
                                placeholder="https://facebook.com/restaurante"
                                value={getString("facebook")}
                                onChange={(e) => setField("facebook", e.target.value)}
                                className="h-11 rounded-xl placeholder:text-gray-300"
                            />
                        </div>

                        <div>
                            <Label>Sitio Web</Label>
                            <Input
                                placeholder="https://restaurante-ejemplo.com"
                                value={getString("web")}
                                onChange={(e) => setField("web", e.target.value)}
                                className="h-11 rounded-xl placeholder:text-gray-300"
                            />
                        </div>

                    </div>
                </motion.section>

                {/* 4. GALERÍA */}
                <GaleriaForm
                    newImages={newImages}
                    setNewImages={setNewImages}
                    existingImages={existingImages}
                    setExistingImages={setExistingImages}
                    fotosAEliminar={fotosAEliminar}
                    setFotosAEliminar={setFotosAEliminar}
                />

                {/* ACCIONES */}
                <div className="flex justify-end gap-4">
                    <Button type="button" variant="outline" onClick={onBack}>
                        Cancelar
                    </Button>

                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-green-600 hover:bg-green-700 text-white rounded-xl px-6"
                    >
                        {isSubmitting ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Save className="w-4 h-4 mr-2" />
                        )}
                        Guardar
                    </Button>
                </div>

            </form>
        </div>
    )
}