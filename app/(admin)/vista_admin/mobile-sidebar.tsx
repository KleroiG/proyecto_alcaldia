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
  allowedItems?: string[]
  activeItem?: string
  onNavigate?: (item: string) => void
}

export function MobileSidebar({
  isSuperadmin = false,
  allowedItems,
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
      href: "prestadores",
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

  const filteredNavItems = navItems.filter((item) => {
    if (item.superadminOnly && !isSuperadmin) {
      return false
    }

    return !allowedItems || allowedItems.includes(item.href)
  })

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="size-5" />
          <span className="sr-only">Abrir menú</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 bg-[#60150F] p-0 text-white border-r border-white/10 ">
        <SheetHeader className="border-b border-white/10 px-4 py-5">
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white/10">
              <MapPin className="size-6 text-yellow-400" />
            </div>
            <div className="flex flex-col">
              <SheetTitle className="text-base font-bold text-white tracking-tight">
                Turismo Sogamoso
              </SheetTitle>
              <SheetDescription className="text-xs text-white/50 font-medium uppercase tracking-wider">
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
                    ? "bg-white/15 text-white shadow-sm"
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                )}
              >
                <span
                  className={cn(
                    "shrink-0",
                    isActive ? "text-yellow-400" : "text-white/50"
                  )}
                >
                  {item.icon}
                </span>
                <span className="truncate">{item.label}</span>
                {item.superadminOnly && isSuperadmin && (
                  <Badge
                    variant="secondary"
                    className="ml-auto bg-yellow-400/20 text-yellow-400 border-none text-[10px] px-1.5"                  >
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
