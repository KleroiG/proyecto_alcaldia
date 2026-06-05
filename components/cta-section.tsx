"use client"

import { MuiscaSunIcon } from "./icon-sol"
import { Mail } from "lucide-react"

export function CTASection() {
  const scrollToContact = () => {
    const el = document.getElementById("contacto")
    if (el) el.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section className="relative overflow-hidden bg-[#60150F] py-16 sm:py-24">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -left-24 opacity-10">
          <MuiscaSunIcon className="h-72 w-72 text-gold" />
        </div>
        <div className="absolute -bottom-12 -right-12 opacity-10">
          <MuiscaSunIcon className="h-56 w-56 text-gold" />
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.03)_0%,transparent_50%)]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/5 backdrop-blur-sm px-4 py-2 text-sm font-medium text-white border border-white/10">
            <MuiscaSunIcon className="h-4 w-4 text-gold" />
            Planifica tu viaje
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl text-balance">
            Comienza tu aventura en Sogamoso
          </h2>

          <p className="mt-4 text-lg text-white/80 max-w-xl mx-auto">
            ¿Tienes preguntas o necesitas ayuda para planificar tu visita perfecta a la Ciudad del Sol? Escríbenos y con gusto te atendemos.
          </p>

          <div className="mt-8 flex justify-center">
            <button
              onClick={scrollToContact}
              className="inline-flex items-center gap-2 rounded-xl border-2 border-white/30 bg-transparent px-8 h-12 text-base font-semibold text-white hover:bg-white/10 transition-colors"
            >
              <Mail className="h-5 w-5" />
              Contáctanos
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
