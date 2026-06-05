import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Loader2, ArrowLeft, Save, Building2 } from "lucide-react"
import { GaleriaForm } from "../components/galeria-form"
import type { Hotel } from "../types"
import { motion } from "framer-motion"

interface ImageFile {
    id: string
    file: File
    preview: string
}

interface HotelFormProps {
    hotel?: Hotel & { fotosOriginales?: any[] } | null
    onBack: () => void
    onSave: (data: Partial<Hotel> & { imageFiles?: File[], fotosAEliminar?: number[] }) => Promise<void>
}

export function HotelForm({ hotel, onBack, onSave }: HotelFormProps) {

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [errors, setErrors] = useState<Record<string, boolean>>({})

    const [newImages, setNewImages] = useState<ImageFile[]>([])
    const [existingImages, setExistingImages] = useState<any[]>([])
    const [fotosAEliminar, setFotosAEliminar] = useState<number[]>([])

    useEffect(() => {
        if (hotel?.fotosOriginales) {
            setExistingImages(hotel.fotosOriginales)
        }
    }, [hotel])

    const [data, setData] = useState({
        nombre: hotel?.nombre || "",
        celular: hotel?.telefono || "",
        correo: hotel?.correo || "",
        rnt: hotel?.rnt || "",
        direccion: hotel?.direccion || "",
        nombre_contacto: hotel?.nombre_contacto || "",

        n_habitaciones_totales: hotel?.n_habitaciones_totales || 0,
        n_habitaciones_simples: hotel?.n_habitaciones_simples || 0,
        n_habitaciones_dobles: hotel?.n_habitaciones_dobles || 0,
        n_habitaciones_suites: hotel?.n_habitaciones_suites || 0,

        petfriendly: hotel?.petfriendly || false,
        acceso_discapacidad: hotel?.acceso_discapacidad || false,
        parqueadero: hotel?.parqueadero || false,
        restaurante: hotel?.restaurante || false,

        calificacion_salud: !!hotel?.calificacion_salud,
        visita_inspeccion_turismo: !!hotel?.visita_inspeccion_turismo,

        observaciones: hotel?.observaciones || "",

        instagram: hotel?.instagram || "",
        facebook: hotel?.facebook || "",
        whatsapp: hotel?.whatsapp || "",
        web: hotel?.web || "",
    })

    type DataKeys = keyof typeof data

    const setField = <K extends DataKeys>(key: K, value: typeof data[K]) => {
        setData((prev) => ({ ...prev, [key]: value }))
        if (errors[key]) setErrors((prev) => ({ ...prev, [key]: false }))
    }

    const getString = (key: DataKeys) => String(data[key] ?? "")
    const getNumber = (key: DataKeys) => Number(data[key] ?? 0)
    const getBoolean = (key: DataKeys) => Boolean(data[key])

    const validate = () => {
        const newErrors: Record<string, boolean> = {}

        if (!getString("nombre").trim()) newErrors.nombre = true
        if (!getString("celular").trim()) newErrors.celular = true
        if (!getString("rnt").trim()) newErrors.rnt = true
        if (!getString("direccion").trim()) newErrors.direccion = true

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
                categoria: "Hotel" as const,
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
                            <Building2 className="h-7 w-7" />
                            {hotel ? "Editar Hotel" : "Nuevo Hotel"}
                        </h2>
                        <p className="text-white/80">
                            Gestión profesional del alojamiento
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
                    <h3 className="text-lg font-semibold ">
                        Información General
                    </h3>
                    <p className="text-sm text-gray-500 mb-6">
                        Completa la información básica del establecimiento
                    </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            {[
                                { label: "Nombre", key: "nombre", placeholder: "Hotel Los Alpes" },
                                { label: "RNT", key: "rnt", placeholder: "12345" },
                                { label: "Dirección", key: "direccion", placeholder: "Cra 14 #12-30 Sogamoso" },
                                { label: "Nombre Contacto", key: "nombre_contacto", placeholder: "Juan Pérez" }
                            ].map((f) => (
                                <motion.div key={f.key} variants={item}>
                                    <Label>{f.label}</Label>
                                    <Input
                                        placeholder={f.placeholder}
                                        value={getString(f.key as DataKeys)}
                                        onChange={(e) => {
                                            let value = e.target.value

                                            // Si es RNT → solo números
                                            if (f.key === "rnt") {
                                                value = value.replace(/\D/g, "")
                                            }

                                            setField(f.key as DataKeys, value)
                                        }}
                                        className="h-11 rounded-xl placeholder:text-gray-300"
                                    />
                                </motion.div>
                            ))}
                        </div>
                </motion.section>

                {/* 2. HABITACIONES */}
                <motion.section
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="bg-white p-6 rounded-2xl border shadow-sm"
                >
                    <h3 className="text-lg font-semibold mb-4">
                        Habitaciones
                    </h3>

                    <div className="grid md:grid-cols-4 gap-4">
                        {[
                            { label: "Totales", key: "n_habitaciones_totales" },
                            { label: "Simples", key: "n_habitaciones_simples" },
                            { label: "Dobles", key: "n_habitaciones_dobles" },
                            { label: "Suites", key: "n_habitaciones_suites" }
                        ].map((f) => (
                            <motion.div key={f.key} variants={item}>
                                <Label>{f.label}</Label>
                                <Input
                                    type="number"
                                    value={getNumber(f.key as DataKeys)}
                                    onChange={(e) => {
                                        const value = Math.max(0, Number(e.target.value))
                                        setField(f.key as DataKeys, value)
                                    }}
                                    className="h-11 rounded-xl"
                                />
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                {/* 3. SERVICIOS */}
                <motion.section className="bg-white p-6 rounded-2xl border">
                    <h3 className="text-lg font-semibold mb-4">
                        Servicios
                    </h3>

                    <div className="grid md:grid-cols-4 gap-4">

                        {[
                            { label: "Pet Friendly", key: "petfriendly" },
                            { label: "Discapacidad", key: "acceso_discapacidad" },
                            { label: "Parqueadero", key: "parqueadero" },
                            { label: "Restaurante", key: "restaurante" }
                        ].map((f) => (
                            <motion.div
                                key={f.key}
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() =>
                                    setField(
                                        f.key as DataKeys,
                                        !getBoolean(f.key as DataKeys)
                                    )
                                }
                                className={`cursor-pointer p-4 rounded-xl border transition duration-200 hover:shadow-md ${getBoolean(f.key as DataKeys)
                                    ? "bg-green-50 border-green-500 shadow-sm"
                                    : "bg-white hover:bg-slate-50"
                                    }`}
                            >
                                <p className="font-medium">{f.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>


                {/* 4. INSPECCIONES */}
                <motion.section className="bg-white p-6 rounded-2xl border">
                    <h3 className="text-lg font-semibold mb-4">
                        Inspecciones
                    </h3>

                    <div className="grid md:grid-cols-2 gap-4">

                        {/* SANIDAD */}
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() =>
                                setField(
                                    "calificacion_salud" as DataKeys,
                                    !getBoolean("calificacion_salud" as DataKeys)
                                )
                            }
                            className={`cursor-pointer p-5 rounded-xl border transition duration-200 ${getBoolean("calificacion_salud" as DataKeys)
                                ? "bg-green-50 border-green-500 shadow-sm"
                                : "bg-white hover:bg-slate-50"
                                }`}
                        >
                            <div className="flex items-start justify-between gap-4">

                                <div>
                                    <p className="font-semibold text-gray-800">
                                        Concepto Sanitario
                                    </p>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Indica si el hotel cuenta con una calificación sanitaria oficial
                                        que certifica el cumplimiento de normas de higiene y salud.
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* TURISMO */}
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() =>
                                setField(
                                    "visita_inspeccion_turismo" as DataKeys,
                                    !getBoolean("visita_inspeccion_turismo" as DataKeys)
                                )
                            }
                            className={`cursor-pointer p-5 rounded-xl border transition duration-200 ${getBoolean("visita_inspeccion_turismo" as DataKeys)
                                ? "bg-green-50 border-green-500 shadow-sm"
                                : "bg-white hover:bg-slate-50"
                                }`}
                        >
                            <div className="flex items-start justify-between gap-4">

                                <div>
                                    <p className="font-semibold text-gray-800">
                                        Inspección de Turismo
                                    </p>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Registra si el establecimiento ha recibido y aprobado una
                                        visita oficial de inspección turística por parte de las autoridades.
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                    </div>
                </motion.section>

                {/* 5. CONTACTO */}
                <motion.section className="bg-white p-6 rounded-2xl border">
                    <h3 className="text-lg font-semibold mb-4">
                        Contacto y Redes
                    </h3>

                    <div className="grid md:grid-cols-3 gap-4">

                        <div>
                            <Label>Celular *</Label>
                            <Input
                                value={getString("celular")}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, "")
                                    setField("celular" as DataKeys, value)
                                }}
                                className="h-11 rounded-xl placeholder:text-gray-300"
                                placeholder="3001234567"
                            />
                        </div>

                        <div>
                            <Label>Correo</Label>
                            <Input
                                placeholder="hotel@email.com"
                                value={getString("correo" as DataKeys)}
                                onChange={(e) =>
                                    setField("correo" as DataKeys, e.target.value)
                                }
                                className="h-11 rounded-xl placeholder:text-gray-300"
                            />
                        </div>

                        <div>
                            <Label>WhatsApp</Label>
                            <Input
                                value={getString("whatsapp")}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, "")
                                    setField("whatsapp" as DataKeys, value)
                                }}
                                className="h-11 rounded-xl placeholder:text-gray-300"
                                placeholder="3001234567"
                            />
                        </div>

                        <div>
                            <Label>Instagram</Label>
                            <Input
                                placeholder="@hotel_ejemplo"
                                value={getString("instagram" as DataKeys)}
                                onChange={(e) =>
                                    setField("instagram" as DataKeys, e.target.value)
                                }
                                className="h-11 rounded-xl placeholder:text-gray-300"
                            />
                        </div>

                        <div>
                            <Label>Facebook</Label>
                            <Input
                                placeholder="Https://facebook.com/hotel.ejemplo"
                                value={getString("facebook" as DataKeys)}
                                onChange={(e) =>
                                    setField("facebook" as DataKeys, e.target.value)
                                }
                                className="h-11 rounded-xl placeholder:text-gray-300"
                            />
                        </div>

                        <div>
                            <Label>Sitio Web</Label>
                            <Input
                                placeholder="https://hotel-ejemplo.com"
                                value={getString("web" as DataKeys)}
                                onChange={(e) =>
                                    setField("web" as DataKeys, e.target.value)
                                }
                                className="h-11 rounded-xl placeholder:text-gray-300"
                            />
                        </div>

                    </div>
                </motion.section>
                {/* 6. DESCRIPCIÓN / OBSERVACIONES */}
                <motion.section
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="bg-white p-6 rounded-2xl border shadow-sm"
                >
                    <h3 className="text-lg font-semibold mb-2">
                        Descripción del Alojamiento
                    </h3>

                    <p className="text-sm text-gray-500 mb-4">
                        Agrega una breve descripción del hotel, su ambiente, servicios destacados
                        o cualquier información importante que ayude a los usuarios a conocerlo mejor.
                    </p>

                    <motion.div variants={item}>
                        <Textarea
                            placeholder="Ej: Hotel ubicado en zona central, ideal para turismo familiar. Cuenta con ambiente tranquilo, servicio 24h y desayuno incluido..."
                            value={getString("observaciones" as DataKeys)}
                            onChange={(e) =>
                                setField("observaciones" as DataKeys, e.target.value)
                            }
                            rows={4}
                            className="rounded-xl mt-2 resize-none placeholder:text-gray-300"
                        />
                    </motion.div>
                </motion.section>

                {/* 7. GALERÍA */}
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