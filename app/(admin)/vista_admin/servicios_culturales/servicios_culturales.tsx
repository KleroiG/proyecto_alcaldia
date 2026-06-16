"use client"

import { Palette } from "lucide-react"

export function ServiciosCulturalesPage() {
  return (
    <div className="p-4 md:p-6 lg:p-8 animate-in fade-in duration-500">
      <div className="flex flex-col items-center justify-center min-h-[60vh] rounded-xl border-2 border-dashed border-gray-200 bg-white p-8 text-center shadow-sm">
        <div className="flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
          <Palette className="size-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-gray-800">Servicios Culturales</h2>
          <p className="text-sm text-muted-foreground max-w-sm leading-relaxed mx-auto">
            Este módulo se encuentra actualmente en construcción.
          </p>
        </div>
      </div>
    </div>
  )
}