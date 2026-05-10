"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { ProviderCard, type Provider, type ProviderCategory } from "@/app/(public)/prestadores_servicios/provider-card"
import { ProviderFilters } from "@/app/(public)/prestadores_servicios/provider-filters"


// Sample provider data
const providers: Provider[] = [
  {
    id: "1",
    name: "Artesanías del Sol",
    category: "Artesano",
    description: "Taller de cerámica y alfarería tradicional. Piezas únicas inspiradas en la cultura Muisca.",
    address: "Cra 11 #12-45, Centro Histórico",
    phone: "+57 310 234 5678",
    imageUrl: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400&h=300&fit=crop",
  },
  {
    id: "2",
    name: "Hotel Plaza Sogamoso",
    category: "Hotel",
    description: "Hotel boutique en el corazón de la ciudad con vistas a la plaza principal.",
    address: "Calle 13 #10-20, Plaza Central",
    phone: "+57 8 770 1234",
    imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop",
  },
  {
    id: "3",
    name: "Restaurante El Fogón Muisca",
    category: "Restaurante",
    description: "Gastronomía típica boyacense con ingredientes frescos de la región.",
    address: "Cra 10 #14-56, Barrio El Carmen",
    phone: "+57 320 987 6543",
    imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop",
  },
  {
    id: "4",
    name: "Viajes Suamox Tours",
    category: "Agencia",
    description: "Agencia especializada en rutas culturales y arqueológicas por Sogamoso y alrededores.",
    address: "Calle 11 #9-32, Centro",
    phone: "+57 315 456 7890",
    imageUrl: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&h=300&fit=crop",
  },
  {
    id: "5",
    name: "María Elena Rodríguez",
    category: "Guía",
    description: "Guía turística certificada. Tours en español, inglés y francés por el Templo del Sol.",
    address: "Museo Arqueológico de Sogamoso",
    phone: "+57 311 222 3344",
    imageUrl: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400&h=300&fit=crop",
  },
  {
    id: "6",
    name: "Posada La Montaña",
    category: "Hotel",
    description: "Hospedaje campestre con habitaciones acogedoras y desayuno tradicional incluido.",
    address: "Vereda San Cristóbal, Km 5",
    phone: "+57 8 770 5678",
    imageUrl: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop",
  },
  {
    id: "7",
    name: "Tejidos Ancestrales",
    category: "Artesano",
    description: "Ruanas, mantas y tejidos elaborados a mano con técnicas tradicionales boyacenses.",
    address: "Cra 9 #15-78, Sector Artesanal",
    phone: "+57 318 765 4321",
    imageUrl: "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=400&h=300&fit=crop",
  },
  {
    id: "8",
    name: "Asadero El Toro Dorado",
    category: "Restaurante",
    description: "Las mejores carnes a la brasa y platos típicos en un ambiente familiar.",
    address: "Av Principal #20-15",
    phone: "+57 322 111 4455",
    imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop",
  },
]

const categoryMap: Record<string, ProviderCategory | null> = {
  all: null,
  hoteles: "Hotel",
  hospedaje: "Hotel", // Soporte para el link del footer
  restaurantes: "Restaurante",
  agencias: "Agencia",
  guias: "Guía",
  artesanos: "Artesano",
}

// 1. Componente de lógica interna que consume useSearchParams
function PrestadoresContent() {
  const searchParams = useSearchParams()
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const category = searchParams.get("category") || "all"
    setSelectedCategory(category)
  }, [searchParams])

  const filteredProviders = providers.filter((provider) => {
    const categoryFilter = categoryMap[selectedCategory]
    const matchesCategory = !categoryFilter || provider.category === categoryFilter
    const matchesSearch = !searchQuery || 
      provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      provider.description.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesCategory && matchesSearch
  })

  return (
    <main className="mx-auto max-w-7xl px-4 pb-12 pt-24 lg:px-8 lg:pt-28">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#1a1a1a] md:text-3xl lg:text-4xl text-balance">
          Directorio de Prestadores de Servicios
        </h1>
        <p className="mt-2 text-gray-600">
          Encuentra los mejores servicios turísticos en Sogamoso
        </p>
      </div>

      <div className="mb-8">
        <ProviderFilters
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </div>

      <p className="mb-6 text-sm text-gray-500">
        {filteredProviders.length} {filteredProviders.length === 1 ? "resultado" : "resultados"} encontrados
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        {filteredProviders.map((provider) => (
          <ProviderCard key={provider.id} provider={provider} />
        ))}
      </div>

      {filteredProviders.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <h3 className="text-lg font-semibold text-gray-900">No se encontraron resultados</h3>
          <p className="mt-1 text-sm text-gray-500">Intenta ajustar los filtros o la búsqueda</p>
        </div>
      )}
    </main>
  )
}

// 2. Exportación principal envuelta en Suspense para habilitar el build estático
export default function PrestadoresPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-gray-500 animate-pulse">Cargando directorio de servicios...</p>
        </div>
      }>
        <PrestadoresContent />
      </Suspense>
    </div>
  )
}