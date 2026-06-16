"use client"

import { ChevronDown, LogOut, User } from "lucide-react"
import { cn } from "@/lib/utils"
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
  const isSuper = userRole.toLowerCase().includes("super");

  return (
    <div className="flex items-center gap-2 sm:gap-4">
      {/* User Profile Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="hidden sm:flex items-center gap-3 px-3 py-1.5 hover:bg-gray-100/80 border border-transparent hover:border-gray-200/50 rounded-xl transition-all duration-200 cursor-pointer"
          >
            <div className="size-8 rounded-full overflow-hidden bg-gradient-to-tr from-[#60150F] to-[#8b2d2d] flex items-center justify-center shrink-0 shadow-sm border border-[#60150F]/20">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={userName}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                  onError={(e) => { e.currentTarget.style.display = "none" }}
                />
              ) : (
                <span className="text-xs font-bold text-white uppercase">
                  {userName.charAt(0)}
                </span>
              )}
            </div>
            <div className="hidden md:flex flex-col items-start text-left gap-0.5">
              <span className="text-sm font-semibold text-gray-800 tracking-wide">
                {userName}
              </span>
              <Badge
                variant="outline"
                className={cn(
                  "text-[9px] font-bold uppercase tracking-wider px-2 py-0 h-4 rounded-full",
                  isSuper
                    ? "bg-gradient-to-r from-amber-500/10 to-yellow-500/10 text-amber-700 border-amber-300"
                    : "bg-[#60150F]/5 text-[#60150F] border-[#60150F]/20"
                )}
              >
                {userRole}
              </Badge>
            </div>
            <ChevronDown className="size-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 p-1.5 rounded-xl shadow-lg border border-gray-100 bg-white">
          <DropdownMenuLabel className="text-xs font-bold text-gray-400 px-2.5 py-1.5 uppercase tracking-wider">Mi Cuenta</DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-gray-100" />
          <DropdownMenuItem onClick={onProfileClick} className="rounded-lg px-2.5 py-2 text-sm text-gray-700 hover:bg-gray-50 focus:bg-gray-50 cursor-pointer">
            <User className="mr-2.5 size-4 text-gray-500" />
            <span className="font-medium">Mi Perfil</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-gray-100" />
          <DropdownMenuItem
            onClick={onLogout}
            className="rounded-lg px-2.5 py-2 text-sm text-red-600 hover:bg-red-50 focus:bg-red-50 focus:text-red-700 cursor-pointer"
          >
            <LogOut className="mr-2.5 size-4 text-red-500" />
            <span className="font-semibold">Cerrar Sesión</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
