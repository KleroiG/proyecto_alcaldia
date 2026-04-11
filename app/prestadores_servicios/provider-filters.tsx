"use client"

import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useState } from "react"

const categories = [
  { value: "all", label: "Todos" },
  { value: "hoteles", label: "Hoteles" },
  { value: "restaurantes", label: "Restaurantes" },
  { value: "agencias", label: "Agencias" },
  { value: "guias", label: "Guías" },
  { value: "artesanos", label: "Artesanos" },
]

interface ProviderFiltersProps {
  selectedCategory: string
  onCategoryChange: (category: string) => void
  searchQuery: string
  onSearchChange: (query: string) => void
}

export function ProviderFilters({
  selectedCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
}: ProviderFiltersProps) {
  return (
    <div className="space-y-4">
      {/* Category Pills - Horizontal Scrollable */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((category) => (
          <button
            key={category.value}
            onClick={() => onCategoryChange(category.value)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              selectedCategory === category.value
                ? "bg-[#6b1d1d] text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
        <Input
          type="search"
          placeholder="Buscar prestador..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
    </div>
  )
}
