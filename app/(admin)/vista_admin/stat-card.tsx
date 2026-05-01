"use client"

import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

interface StatCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  trend?: {
    value: number
    label: string
  }
  className?: string
}

export function StatCard({
  title,
  value,
  icon,
  trend,
  className,
}: StatCardProps) {
  const getTrendIcon = () => {
    if (!trend) return null
    if (trend.value > 0) return <TrendingUp className="size-4" />
    if (trend.value < 0) return <TrendingDown className="size-4" />
    return <Minus className="size-4" />
  }

  const getTrendColor = () => {
    if (!trend) return ""
    if (trend.value > 0) return "text-primary"
    if (trend.value < 0) return "text-destructive"
    return "text-muted-foreground"
  }

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-muted-foreground">
              {title}
            </span>
            <span className="text-3xl font-bold text-foreground">{value}</span>
            {trend && (
              <div className={cn("flex items-center gap-1 text-sm", getTrendColor())}>
                {getTrendIcon()}
                <span className="font-medium">
                  {trend.value > 0 ? "+" : ""}
                  {trend.value}%
                </span>
                <span className="text-muted-foreground">{trend.label}</span>
              </div>
            )}
          </div>
          <div className="flex size-12 items-center justify-center rounded-xl bg-accent/20">
            <span className="text-accent">{icon}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
