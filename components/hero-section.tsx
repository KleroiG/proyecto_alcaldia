import Image from "next/image"
import { Button } from "@/components/ui/button"
import { MapPin, Calendar, Compass } from "lucide-react"
import { MuiscaSunIcon } from "./icon-sol"

export function HeroSection() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-sogamoso.jpg"
          alt="Majestic landscape of Sogamoso Valley, Boyacá, Colombia"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
      </div>

      {/* Decorative Muisca Sun Patterns */}
      <div className="absolute top-24 right-8 opacity-10 lg:opacity-20 pointer-events-none">
        <MuiscaSunIcon className="h-32 w-32 lg:h-48 lg:w-48 text-gold" />
      </div>
      <div className="absolute bottom-32 left-8 opacity-10 lg:opacity-15 pointer-events-none">
        <MuiscaSunIcon className="h-24 w-24 lg:h-36 lg:w-36 text-gold" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen items-center">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pt-20">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm px-4 py-2 text-sm font-medium text-white border border-white/20">
              <MapPin className="h-4 w-4 text-gold" />
              Boyacá, Colombia
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl text-balance">
              Sogamoso
              <span className="block text-gold">Ciudad del Sol</span>
            </h1>

            {/* Subtitle */}
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/90 sm:text-xl">
              Descubre el legado ancestral de la cultura Muisca, paisajes de ensueño y la calidez de nuestra gente en el corazón de los Andes colombianos.
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Button
                size="lg"
                className="bg-emerald text-white hover:bg-emerald-light font-semibold text-base px-8 h-12 shadow-lg shadow-emerald/30"
              >
                <Compass className="mr-2 h-5 w-5" />
                Explorar destinos
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white bg-white/10 backdrop-blur-sm hover:bg-white hover:text-foreground font-semibold text-base px-8 h-12"
              >
                <Calendar className="mr-2 h-5 w-5" />
                Ver eventos
              </Button>
            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 gap-4 sm:gap-8 max-w-lg">
              <div className="text-center sm:text-left">
                <div className="text-3xl font-bold text-white sm:text-4xl">50+</div>
                <div className="mt-1 text-sm text-white/70">Sitios turísticos</div>
              </div>
              <div className="text-center sm:text-left">
                <div className="text-3xl font-bold text-white sm:text-4xl">3000</div>
                <div className="mt-1 text-sm text-white/70">Años de historia</div>
              </div>
              <div className="text-center sm:text-left">
                <div className="text-3xl font-bold text-white sm:text-4xl">2600m</div>
                <div className="mt-1 text-sm text-white/70">Altitud</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/70">
        <span className="text-xs uppercase tracking-widest">Descubrir más</span>
        <div className="h-12 w-6 rounded-full border-2 border-white/30 p-1">
          <div className="h-2 w-1.5 rounded-full bg-white animate-bounce mx-auto" />
        </div>
      </div>
    </section>
  )
}
