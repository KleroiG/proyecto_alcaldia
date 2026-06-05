"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2, Phone, Mail, MapPin, Award, Languages, Calendar } from "lucide-react"
import { Guia } from "../types"

interface GuiaCardProps {
  guia: Guia
  onEdit: (guia: Guia) => void
  onDelete: (id: string) => void
}

export function GuiaCard({ guia, onEdit, onDelete }: GuiaCardProps) {
  return (
    <div className="relative bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg border border-gray-200 overflow-hidden group hover:shadow-xl transition-shadow">
      {/* Card Header - ID Card Style */}
      <div className="bg-gradient-to-r from-[#6b1d1d] to-[#8b2d2d] px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg
              className="h-6 w-6 text-[#d4a84b]"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <circle cx="12" cy="12" r="5" />
              <path
                d="M12 1v3M12 20v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M1 12h3M20 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
            <span className="text-xs font-semibold text-white/90 tracking-wider">
              SOGAMOSO - CIUDAD DEL SOL
            </span>
          </div>
          <Badge className="bg-[#d4a84b] text-white border-0 text-[10px]">
            GUÍA TURÍSTICO
          </Badge>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4">
        <div className="flex gap-4">
          {/* Default Avatar */}
          <div className="flex-shrink-0">
            <div className="w-24 h-28 bg-gradient-to-b from-gray-100 to-gray-200 rounded-lg border-2 border-gray-300 flex items-center justify-center overflow-hidden">
              <svg
                className="w-16 h-16 text-gray-400"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
            <div className="mt-2 text-center">
              <p className="text-[10px] text-gray-500 font-mono">
                {guia.numero_tarjeta}
              </p>
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 text-lg leading-tight">
              {guia.nombre} {guia.apellido}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5 font-mono">
              {guia.tipo_documento}: {guia.documento}
            </p>

            <div className="mt-3 space-y-1.5">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="h-3.5 w-3.5 text-[#d4a84b]" />
                <span className="truncate">{guia.telefono}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="h-3.5 w-3.5 text-[#d4a84b]" />
                <span className="truncate">{guia.email}</span>
              </div>
              {/*<div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="h-3.5 w-3.5 text-[#d4a84b]" />
                <span className="truncate">{guia.direccion}</span>
              </div>
              */}
            </div>
          </div>
        </div>

        {/* Skills Section */}
        <div className="mt-4 pt-3 border-t border-dashed border-gray-200">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 mb-1.5">
                <Languages className="h-3.5 w-3.5 text-[#6b1d1d]" />
                Idiomas
              </div>
              <div className="flex flex-wrap gap-1">
                {guia.idiomas.map((idioma) => (
                  <Badge
                    key={idioma}
                    variant="outline"
                    className="text-[10px] bg-blue-50 text-blue-700 border-blue-200"
                  >
                    {idioma}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 mb-1.5">
                <Award className="h-3.5 w-3.5 text-[#6b1d1d]" />
                Especialidades
              </div>
              <div className="flex flex-wrap gap-1">
                {guia.especialidades.slice(0, 2).map((esp) => (
                  <Badge
                    key={esp}
                    variant="outline"
                    className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200"
                  >
                    {esp}
                  </Badge>
                ))}
                {guia.especialidades.length > 2 && (
                  <Badge
                    variant="outline"
                    className="text-[10px] bg-gray-50 text-gray-600 border-gray-200"
                  >
                    +{guia.especialidades.length - 2}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Calendar className="h-3.5 w-3.5" />
            <span>Registro: {new Date(guia.fecha_registro).toLocaleDateString('es-CO')}</span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(guia)}
              className="h-8 w-8 p-0 text-gray-600 hover:text-[#6b1d1d] hover:bg-[#6b1d1d]/10"
              aria-label={`Editar ${guia.nombre}`}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(guia.id)}
              className="h-8 w-8 p-0 text-gray-600 hover:text-red-600 hover:bg-red-50"
              aria-label={`Eliminar ${guia.nombre}`}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Decorative stripe */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#d4a84b] via-[#6b1d1d] to-[#d4a84b]" />
    </div>
  )
}
