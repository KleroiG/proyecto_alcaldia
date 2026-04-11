"use client"

import { Bell, ChevronDown, LogOut, User, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface AdminHeaderProps {
  userName?: string
  userRole?: string
  notificationCount?: number
  onLogout?: () => void
}

export function AdminHeader({
  userName = "Administrador",
  userRole = "Superadministrador",
  notificationCount = 3,
  onLogout,
}: AdminHeaderProps) {
  return (
    <div className="flex items-center gap-2 sm:gap-4">
      {/* Notifications */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="size-5 text-muted-foreground" />
            {notificationCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex size-5 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
                {notificationCount}
              </span>
            )}
            <span className="sr-only">Notificaciones</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80">
          <DropdownMenuLabel>Notificaciones</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
            <span className="text-sm font-medium">Nuevo evento creado</span>
            <span className="text-xs text-muted-foreground">
              Festival de la Cultura - hace 2 horas
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
            <span className="text-sm font-medium">Proveedor registrado</span>
            <span className="text-xs text-muted-foreground">
              Hotel El Lago - hace 5 horas
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
            <span className="text-sm font-medium">
              Reporte mensual disponible
            </span>
            <span className="text-xs text-muted-foreground">
              Estadísticas de Marzo 2024
            </span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="justify-center text-primary">
            Ver todas las notificaciones
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* User Profile Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="hidden sm:flex items-center gap-3 px-2 hover:bg-muted"
          >
            <Avatar className="size-8">
              <AvatarImage src="/placeholder-avatar.jpg" alt={userName} />
              <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                {userName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="hidden md:flex flex-col items-start text-left">
              <span className="text-sm font-medium text-foreground">
                {userName}
              </span>
              <Badge
                variant="secondary"
                className="h-5 bg-primary/10 text-primary text-[10px] px-1.5"
              >
                {userRole}
              </Badge>
            </div>
            <ChevronDown className="size-4 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <User className="mr-2 size-4" />
            <span>Perfil</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 size-4" />
            <span>Configuración</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={onLogout}
            className="text-destructive focus:bg-destructive/10 focus:text-destructive"
          >
            <LogOut className="mr-2 size-4" />
            <span>Cerrar Sesión</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Logout Button */}
      <Button
        variant="destructive"
        size="sm"
        onClick={onLogout}
        className="gap-2"
      >
        <LogOut className="size-4" />
        <span className="hidden sm:inline">Cerrar Sesión</span>
      </Button>
    </div>
  )
}
