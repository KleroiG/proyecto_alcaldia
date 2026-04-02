import { Button } from "@/components/ui/button"
import { MuiscaSunIcon } from "./muisca-sun-icon"
import { ArrowRight, Download, Mail } from "lucide-react"

export function CTASection() {
  return (
    <section className="relative overflow-hidden bg-emerald py-16 sm:py-24">
      {/* Decorative Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -left-24 opacity-10">
          <MuiscaSunIcon className="h-72 w-72 text-gold" />
        </div>
        <div className="absolute -bottom-12 -right-12 opacity-10">
          <MuiscaSunIcon className="h-56 w-56 text-gold" />
        </div>
        {/* Pattern overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.05)_0%,transparent_50%)]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm px-4 py-2 text-sm font-medium text-white border border-white/20">
            <MuiscaSunIcon className="h-4 w-4 text-gold" />
            Planifica tu viaje
          </div>

          {/* Heading */}
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl text-balance">
            Comienza tu aventura en Sogamoso
          </h2>

          {/* Description */}
          <p className="mt-4 text-lg text-white/80 max-w-xl mx-auto">
            Descarga nuestra guía turística gratuita o contáctanos para planificar tu visita perfecta a la Ciudad del Sol
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              className="bg-white text-emerald hover:bg-white/90 font-semibold text-base px-8 h-12 shadow-lg"
            >
              <Download className="mr-2 h-5 w-5" />
              Descargar guía
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white text-white bg-transparent hover:bg-white hover:text-emerald font-semibold text-base px-8 h-12"
            >
              <Mail className="mr-2 h-5 w-5" />
              Contáctanos
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-white/60 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-white">150K+</span>
              <span>Visitantes anuales</span>
            </div>
            <div className="hidden sm:block w-px h-8 bg-white/20" />
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-white">4.8</span>
              <span>Calificación promedio</span>
            </div>
            <div className="hidden sm:block w-px h-8 bg-white/20" />
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-white">100%</span>
              <span>Recomendaciones</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
