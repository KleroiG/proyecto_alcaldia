"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Menu, X } from "lucide-react"
import { MuiscaSunIcon } from "./muisca-sun-icon"

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/eventos", label: "Eventos" },
  { href: "/prestadores", label: "Prestadores" },
  { href: "/estadisticas", label: "Estadísticas" },
]

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#60150F] backdrop-blur-md border-b border-white/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav className="flex h-16 items-center justify-between lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <MuiscaSunIcon className="h-9 w-9 text-gold transition-transform group-hover:scale-110" />
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-white leading-tight">
                Sogamoso
              </span>
              <span className="text-[10px] font-medium uppercase tracking-widest text-emerald-400">
                Turismo y Cultura
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
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

          {/* Desktop CTA */}
          <div className="hidden lg:flex lg:items-center lg:gap-4">
            <Button
              variant="outline"
              className="border-white/20 bg-transparent text-white hover:bg-white hover:text-[#60150F]"
            >
              Iniciar sesión
            </Button>
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Abrir menú</span>
              </Button>
            </SheetTrigger>
            {/* SheetContent ajustado para mantener la coherencia visual */}
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
                  <Button variant="ghost" size="icon" className="text-white" onClick={() => setIsOpen(false)}>
                    <X className="h-6 w-6" />
                    <span className="sr-only">Cerrar menú</span>
                  </Button>
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
                <Button className="mt-4 bg-emerald-600 text-white hover:bg-emerald-500 border-none">
                  Iniciar sesión
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </nav>
      </div>
    </header>
  )
}