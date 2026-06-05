"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, ArrowLeft, Save, Briefcase } from "lucide-react"
import { GaleriaForm } from "../components/galeria-form"
import type { Agencia } from "../types"
import { motion } from "framer-motion"

interface ImageFile {
    id: string
    file: File
    preview: string
}

interface AgenciaFormProps {
    agencia?: Agencia & { fotosOriginales?: any[] } | null
    onBack: () => void
    onSave: (data: Partial<Agencia> & { imageFiles?: File[], fotosAEliminar?: number[] }) => Promise<void>
}

export function AgenciaForm({ agencia, onBack, onSave }: AgenciaFormProps) {

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [errors, setErrors] = useState<Record<string, boolean>>({})

    const [newImages, setNewImages] = useState<ImageFile[]>([])
    const [existingImages, setExistingImages] = useState<any[]>([])
    const [fotosAEliminar, setFotosAEliminar] = useState<number[]>([])

    useEffect(() => {
        if (agencia?.fotosOriginales) {
            setExistingImages(agencia.fotosOriginales)
        }
    }, [agencia])

    const [data, setData] = useState({
        nombre: agencia?.nombre || "",
        celular: agencia?.telefono || "",
        correo: agencia?.correo || "",
        nit: agencia?.nit || "",
        rnt: agencia?.rnt || "",
        tipo: agencia?.tipo || "",
        representante_legal: agencia?.representante_legal || "",
        n_empleados_asociados: agencia?.n_empleados_asociados || 0,
        especialidad_turistica: agencia?.especialidad_turistica || "",
        destinos_principales: agencia?.destinos_principales || "",
        observaciones: agencia?.observaciones || "",
        instagram: agencia?.instagram || "",
        facebook: agencia?.facebook || "",
        whatsapp: agencia?.whatsapp || "",
        web: agencia?.web || "",
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
        if (!getString("nit").trim()) newErrors.nit = true
        if (!getString("rnt").trim()) newErrors.rnt = true
        if (!getString("celular").trim()) newErrors.celular = true
        if (!getString("tipo")) newErrors.tipo = true

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
                categoria: "Agencia" as const,
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
                            <Briefcase className="h-7 w-7" />
                            {agencia ? "Editar Agencia" : "Nueva Agencia"}
                        </h2>
                        <p className="text-white/80 mt-1">
                            Gestión del registro legal, operación y destinos
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

                {/* 1. INFORMACIÓN LEGAL Y COMERCIAL */}
                <motion.section
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="bg-white p-6 rounded-2xl border shadow-sm"
                >
                    <h3 className="text-lg font-semibold mb-4">
                        Información Legal
                    </h3>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">

                        <motion.div variants={item}>
                            <Label>Nombre Comercial *</Label>
                            <Input
                                placeholder="Agencia Viajes El Sol"
                                value={getString("nombre")}
                                onChange={(e) => setField("nombre", e.target.value)}
                                className={`h-11 rounded-xl placeholder:text-gray-300 ${errors.nombre ? "border-red-500" : ""}`}
                            />
                        </motion.div>

                        <motion.div variants={item}>
                            <Label>NIT *</Label>
                            <Input
                                placeholder="900123456-7"
                                value={getString("nit")}
                                onChange={(e) => setField("nit", e.target.value)}
                                className={`h-11 rounded-xl placeholder:text-gray-300 ${errors.nit ? "border-red-500" : ""}`}
                            />
                        </motion.div>

                        <motion.div variants={item}>
                            <Label>RNT (Registro Nacional de Turismo) *</Label>
                            <Input
                                placeholder="12345"
                                value={getString("rnt")}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, "")
                                    setField("rnt", value)
                                }}
                                className={`h-11 rounded-xl placeholder:text-gray-300 ${errors.rnt ? "border-red-500" : ""}`}
                            />
                        </motion.div>

                        <motion.div variants={item}>
                            <Label>Representante Legal</Label>
                            <Input
                                placeholder="Carlos Ruiz"
                                value={getString("representante_legal")}
                                onChange={(e) => setField("representante_legal", e.target.value)}
                                className="h-11 rounded-xl placeholder:text-gray-300"
                            />
                        </motion.div>

                        <motion.div variants={item}>
                            <Label>Tipo de Agencia *</Label>
                            <Select
                                value={getString("tipo")}
                                onValueChange={(value) => setField("tipo", value)}
                            >
                                <SelectTrigger className={`h-11 rounded-xl ${errors.tipo ? "border-red-500" : ""}`}>
                                    <SelectValue placeholder="Seleccione el tipo" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Operadora">Agencia Operadora</SelectItem>
                                    <SelectItem value="Viajes">Agencia de Viajes y Turismo</SelectItem>
                                    <SelectItem value="Mayorista">Agencia Mayorista</SelectItem>
                                </SelectContent>
                            </Select>
                        </motion.div>

                        <motion.div variants={item}>
                            <Label>N° de Empleados / Asociados</Label>
                            <Input
                                type="number"
                                placeholder="5"
                                value={getNumber("n_empleados_asociados")}
                                onChange={(e) => {
                                    const value = Math.max(0, Number(e.target.value))
                                    setField("n_empleados_asociados", value)
                                }}
                                className="h-11 rounded-xl placeholder:text-gray-300"
                            />
                        </motion.div>
                    </div>
                </motion.section>

                {/* 2. OPERACIÓN Y DESTINOS */}
                <motion.section
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="bg-white p-6 rounded-2xl border shadow-sm"
                >
                    <h3 className="text-lg font-semibold mb-4">
                        Especialidad y Cobertura
                    </h3>

                    <div className="grid md:grid-cols-2 gap-4">
                        <motion.div variants={item}>
                            <Label>Especialidad Turística</Label>
                            <Input
                                placeholder="Ej: Ecoturismo, Turismo cultural, Histórico, Aventura..."
                                value={getString("especialidad_turistica")}
                                onChange={(e) => setField("especialidad_turistica", e.target.value)}
                                className="h-11 rounded-xl placeholder:text-gray-300"
                            />
                        </motion.div>

                        <motion.div variants={item}>
                            <Label>Destinos Principales</Label>
                            <Input
                                placeholder="Ej: Sugamuxi, Laguna de Tota, Páramo de Ocetá..."
                                value={getString("destinos_principales")}
                                onChange={(e) => setField("destinos_principales", e.target.value)}
                                className="h-11 rounded-xl placeholder:text-gray-300"
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
                                placeholder="agencia@email.com"
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
                                placeholder="@agencia_ejemplo"
                                value={getString("instagram")}
                                onChange={(e) => setField("instagram", e.target.value)}
                                className="h-11 rounded-xl placeholder:text-gray-300"
                            />
                        </div>

                        <div>
                            <Label>Facebook</Label>
                            <Input
                                placeholder="https://facebook.com/agencia"
                                value={getString("facebook")}
                                onChange={(e) => setField("facebook", e.target.value)}
                                className="h-11 rounded-xl placeholder:text-gray-300"
                            />
                        </div>

                        <div>
                            <Label>Sitio Web</Label>
                            <Input
                                placeholder="https://agencia-ejemplo.com"
                                value={getString("web")}
                                onChange={(e) => setField("web", e.target.value)}
                                className="h-11 rounded-xl placeholder:text-gray-300"
                            />
                        </div>

                    </div>
                    {/* 4. DESCRIPCIÓN / OBSERVACIONES */}
                </motion.section>
                <motion.section
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="bg-white p-6 rounded-2xl border shadow-sm"
                >
                    <h3 className="text-lg font-semibold mb-2">
                        Observaciones / Descripción
                    </h3>

                    <p className="text-sm text-gray-500 mb-4">
                        Agrega una breve descripción de la agencia de viajes, sus servicios principales, tipos de destinos que ofrece, el tipo de experiencia que brinda a los viajeros y cualquier información relevante que ayude a los usuarios a conocerla mejor.
                    </p>

                    <motion.div variants={item}>
                        <Textarea
                            placeholder="Ej: Agencia de Viajes con servicios de turismo. Ofrecemos viajes a lugares turiísticos, playas, parques, montañas, etc. Nuestros servicios son personalizados y adaptados a las necesidades de cada viajero."
                            value={getString("observaciones" as DataKeys)}
                            onChange={(e) =>
                                setField("observaciones" as DataKeys, e.target.value)
                            }
                            rows={4}
                            className="rounded-xl mt-2 resize-none placeholder:text-gray-300"
                        />
                    </motion.div>
                </motion.section>

                {/* 5. GALERÍA */}
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