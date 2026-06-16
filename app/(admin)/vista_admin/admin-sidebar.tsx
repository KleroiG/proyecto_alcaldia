"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { LayoutDashboard, MapPin, Users, Palette, Calendar, Shield, ChevronLeft, ChevronRight, } from "lucide-react"

interface NavItem {
  label: string
  icon: React.ReactNode
  href: string
  active?: boolean
  superadminOnly?: boolean
}

interface AdminSidebarProps {
  isSuperadmin?: boolean
  allowedItems?: string[]
  activeItem?: string
  onNavigate?: (item: string) => void
  collapsed?: boolean
  onToggleCollapse?: () => void
}

export function AdminSidebar({
  isSuperadmin = false,
  allowedItems,
  activeItem = "dashboard",
  onNavigate,
  collapsed = false,
  onToggleCollapse,
}: AdminSidebarProps) {
  const navItems: NavItem[] = [
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
      label: "Eventos",
      icon: <Calendar className="size-5" />,
      href: "events",
    },
    {
      label: "Servicios Culturales",
      icon: <Palette className="size-5" />,
      href: "cultural-services",
    },
    {
      label: "Dashboard",
      icon: <LayoutDashboard className="size-5" />,
      href: "dashboard",
    },
    {
      label: "Gestión de Roles",
      icon: <Shield className="size-5" />,
      href: "roles",
      superadminOnly: true,
    },
  ]

  const filteredNavItems = navItems.filter((item) => {
    if (item.superadminOnly) {
      return isSuperadmin
    }

    return !allowedItems || allowedItems.includes(item.href)
  })

  return (
    <aside
      className={cn(
        "flex h-screen flex-col bg-gradient-to-b from-[#60150F] via-[#470f0b] to-[#260705] text-white transition-all duration-300 border-r border-white/10 shadow-xl shrink-0 z-20",
        collapsed ? "w-20" : "w-72"
      )}
    >
      {/* Logo Area */}
      <div className="flex items-center gap-3 border-b border-white/10 px-4 py-6">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-white/15 to-white/5 border border-white/10 shadow-md shadow-yellow-500/10">
          <MapPin className="size-6 text-yellow-400 animate-pulse" />
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <span className="text-base font-bold text-white tracking-tight leading-tight">
              Turismo Sogamoso
            </span>
            <span className="text-[10px] text-yellow-400/80 font-bold uppercase tracking-widest mt-0.5">
              Panel de Control
            </span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1.5 overflow-y-auto px-3 py-6">
        {filteredNavItems.map((item) => {
          const isActive = activeItem === item.href
          return (
            <button
              key={item.href}
              onClick={() => onNavigate?.(item.href)}
              className={cn(
                "flex w-full items-center gap-3 px-3 py-3 text-sm font-medium transition-all duration-200 relative group overflow-hidden",
                isActive
                  ? "bg-white/10 text-white shadow-inner border-l-4 border-yellow-400 rounded-r-lg pl-2"
                  : "text-white/70 hover:bg-white/5 hover:text-white hover:pl-4 rounded-lg"
              )}
            >
              {/* Active glow background effect */}
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/5 to-transparent pointer-events-none" />
              )}
              <span
                className={cn(
                  "shrink-0 transition-colors duration-200 group-hover:scale-110",
                  isActive ? "text-yellow-400" : "text-white/50 group-hover:text-yellow-400/80"
                )}
              >
                {item.icon}
              </span>
              {!collapsed && (
                <span className="truncate tracking-wide">{item.label}</span>
              )}
              {!collapsed && item.superadminOnly && isSuperadmin && (
                <Badge
                  variant="secondary"
                  className="ml-auto bg-yellow-400/20 text-yellow-400 border border-yellow-400/30 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5"
                >
                  Super
                </Badge>
              )}
            </button>
          )
        })}
      </nav>

      {/* Collapse Toggle */}
      <div className="border-t border-white/10 p-3 bg-black/10">
        <button
          onClick={onToggleCollapse}
          className="flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm text-white/60 hover:bg-white/5 hover:text-white transition-all duration-200"
        >
          {collapsed ? (
            <ChevronRight className="size-5 text-yellow-400" />
          ) : (
            <>
              <ChevronLeft className="size-5 text-white/50" />
              <span className="tracking-wide">Colapsar menú</span>
            </>
          )}
        </button>
      </div>
    </aside>
  )
}
