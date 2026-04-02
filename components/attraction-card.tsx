"use client"

import Image from "next/image"
import { Star, MapPin, Clock, ArrowRight } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface AttractionCardProps {
  title: string
  description: string
  image: string
  rating: number
  category: string
  distance: string
  duration: string
  featured?: boolean
}

export function AttractionCard({
  title,
  description,
  image,
  rating,
  category,
  distance,
  duration,
  featured = false,
}: AttractionCardProps) {
  return (
    <Card
      className={cn(
        "group relative overflow-hidden border-0 bg-card shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer",
        featured && "md:col-span-2 md:row-span-2"
      )}
    >
      {/* Image Container */}
      <div className={cn("relative overflow-hidden", featured ? "h-64 md:h-full" : "h-48")}>
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes={featured ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        
        {/* Category Badge */}
        <Badge
          className="absolute top-4 left-4 bg-emerald text-white border-0 font-medium"
        >
          {category}
        </Badge>

        {/* Rating */}
        <div className="absolute top-4 right-4 flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-sm font-semibold shadow-sm">
          <Star className="h-4 w-4 fill-gold text-gold" />
          <span className="text-foreground">{rating.toFixed(1)}</span>
        </div>

        {/* Bottom Content */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className={cn(
            "font-bold text-white text-balance",
            featured ? "text-xl md:text-2xl" : "text-lg"
          )}>
            {title}
          </h3>
          {featured && (
            <p className="mt-2 text-sm text-white/80 line-clamp-2 hidden md:block">
              {description}
            </p>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4">
        {!featured && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {description}
          </p>
        )}
        
        {/* Meta Info */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <MapPin className="h-4 w-4 text-emerald" />
              {distance}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4 text-emerald" />
              {duration}
            </span>
          </div>
          <div className="flex items-center gap-1 text-emerald font-medium opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-sm">Ver más</span>
            <ArrowRight className="h-4 w-4" />
          </div>
        </div>
      </div>
    </Card>
  )
}
