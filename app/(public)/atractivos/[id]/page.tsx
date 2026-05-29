"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { MapPin, Clock, Phone, Globe, ArrowLeft, Star, DollarSign, Instagram, Facebook, MessageCircle, Share2, Navigation } from "lucide-react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ImageGallery } from "../image-gallery"

export default function AtractivoDetailPage() {
  const params = useParams()
  const id = params?.id ? Number(params.id) : null

  // --- ESTADOS PARA MANEJAR DATOS REALES ---
  const [atractivo, setAtractivo] = useState<any>(null)
  const [cargando, setCargando] = useState(true)

  // --- EFECTO PARA BUSCAR EN LA BASE DE DATOS ---
  useEffect(() => {
    if (!id) return

    const fetchAtractivo = async () => {
      try {
        setCargando(true)
        const response = await fetch(`http://127.0.0.1:8000/api/tourism/${id}`)

        if (!response.ok) throw new Error("No se pudo cargar el atractivo")

        const result = await response.json()
        const data = result.data || result

        // Formateamos las fotos para arreglar los enlaces de Google Drive (evitar error CORS)
        const fotosFormateadas = (data.fotos || []).map((foto: any, index: number) => {
          let urlFinal = foto.url_foto;
          if (urlFinal && urlFinal.includes("drive.google.com")) {
            const matches = urlFinal.match(/(?:id=|\/d\/)([a-zA-Z0-9_-]+)/);
            if (matches && matches[1]) {
              urlFinal = `https://drive.google.com/thumbnail?sz=w1000&id=${matches[1]}`;
            }
          }
          return {
            id: foto.id_foto || index,
            url: urlFinal,
            alt: `Fotografía de ${data.nombre}`
          }
        });

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

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: atractivo.nombre,
          text: (atractivo.descripcion || "").slice(0, 100) + "...",
          url: window.location.href,
        })
      } catch {

      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert("¡Enlace copiado al portapapeles!")
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
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Descripción
                </h2>

                <Separator className="mb-6" />

                <p className="text-gray-700 leading-relaxed whitespace-pre-line text-justify">
                  {atractivo.descripcion ||
                    "No hay una descripción detallada para este lugar."}
                </p>
              </div>

              {/* Schedule and Pricing */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Schedule */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-[#d4a84b]/10 flex items-center justify-center">
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
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
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

              {/* Main Info Card */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">

                <div className="flex items-start justify-between gap-4 mb-5">

                  <div>
                    <Badge className="bg-[#6b1d1d] text-white mb-3">
                      {atractivo.tipo}
                    </Badge>

                    <h1 className="text-2xl font-bold text-gray-900 leading-tight">
                      {atractivo.nombre}
                    </h1>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-3 text-gray-600 mb-6">
                  <div className="mt-0.5">
                    <MapPin className="h-5 w-5 text-[#d4a84b]" />
                  </div>

                  <span className="leading-relaxed">
                    {atractivo.direccion}
                  </span>
                </div>

                <Separator className="my-6" />

                {/* Action Buttons */}
                <div className="space-y-3">

                  <Button
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
                    onClick={() =>
                      window.open(
                        `https://maps.google.com/?q=${encodeURIComponent(
                          `${atractivo.nombre}, Sogamoso, Boyacá`
                        )}`,
                        "_blank"
                      )
                    }
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
              </div>

              {/* Contact Card */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">

                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Información de Contacto
                </h2>

                <div className="space-y-4">

                  {/* Empty State */}
                  {!atractivo.telefono &&
                    !atractivo.whatsapp &&
                    !atractivo.web && (
                      <p className="text-sm text-gray-500">
                        No hay información de contacto registrada.
                      </p>
                    )}

                  {/* Phone */}
                  {atractivo.telefono && (
                    <a
                      href={`tel:+57${atractivo.telefono}`}
                      className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-full bg-[#6b1d1d]/10 flex items-center justify-center">
                        <Phone className="h-5 w-5 text-[#6b1d1d]" />
                      </div>

                      <div>
                        <p className="text-xs text-gray-500">
                          Teléfono
                        </p>

                        <p className="font-medium text-gray-900">
                          {formatPhoneNumber(atractivo.telefono)}
                        </p>
                      </div>
                    </a>
                  )}

                  {/* WhatsApp */}
                  {atractivo.whatsapp && (
                    <a
                      href={`https://wa.me/57${atractivo.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                        <MessageCircle className="h-5 w-5 text-green-500" />
                      </div>

                      <div>
                        <p className="text-xs text-gray-500">
                          WhatsApp
                        </p>

                        <p className="font-medium text-gray-900">
                          Enviar mensaje
                        </p>
                      </div>
                    </a>
                  )}

                  {/* Website */}
                  {atractivo.web && (
                    <a
                      href={
                        atractivo.web.startsWith("http")
                          ? atractivo.web
                          : `https://${atractivo.web}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                        <Globe className="h-5 w-5 text-blue-500" />
                      </div>

                      <div>
                        <p className="text-xs text-gray-500">
                          Sitio Web
                        </p>

                        <p className="font-medium text-gray-900 truncate max-w-[180px]">
                          {atractivo.web.replace(/^https?:\/\//, "")}
                        </p>
                      </div>
                    </a>
                  )}
                </div>

                {/* Social Media */}
                {(atractivo.instagram || atractivo.facebook) && (
                  <>
                    <Separator className="my-5" />

                    <h3 className="text-sm font-medium text-gray-500 mb-3">
                      Redes Sociales
                    </h3>

                    <div className="flex gap-3">

                      {atractivo.instagram && (
                        <a
                          href={`https://instagram.com/${atractivo.instagram.replace("@", "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center hover:scale-110 transition-transform"
                        >
                          <Instagram className="h-5 w-5 text-white" />
                        </a>
                      )}

                      {atractivo.facebook && (
                        <a
                          href={`https://facebook.com/${atractivo.facebook}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 rounded-full bg-[#1877F2] flex items-center justify-center hover:scale-110 transition-transform"
                        >
                          <Facebook className="h-5 w-5 text-white" />
                        </a>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Map */}
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                <div className="aspect-square bg-gray-100 flex items-center justify-center">
                  <div className="text-center p-6">
                    <MapPin className="h-12 w-12 text-[#6b1d1d] mx-auto mb-3" />

                    <p className="text-gray-600 text-sm leading-relaxed">
                      {atractivo.direccion}
                    </p>
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