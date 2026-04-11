"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#6b1d1d]">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            {/* Sun Icon */}
            <svg
              className="h-8 w-8 text-[#d4a84b]"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <circle cx="12" cy="12" r="5" />
              <path d="M12 1v3M12 20v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M1 12h3M20 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round"
                fill="none"
              />
            </svg>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-white leading-tight">Sogamoso</span>
              <span className="text-[10px] font-medium tracking-wider text-[#d4a84b]">
                TURISMO Y CULTURA
              </span>
            </div>
          </Link>

          {/* Navigation - Hidden on mobile */}
          <nav className="hidden md:flex items-center gap-8">
            <Link 
              href="/" 
              className="text-sm font-medium text-white/90 hover:text-white transition-colors"
            >
              Inicio
            </Link>
            <Link 
              href="/eventos" 
              className="text-sm font-medium text-white border-b-2 border-white pb-0.5"
            >
              Eventos
            </Link>
            <Link 
              href="/prestadores" 
              className="text-sm font-medium text-white/90 hover:text-white transition-colors"
            >
              Prestadores
            </Link>
            <Link 
              href="/estadisticas" 
              className="text-sm font-medium text-white/90 hover:text-white transition-colors"
            >
              Estadísticas
            </Link>
          </nav>

          {/* Login Button */}
          <Button
            variant="outline"
            className="border-white/50 bg-transparent text-white hover:bg-white/10 hover:text-white"
          >
            Iniciar sesión
          </Button>
        </div>
      </div>
    </header>
  )
}
