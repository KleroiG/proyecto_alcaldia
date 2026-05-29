"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams, useSearchParams } from "next/navigation"
import { MapPin, Clock, Phone, Globe, ArrowLeft, Star, Instagram, Facebook, MessageCircle, Share2, Navigation, Mail, User, Building2, UtensilsCrossed, Briefcase, BedDouble, Users, Car, PawPrint, Accessibility, ShieldCheck, ClipboardCheck, FileText, MapPinned, ChefHat, Utensils, BadgeCheck, Loader2 } from "lucide-react"
import { Header } from "@/components/header"
import { ImageGallery } from "../../image-gallery"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

// Configuración estética de categorías en el Front
const categoriaConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
    hotel: { label: "Hotel", color: "bg-blue-600", icon: Building2 },
    restaurante: { label: "Restaurante", color: "bg-orange-600", icon: UtensilsCrossed },
    agencia: { label: "Agencia de Viajes", color: "bg-purple-600", icon: Briefcase },
}

export default function PrestadorDetailPage() {
    const params = useParams()
    const searchParams = useSearchParams()

    const id = params?.id ? Number(params.id) : null
    const typeParam = searchParams?.get("type")?.toLowerCase() // hotel | restaurante | agencia

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

                // PASO 3: Formatear las imágenes procedentes de Google Drive
                const fotosFormateadas = (data.fotos || []).map((foto: any, index: number) => {
                    let urlFinal = foto.url_foto || foto.url
                    if (urlFinal && urlFinal.includes("drive.google.com")) {
                        const matches = urlFinal.match(/(?:id=|\/d\/)([a-zA-Z0-9_-]+)/)
                        if (matches && matches[1]) {
                            urlFinal = `https://drive.google.com/thumbnail?sz=w1000&id=${matches[1]}`
                        }
                    }
                    return {
                        id: foto.id_foto || index,
                        url: urlFinal,
                        alt: `Fotografía de ${data.nombre}`
                    }
                })

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
        switch (prestador.categoria) {
            case "hotel":
                return (
                    <>
                        <div className="bg-white rounded-xl p-6 shadow-sm">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                                    <BedDouble className="h-5 w-5 text-blue-600" />
                                </div>
                                <h2 className="text-lg font-semibold text-gray-900">Habitaciones</h2>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 rounded-lg p-4 text-center">
                                    <p className="text-3xl font-bold text-[#6b1d1d]">{prestador.n_habitaciones_totales || 0}</p>
                                    <p className="text-sm text-gray-600">Total</p>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-4 text-center">
                                    <p className="text-3xl font-bold text-gray-700">{prestador.n_habitaciones_simples || 0}</p>
                                    <p className="text-sm text-gray-600">Simples</p>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-4 text-center">
                                    <p className="text-3xl font-bold text-gray-700">{prestador.n_habitaciones_dobles || 0}</p>
                                    <p className="text-sm text-gray-600">Dobles</p>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-4 text-center">
                                    <p className="text-3xl font-bold text-[#d4a84b]">{prestador.n_habitaciones_suites || 0}</p>
                                    <p className="text-sm text-gray-600">Suites</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl p-6 shadow-sm">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Servicios y Amenidades</h2>
                            <div className="grid grid-cols-2 gap-3">
                                <div className={`flex items-center gap-2 p-3 rounded-lg ${prestador.petfriendly ? "bg-emerald-50" : "bg-gray-100"}`}>
                                    <PawPrint className={`h-5 w-5 ${prestador.petfriendly ? "text-emerald-600" : "text-gray-400"}`} />
                                    <span className={prestador.petfriendly ? "text-emerald-700" : "text-gray-500"}>
                                        {prestador.petfriendly ? "Pet Friendly" : "No admite mascotas"}
                                    </span>
                                </div>
                                <div className={`flex items-center gap-2 p-3 rounded-lg ${prestador.acceso_discapacidad ? "bg-emerald-50" : "bg-gray-100"}`}>
                                    <Accessibility className={`h-5 w-5 ${prestador.acceso_discapacidad ? "text-emerald-600" : "text-gray-400"}`} />
                                    <span className={prestador.acceso_discapacidad ? "text-emerald-700" : "text-gray-500"}>
                                        {prestador.acceso_discapacidad ? "Accesible" : "Sin accesibilidad"}
                                    </span>
                                </div>
                                <div className={`flex items-center gap-2 p-3 rounded-lg ${prestador.parqueadero ? "bg-emerald-50" : "bg-gray-100"}`}>
                                    <Car className={`h-5 w-5 ${prestador.parqueadero ? "text-emerald-600" : "text-gray-400"}`} />
                                    <span className={prestador.parqueadero ? "text-emerald-700" : "text-gray-500"}>
                                        {prestador.parqueadero ? "Parqueadero" : "Sin parqueadero"}
                                    </span>
                                </div>
                                <div className={`flex items-center gap-2 p-3 rounded-lg ${prestador.restaurante ? "bg-emerald-50" : "bg-gray-100"}`}>
                                    <UtensilsCrossed className={`h-5 w-5 ${prestador.restaurante ? "text-emerald-600" : "text-gray-400"}`} />
                                    <span className={prestador.restaurante ? "text-emerald-700" : "text-gray-500"}>
                                        {prestador.restaurante ? "Restaurante" : "Sin restaurante"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl p-6 shadow-sm">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Certificaciones</h2>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <ShieldCheck className="h-5 w-5 text-[#6b1d1d]" />
                                        <span className="text-gray-700">RNT (Registro Nacional de Turismo)</span>
                                    </div>
                                    <Badge className="bg-[#6b1d1d] text-white">{prestador.rnt || "N/A"}</Badge>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <ClipboardCheck className="h-5 w-5 text-emerald-600" />
                                        <span className="text-gray-700">Calificación de Salud</span>
                                    </div>
                                    <Badge className="bg-emerald-600 text-white text-lg px-3">{prestador.calificacion_salud || "N/A"}</Badge>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <BadgeCheck className={`h-5 w-5 ${prestador.visita_inspeccion_turismo ? "text-emerald-600" : "text-gray-400"}`} />
                                        <span className="text-gray-700">Inspección de Turismo</span>
                                    </div>
                                    <Badge className={prestador.visita_inspeccion_turismo ? "bg-emerald-600 text-white" : "bg-gray-400 text-white"}>
                                        {prestador.visita_inspeccion_turismo ? "Aprobada" : "Pendiente"}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </>
                )

            case "restaurante":
                return (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white rounded-xl p-6 shadow-sm">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center">
                                        <ChefHat className="h-5 w-5 text-orange-600" />
                                    </div>
                                    <h2 className="text-lg font-semibold text-gray-900">Tipo de Cocina</h2>
                                </div>
                                <Badge className="bg-orange-600 text-white text-base px-4 py-1.5">
                                    {prestador.tipo_cocina || "No especificada"}
                                </Badge>
                            </div>

                            <div className="bg-white rounded-xl p-6 shadow-sm">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                                        <Users className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <h2 className="text-lg font-semibold text-gray-900">Capacidad</h2>
                                </div>
                                <p className="text-3xl font-bold text-[#6b1d1d]">{prestador.capacidad || 0} <span className="text-base font-normal text-gray-600">personas</span></p>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl p-6 shadow-sm">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full bg-[#d4a84b]/10 flex items-center justify-center">
                                    <Clock className="h-5 w-5 text-[#d4a84b]" />
                                </div>
                                <h2 className="text-lg font-semibold text-gray-900">Horario de Atención</h2>
                            </div>
                            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                {prestador.horarios || "Consulte directamente con el establecimiento"}
                            </p>
                        </div>

                        <div className="bg-white rounded-xl p-6 shadow-sm">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full bg-[#6b1d1d]/10 flex items-center justify-center">
                                    <Utensils className="h-5 w-5 text-[#6b1d1d]" />
                                </div>
                                <h2 className="text-lg font-semibold text-gray-900">Platos Principales</h2>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {prestador.platos_principales ? (
                                    prestador.platos_principales.split(",").map((plato: string, index: number) => (
                                        <Badge key={index} variant="outline" className="border-[#6b1d1d] text-[#6b1d1d] bg-[#6b1d1d]/5 px-3 py-1.5">
                                            {plato.trim()}
                                        </Badge>
                                    ))
                                ) : (
                                    <span className="text-gray-500 text-sm">No cargados</span>
                                )}
                            </div>
                        </div>

                        {prestador.propietario && (
                            <div className="bg-white rounded-xl p-6 shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                                        <User className="h-5 w-5 text-gray-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Propietario</p>
                                        <p className="font-semibold text-gray-900">{prestador.propietario}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )

            case "agencia":
                return (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white rounded-xl p-6 shadow-sm">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                                        <Briefcase className="h-5 w-5 text-purple-600" />
                                    </div>
                                    <h2 className="text-lg font-semibold text-gray-900">Tipo de Agencia</h2>
                                </div>
                                <Badge className="bg-purple-600 text-white text-base px-4 py-1.5">
                                    {prestador.tipo || "Operador Turístico"}
                                </Badge>
                            </div>

                            <div className="bg-white rounded-xl p-6 shadow-sm">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                                        <Users className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <h2 className="text-lg font-semibold text-gray-900">Equipo</h2>
                                </div>
                                <p className="text-3xl font-bold text-[#6b1d1d]">{prestador.n_empleados_asociados || 0} <span className="text-base font-normal text-gray-600">empleados</span></p>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl p-6 shadow-sm">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                                    <MapPinned className="h-5 w-5 text-emerald-600" />
                                </div>
                                <h2 className="text-lg font-semibold text-gray-900">Especialidad Turística</h2>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {prestador.especialidad_turistica ? (
                                    prestador.especialidad_turistica.split(",").map((esp: string, index: number) => (
                                        <Badge key={index} className="bg-emerald-600 text-white px-3 py-1.5">
                                            {esp.trim()}
                                        </Badge>
                                    ))
                                ) : (
                                    <span className="text-gray-500 text-sm">No cargadas</span>
                                )}
                            </div>
                        </div>

                        <div className="bg-white rounded-xl p-6 shadow-sm">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full bg-[#d4a84b]/10 flex items-center justify-center">
                                    <MapPin className="h-5 w-5 text-[#d4a84b]" />
                                </div>
                                <h2 className="text-lg font-semibold text-gray-900">Destinos Principales</h2>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {prestador.destinos_principales ? (
                                    prestador.destinos_principales.split(",").map((destino: string, index: number) => (
                                        <Badge key={index} variant="outline" className="border-[#d4a84b] text-[#d4a84b] bg-[#d4a84b]/5 px-3 py-1.5">
                                            {destino.trim()}
                                        </Badge>
                                    ))
                                ) : (
                                    <span className="text-gray-500 text-sm">No cargados</span>
                                )}
                            </div>
                        </div>

                        <div className="bg-white rounded-xl p-6 shadow-sm">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Información Legal</h2>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <FileText className="h-5 w-5 text-gray-600" />
                                        <span className="text-gray-700">NIT</span>
                                    </div>
                                    <Badge variant="outline" className="border-gray-400 text-gray-700">{prestador.nit || "N/A"}</Badge>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <ShieldCheck className="h-5 w-5 text-[#6b1d1d]" />
                                        <span className="text-gray-700">RNT</span>
                                    </div>
                                    <Badge className="bg-[#6b1d1d] text-white">{prestador.rnt || "N/A"}</Badge>
                                </div>
                            </div>
                        </div>

                        {prestador.representante_legal && (
                            <div className="bg-white rounded-xl p-6 shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-[#6b1d1d]/10 flex items-center justify-center">
                                        <User className="h-5 w-5 text-[#6b1d1d]" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Representante Legal</p>
                                        <p className="font-semibold text-gray-900">{prestador.representante_legal}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )
            default:
                return null
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="pt-20 pb-12">
                <div className="bg-white border-b">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex items-center gap-2 text-sm">
                            <Link href="/" className="text-gray-500 hover:text-[#6b1d1d] transition-colors">
                                Inicio
                            </Link>
                            <span className="text-gray-400">/</span>
                            <Link href="/prestadores_servicios" className="text-gray-500 hover:text-[#6b1d1d] transition-colors">
                                Prestadores de Servicios
                            </Link>
                            <span className="text-gray-400">/</span>
                            <span className="text-[#6b1d1d] font-medium truncate max-w-[200px]">{prestador.nombre}</span>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-8">
                    <Link href="/prestadores_servicios" className="inline-flex items-center text-[#6b1d1d] hover:text-[#5a1818] mb-6 transition-colors">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Volver a Prestadores de Servicios
                    </Link>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-6">
                            <ImageGallery images={prestador.fotos} nombre={prestador.nombre} />

                            <div className="bg-white rounded-xl p-6 shadow-sm">
                                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                                    <div>
                                        <Badge className={`${config.color} text-white mb-3`}>
                                            <CategoriaIcon className="h-3.5 w-3.5 mr-1.5" />
                                            {config.label}
                                        </Badge>
                                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                                            {prestador.nombre}
                                        </h1>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 text-gray-600 mb-6">
                                    <MapPin className="h-5 w-5 text-[#d4a84b]" />
                                    <span>{prestador.direccion}</span>
                                </div>

                                {(prestador.observaciones || prestador.descripcion) && (
                                    <>
                                        <Separator className="my-6" />
                                        <div>
                                            <h2 className="text-lg font-semibold text-gray-900 mb-3">Acerca de</h2>
                                            <p className="text-gray-700 leading-relaxed">
                                                {prestador.observaciones || prestador.descripcion}
                                            </p>
                                        </div>
                                    </>
                                )}
                            </div>

                            {renderCategorySpecificContent()}
                        </div>

                        <div className="space-y-6">
                            <div className="bg-white rounded-xl p-6 shadow-sm">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Información de Contacto</h2>

                                <div className="space-y-4">
                                    {prestador.celular && (
                                        <a
                                            href={`tel:+57${prestador.celular}`}
                                            className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                                        >
                                            <div className="w-10 h-10 rounded-full bg-[#6b1d1d]/10 flex items-center justify-center">
                                                <Phone className="h-5 w-5 text-[#6b1d1d]" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Teléfono</p>
                                                <p className="font-medium text-gray-900">{formatPhoneNumber(prestador.celular)}</p>
                                            </div>
                                        </a>
                                    )}

                                    {prestador.correo && (
                                        <a
                                            href={`mailto:${prestador.correo}`}
                                            className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                                        >
                                            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                                                <Mail className="h-5 w-5 text-blue-500" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Correo Electrónico</p>
                                                <p className="font-medium text-gray-900 truncate max-w-[180px]">{prestador.correo}</p>
                                            </div>
                                        </a>
                                    )}

                                    {prestador.whatsapp && (
                                        <a
                                            href={`https://wa.me/57${String(prestador.whatsapp).trim()}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                                        >
                                            <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                                                <MessageCircle className="h-5 w-5 text-green-500" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">WhatsApp</p>
                                                <p className="font-medium text-gray-900">Enviar mensaje</p>
                                            </div>
                                        </a>
                                    )}

                                    {(prestador.web || prestador.website) && (
                                        <a
                                            href={prestador.web || prestador.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                                        >
                                            <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                                                <Globe className="h-5 w-5 text-purple-500" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Sitio Web</p>
                                                <p className="font-medium text-gray-900 truncate max-w-[180px]">
                                                    {(prestador.web || prestador.website).replace(/^https?:\/\//, "")}
                                                </p>
                                            </div>
                                        </a>
                                    )}
                                </div>

                                {(prestador.instagram || prestador.facebook) && (
                                    <>
                                        <Separator className="my-4" />
                                        <h3 className="text-sm font-medium text-gray-500 mb-3">Redes Sociales</h3>
                                        <div className="flex gap-3">
                                            {prestador.instagram && (
                                                <a
                                                    href={`https://instagram.com/${prestador.instagram.replace("@", "")}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center hover:scale-110 transition-transform"
                                                    aria-label="Instagram"
                                                >
                                                    <Instagram className="h-5 w-5 text-white" />
                                                </a>
                                            )}
                                            {prestador.facebook && (
                                                <a
                                                    href={`https://facebook.com/${prestador.facebook}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="w-10 h-10 rounded-full bg-[#1877F2] flex items-center justify-center hover:scale-110 transition-transform"
                                                    aria-label="Facebook"
                                                >
                                                    <Facebook className="h-5 w-5 text-white" />
                                                </a>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="bg-white rounded-xl p-6 shadow-sm space-y-3">
                                <Button
                                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
                                    onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${prestador.nombre}, Sogamoso`)}`, "_blank")}
                                >
                                    <Navigation className="mr-2 h-4 w-4" />
                                    Cómo llegar
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full border-[#6b1d1d] text-[#6b1d1d] hover:bg-[#6b1d1d] hover:text-white"
                                    onClick={handleShare}
                                >
                                    <Share2 className="mr-2 h-4 w-4" />
                                    Compartir
                                </Button>
                            </div>

                            <div className="bg-white rounded-xl overflow-hidden shadow-sm">
                                <div className="aspect-square bg-gray-200 flex items-center justify-center">
                                    <div className="text-center p-4">
                                        <MapPin className="h-12 w-12 text-[#6b1d1d] mx-auto mb-2" />
                                        <p className="text-gray-600 text-sm">{prestador.direccion}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}