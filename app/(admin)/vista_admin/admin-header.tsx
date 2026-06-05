"use client"

import { ChevronDown, LogOut, User } from "lucide-react"
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
  avatarUrl?: string
  onLogout?: () => void
  onProfileClick?: () => void
}

export function AdminHeader({
  userName = "Administrador",
  userRole = "Superadministrador",
  avatarUrl,
  onLogout,
  onProfileClick,
}: AdminHeaderProps) {
  return (
    <div className="flex items-center gap-2 sm:gap-4">
      {/* User Profile Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="hidden sm:flex items-center gap-3 px-2 hover:bg-muted"
          >
            <Avatar className="size-8">
              {avatarUrl && (
                <img
                  src={avatarUrl}
                  alt={userName}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="h-full w-full rounded-full object-cover"
                />
              )}
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
          <DropdownMenuItem onClick={onProfileClick}>
            <User className="mr-2 size-4" />
            <span>Perfil</span>
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
