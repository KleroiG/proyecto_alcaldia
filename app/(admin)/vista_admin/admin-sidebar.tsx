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
    <aside
      className={cn(
        "sticky top-0 flex h-screen flex-col bg-[#60150F] text-white transition-all duration-300 border-r border-white/10",
        collapsed ? "w-20" : "w-72"
      )}
    >
      {/* Logo Area */}
      <div className="flex items-center gap-3 border-b border-white/10 px-4 py-6">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white/10">
          <MapPin className="size-6 text-yellow-400" />
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <span className="text-base font-bold text-white tracking-tight">
              Turismo Sogamoso
            </span>
            <span className="text-xs text-white/50 font-medium uppercase tracking-wider">
              Admin Panel
            </span>
          </div>
        )}
      </div>

      {/* Navigation */}
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
                  "shrink-0 transition-colors",
                  isActive ? "text-yellow-400" : "text-white/50"
                )}
              >
                {item.icon}
              </span>
              {!collapsed && (
                <span className="truncate">{item.label}</span>
              )}
              {!collapsed && item.superadminOnly && isSuperadmin && (
                <Badge
                  variant="secondary"
                  className="ml-auto bg-yellow-400/20 text-yellow-400 border-none text-[10px] px-1.5"
                >
                  Superadmin
                </Badge>
              )}
            </button>
          )
        })}
      </nav>

      {/* Collapse Toggle */}
      <div className="border-t border-white/10 p-3">
        <button
          onClick={onToggleCollapse}
          className="flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm text-white/60 hover:bg-white/5 hover:text-white transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="size-5" />
          ) : (
            <>
              <ChevronLeft className="size-5" />
              <span>Colapsar menú</span>
            </>
          )}
        </button>
      </div>
    </aside>
  )
}
