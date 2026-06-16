"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { gdriveUrl } from "@/lib/events"
import { apiUrl } from "@/lib/api"
import { useParams } from "next/navigation"
import { MapPin, Clock, Phone, Globe, ArrowLeft, Star, DollarSign, Instagram, Facebook, MessageCircle, Share2, Navigation } from "lucide-react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ImageGallery } from "../../image-gallery"
import ShareModal from "@/components/share-section"

export default function AtractivoDetailPage() {
  const params = useParams()
  const id = params?.id ? Number(params.id) : null

  // --- ESTADOS PARA MANEJAR DATOS REALES ---
  const [atractivo, setAtractivo] = useState<any>(null)
  const [cargando, setCargando] = useState(true)

  // Estado para controlar el modal de compartir
  const [shareOpen, setShareOpen] = useState(false)

  const ubicacionBusqueda =
    atractivo?.direccion?.trim()
      ? `${atractivo.nombre}, ${atractivo.direccion}, Sogamoso, Boyacá`
      : `${atractivo?.nombre || "Sogamoso"}, Boyacá`;

  // --- EFECTO PARA BUSCAR EN LA BASE DE DATOS ---
  useEffect(() => {
    if (!id) return

    const fetchAtractivo = async () => {
      try {
        setCargando(true)
        const response = await fetch(apiUrl(`tourism/${id}`))

        if (!response.ok) throw new Error("No se pudo cargar el atractivo")

        const result = await response.json()
        const data = result.data || result

        const fotosFormateadas = (data.fotos || []).map((foto: any, index: number) => ({
          id: foto.id_foto || index,
          url: gdriveUrl(foto.url_foto || ""),
          alt: `Fotografía de ${data.nombre}`,
        }));

        // Si el atractivo no tiene fotos en la base de datos, usamos un fallback temporal
        if (fotosFormateadas.length === 0) {
          fotosFormateadas.push({
            id: 1,
            url: "https://images.unsplash.com/photo-1590001155093-a3c66ab0c3ff?q=80&w=1200",
            alt: "Imagen por defecto"
          })
        }

        // Mapeamos los datos del backend a la estructura que tu diseño espera
        setAtractivo({
          ...data,
          fotos: fotosFormateadas,
          // Manejamos la dirección por si viene como objeto relacional
          direccion: typeof data.direccion === 'object' && data.direccion
            ? data.direccion.direccion
            : (data.direccion || "Sogamoso, Boyacá"),
          tipo: data.tipo || "Patrimonio",
          precio: data.precio || "Entrada libre",
          horario: data.horario || "No especificado"
        })

      } catch (error) {
        console.error("Error al obtener el atractivo:", error)
        setAtractivo(null)
      } finally {
        setCargando(false)
      }
    }

    fetchAtractivo()
  }, [id])

  // --- VISTA DE CARGA ---
  if (cargando) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-gray-500 font-medium">Cargando información del atractivo...</div>
        </main>
      </div>
    )
  }

  // --- VISTA DE ERROR / NO ENCONTRADO ---
  if (!atractivo) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="pt-24 pb-12">
          <div className="container mx-auto px-4">
            <div className="text-center py-20">
              <h1 className="text-2xl font-bold text-gray-800 mb-4">Atractivo no encontrado</h1>
              <p className="text-gray-600 mb-8">El atractivo turístico que buscas no existe o ha sido eliminado.</p>
              <Link href="/atractivos">
                <Button className="bg-[#6b1d1d] hover:bg-[#5a1818] text-white">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Volver a Atractivos
                </Button>
              </Link>
            </div>
          </div>
        </main>
      </div>
    )
  }

  // --- UTILIDADES ---
  const formatPhoneNumber = (phone: string | number) => {
    const phoneStr = phone.toString().replace(/\D/g, '') // Limpia caracteres raros
    if (phoneStr.length < 10) return phoneStr;
    return `+57 ${phoneStr.slice(0, 3)} ${phoneStr.slice(3, 6)} ${phoneStr.slice(6)}`
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
              <Link href="/atractivos" className="text-gray-500 hover:text-[#6b1d1d] transition-colors">
                Atractivos Turísticos
              </Link>
              <span className="text-gray-400">/</span>
              <span className="text-[#6b1d1d] font-medium">{atractivo.nombre}</span>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Back Button */}
          <Link href="/atractivos" className="inline-flex items-center text-[#6b1d1d] hover:text-[#5a1818] mb-6 transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Atractivos Turísticos
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* LEFT CONTENT */}
            <div className="lg:col-span-2 space-y-6">

              {/* Image Gallery */}
              <ImageGallery
                images={atractivo.fotos}
                nombre={atractivo.nombre}
              />

              {/* Description */}
              <div className="relative bg-white rounded-2xl p-7 shadow-sm border border-gray-100 overflow-hidden group transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                <h2 className="text-xl font-bold text-gray-900 mb-2 tracking-tight">
                  Descripción
                </h2>

                <Separator className="mb-6" />

                <p className="text-gray-700 leading-relaxed whitespace-pre-line text-justify text-[15px] max-h-[420px] overflow-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300">
                  {atractivo.descripcion ||
                    "No hay una descripción detallada para este lugar."}
                </p>
              </div>

              {/* Schedule and Pricing */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Schedule */}
                <div className="relative bg-white rounded-2xl p-6 border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 group">
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-br from-[#d4a84b]/5 to-transparent rounded-2xl" />
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#d4a84b]/10 to-transparent flex items-center justify-center shadow-sm group-hover:scale-110 transition">
                      <Clock className="h-5 w-5 text-[#d4a84b]" />
                    </div>

                    <h2 className="text-lg font-semibold text-gray-900">
                      Horario
                    </h2>
                  </div>

                  <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                    {atractivo.horario}
                  </p>
                </div>

                {/* Pricing */}
                <div className="relative bg-white rounded-2xl p-6 border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 group">
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-br from-emerald-500/5 to-transparent rounded-2xl" />
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/10 to-transparent flex items-center justify-center shadow-sm group-hover:scale-110 transition">
                      <DollarSign className="h-5 w-5 text-emerald-500" />
                    </div>

                    <h2 className="text-lg font-semibold text-gray-900">
                      Tarifas
                    </h2>
                  </div>

                  <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                    {atractivo.precio}
                  </p>
                </div>
              </div>
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
                    <Badge className="bg-[#6b1d1d] text-white px-3 py-1 rounded-full">
                      {atractivo.tipo}
                    </Badge>

                    <h1 className="text-2xl font-bold text-gray-900 mt-3 leading-tight">
                      {atractivo.nombre}
                    </h1>

                    <p className="text-sm text-gray-500 mt-2">
                      Descubre este lugar turístico
                    </p>
                  </div>

                  {/* Dirección */}
                  <div className="flex items-start gap-3 text-gray-600 mb-6 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition">
                    <MapPin className="h-5 w-5 text-[#d4a84b] mt-0.5" />
                    <span className="leading-relaxed text-sm">
                      {atractivo.direccion}
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
                            ubicacionBusqueda
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

                    {/* COMPARTIR MEJORADO */}
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

                  {!atractivo.telefono &&
                    !atractivo.whatsapp &&
                    !atractivo.web && (
                      <p className="text-sm text-gray-500 italic">
                        No hay información de contacto disponible.
                      </p>
                    )}

                  {atractivo.telefono && (
                    <a
                      href={`tel:+57${atractivo.telefono}`}
                      className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition"
                    >
                      <Phone className="h-5 w-5 text-[#6b1d1d]" />
                      <div>
                        <p className="text-xs text-gray-500">Teléfono</p>
                        <p className="font-medium">{atractivo.telefono}</p>
                      </div>
                    </a>
                  )}

                  {atractivo.whatsapp && (
                    <a
                      href={`https://wa.me/57${atractivo.whatsapp}`}
                      target="_blank"
                      className="flex items-center gap-3 p-3 rounded-xl bg-green-50 hover:bg-green-100 transition"
                    >
                      <MessageCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="text-xs text-gray-500">WhatsApp</p>
                        <p className="font-medium">Enviar mensaje</p>
                      </div>
                    </a>
                  )}

                  {atractivo.web && (
                    <a
                      href={
                        atractivo.web.startsWith("http")
                          ? atractivo.web
                          : `https://${atractivo.web}`
                      }
                      target="_blank"
                      className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 hover:bg-blue-100 transition"
                    >
                      <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-blue-50 hover:bg-blue-100 transition overflow-hidden">
                        <div className="shrink-0">
                          <Globe className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs text-gray-500">Sitio web</p>

                          <p className="font-medium text-sm text-gray-900 truncate">
                            {atractivo.web.replace(/^https?:\/\//, "")}
                          </p>
                        </div>

                      </div>
                    </a>
                  )}

                </div>
                {(atractivo.instagram || atractivo.facebook) && (
                  <>
                    <div className="border-t border-gray-100 my-4" />

                    <h3 className="text-sm font-medium text-gray-500 mb-3">
                      Redes sociales
                    </h3>

                    <div className="flex gap-3">

                      {atractivo.instagram && (
                        <a
                          href={`https://instagram.com/${atractivo.instagram.replace("@", "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center hover:scale-110 transition-all duration-300 shadow-sm"
                        >
                          <Instagram className="h-5 w-5 text-white" />
                        </a>
                      )}

                      {atractivo.facebook && (
                        <a
                          href={`${atractivo.facebook}`}
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
                    title="Mapa"
                    width="100%"
                    height="100%"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://www.google.com/maps?q=${encodeURIComponent(
                      ubicacionBusqueda
                    )}&output=embed`}
                    className="w-full h-full"
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