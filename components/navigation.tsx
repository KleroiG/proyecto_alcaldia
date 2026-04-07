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
  { href: "/proveedores", label: "Proveedores" },
  { href: "/estadisticas", label: "Estadísticas" },
]

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav className="flex h-16 items-center justify-between lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <MuiscaSunIcon className="h-9 w-9 text-gold" />
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-foreground leading-tight">
                Sogamoso
              </span>
              <span className="text-[10px] font-medium uppercase tracking-widest text-emerald">
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
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-emerald"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex lg:items-center lg:gap-4">
            <Button
              variant="outline"
              className="border-emerald text-emerald hover:bg-emerald hover:text-white"
            >
              Iniciar sesión
            </Button>
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" className="text-foreground">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Abrir menú</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full max-w-sm bg-background p-6">
              <SheetTitle className="sr-only">Menú de navegación</SheetTitle>
              <SheetDescription className="sr-only">
                Navegación principal del sitio de turismo de Sogamoso
              </SheetDescription>
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <Link href="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
                    <MuiscaSunIcon className="h-8 w-8 text-gold" />
                    <span className="text-lg font-bold text-foreground">Sogamoso</span>
                  </Link>
                  <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
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
                      className="text-lg font-medium text-foreground transition-colors hover:text-emerald py-2"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
                <Button className="mt-4 bg-emerald text-white hover:bg-emerald-light">
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
