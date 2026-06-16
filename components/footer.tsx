"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin, X, Send } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

const CONTACT_EMAIL = "turismo@sogamoso.gov.co"

const footerLinks = {
  explore: [
    { label: "Atractivos turísticos", href: "/atractivos" },
    { label: "Eventos", href: "/eventos" },
    { label: "Servicios culturales", href: "/servicios_culturales" },
  ],
  services: [
    { label: "Hospedaje", href: "/prestadores_servicios?category=hoteles" },
    { label: "Restaurantes", href: "/prestadores_servicios?category=restaurantes" },
    { label: "Guías turísticos", href: "/prestadores_servicios?category=guias" },
  ],
}

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Youtube, href: "#", label: "YouTube" },
]

function ContactModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({ nombre: "", correo: "", asunto: "", mensaje: "" })
  const [sent, setSent] = useState(false)

  const update = (k: keyof typeof form, v: string) => setForm((p) => ({ ...p, [k]: v }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const subject = encodeURIComponent(form.asunto || "Contacto desde el sitio web")
    const body = encodeURIComponent(
      `Nombre: ${form.nombre}\nCorreo: ${form.correo}\n\n${form.mensaje}`
    )
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`
    setSent(true)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between bg-[#60150F] px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-white">Contáctanos</h2>
            <p className="text-xs text-white/70">{CONTACT_EMAIL}</p>
          </div>
          <button
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Form */}
        {sent ? (
          <div className="flex flex-col items-center gap-3 px-6 py-10 text-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-green-100">
              <Send className="size-6 text-green-600" />
            </div>
            <p className="text-base font-semibold text-gray-900">¡Listo!</p>
            <p className="text-sm text-gray-500">
              Se abrió tu cliente de correo con el mensaje. Recuerda enviarlo desde ahí.
            </p>
            <Button onClick={onClose} className="mt-2 bg-[#60150F] hover:bg-[#7a1a12] text-white">
              Cerrar
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="c-nombre" className="text-xs">Nombre</Label>
                <Input
                  id="c-nombre"
                  placeholder="Tu nombre"
                  value={form.nombre}
                  onChange={(e) => update("nombre", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="c-correo" className="text-xs">Tu correo</Label>
                <Input
                  id="c-correo"
                  type="email"
                  placeholder="tu@correo.com"
                  value={form.correo}
                  onChange={(e) => update("correo", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="c-asunto" className="text-xs">Asunto</Label>
              <Input
                id="c-asunto"
                placeholder="¿En qué podemos ayudarte?"
                value={form.asunto}
                onChange={(e) => update("asunto", e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="c-mensaje" className="text-xs">Mensaje</Label>
              <Textarea
                id="c-mensaje"
                placeholder="Escribe tu mensaje aquí..."
                rows={4}
                value={form.mensaje}
                onChange={(e) => update("mensaje", e.target.value)}
                required
                className="resize-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" className="gap-2 bg-[#60150F] hover:bg-[#7a1a12] text-white">
                <Send className="size-4" />
                Enviar mensaje
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export function Footer() {
  const [contactOpen, setContactOpen] = useState(false)

  return (
    <>
      <footer id="contacto" className="bg-foreground text-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 py-12 sm:grid-cols-2 lg:grid-cols-5 lg:py-16">
            {/* Brand Column */}
            <div className="lg:col-span-2">
              <Link href="/" className="flex items-center gap-3">
                <Image
                  src="/images/LogoEscudoSogamoso.png"
                  alt="Logo Sogamoso"
                  width={250}
                  height={250}
                  className="transition-transform duration-300 group-hover:rotate-8"
                />
              </Link>
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-background/70">
                Descubre la magia de la Ciudad del Sol. Patrimonio cultural, naturaleza exuberante y la calidez de la gente boyacense te esperan.
              </p>

              <div className="mt-6 space-y-2">
                <a href="tel:+5786780000" className="flex items-center gap-2 text-sm text-background/70 hover:text-gold transition-colors">
                  <Phone className="h-4 w-4" />
                  +57 (8) 678 0000
                </a>
                <a href="mailto:turismo@sogamoso.gov.co" className="flex items-center gap-2 text-sm text-background/70 hover:text-gold transition-colors">
                  <Mail className="h-4 w-4" />
                  turismo@sogamoso.gov.co
                </a>
                <div className="flex items-start gap-2 text-sm text-background/70">
                  <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  Calle 11 No. 10-61, Sogamoso, Boyacá
                </div>
              </div>

              <div className="mt-6 flex items-center gap-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-background/10 text-background transition-colors hover:bg-gold hover:text-foreground"
                    aria-label={social.label}
                  >
                    <social.icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Explorar */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-background">
                Explorar
              </h3>
              <ul className="mt-4 space-y-3">
                {footerLinks.explore.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-background/70 transition-colors hover:text-gold">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Servicios */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-background">
                Servicios
              </h3>
              <ul className="mt-4 space-y-3">
                {footerLinks.services.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-background/70 transition-colors hover:text-gold">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Información */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-background">
                Información
              </h3>
              <ul className="mt-4 space-y-3">
                <li>
                  <button
                    onClick={() => setContactOpen(true)}
                    className="text-sm text-background/70 transition-colors hover:text-gold"
                  >
                    Contacto
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-background/10 py-6">
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <p className="text-xs text-background/50">
                © {new Date().getFullYear()} Alcaldía de Sogamoso. Todos los derechos reservados.
              </p>
              <div className="flex items-center gap-4 text-xs text-background/50">
                <Link href="/privacidad" className="hover:text-gold transition-colors">
                  Política de privacidad
                </Link>
                <Link href="/terminos" className="hover:text-gold transition-colors">
                  Términos de uso
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {contactOpen && <ContactModal onClose={() => setContactOpen(false)} />}
    </>
  )
}
