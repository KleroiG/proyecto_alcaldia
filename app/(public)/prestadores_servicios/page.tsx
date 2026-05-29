// Modificación en page.tsx
"use client"

import { useEffect, useState } from "react"
import { Suspense } from "react"
import { ProviderCard, type Provider } from "@/app/(public)/prestadores_servicios/provider-card"
import { ProviderFilters } from "@/app/(public)/prestadores_servicios/provider-filters"
import { useSearchParams } from "next/navigation"

export default function PrestadoresPage() {
  const searchParams = useSearchParams()

  // Estados de control asíncronos obligatorios
  const [providers, setProviders] = useState<Provider[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Estados de filtrado local
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  // Sincronizar categoría inicial desde la URL si existe
  useEffect(() => {
    const categoryParam = searchParams.get("categoria")
    if (categoryParam) {
      setSelectedCategory(categoryParam)
    }
  }, [searchParams])

  // Petición única de datos al Backend unificado (BFF)
  useEffect(() => {
    const fetchPrestadores = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Ajusta la URL base según tus variables de entorno (ej: process.env.NEXT_PUBLIC_API_URL)
        const response = await fetch("http://localhost:8000/api/prestadores-turisticos")

        if (!response.ok) {
          throw new Error("No se pudo obtener la información de los prestadores.")
        }

        const json = await response.json()
        if (json.success) {
          setProviders(json.data)
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

  // Diccionario inverso para mapear slugs de URL/Filtros con las categorías del Backend
  const categoryMap: Record<string, string> = {
    hoteles: "Hotel",
    restaurantes: "Restaurante",
    agencias: "Agencia",
  }

  // Filtrado reactivo en memoria (Alta eficiencia en Front una vez descargados los datos)
  const filteredProviders = providers.filter((provider) => {
    const matchesCategory =
      selectedCategory === "all" || provider.category === categoryMap[selectedCategory]
    const matchesSearch =
      provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      provider.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <Suspense fallback={<div className="p-20 text-center">Cargando filtros...</div>}>
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8 pt-24">
        {/* Título de la sección */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
            Prestadores de Servicios Turísticos
          </h1>
          <p className="mt-2 text-gray-600">
            Consulte los establecimientos autorizados y certificados en el municipio de Sogamoso.
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
          <div className="grid gap-6 md:grid-cols-2">
            {[1, 2, 3, 4].map((n) => (
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
                <h3 className="text-lg font-medium text-gray-900">No se encontraron prestadores</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Pruebe cambiando los términos de búsqueda o de categoría.
                </p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
    </Suspense>
  )
}