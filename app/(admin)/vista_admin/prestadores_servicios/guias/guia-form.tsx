"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Loader2, ArrowLeft, Save, Compass, Plus } from "lucide-react"
import type { Guia } from "../types"
import { motion } from "framer-motion"

interface GuiaFormProps {
    guia?: Guia | null
    onBack: () => void
    onSave: (data: Partial<Guia>) => Promise<void>
}

const idiomasDisponibles = ["Español", "Inglés", "Francés", "Alemán", "Italiano", "Portugués", "Japones", "Mandarin", "Hindi","Lengua de Señas Colombiana"]

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

export function GuiaForm({ guia, onBack, onSave }: GuiaFormProps) {

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [errors, setErrors] = useState<Record<string, boolean>>({})

    // Mapeo adaptado a los atributos exactos de la BD
    const [data, setData] = useState({
        nombre: guia?.nombre || "",
        n_cedula: (guia as any)?.n_cedula || (guia as any)?.documento || "",
        celular: guia?.telefono || "",
        correo: guia?.correo || (guia as any)?.email || "",
        rnt: (guia as any)?.rnt || (guia as any)?.numero_tarjeta || "",
        años_experiencia: (guia as any)?.años_experiencia || 0,

        // Arrays para etiquetas
        idiomas: Array.isArray(guia?.idiomas) ? guia.idiomas : (typeof guia?.idiomas === 'string' ? (guia?.idiomas as string).split(',') : []),
        especialidad: Array.isArray(guia?.especialidades) ? guia.especialidades : (typeof (guia as any)?.especialidad === 'string' ? ((guia as any)?.especialidad as string).split(',') : []),

        principales_atractivos: (guia as any)?.principales_atractivos || "",
        disponibilidad_habitual: (guia as any)?.disponibilidad_habitual || "",
        competencias_adicionales: (guia as any)?.competencias_adicionales || "",
        publico_tiene_experiencia: (guia as any)?.publico_tiene_experiencia || "",
        asociacion: (guia as any)?.asociacion || "",
    })

    type DataKeys = keyof typeof data

    const setField = <K extends DataKeys>(key: K, value: typeof data[K]) => {
        setData((prev) => ({ ...prev, [key]: value }))
        if (errors[key]) setErrors((prev) => ({ ...prev, [key]: false }))
    }

    const toggleArrayField = (field: 'idiomas' | 'especialidad', item: string) => {
        setData(prev => ({
            ...prev,
            [field]: prev[field].includes(item)
                ? (prev[field] as string[]).filter(i => i !== item)
                : [...(prev[field] as string[]), item]
        }))
        if (errors[field]) setErrors((prev) => ({ ...prev, [field]: false }))
    }

    const getString = (key: DataKeys) => String(data[key] ?? "")
    const getNumber = (key: DataKeys) => Number(data[key] ?? 0)

    const validate = () => {
        const newErrors: Record<string, boolean> = {}

        if (!getString("nombre").trim()) newErrors.nombre = true
        if (!getString("n_cedula").trim()) newErrors.n_cedula = true
        if (!getString("celular").trim()) newErrors.celular = true
        if (!getString("correo").trim()) newErrors.correo = true
        if (data.idiomas.length === 0) newErrors.idiomas = true

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
                categoria: "Guia" as const,
            } as any)
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
                            <Compass className="h-7 w-7" />
                            {guia ? "Editar Guía Turístico" : "Nuevo Guía Turístico"}
                        </h2>
                        <p className="text-white/80 mt-1">
                            Gestión del talento humano y guianzas
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

                {/* 1. INFORMACIÓN PERSONAL Y LEGAL */}
                <motion.section
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="bg-white p-6 rounded-2xl border shadow-sm"
                >
                    <h3 className="text-lg font-semibold mb-4">
                        Información Personal
                    </h3>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">

                        <motion.div variants={item}>
                            <Label>Nombres y Apellidos *</Label>
                            <Input
                                placeholder="Juan Pérez"
                                value={getString("nombre")}
                                onChange={(e) => setField("nombre", e.target.value)}
                                className={`h-11 rounded-xl placeholder:text-gray-300 ${errors.nombre ? "border-red-500" : ""}`}
                            />
                        </motion.div>

                        <motion.div variants={item}>
                            <Label>N° Cédula / Documento *</Label>
                            <Input
                                placeholder="1234567890"
                                value={getString("n_cedula")}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, "")
                                    setField("n_cedula", value)
                                }}
                                className={`h-11 rounded-xl placeholder:text-gray-300 ${errors.n_cedula ? "border-red-500" : ""}`}
                            />
                        </motion.div>

                        <motion.div variants={item}>
                            <Label>RNT (Registro Nacional de Turismo)</Label>
                            <Input
                                placeholder="12345"
                                value={getString("rnt")}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, "")
                                    setField("rnt", value)
                                }}
                                className="h-11 rounded-xl placeholder:text-gray-300"
                            />
                        </motion.div>

                        <motion.div variants={item}>
                            <Label>Celular *</Label>
                            <Input
                                placeholder="3001234567"
                                value={getString("celular")}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, "")
                                    setField("celular", value)
                                }}
                                className={`h-11 rounded-xl placeholder:text-gray-300 ${errors.celular ? "border-red-500" : ""}`}
                            />
                        </motion.div>

                        <motion.div variants={item}>
                            <Label>Correo Electrónico *</Label>
                            <Input
                                type="email"
                                placeholder="guia@email.com"
                                value={getString("correo")}
                                onChange={(e) => setField("correo", e.target.value)}
                                className={`h-11 rounded-xl placeholder:text-gray-300 ${errors.correo ? "border-red-500" : ""}`}
                            />
                        </motion.div>

                        <motion.div variants={item}>
                            <Label>Asociación o Gremio</Label>
                            <Input
                                placeholder="Ej: Corpoguias, Anato..."
                                value={getString("asociacion")}
                                onChange={(e) => setField("asociacion", e.target.value)}
                                className="h-11 rounded-xl placeholder:text-gray-300"
                            />
                        </motion.div>

                    </div>
                </motion.section>

                {/* 2. PERFIL PROFESIONAL */}
                <motion.section
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="bg-white p-6 rounded-2xl border shadow-sm"
                >
                    <h3 className="text-lg font-semibold mb-4">
                        Perfil Profesional
                    </h3>

                    <div className="grid md:grid-cols-3 gap-4">
                        <motion.div variants={item}>
                            <Label>Años de Experiencia</Label>
                            <Input
                                type="number"
                                placeholder="5"
                                value={getNumber("años_experiencia")}
                                onChange={(e) => {
                                    const value = Math.max(0, Number(e.target.value))
                                    setField("años_experiencia", value)
                                }}
                                className="h-11 rounded-xl placeholder:text-gray-300"
                            />
                        </motion.div>

                        <motion.div variants={item}>
                            <Label>Disponibilidad Habitual</Label>
                            <Input
                                placeholder="Ej: Fines de semana, Tiempo completo..."
                                value={getString("disponibilidad_habitual")}
                                onChange={(e) => setField("disponibilidad_habitual", e.target.value)}
                                className="h-11 rounded-xl placeholder:text-gray-300"
                            />
                        </motion.div>

                        <motion.div variants={item}>
                            <Label>Público de Experiencia</Label>
                            <Input
                                placeholder="Ej: Extranjeros, Tercera edad, Estudiantes..."
                                value={getString("publico_tiene_experiencia")}
                                onChange={(e) => setField("publico_tiene_experiencia", e.target.value)}
                                className="h-11 rounded-xl placeholder:text-gray-300"
                            />
                        </motion.div>
                    </div>
                </motion.section>

                {/* 3. HABILIDADES Y ESPECIALIDADES (BADGES) */}
                <motion.section className="bg-white p-6 rounded-2xl border">
                    <h3 className="text-lg font-semibold mb-4">
                        Habilidades y Especialidades
                    </h3>

                    <div className="space-y-6">
                        {/* IDIOMAS */}
                        <div>
                            <Label className={`text-sm font-medium ${errors.idiomas ? "text-red-500" : "text-gray-700"}`}>
                                Idiomas Dominados *
                            </Label>
                            <div className="flex flex-wrap gap-2 mt-3">
                                {idiomasDisponibles.map((idioma) => {
                                    const isSelected = data.idiomas.includes(idioma)
                                    return (
                                        <Badge
                                            key={idioma}
                                            onClick={() => toggleArrayField('idiomas', idioma)}
                                            className={`cursor-pointer px-4 py-2 rounded-xl transition-all duration-200 border-transparent ${isSelected
                                                    ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md scale-105"
                                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                                }`}
                                        >
                                            <span className="flex items-center gap-1 text-sm">
                                                {isSelected && <Plus className="h-3 w-3 rotate-45 transition-transform" />}
                                                {idioma}
                                            </span>
                                        </Badge>
                                    )
                                })}
                            </div>
                            {errors.idiomas && <p className="text-red-500 text-xs mt-2">Debe seleccionar al menos un idioma.</p>}
                        </div>

                        <div className="w-full h-px bg-gray-100 my-4" />

                        {/* ESPECIALIDADES */}
                        <div>
                            <Label className="text-sm font-medium text-gray-700">
                                Especialidades Turísticas
                            </Label>
                            <div className="flex flex-wrap gap-2 mt-3">
                                {especialidadesDisponibles.map((esp) => {
                                    const isSelected = data.especialidad.includes(esp)
                                    return (
                                        <Badge
                                            key={esp}
                                            onClick={() => toggleArrayField('especialidad', esp)}
                                            className={`cursor-pointer px-4 py-2 rounded-xl transition-all duration-200 border-transparent ${isSelected
                                                    ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md scale-105"
                                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                                }`}
                                        >
                                            <span className="flex items-center gap-1 text-sm">
                                                {isSelected && <Plus className="h-3 w-3 rotate-45 transition-transform" />}
                                                {esp}
                                            </span>
                                        </Badge>
                                    )
                                })}
                            </div>
                        </div>

                    </div>
                </motion.section>

                {/* 4. OPERACIÓN Y COMPETENCIAS (TEXTAREAS) */}
                <motion.section
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="bg-white p-6 rounded-2xl border shadow-sm"
                >
                    <h3 className="text-lg font-semibold mb-4">
                        Operación Turística
                    </h3>

                    <div className="grid md:grid-cols-2 gap-6">
                        <motion.div variants={item}>
                            <Label>Principales Atractivos o Rutas</Label>
                            <Textarea
                                placeholder="Menciona las rutas o atractivos en los que más opera..."
                                value={getString("principales_atractivos")}
                                onChange={(e) => setField("principales_atractivos", e.target.value)}
                                rows={4}
                                className="rounded-xl mt-2 resize-none placeholder:text-gray-300"
                            />
                        </motion.div>

                        <motion.div variants={item}>
                            <Label>Competencias Adicionales</Label>
                            <Textarea
                                placeholder="Ej: Primeros auxilios, RCP, Manejo de cuerdas, Certificaciones SENA..."
                                value={getString("competencias_adicionales")}
                                onChange={(e) => setField("competencias_adicionales", e.target.value)}
                                rows={4}
                                className="rounded-xl mt-2 resize-none placeholder:text-gray-300"
                            />
                        </motion.div>
                    </div>
                </motion.section>


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