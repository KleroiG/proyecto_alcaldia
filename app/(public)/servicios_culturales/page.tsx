"use client"

import { useEffect, useState, useMemo } from "react"
import { MuiscaSunIcon } from "@/components/icon-sol"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Filter, Search, Palette, Loader2 } from "lucide-react"
import {
  getCulturalServices,
  getArtisticAreas,
  getProfileTypesSc,
  type CulturalService,
  type ArtisticArea,
  type ProfileTypeSc,
} from "@/lib/cultural-services"
import { CulturalServiceCard } from "./cultural-service-card"
import { useAlert } from "@/components/global-alert"

export default function CulturalServicesPublicPage() {
  const [services, setServices] = useState<CulturalService[]>([])
  const [areas, setAreas] = useState<ArtisticArea[]>([])
  const [profiles, setProfiles] = useState<ProfileTypeSc[]>([])

  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedArea, setSelectedArea] = useState<string>("all")
  const [selectedProfile, setSelectedProfile] = useState<string>("all")

  const { showAlert } = useAlert()

  const loadData = async () => {
    try {
      setIsLoading(true)
      const [servicesData, areasData, profilesData] = await Promise.all([
        getCulturalServices(),
        getArtisticAreas(),
        getProfileTypesSc(),
      ])
      setServices(servicesData)
      setAreas(areasData)
      setProfiles(profilesData)
    } catch (err: any) {
      console.error(err)
      showAlert("error", "Error", "No se pudieron obtener los servicios culturales de Sogamoso.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // Filtrado reactivo local
  const filteredServices = useMemo(() => {
    return services.filter((item) => {
      const matchesSearch =
        item.nombre_artistico.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.biografia.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.tipo_servicio || "").toLowerCase().includes(searchQuery.toLowerCase())

      const matchesArea =
        selectedArea === "all" || String(item.id_area_artistica) === selectedArea

      const matchesProfile =
        selectedProfile === "all" || String(item.id_tipo_perfil_sc) === selectedProfile

      return matchesSearch && matchesArea && matchesProfile
    })
  }, [services, searchQuery, selectedArea, selectedProfile])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1 pt-24 pb-16">
        <div className="mx-auto max-w-[1370px] px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="relative mb-12">
            <div className="absolute top-0 right-0 opacity-5 pointer-events-none" aria-hidden="true">
              <MuiscaSunIcon className="h-64 w-64 text-gold animate-spin-slow" />
            </div>
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#60150F] mb-3">
              <MuiscaSunIcon className="h-4.5 w-4.5 text-gold" />
              Sogamoso Ciudad del Sol
            </span>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Servicios Culturales y Artistas
            </h1>
            <p className="mt-3 text-base text-gray-600 max-w-3xl leading-relaxed">
              Descubre el talento local de Sogamoso. Explora muralistas, músicos, colectivos de danza, artesanos y formadores que enriquecen nuestra identidad cultural.
            </p>
          </div>

          {/* Filters Bar */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm mb-10 flex flex-col md:flex-row gap-4 items-center">
            {/* Search Input */}
            <div className="relative w-full md:flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <Input
                placeholder="Buscar por artista, técnica, biografía..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full bg-slate-50 border-slate-200 focus-visible:ring-[#60150F] rounded-xl h-11"
              />
            </div>

            {/* Area Filter */}
            <div className="w-full md:w-[240px]">
              <Select value={selectedArea} onValueChange={setSelectedArea}>
                <SelectTrigger className="w-full bg-slate-50 border-slate-200 h-11 rounded-xl">
                  <SelectValue placeholder="Todas las Áreas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las Áreas</SelectItem>
                  {areas.map((a) => (
                    <SelectItem key={a.id} value={String(a.id)}>
                      {a.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Profile Filter */}
            <div className="w-full md:w-[240px]">
              <Select value={selectedProfile} onValueChange={setSelectedProfile}>
                <SelectTrigger className="w-full bg-slate-50 border-slate-200 h-11 rounded-xl">
                  <SelectValue placeholder="Todos los Perfiles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los Perfiles</SelectItem>
                  {profiles.map((p) => (
                    <SelectItem key={p.id} value={String(p.id)}>
                      {p.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Reset Filters */}
            {(searchQuery || selectedArea !== "all" || selectedProfile !== "all") && (
              <Button
                variant="ghost"
                onClick={() => {
                  setSearchQuery("")
                  setSelectedArea("all")
                  setSelectedProfile("all")
                }}
                className="text-[#60150F] hover:bg-[#60150F]/5 text-xs font-semibold cursor-pointer shrink-0 rounded-xl"
              >
                Limpiar filtros
              </Button>
            )}
          </div>

          {/* Results Area */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="h-[380px] animate-pulse rounded-2xl bg-gray-200/60" />
              ))}
            </div>
          ) : (
            <>
              <p className="text-xs text-gray-500 mb-6 font-medium tracking-wide">
                {filteredServices.length} {filteredServices.length === 1 ? "artista encontrado" : "artistas encontrados"}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredServices.map((service) => (
                  <CulturalServiceCard key={service.id} service={service} />
                ))}
              </div>

              {filteredServices.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="size-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
                    <Palette className="size-8" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">No se encontraron resultados</h3>
                  <p className="text-sm text-gray-500 max-w-sm mt-1 leading-relaxed">
                    Intenta cambiar los términos de búsqueda o los selectores de los filtros.
                  </p>
                </div>
              )}
            </>
          )}

        </div>
      </main>

      <Footer />
    </div>
  )
}
