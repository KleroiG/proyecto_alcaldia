"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Phone,
  Mail,
  ArrowLeft,
  Globe,
  Instagram,
  Facebook,
  Youtube,
  User,
  Heart,
  Palette,
  Award,
  ChevronRight,
  MessageCircle,
} from "lucide-react"
import {
  getCulturalServiceById,
  type CulturalService,
} from "@/lib/cultural-services"
import { gdriveUrl } from "@/lib/events"
import { ROUTES } from "@/lib/routes"

export default function CulturalServiceDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id ? String(params.id) : null

  const [service, setService] = useState<CulturalService | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!id) return

    const loadService = async () => {
      try {
        setIsLoading(true)
        const data = await getCulturalServiceById(id)
        setService(data)
      } catch (err) {
        console.error("Error al cargar servicio:", err)
        setService(null)
      } finally {
        setIsLoading(false)
      }
    }

    loadService()
  }, [id])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2 text-sm text-gray-500 font-medium">
            <Palette className="h-8 w-8 text-[#60150F] animate-spin" />
            Cargando trayectoria artística...
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="flex-1 pt-24 pb-12">
          <div className="container mx-auto px-4">
            <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
              <h1 className="text-2xl font-bold text-gray-800 mb-4">Artista o Gestor no encontrado</h1>
              <p className="text-gray-600 mb-8">El registro que buscas no existe o fue despublicado.</p>
              <Link href={ROUTES.serviciosCulturales}>
                <Button className="bg-[#60150F] hover:bg-[#470f0b] text-white rounded-xl px-5 cursor-pointer">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Volver a Servicios Culturales
                </Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const displayImage = service.url_foto
    ? gdriveUrl(service.url_foto)
    : "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=1200"

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1 pt-20 pb-12">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-100">
          <div className="mx-auto max-w-[1370px] px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
              <Link href={ROUTES.home} className="hover:text-[#60150F] transition-colors">
                Inicio
              </Link>
              <ChevronRight className="h-3 w-3 text-gray-400" />
              <Link href={ROUTES.serviciosCulturales} className="hover:text-[#60150F] transition-colors">
                Servicios Culturales
              </Link>
              <ChevronRight className="h-3 w-3 text-gray-400" />
              <span className="text-[#60150F] font-semibold">{service.nombre_artistico}</span>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-[1370px] px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <Link
            href={ROUTES.serviciosCulturales}
            className="inline-flex items-center text-[#60150F] hover:text-[#470f0b] mb-6 transition-colors text-sm font-semibold"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Servicios Culturales
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* LEFT COLUMN: Main trayectoria, biografía y detalles */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Photo & Main Presentation Header */}
              <div className="relative overflow-hidden rounded-3xl bg-white border border-gray-100 shadow-sm">
                <div className="aspect-[21/9] w-full bg-slate-100 overflow-hidden relative">
                  <img
                    src={displayImage}
                    alt={service.nombre_artistico}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=1200"
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>
                
                <div className="p-6 sm:p-8 relative -mt-10 sm:-mt-14 z-10 flex flex-col sm:flex-row items-start sm:items-end gap-5">
                  <div className="size-20 sm:size-28 rounded-2xl overflow-hidden border-4 border-white bg-white shadow-md shrink-0">
                    <img
                      src={displayImage}
                      alt=""
                      className="h-full w-full object-cover"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.currentTarget.src = "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=200"
                      }}
                    />
                  </div>
                  <div className="flex-1 space-y-2 pt-1 sm:pt-0">
                    <div className="flex flex-wrap items-center gap-2">
                      {service.area_artistica?.nombre && (
                        <Badge className="bg-[#60150F] text-white border-none text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-sm">
                          {service.area_artistica.nombre}
                        </Badge>
                      )}
                      {service.tipo_perfil_sc?.nombre && (
                        <Badge variant="outline" className="border-yellow-500/30 bg-yellow-500/5 text-yellow-700 text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                          {service.tipo_perfil_sc.nombre}
                        </Badge>
                      )}
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight leading-tight">
                      {service.nombre_artistico}
                    </h1>
                  </div>
                </div>
              </div>

              {/* Bio / Biography Section */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-4">
                <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2 border-b border-slate-50 pb-3">
                  <User className="h-5 w-5 text-[#60150F]" />
                  Trayectoria y Biografía
                </h2>
                <p className="text-gray-700 leading-relaxed text-justify whitespace-pre-line text-sm sm:text-base">
                  {service.biografia || "No se ha proporcionado una biografía detallada."}
                </p>
              </div>

              {/* Services and Target Audience */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-3 group hover:shadow-md transition-all duration-300">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-[#60150F]/5 flex items-center justify-center shrink-0">
                      <Palette className="h-5 w-5 text-[#60150F]" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg">Servicio Artístico</h3>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed font-medium">
                    {service.tipo_servicio}
                  </p>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-3 group hover:shadow-md transition-all duration-300">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-amber-500/5 flex items-center justify-center shrink-0">
                      <Heart className="h-5 w-5 text-amber-600" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg">Público Objetivo</h3>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed font-medium">
                    {service.publico_objetivo}
                  </p>
                </div>
              </div>

              {/* Recognitions */}
              {service.reconocimientos && (
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-4">
                  <h2 className="text-lg font-bold text-gray-900 tracking-tight flex items-center gap-2 border-b border-slate-50 pb-3">
                    <Award className="h-5 w-5 text-yellow-600 animate-pulse" />
                    Reconocimientos y Logros
                  </h2>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed whitespace-pre-line text-justify">
                    {service.reconocimientos}
                  </p>
                </div>
              )}

            </div>

            {/* RIGHT COLUMN: Contact cards & social networks */}
            <div className="space-y-6">
              
              {/* Contact Info Card */}
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Contacto Público</h3>
                  <p className="text-xs text-gray-500 mt-1">Comunícate con el artista para cotizaciones y eventos</p>
                </div>

                <div className="space-y-3">
                  {service.telefono_publicar && (
                    <a
                      href={`tel:${service.telefono_publicar}`}
                      className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-all group"
                    >
                      <div className="size-10 rounded-xl bg-[#60150F]/5 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <Phone className="h-5 w-5 text-[#60150F]" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Teléfono de Contratación</p>
                        <p className="text-sm font-semibold text-gray-800 tracking-wide">{service.telefono_publicar}</p>
                      </div>
                    </a>
                  )}

                  {service.correo_publicar && (
                    <a
                      href={`mailto:${service.correo_publicar}`}
                      className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-all group"
                    >
                      <div className="size-10 rounded-xl bg-[#60150F]/5 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <Mail className="h-5 w-5 text-[#60150F]" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Correo Público</p>
                        <p className="text-sm font-semibold text-gray-800 truncate">{service.correo_publicar}</p>
                      </div>
                    </a>
                  )}

                  {service.sitio_web && (
                    <a
                      href={service.sitio_web.startsWith("http") ? service.sitio_web : `https://${service.sitio_web}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-all group"
                    >
                      <div className="size-10 rounded-xl bg-[#60150F]/5 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <Globe className="h-5 w-5 text-[#60150F]" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Sitio Web</p>
                        <p className="text-sm font-semibold text-gray-800 truncate">{service.sitio_web.replace(/^https?:\/\//, "")}</p>
                      </div>
                    </a>
                  )}

                  {/* WhatsApp Quick Link */}
                  {service.telefono_publicar && (
                    <Button
                      onClick={() =>
                        window.open(
                          `https://wa.me/57${String(service.telefono_publicar).replace(/\D/g, "")}`,
                          "_blank"
                        )
                      }
                      className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white rounded-2xl py-6 font-bold text-sm tracking-wide gap-2 shadow-sm cursor-pointer"
                    >
                      <MessageCircle className="size-5 shrink-0" />
                      Contactar por WhatsApp
                    </Button>
                  )}
                </div>
              </div>

              {/* Social Networks Card */}
              {(service.instagram || service.facebook || service.youtube || service.tiktok || service.otra_red) && (
                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider border-b border-slate-50 pb-2">Redes de Difusión</h3>
                  
                  <div className="flex flex-wrap gap-3">
                    {service.instagram && (
                      <a
                        href={service.instagram.startsWith("http") ? service.instagram : `https://${service.instagram}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="size-11 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center hover:scale-110 transition-all shadow-sm cursor-pointer"
                        title="Instagram"
                      >
                        <Instagram className="h-5 w-5 text-white" />
                      </a>
                    )}
                    {service.facebook && (
                      <a
                        href={service.facebook.startsWith("http") ? service.facebook : `https://${service.facebook}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="size-11 rounded-full bg-[#1877F2] flex items-center justify-center hover:scale-110 transition-all shadow-sm cursor-pointer"
                        title="Facebook"
                      >
                        <Facebook className="h-5 w-5 text-white" />
                      </a>
                    )}
                    {service.youtube && (
                      <a
                        href={service.youtube.startsWith("http") ? service.youtube : `https://${service.youtube}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="size-11 rounded-full bg-[#FF0000] flex items-center justify-center hover:scale-110 transition-all shadow-sm cursor-pointer"
                        title="YouTube"
                      >
                        <Youtube className="h-5 w-5 text-white" />
                      </a>
                    )}
                    {service.tiktok && (
                      <a
                        href={service.tiktok.startsWith("http") ? service.tiktok : `https://${service.tiktok}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="size-11 rounded-full bg-black flex items-center justify-center hover:scale-110 transition-all shadow-sm cursor-pointer"
                        title="TikTok"
                      >
                        <span className="text-white font-extrabold text-xs">d</span>
                      </a>
                    )}
                    {service.otra_red && (
                      <a
                        href={service.otra_red.startsWith("http") ? service.otra_red : `https://${service.otra_red}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="size-11 rounded-full bg-slate-800 flex items-center justify-center hover:scale-110 transition-all shadow-sm cursor-pointer"
                        title="Enlace"
                      >
                        <Globe className="h-5 w-5 text-white" />
                      </a>
                    )}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
