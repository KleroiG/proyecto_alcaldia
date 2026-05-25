"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { MuiscaSunIcon } from "./icon-sol"
import { ROUTES } from "@/lib/routes"

const navLinks = [
  { href: ROUTES.home, label: "Inicio" },
  { href: ROUTES.atractivos, label: "Atractivos" },
  { href: ROUTES.eventos, label: "Eventos" },
  { href: ROUTES.prestadores, label: "Prestadores" },
  { href: ROUTES.estadisticas, label: "Estadísticas" },

]

export function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#60150F] backdrop-blur-md border-b border-white/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav className="flex h-16 items-center justify-between lg:h-20">
          {/* Logo - Redirige al Inicio */}
          <Link href="/" className="flex items-center gap-2 group">
            <Image
              src="/images/LogoEscudoSogamoso.png"
              alt="Logo Sogamoso"
              width={200}
              height={200}
              priority
              style={{ width: "auto", height: "auto" }}
            />
          </Link>

          {/* Desktop Navigation - Rutas principales */}
          <div className="hidden lg:flex lg:items-center lg:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-white/80 transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA - Redirige al Panel Administrativo */}
          <div className="hidden lg:flex lg:items-center lg:gap-4">
            <Link href="/autenticacion">
              <Button
                variant="outline"
                className="border-white/20 bg-transparent text-white hover:bg-white hover:text-[#60150F]"
              >
                Iniciar sesión
              </Button>
            </Link>
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Abrir menú</span>
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="w-full max-w-sm bg-[#60150F] border-l border-white/10 p-6 text-white">
              <SheetTitle className="sr-only">Menú de navegación</SheetTitle>
              <SheetDescription className="sr-only">
                Navegación principal del sitio de turismo de Sogamoso
              </SheetDescription>
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <Link href="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
                    <MuiscaSunIcon className="h-8 w-8 text-gold" />
                    <span className="text-lg font-bold text-white">Sogamoso</span>
                  </Link>
                </div>
                <div className="flex flex-col gap-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className="text-lg font-medium text-white/90 transition-colors hover:text-emerald-400 py-2 border-b border-white/5"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
                {/* Botón Iniciar Sesión móvil */}
                <Link href="/autenticacion" onClick={() => setIsOpen(false)}>
                  <Button className="w-full mt-4 bg-emerald-600 text-white hover:bg-emerald-500 border-none">
                    Iniciar sesión
                  </Button>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </nav>
      </div>
    </header>
  )
}