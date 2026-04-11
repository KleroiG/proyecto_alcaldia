"use client"

import { Menu, MapPin, LayoutDashboard, Users, Palette, Calendar, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

interface NavItem {
  label: string
  icon: React.ReactNode
  href: string
  active?: boolean
  superadminOnly?: boolean
}

interface MobileSidebarProps {
  isSuperadmin?: boolean
  activeItem?: string
  onNavigate?: (item: string) => void
}

export function MobileSidebar({
  isSuperadmin = true,
  activeItem = "dashboard",
  onNavigate,
}: MobileSidebarProps) {
  const navItems: NavItem[] = [
    {
      label: "Dashboard (Estadísticas)",
      icon: <LayoutDashboard className="size-5" />,
      href: "dashboard",
    },
    {
      label: "Atractivos Turísticos",
      icon: <MapPin className="size-5" />,
      href: "attractions",
    },
    {
      label: "Prestadores de Servicios",
      icon: <Users className="size-5" />,
      href: "providers",
    },
    {
      label: "Servicios Culturales",
      icon: <Palette className="size-5" />,
      href: "cultural",
    },
    {
      label: "Eventos",
      icon: <Calendar className="size-5" />,
      href: "events",
    },
    {
      label: "Gestión de Roles",
      icon: <Shield className="size-5" />,
      href: "roles",
      superadminOnly: true,
    },
  ]

  const filteredNavItems = navItems.filter(
    (item) => !item.superadminOnly || isSuperadmin
  )

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="size-5" />
          <span className="sr-only">Abrir menú</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 bg-sidebar p-0">
        <SheetHeader className="border-b border-sidebar-border px-4 py-5">
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-sidebar-accent">
              <MapPin className="size-6 text-accent" />
            </div>
            <div className="flex flex-col">
              <SheetTitle className="text-base font-bold text-sidebar-foreground">
                Turismo Sogamoso
              </SheetTitle>
              <SheetDescription className="text-xs text-sidebar-foreground/70">
                Panel de Administración
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {filteredNavItems.map((item) => {
            const isActive = activeItem === item.href
            return (
              <button
                key={item.href}
                onClick={() => onNavigate?.(item.href)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                )}
              >
                <span
                  className={cn(
                    "shrink-0",
                    isActive ? "text-accent" : "text-sidebar-foreground/70"
                  )}
                >
                  {item.icon}
                </span>
                <span className="truncate">{item.label}</span>
                {item.superadminOnly && isSuperadmin && (
                  <Badge
                    variant="secondary"
                    className="ml-auto bg-accent/20 text-accent text-[10px] px-1.5"
                  >
                    Superadmin
                  </Badge>
                )}
              </button>
            )
          })}
        </nav>
      </SheetContent>
    </Sheet>
  )
}
