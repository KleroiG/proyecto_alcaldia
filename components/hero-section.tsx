"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MapPin, Calendar, Compass } from "lucide-react"
import { MuiscaSunIcon } from "./icon-sol"
import { gdriveUrl } from "@/lib/events"
import { apiUrl } from "@/lib/api"

const FALLBACK = "/images/hero-sogamoso.jpg"

async function fetchAtractivoImages(): Promise<string[]> {
  try {
    const res = await fetch(apiUrl("tourism"))
    if (!res.ok) return []
    const json = await res.json()
    const items: { fotos?: { url_foto?: string }[] }[] = json?.data ?? []
    const urls: string[] = []
    for (const item of items) {
      if (item.fotos && item.fotos.length > 0) {
        const raw = item.fotos[0].url_foto ?? ""
        const converted = gdriveUrl(raw)
        if (converted) urls.push(converted)
      }
      if (urls.length >= 8) break
    }
    return urls
  } catch {
    return []
  }
}

export function HeroSection() {
  const [images, setImages] = useState<string[]>([FALLBACK])
  const [current, setCurrent] = useState(0)
  const [loaded, setLoaded] = useState<boolean[]>([false])

  useEffect(() => {
    fetchAtractivoImages().then((urls) => {
      if (urls.length > 0) {
        setImages(urls)
        setLoaded(new Array(urls.length).fill(false))
      }
    })
  }, [])

  // Auto-advance carousel
  useEffect(() => {
    if (images.length <= 1) return
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [images.length])

  const markLoaded = (i: number) => {
    setLoaded((prev) => {
      const next = [...prev]
      next[i] = true
      return next
    })
  }

  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      {/* Carousel images */}
      <div className="absolute inset-0">
        {images.map((src, i) => (
          <img
            key={src + i}
            src={src}
            alt=""
            loading={i === 0 ? undefined : "lazy"}
            referrerPolicy="no-referrer"
            onLoad={() => markLoaded(i)}
            onError={(e) => {
              e.currentTarget.src = FALLBACK
              markLoaded(i)
            }}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
              i === current ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
      </div>

      {/* Decorative Muisca Sun */}
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
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm px-4 py-2 text-sm font-medium text-white border border-white/20">
              <MapPin className="h-4 w-4 text-gold" />
              Boyacá, Colombia
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl text-balance">
              Sogamoso
              <span className="block text-gold">Ciudad del Sol</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/90 sm:text-xl">
              Descubre el legado ancestral de la cultura Muisca, paisajes de ensueño y la calidez de nuestra gente en el corazón de los Andes colombianos.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="bg-emerald text-white hover:bg-emerald-light font-semibold text-base px-8 h-12 shadow-lg shadow-emerald/30"
              >
                <Link href="/atractivos">
                  <Compass className="mr-2 h-5 w-5" />
                  Explorar destinos
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-2 border-white text-white bg-white/10 backdrop-blur-sm hover:bg-white hover:text-foreground font-semibold text-base px-8 h-12"
              >
                <Link href="/eventos">
                  <Calendar className="mr-2 h-5 w-5" />
                  Ver eventos
                </Link>
              </Button>
            </div>

            {/* Stats — solo altitud + distancia Bogotá */}
            <div className="mt-12 flex gap-8 max-w-sm">
              <div className="text-center sm:text-left">
                <div className="text-3xl font-bold text-white sm:text-4xl">2600m</div>
                <div className="mt-1 text-sm text-white/70">Altitud</div>
              </div>
              <div className="w-px bg-white/20" />
              <div className="text-center sm:text-left">
                <div className="text-3xl font-bold text-white sm:text-4xl">~185km</div>
                <div className="mt-1 text-sm text-white/70">de Bogotá</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Carousel dots */}
      {images.length > 1 && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === current ? "w-6 bg-white" : "w-2 bg-white/40 hover:bg-white/60"
              }`}
              aria-label={`Ir a imagen ${i + 1}`}
            />
          ))}
        </div>
      )}

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
