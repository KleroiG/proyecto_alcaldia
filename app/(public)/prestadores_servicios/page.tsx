// Modificación en page.tsx
"use client"

import { useEffect, useState } from "react"
import { Suspense } from "react"
import { gdriveUrl } from "@/lib/events"
import { apiUrl } from "@/lib/api"
import { ProviderCard, type Provider } from "@/app/(public)/prestadores_servicios/provider-card"
import { ProviderFilters } from "@/app/(public)/prestadores_servicios/provider-filters"
import { useSearchParams } from "next/navigation"
import { MuiscaSunIcon } from "@/components/icon-sol"

export default function PrestadoresPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center text-gray-500">Cargando...</div>}>
      <PrestadoresContent />
    </Suspense>
  )
}

function PrestadoresContent() {
  const searchParams = useSearchParams()

  const [providers, setProviders] = useState<Provider[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const categoryParam = searchParams.get("categoria")
    if (categoryParam) {
      setSelectedCategory(categoryParam)
    }
  }, [searchParams])

  useEffect(() => {
    const fetchPrestadores = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const response = await fetch(apiUrl("prestadores-turisticos"))

        if (!response.ok) {
          throw new Error("No se pudo obtener la información de los prestadores.")
        }

        const json = await response.json()

        if (json.success && json.data) {
          const visibleProviders = json.data.filter((item: any) => {
            if (!item) return false;
            const visibleValue = item.isvisible !== undefined ? item.isvisible : item.isVisible;
            return visibleValue === undefined || visibleValue === true || visibleValue === 1 || visibleValue === "1";
          });

          const mapped = visibleProviders.map((item: any) => ({
            ...item,
            imageUrl: gdriveUrl(item.imageUrl || item.url_foto || ""),
          }))
          setProviders(mapped)
        } else {
          throw new Error(json.message || "Error inesperado del servidor.")
        }
      } catch (err: any) {
        setError(err.message || "Error de conexión con el servidor municipal.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchPrestadores()
  }, [])

  // Añadimos "guias" al mapa de categorías
  const categoryMap: Record<string, string> = {
    hoteles: "Hotel",
    restaurantes: "Restaurante",
    agencias: "Agencia",
    guias: "Guia",
  }

  const filteredProviders = providers.filter((provider) => {
    const isVisibleValue = provider.isvisible !== undefined ? provider.isvisible : (provider as any).isVisible;
    const isHidden = isVisibleValue === false || isVisibleValue === 0 || isVisibleValue === "0";
    if (isHidden) return false;

    const matchesCategory =
      selectedCategory === "all" || provider.category === categoryMap[selectedCategory]
    
    // Mejoramos la búsqueda para que también contemple el apellido de los guías
    const fullName = `${provider.name || ""} ${provider.apellido || ""}`.trim().toLowerCase()
    const matchesSearch = fullName.includes(searchQuery.toLowerCase())
      
    return matchesCategory && matchesSearch
  })

  return (
      <div className="min-h-screen bg-gray-50">
        <main className="mx-auto max-w-[1370px] px-4 sm:px-6 lg:px-8 py-8 pt-24">
          {/* Título de la sección */}
          <div className="mb-8">
            <span className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-primary mb-2">
              <MuiscaSunIcon className="h-5 w-5 text-gold" />
              Sogamoso Ciudad del Sol
            </span>
            <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
              Prestadores de Servicios Turísticos y Guías
            </h1>
            <p className="mt-2 text-gray-600">
              Consulte los establecimientos autorizados y profesionales certificados en el municipio de Sogamoso.
            </p>
          </div>

          {/* Filtros */}
          <div className="mb-8">
            <ProviderFilters
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          </div>

          {/* Control de visualización: Cargando, Error o Resultados */}
          {isLoading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="h-40 animate-pulse rounded-2xl bg-gray-200" />
              ))}
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-800">
              <p className="font-semibold">Error institucional:</p>
              <p className="text-sm">{error}</p>
            </div>
          ) : (
            <>
              <p className="mb-6 text-sm text-gray-500">
                {filteredProviders.length} {filteredProviders.length === 1 ? "resultado" : "resultados"} encontrados
              </p>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredProviders.map((provider) => (
                  <ProviderCard
                    key={provider.id}
                    provider={provider}
                  />
                ))}
              </div>

              {filteredProviders.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <h3 className="text-lg font-medium text-gray-900">No se encontraron resultados</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Pruebe cambiando los términos de búsqueda o de categoría.
                  </p>
                </div>
              )}
            </>
          )}
        </main>
      </div>
  )
}