"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { gdriveUrl } from "@/lib/events"
import { useParams, useSearchParams } from "next/navigation"
import { MapPin, Clock, Phone, Globe, ArrowLeft, Star, Instagram, Facebook, MessageCircle, Share2, Navigation, Mail, User, Building2, UtensilsCrossed, Briefcase, BedDouble, Users, Car, PawPrint, Accessibility, ShieldCheck, ClipboardCheck, FileText, MapPinned, ChefHat, Utensils, BadgeCheck, Loader2 } from "lucide-react"
import { Header } from "@/components/header"
import { ImageGallery } from "../../image-gallery"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import ShareModal from "@/components/share-section"

// Configuración estética de categorías en el Front
const categoriaConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
    hotel: { label: "Hotel", color: "bg-blue-600", icon: Building2 },
    restaurante: { label: "Restaurante", color: "bg-orange-600", icon: UtensilsCrossed },
    agencia: { label: "Agencia de Viajes", color: "bg-purple-600", icon: Briefcase },
}

export default function PrestadorDetailPage() {
    const params = useParams()
    const searchParams = useSearchParams()
    const [shareOpen, setShareOpen] = useState(false)
    const id = params?.id ? Number(params.id) : null
    const typeParam = searchParams?.get("type")?.toLowerCase()

    // --- ESTADOS PARA DATOS REALES ---
    const [prestador, setPrestador] = useState<any>(null)
    const [cargando, setCargando] = useState(true)



    useEffect(() => {
        if (!id) return

        const fetchPrestador = async () => {
            try {
                setCargando(true)
                const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'

                let data = null
                let finalCategory = ""

                // Mapeo entre cómo se llama en Laravel y cómo se procesa en tu Front
                const endpoints = [
                    { key: "hotel", route: "hotel", frontendCat: "hotel" },
                    { key: "restaurante", route: "restaurant", frontendCat: "restaurante" },
                    { key: "agencia", route: "agency", frontendCat: "agencia" }
                ]

                // PASO 1: Si la URL tiene el parámetro ?type=..., intentamos directo a esa ruta de Laravel
                if (typeParam) {
                    const target = endpoints.find(e => e.frontendCat === typeParam || e.key === typeParam)
                    if (target) {
                        try {
                            const res = await fetch(`${baseUrl}/api/${target.route}/${id}`)
                            if (res.ok) {
                                const result = await res.json()
                                if (result.success || result.id || result.id_prestador) {
                                    data = result.data || result
                                    finalCategory = target.frontendCat
                                }
                            }
                        } catch (e) {
                            console.warn(`Intento directo fallido en /api/${target.route}/${id}`)
                        }
                    }
                }

                // PASO 2: Si no se encontró mediante el parámetro, escaneamos secuencialmente los 3 endpoints (Auto-detect)
                if (!data) {
                    for (const endpoint of endpoints) {
                        try {
                            const res = await fetch(`${baseUrl}/api/${endpoint.route}/${id}`)
                            if (res.ok) {
                                const result = await res.json()
                                // Si el backend responde exitosamente o devuelve el objeto con id
                                if (result.success || result.id || result.id_prestador) {
                                    data = result.data || result
                                    finalCategory = endpoint.frontendCat
                                    break // Frenamos el bucle porque ya encontramos el correcto
                                }
                            }
                        } catch (e) {
                            // Ignorar error 404 y continuar buscando en la siguiente tabla
                        }
                    }
                }

                // Si después de buscar en todo lado no hay respuesta, lanzamos un error global
                if (!data) throw new Error("Prestador no encontrado en ninguna categoría")

                const fotosFormateadas = (data.fotos || []).map((foto: any, index: number) => ({
                    id: foto.id_foto || index,
                    url: gdriveUrl(foto.url_foto || foto.url || ""),
                    alt: `Fotografía de ${data.nombre}`,
                }))

                if (fotosFormateadas.length === 0) {
                    fotosFormateadas.push({
                        id: 1,
                        url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200",
                        alt: "Imagen por defecto"
                    })
                }

                // Normalización de la dirección
                const direccionFinal = typeof data.direccion === 'object' && data.direccion
                    ? data.direccion.direccion
                    : (data.direccion || "Sogamoso, Boyacá")

                // Guardamos en el estado unificado
                setPrestador({
                    ...data,
                    categoria: finalCategory,
                    fotos: fotosFormateadas,
                    direccion: direccionFinal
                })

            } catch (error) {
                console.error("Error al obtener prestador:", error)
                setPrestador(null)
            } finally {
                setCargando(false)
            }
        }

        fetchPrestador()
    }, [id, typeParam])

    if (cargando) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <Header />
                <main className="flex-1 flex flex-col items-center justify-center gap-3">
                    <Loader2 className="h-8 w-8 animate-spin text-[#6b1d1d]" />
                    <p className="text-gray-500 font-medium">Buscando información del prestador turístico...</p>
                </main>
            </div>
        )
    }

    if (!prestador) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <main className="pt-24 pb-12">
                    <div className="container mx-auto px-4">
                        <div className="text-center py-20">
                            <h1 className="text-2xl font-bold text-gray-800 mb-4">Prestador no encontrado</h1>
                            <p className="text-gray-600 mb-8">El prestador de servicios que buscas no existe o ha sido eliminado.</p>
                            <Link href="/prestadores_servicios">
                                <Button className="bg-[#6b1d1d] hover:bg-[#5a1818] text-white">
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Volver a Prestadores
                                </Button>
                            </Link>
                        </div>
                    </div>
                </main>
            </div>
        )
    }

    const config = categoriaConfig[prestador.categoria] || categoriaConfig.hotel
    const CategoriaIcon = config.icon

    // Construcción de la URL para el mapa de Google Maps
    const ubicacionBusqueda =
        prestador?.direccion?.trim()
            ? `${prestador.nombre}, ${prestador.direccion}, Sogamoso, Boyacá`
            : `${prestador.nombre}, Sogamoso, Boyacá`

    const mapaEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(
        ubicacionBusqueda
    )}&output=embed`

    const mapaNavegacionUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        ubicacionBusqueda
    )}`

    const formatPhoneNumber = (phone: any) => {
        if (!phone) return ""

        // Convertimos explícitamente a String para evitar que colapse si viene como número desde la BD
        const phoneStr = String(phone).trim()

        // Si el teléfono no tiene la longitud estándar de celular (10 dígitos), lo retorna sin formatear
        if (phoneStr.length !== 10) return phoneStr

        return `+57 ${phoneStr.slice(0, 3)} ${phoneStr.slice(3, 6)} ${phoneStr.slice(6)}`
    }

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: prestador.nombre,
                    text: `Descubre ${prestador.nombre} en Sogamoso`,
                    url: window.location.href,
                })
            } catch { /* Ignorar cancelación */ }
        } else {
            navigator.clipboard.writeText(window.location.href)
        }
    }

    const renderCategorySpecificContent = () => {
        const cardBase =
            "relative bg-white rounded-2xl p-6 border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 group overflow-hidden";

        const glow =
            "absolute inset-0 opacity-0 group-hover:opacity-100 transition rounded-2xl";

        switch (prestador.categoria) {

            case "hotel":
                return (
                    <>
                        {/* HABITACIONES */}
                        <div className={cardBase}>
                            <div className={`${glow} bg-gradient-to-br from-[#6b1d1d]/5 to-transparent`} />

                            <div className="flex items-center gap-3 mb-5 relative z-10">
                                <div className="w-10 h-10 rounded-xl bg-[#6b1d1d]/10 flex items-center justify-center group-hover:scale-110 transition">
                                    <BedDouble className="h-5 w-5 text-[#6b1d1d]" />
                                </div>
                                <h2 className="text-lg font-semibold text-gray-900">
                                    Habitaciones
                                </h2>
                            </div>

                            <div className="grid grid-cols-2 gap-4 relative z-10">
                                {[
                                    { label: "Total", value: prestador.n_habitaciones_totales || 0, color: "text-[#6b1d1d]" },
                                    { label: "Simples", value: prestador.n_habitaciones_simples || 0, color: "text-gray-700" },
                                    { label: "Dobles", value: prestador.n_habitaciones_dobles || 0, color: "text-gray-700" },
                                    { label: "Suites", value: prestador.n_habitaciones_suites || 0, color: "text-[#d4a84b]" },
                                ].map((item, i) => (
                                    <div key={i} className="bg-gray-50 group-hover:bg-white/70 rounded-xl p-4 text-center transition-all duration-300 border border-transparent group-hover:border-gray-200">
                                        <p className={`text-3xl font-bold transition-colors duration-300 ${item.color} group-hover:text-[#6b1d1d]`}>{item.value}</p>
                                        <p className="text-sm text-gray-600">{item.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* AMENIDADES */}
                        <div className={cardBase}>
                            <div className={`${glow} bg-gradient-to-br from-emerald-500/5 to-transparent`} />

                            <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                Servicios y Amenidades
                            </h2>

                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    {
                                        icon: PawPrint,
                                        label: prestador.petfriendly ? "Pet Friendly" : "Sin mascotas",
                                        active: prestador.petfriendly,
                                    },
                                    {
                                        icon: Accessibility,
                                        label: prestador.acceso_discapacidad ? "Accesible" : "Sin accesibilidad",
                                        active: prestador.acceso_discapacidad,
                                    },
                                    {
                                        icon: Car,
                                        label: prestador.parqueadero ? "Parqueadero" : "Sin parqueadero",
                                        active: prestador.parqueadero,
                                    },
                                    {
                                        icon: UtensilsCrossed,
                                        label: prestador.restaurante ? "Restaurante" : "Sin restaurante",
                                        active: prestador.restaurante,
                                    },
                                ].map((item, i) => {
                                    const Icon = item.icon;
                                    return (
                                        <div
                                            key={i}
                                            className={`flex items-center gap-2 p-3 rounded-xl transition ${item.active ? "bg-emerald-50" : "bg-gray-100"
                                                }`}
                                        >
                                            <Icon className={`h-5 w-5 ${item.active ? "text-emerald-600" : "text-gray-400"}`} />
                                            <span className={item.active ? "text-emerald-700" : "text-gray-500"}>
                                                {item.label}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* CERTIFICACIONES */}
                        <div className={cardBase}>
                            <div className={`${glow} bg-gradient-to-br from-[#d4a84b]/5 to-transparent`} />

                            <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                Certificaciones
                            </h2>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                                    <div className="flex items-center gap-3">
                                        <ShieldCheck className="h-5 w-5 text-[#6b1d1d]" />
                                        <span className="text-gray-700">RNT</span>
                                    </div>
                                    <Badge className="bg-[#6b1d1d] text-white">
                                        {prestador.rnt || "N/A"}
                                    </Badge>
                                </div>

                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                                    <div className="flex items-center gap-3">
                                        <ClipboardCheck className="h-5 w-5 text-emerald-600" />
                                        <span className="text-gray-700">Salud</span>
                                    </div>
                                    <Badge className="bg-emerald-600 text-white">
                                        {prestador.calificacion_salud || "N/A"}
                                    </Badge>
                                </div>

                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                                    <div className="flex items-center gap-3">
                                        <BadgeCheck className="h-5 w-5 text-gray-500" />
                                        <span className="text-gray-700">Inspección</span>
                                    </div>
                                    <Badge className={prestador.visita_inspeccion_turismo ? "bg-emerald-600 text-white" : "bg-gray-400 text-white"}>
                                        {prestador.visita_inspeccion_turismo ? "Aprobada" : "Pendiente"}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </>
                );

            case "restaurante":
                return (
                    <>
                        {/* Descripción gastronómica */}
                        <div className="relative bg-white rounded-2xl p-6 border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 group overflow-hidden">

                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-br from-[#6b1d1d]/5 to-transparent rounded-2xl" />

                            <div className="flex items-center gap-3 mb-4 relative z-10">
                                <div className="w-10 h-10 rounded-xl bg-[#6b1d1d]/10 flex items-center justify-center group-hover:scale-110 transition">
                                    <Utensils className="h-5 w-5 text-[#6b1d1d]" />
                                </div>

                                <h2 className="text-lg font-semibold text-gray-900">
                                    Descripción gastronómica
                                </h2>
                            </div>

                            <p className="text-gray-700 leading-relaxed text-sm whitespace-pre-line relative z-10 max-h-[220px] overflow-auto pr-2">
                                {prestador.platos_principales || "Sin información disponible"}
                            </p>
                        </div>

                        {/* TIPOS + CAPACIDAD */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            {/* TIPO DE COCINA */}
                            <div className="relative bg-white rounded-2xl p-6 border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 group overflow-hidden">
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-br from-orange-500/5 to-transparent rounded-2xl" />

                                <div className="flex items-center gap-3 mb-4 relative z-10">
                                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center group-hover:scale-110 transition">
                                        <ChefHat className="h-5 w-5 text-orange-600" />
                                    </div>
                                    <h2 className="text-lg font-semibold text-gray-900">
                                        Tipo de Cocina
                                    </h2>
                                </div>

                                <Badge className="bg-orange-600 text-white text-base px-4 py-1.5 relative z-10">
                                    {prestador.tipo_cocina || "No especificada"}
                                </Badge>
                            </div>

                            {/* CAPACIDAD */}
                            <div className="relative bg-white rounded-2xl p-6 border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 group overflow-hidden">
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-br from-[#6b1d1d]/5 to-transparent rounded-2xl" />

                                <div className="flex items-center gap-3 mb-4 relative z-10">
                                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center group-hover:scale-110 transition">
                                        <Users className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <h2 className="text-lg font-semibold text-gray-900">
                                        Capacidad
                                    </h2>
                                </div>

                                <p className="text-3xl font-bold text-[#6b1d1d] relative z-10">
                                    {prestador.capacidad || 0}{" "}
                                    <span className="text-base font-normal text-gray-600">
                                        personas
                                    </span>
                                </p>
                            </div>
                        </div>

                        {/* HORARIO */}
                        <div className="relative bg-white rounded-2xl p-6 border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 group overflow-hidden">
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-br from-[#d4a84b]/5 to-transparent rounded-2xl" />

                            <div className="flex items-center gap-3 mb-4 relative z-10">
                                <div className="w-10 h-10 rounded-xl bg-[#d4a84b]/10 flex items-center justify-center group-hover:scale-110 transition">
                                    <Clock className="h-5 w-5 text-[#d4a84b]" />
                                </div>
                                <h2 className="text-lg font-semibold text-gray-900">
                                    Horario de Atención
                                </h2>
                            </div>

                            <p className="text-gray-700 leading-relaxed whitespace-pre-line relative z-10">
                                {prestador.horarios || "Consulte directamente con el establecimiento"}
                            </p>
                        </div>
                    </>
                );

            case "agencia":
                return (
                    <>
                        {/* DESCRIPCIÓN TURÍSTICA */}
                        <div className="relative bg-white rounded-2xl p-6 border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 group overflow-hidden">

                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-br from-[#d4a84b]/5 to-transparent rounded-2xl" />

                            <div className="flex items-center gap-3 mb-4 relative z-10">
                                <div className="w-10 h-10 rounded-xl bg-[#d4a84b]/10 flex items-center justify-center group-hover:scale-110 transition">
                                    <MapPin className="h-5 w-5 text-[#d4a84b]" />
                                </div>

                                <h2 className="text-lg font-semibold text-gray-900">
                                    Descripción
                                </h2>
                            </div>

                            <p className="text-gray-700 leading-relaxed whitespace-pre-line text-sm relative z-10">
                                {prestador.observaciones ||
                                    "Este prestador no ha definido una descripción turística detallada."}
                            </p>
                        </div>
                        {/* TIPO + ESPECIALIDAD */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            {/* TIPO */}
                            <div className="relative bg-white rounded-2xl p-6 border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 group overflow-hidden">
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-br from-purple-500/5 to-transparent rounded-2xl" />

                                <div className="flex items-center gap-3 mb-4 relative z-10">
                                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center group-hover:scale-110 transition">
                                        <Briefcase className="h-5 w-5 text-purple-600" />
                                    </div>

                                    <h2 className="text-lg font-semibold text-gray-900">
                                        Tipo de Agencia
                                    </h2>
                                </div>

                                <Badge className="bg-purple-600 text-white text-base px-4 py-1.5 hover:scale-103 transition relative z-10">
                                    {prestador.tipo || "Operador Turístico"}
                                </Badge>
                            </div>

                            {/* ESPECIALIDAD TURÍSTICA */}
                            <div className="relative bg-white rounded-2xl p-6 border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 group overflow-hidden">
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-br from-emerald-500/5 to-transparent rounded-2xl" />

                                <div className="flex items-center gap-3 mb-4 relative z-10">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center group-hover:scale-110 transition">
                                        <MapPinned className="h-5 w-5 text-emerald-600" />
                                    </div>

                                    <h2 className="text-lg font-semibold text-gray-900">
                                        Especialidad turística
                                    </h2>
                                </div>

                                <div className="flex flex-wrap gap-2 relative z-10">
                                    {prestador.especialidad_turistica ? (
                                        prestador.especialidad_turistica.split(",").map((esp: string, index: number) => (
                                            <Badge
                                                key={index}
                                                className="bg-emerald-600 text-white text-sm px-3 py-1.5 hover:scale-105 transition"
                                            >
                                                {esp.trim()}
                                            </Badge>
                                        ))
                                    ) : (
                                        <span className="text-gray-500 text-sm">
                                            No cargadas
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </>
                );
            default:
                return null
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="pt-20 pb-12">
                {/* Breadcrumb */}
                <div className="bg-white border-b">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex items-center gap-2 text-sm">
                            <Link href="/" className="text-gray-500 hover:text-[#6b1d1d] transition-colors">
                                Inicio
                            </Link>
                            <span className="text-gray-400">/</span>
                            <Link href="/prestadores_servicios" className="text-gray-500 hover:text-[#6b1d1d] transition-colors">
                                Prestadores
                            </Link>
                            <span className="text-gray-400">/</span>
                            <span className="text-[#6b1d1d] font-medium truncate max-w-[200px] md:max-w-none">
                                {prestador.nombre}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-8">
                    {/* Back Button */}
                    <Link
                        href="/prestadores_servicios"
                        className="inline-flex items-center text-[#6b1d1d] hover:text-[#5a1818] mb-6 transition-colors"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Volver a Prestadores
                    </Link>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* LEFT CONTENT */}
                        <div className="lg:col-span-2 space-y-6">

                            {/* Image Gallery */}
                            <ImageGallery
                                images={prestador.fotos}
                                nombre={prestador.nombre}
                            />

                            {/* Contenido Dinámico por Categoría en lugar de Descripción estática */}
                            {renderCategorySpecificContent()}

                        </div>

                        {/* RIGHT SIDEBAR */}
                        <div className="space-y-6">

                            {/* MAIN CARD */}
                            <div className="relative overflow-hidden rounded-3xl bg-white shadow-lg border border-gray-100 transition-all hover:shadow-xl">

                                {/* Header decorativo */}
                                <div className="h-2 bg-gradient-to-r from-[#6b1d1d] via-[#d4a84b] to-[#6b1d1d]" />

                                <div className="p-6">

                                    {/* Tipo + título */}
                                    <div className="mb-5">
                                        <Badge className={`${config.color} text-white px-3 py-1 rounded-full border-none`}>
                                            <span className="flex items-center">
                                                <CategoriaIcon className="h-3.5 w-3.5 mr-1.5" />
                                                {config.label}
                                            </span>
                                        </Badge>

                                        <h1 className="text-2xl font-bold text-gray-900 mt-3 leading-tight">
                                            {prestador.nombre}
                                        </h1>

                                        <p className="text-sm text-gray-500 mt-2">
                                            Descubre este prestador de servicios
                                        </p>
                                    </div>

                                    {/* Dirección */}
                                    <div className="flex items-start gap-3 text-gray-600 mb-6 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition">
                                        <MapPin className="h-5 w-5 text-[#d4a84b] mt-0.5" />
                                        <span className="leading-relaxed text-sm">
                                            {prestador.direccion}
                                        </span>
                                    </div>

                                    {/* BOTONES */}
                                    <div className="space-y-3">

                                        {/* Cómo llegar */}
                                        <button
                                            className="w-full relative overflow-hidden group bg-[#6b1d1d] text-white py-3 rounded-xl font-medium transition-all hover:scale-[1.02]"
                                            onClick={() =>
                                                window.open(
                                                    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                                        `${prestador.nombre}, Sogamoso`
                                                    )}`,
                                                    "_blank"
                                                )
                                            }
                                        >
                                            <span className="relative z-10 flex items-center justify-center gap-2">
                                                <Navigation className="h-4 w-4" />
                                                Cómo llegar
                                            </span>
                                            <div className="absolute inset-0 bg-gradient-to-r from-[#6b1d1d] to-[#8b2d2d] opacity-0 group-hover:opacity-100 transition" />
                                        </button>

                                        {/* Compartir */}
                                        <button
                                            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 hover:scale-[1.02]"
                                            onClick={() => setShareOpen(true)}
                                        >
                                            Compartir lugar
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* CONTACTO CARD */}
                            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition">

                                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                    Información de contacto
                                </h2>

                                <div className="space-y-3">

                                    {!prestador.celular &&
                                        !prestador.correo &&
                                        !prestador.whatsapp &&
                                        !(prestador.web || prestador.website) && (
                                            <p className="text-sm text-gray-500 italic">
                                                No hay información de contacto disponible.
                                            </p>
                                        )}

                                    {prestador.celular && (
                                        <a
                                            href={`tel:+57${prestador.celular}`}
                                            className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition"
                                        >
                                            <Phone className="h-5 w-5 text-[#6b1d1d]" />
                                            <div>
                                                <p className="text-xs text-gray-500">Teléfono</p>
                                                <p className="font-medium">{formatPhoneNumber(prestador.celular)}</p>
                                            </div>
                                        </a>
                                    )}

                                    {prestador.whatsapp && (
                                        <a
                                            href={`https://wa.me/57${prestador.whatsapp}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 p-3 rounded-xl bg-green-50 hover:bg-green-100 transition"
                                        >
                                            <MessageCircle className="h-5 w-5 text-green-600" />
                                            <div>
                                                <p className="text-xs text-gray-500">WhatsApp</p>
                                                <p className="font-medium">Enviar mensaje</p>
                                            </div>
                                        </a>
                                    )}

                                    {prestador.correo && (
                                        <a
                                            href={`mailto:${prestador.correo}`}
                                            className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition"
                                        >
                                            <Mail className="h-5 w-5 text-slate-600 shrink-0" />
                                            <div className="min-w-0">
                                                <p className="text-xs text-gray-500">Correo electrónico</p>
                                                <p className="font-medium text-sm text-gray-900 truncate">{prestador.correo}</p>
                                            </div>
                                        </a>
                                    )}

                                    {(prestador.web || prestador.website) && (
                                        <a
                                            href={(prestador.web || prestador.website).startsWith("http")
                                                ? (prestador.web || prestador.website)
                                                : `https://${prestador.web || prestador.website}`
                                            }
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 hover:bg-blue-100 transition"
                                        >
                                            <Globe className="h-5 w-5 text-blue-600 shrink-0" />
                                            <div className="min-w-0">
                                                <p className="text-xs text-gray-500">Sitio web</p>
                                                <p className="font-medium text-sm text-gray-900 truncate">
                                                    {(prestador.web || prestador.website).replace(/^https?:\/\//, "")}
                                                </p>
                                            </div>
                                        </a>
                                    )}

                                </div>

                                {(prestador.instagram || prestador.facebook) && (
                                    <>
                                        <div className="border-t border-gray-100 my-4" />

                                        <h3 className="text-sm font-medium text-gray-500 mb-3">
                                            Redes sociales
                                        </h3>

                                        <div className="flex gap-3">

                                            {prestador.instagram && (
                                                <a
                                                    href={`https://instagram.com/${prestador.instagram.replace("@", "")}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center hover:scale-110 transition-all duration-300 shadow-sm"
                                                >
                                                    <Instagram className="h-5 w-5 text-white" />
                                                </a>
                                            )}

                                            {prestador.facebook && (
                                                <a
                                                    href={`${prestador.facebook}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="w-12 h-12 rounded-full bg-[#1877F2] flex items-center justify-center hover:scale-110 transition-all duration-300 shadow-sm"
                                                >
                                                    <Facebook className="h-5 w-5 text-white" />
                                                </a>
                                            )}

                                        </div>
                                    </>
                                )}
                            </div>

                            {/* MAPA */}
                            <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition">

                                <div className="p-4 border-b">
                                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-[#6b1d1d]" />
                                        Ubicación
                                    </h3>
                                </div>

                                <div className="aspect-square">
                                    <iframe
                                        title="Mapa Prestador"
                                        width="100%"
                                        height="100%"
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                        src={mapaEmbedUrl}
                                        className="w-full h-full border-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            {shareOpen && (
                <ShareModal
                    isOpen={shareOpen}
                    onClose={() => setShareOpen(false)}
                    shareUrl={window.location.href}
                />
            )}
        </div>
    )
}