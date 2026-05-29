"use client"

import React, { createContext, useContext, useState, useCallback, useEffect } from "react"
import { AlertTriangle, Info, CheckCircle, XCircle, X } from "lucide-react"
import { cn } from "@/lib/utils" // Asumiendo que usas la utilidad estándar de shadcn/ui

export type AlertType = "success" | "error" | "info" | "warning"

interface Alert {
  id: string
  type: AlertType
  title: string
  message: string
}

interface AlertContextType {
  showAlert: (type: AlertType, title: string, message: string) => void
}

const AlertContext = createContext<AlertContextType | undefined>(undefined)

export const useAlert = () => {
  const context = useContext(AlertContext)
  if (!context) {
    throw new Error("useAlert debe ser usado dentro de un GlobalAlertProvider")
  }
  return context
}

export const GlobalAlertProvider = ({ children }: { children: React.ReactNode }) => {
  const [alerts, setAlerts] = useState<Alert[]>([])

  const showAlert = useCallback((type: AlertType, title: string, message: string) => {
    const id = Math.random().toString(36).substring(2, 9)
    setAlerts((prev) => [...prev, { id, type, title, message }])
  }, [])

  const removeAlert = useCallback((id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id))
  }, [])

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      {/* Contenedor fijo para las alertas */}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-3 pointer-events-none">
        {alerts.map((alert) => (
          <AlertItem key={alert.id} alert={alert} onRemove={() => removeAlert(alert.id)} />
        ))}
      </div>
    </AlertContext.Provider>
  )
}

// Componente individual de la alerta
const AlertItem = ({ alert, onRemove }: { alert: Alert; onRemove: () => void }) => {
  const [isClosing, setIsClosing] = useState(false)

  // Auto-cierre después de 5 segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose()
    }, 5000)
    return () => clearTimeout(timer)
  }, [])

  const handleClose = () => {
    setIsClosing(true)
    // Esperamos a que termine la animación antes de desmontar
    setTimeout(() => {
      onRemove()
    }, 300) // 300ms coincide con la duración de la animación
  }

  // Configuración de estilos e iconos según el tipo (Basado en la imagen proporcionada)
  const alertStyles = {
    warning: {
      bg: "bg-[#f59e0b]", // Naranja/Ambar
      icon: <AlertTriangle className="w-6 h-6 text-white" />,
    },
    info: {
      bg: "bg-[#2563eb]", // Azul
      icon: <Info className="w-6 h-6 text-white" />,
    },
    success: {
      bg: "bg-[#10b981]", // Verde
      icon: <CheckCircle className="w-6 h-6 text-white" />,
    },
    error: {
      bg: "bg-[#ef4444]", // Rojo
      icon: <XCircle className="w-6 h-6 text-white" />,
    },
  }

  const { bg, icon } = alertStyles[alert.type]

  return (
    <div
      className={cn(
        "pointer-events-auto flex items-start w-[400px] p-4 rounded-md shadow-lg text-white transition-all duration-300 ease-in-out",
        bg,
        isClosing 
          ? "opacity-0 translate-x-8 scale-95" // Animación de salida
          : "animate-in slide-in-from-right-8 fade-in zoom-in-95" // Animación de entrada
      )}
      role="alert"
    >
      <div className="flex-shrink-0 mr-3 mt-0.5">
        {icon}
      </div>
      <div className="flex-1 mr-2">
        <h3 className="font-semibold text-base leading-none mb-1.5">{alert.title}</h3>
        <p className="text-sm opacity-90 leading-snug">{alert.message}</p>
      </div>
      <button
        onClick={handleClose}
        className="flex-shrink-0 ml-auto opacity-70 hover:opacity-100 transition-opacity focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 rounded"
        aria-label="Cerrar alerta"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  )
}