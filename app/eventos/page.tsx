import { Header } from "@/app/eventos/header"
import { EventFilters } from "@/app/eventos/event-filters"
import { EventCard, type EventStatus } from "@/app/eventos/event-card"

const events: Array<{
  id: string
  title: string
  date: string
  time: string
  location: string
  description: string
  imageUrl: string
  status: EventStatus
}> = [
  {
    id: "1",
    title: "Festival del Sol y del Acero",
    date: "15 de Julio, 2024",
    time: "10:00 AM",
    location: "Plaza de la Villa",
    description:
      "Celebración tradicional que rinde homenaje a la industria siderúrgica y la riqueza cultural de Sogamoso con música, danza y gastronomía típica.",
    imageUrl: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&h=500&fit=crop",
    status: "upcoming",
  },
  {
    id: "2",
    title: "Concierto de Música Andina",
    date: "20 de Julio, 2024",
    time: "6:00 PM",
    location: "Teatro Sogamoso",
    description:
      "Una noche mágica con los mejores exponentes de la música andina colombiana. Disfruta de bandolas, tiples y guitarras en vivo.",
    imageUrl: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&h=500&fit=crop",
    status: "ongoing",
  },
  {
    id: "3",
    title: "Muestra de Danzas Folclóricas",
    date: "10 de Julio, 2024",
    time: "3:00 PM",
    location: "Parque de la Independencia",
    description:
      "Presentación de grupos de danza tradicional de la región, con vestidos típicos y coreografías que celebran nuestra herencia cultural.",
    imageUrl: "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=800&h=500&fit=crop",
    status: "finished",
  },
  {
    id: "4",
    title: "Taller de Cerámica Muisca",
    date: "25 de Julio, 2024",
    time: "9:00 AM",
    location: "Museo Arqueológico",
    description:
      "Aprende las técnicas ancestrales de cerámica utilizadas por la cultura Muisca. Incluye materiales y guía especializada.",
    imageUrl: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&h=500&fit=crop",
    status: "last-spots",
  },
  {
    id: "5",
    title: "Teatro: La Leyenda del Sugamuxi",
    date: "28 de Julio, 2024",
    time: "7:30 PM",
    location: "Casa de la Cultura",
    description:
      "Obra teatral que narra la historia del cacique Sugamuxi y el templo del sol. Una experiencia cultural inolvidable para toda la familia.",
    imageUrl: "https://images.unsplash.com/photo-1503095396549-807759245b35?w=800&h=500&fit=crop",
    status: "upcoming",
  },
  {
    id: "6",
    title: "Feria Gastronómica Regional",
    date: "1 de Agosto, 2024",
    time: "11:00 AM",
    location: "Plaza Principal",
    description:
      "Degusta los sabores tradicionales de Boyacá: cuchuco de trigo, mazamorra chiquita, longaniza y muchos platos más de nuestra cocina típica.",
    imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=500&fit=crop",
    status: "upcoming",
  },
]

export default function EventsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
              Agenda Cultural y de Eventos
            </h1>
            <p className="mt-2 text-gray-600">
              Descubre los eventos culturales que hacen de Sogamoso un destino único
            </p>
          </div>

          {/* Filters Section */}
          <div className="mb-10">
            <EventFilters />
          </div>

          {/* Events Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <EventCard
                key={event.id}
                title={event.title}
                date={event.date}
                time={event.time}
                location={event.location}
                description={event.description}
                imageUrl={event.imageUrl}
                status={event.status}
              />
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#6b1d1d] py-8 text-white">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-white/80">
            © 2024 Sogamoso Turismo y Cultura. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}
