import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react"

const footerLinks = {
  explore: [
    { label: "Atractivos turísticos", href: "/atractivos" },
    { label: "Eventos", href: "/eventos" },
  ],
services: [
  { label: "Hospedaje", href: "/prestadores_servicios?category=hoteles" },
  { label: "Restaurantes", href: "/prestadores_servicios?category=restaurantes" },
  { label: "Transporte", href: "/prestadores_servicios?category=agencias" },
  { label: "Guías turísticos", href: "/prestadores_servicios?category=guias" },
],
  about: [
    { label: "Sobre Sogamoso", href: "/sobre-sogamoso" },
    { label: "Historia", href: "/historia" },
    { label: "Contacto", href: "/contacto" },
  ],
}

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Youtube, href: "#", label: "YouTube" },
]

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
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

            {/* Contact Info */}
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

            {/* Social Links */}
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

          {/* Link Columns */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-background">
              Explorar
            </h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.explore.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-background/70 transition-colors hover:text-gold"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-background">
              Servicios
            </h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-background/70 transition-colors hover:text-gold"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-background">
              Información
            </h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.about.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-background/70 transition-colors hover:text-gold"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
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
  )
}
