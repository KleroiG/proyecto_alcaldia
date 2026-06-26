"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Plane } from "lucide-react"

// Importamos los 4 formularios especializados
import { HotelForm } from "./hoteles/hotel-form"
import { RestauranteForm } from "./restaurantes/restaurante-form"
import { AgenciaForm } from "./agencias/agencia-form"
import { GuiaForm } from "./guias/guia-form"

// Tipos
import type {Hotel, Restaurante, Agencia} from "./types"

interface PrestadorFormProps {
    prestador?: any | null // Puede ser Prestador (Hotel/Rest/Agencia) o Guia
    onBack: () => void
    onSavePrestador: (data: any) => Promise<void>
    onSaveGuia?: (data: any) => Promise<void> // Añadimos el guardado de guía por si acaso
}

export function PrestadorForm({ prestador, onBack, onSavePrestador, onSaveGuia }: PrestadorFormProps) {
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string>("")

    // Sincronizar si entra un registro para edición
    useEffect(() => {
        if (prestador) {
            if (prestador.categoria) {
                setCategoriaSeleccionada(prestador.categoria)
            }
            else if (prestador.documento || prestador.numero_tarjeta || prestador.idiomas) {
                setCategoriaSeleccionada("Guia")
            }
        }
    }, [prestador])

    // 1. SI ES EDICIÓN: Renderizado directo
    if (prestador) {
        if (categoriaSeleccionada === "Hotel") {
            return <HotelForm hotel={prestador as Hotel} onBack={onBack} onSave={onSavePrestador} />
        }
        if (categoriaSeleccionada === "Restaurante") {
            return <RestauranteForm restaurante={prestador as Restaurante} onBack={onBack} onSave={onSavePrestador} />
        }
        if (categoriaSeleccionada === "Agencia") {
            return <AgenciaForm agencia={prestador as Agencia} onBack={onBack} onSave={onSavePrestador} />
        }
        if (categoriaSeleccionada === "Guia") {
            return ( <GuiaForm guia={prestador} onBack={onBack} onSave={onSaveGuia ? onSaveGuia : onSavePrestador}  />
            )
        }
    }

    // 2. SI ES CREACIÓN Y YA SELECCIONÓ UNA CATEGORÍA
    if (categoriaSeleccionada === "Hotel") {
        return <HotelForm onBack={() => setCategoriaSeleccionada("")} onSave={onSavePrestador} />
    }
    if (categoriaSeleccionada === "Restaurante") {
        return <RestauranteForm onBack={() => setCategoriaSeleccionada("")} onSave={onSavePrestador} />
    }
    if (categoriaSeleccionada === "Agencia") {
        return <AgenciaForm onBack={() => setCategoriaSeleccionada("")} onSave={onSavePrestador} />
    }
    if (categoriaSeleccionada === "Guia") {
        return <GuiaForm onBack={() => setCategoriaSeleccionada("")} onSave={onSaveGuia ? onSaveGuia : onSavePrestador} />
    }

    // 3. PANTALLA INICIAL DE CREACIÓN: Selector de Categoría
    return (
        <div className="max-w-xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-[#6b1d1d] to-[#8b2d2d] px-6 py-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Plane className="h-5 w-5" />
                    Nuevo Registro Turístico
                </h2>
                <Button variant="ghost" onClick={onBack} className="text-white hover:bg-white/10">
                    <ArrowLeft className="h-4 w-4 mr-2" /> Cancelar
                </Button>
            </div>

            <div className="p-6 space-y-6">
                <div className="space-y-2">
                    <Label className="text-gray-700 font-medium">¿Qué tipo de actor turístico deseas registrar?</Label>
                    <Select onValueChange={(value) => setCategoriaSeleccionada(value)}>
                        <SelectTrigger className="w-full h-12 text-base">
                            <SelectValue placeholder="Selecciona una opción..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Hotel" className="py-3 text-base">🏨 Hotel / Alojamiento</SelectItem>
                            <SelectItem value="Restaurante" className="py-3 text-base">🍴 Restaurante / Gastronomía</SelectItem>
                            <SelectItem value="Agencia" className="py-3 text-base">💼 Agencia de Viajes / Operadora</SelectItem>
                            <SelectItem value="Guia" className="py-3 text-base">🤠 Guía de Turismo</SelectItem> {/* <-- Nueva opción */}
                        </SelectContent>
                    </Select>
                </div>
                <p className="text-xs text-gray-400 text-center">
                    Dependiendo de la selección, se habilitarán los campos legales y técnicos requeridos por el sistema.
                </p>
            </div>
        </div>
    )
}