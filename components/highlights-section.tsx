import { MuiscaSunIcon } from "./muisca-sun-icon"
import { Mountain, Users, Calendar, Award } from "lucide-react"

const highlights = [
  {
    icon: MuiscaSunIcon,
    title: "Herencia Muisca",
    description: "Sogamoso fue el centro ceremonial más importante de la civilización Muisca, hogar del legendario Templo del Sol.",
    color: "text-gold",
    isCustomIcon: true,
  },
  {
    icon: Mountain,
    title: "Naturaleza Imponente",
    description: "Desde páramos místicos hasta lagos cristalinos, descubre ecosistemas únicos en los Andes colombianos.",
    color: "text-emerald",
    isCustomIcon: false,
  },
  {
    icon: Users,
    title: "Hospitalidad Boyacense",
    description: "Experimenta la calidez de nuestra gente y sumérgete en las tradiciones vivas de la región.",
    color: "text-red-vibrant",
    isCustomIcon: false,
  },
  {
    icon: Calendar,
    title: "Festivales Todo el Año",
    description: "Del Festival del Sol y del Acero a las ferias artesanales, siempre hay algo que celebrar.",
    color: "text-gold",
    isCustomIcon: false,
  },
]

export function HighlightsSection() {
  return (
    <section className="bg-secondary py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-emerald mb-2">
            <Award className="h-4 w-4" />
            ¿Por qué visitarnos?
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
            Sogamoso te espera
          </h2>
          <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
            Una ciudad donde la historia milenaria se encuentra con la belleza natural y la tradición viva
          </p>
        </div>

        {/* Highlights Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {highlights.map((highlight, index) => (
            <div
              key={index}
              className="group relative bg-background rounded-xl p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              {/* Icon */}
              <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-muted ${highlight.color}`}>
                {highlight.isCustomIcon ? (
                  <highlight.icon className="h-7 w-7" />
                ) : (
                  <highlight.icon className="h-6 w-6" />
                )}
              </div>

              {/* Content */}
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {highlight.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {highlight.description}
              </p>

              {/* Decorative line */}
              <div className="absolute bottom-0 left-6 right-6 h-0.5 bg-gradient-to-r from-emerald via-gold to-red-vibrant opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
