"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Mail, 
  Shield, 
  ShieldCheck, 
  MapPin, 
  Briefcase, 
  Palette, 
  Calendar, 
  BarChart3,
  Save
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Administrator {
  id: string
  name: string
  email: string
  role: "superadmin" | "admin"
  avatar: string
  permissions: {
    atractivos: boolean
    prestadores: boolean
    culturales: boolean
    eventos: boolean
    estadisticas: boolean
  }
}

const administrators: Administrator[] = [
  {
    id: "1",
    name: "María García",
    email: "maria.garcia@sogamoso.gov.co",
    role: "superadmin",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
    permissions: {
      atractivos: true,
      prestadores: true,
      culturales: true,
      eventos: true,
      estadisticas: true,
    },
  },
  {
    id: "2",
    name: "Carlos Gomez",
    email: "carlos.gomez@sogamoso.gov.co",
    role: "admin",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    permissions: {
      atractivos: false,
      prestadores: false,
      culturales: false,
      eventos: true,
      estadisticas: false,
    },
  },
  {
    id: "3",
    name: "Ana Rodríguez",
    email: "ana.rodriguez@sogamoso.gov.co",
    role: "admin",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    permissions: {
      atractivos: true,
      prestadores: true,
      culturales: false,
      eventos: false,
      estadisticas: false,
    },
  },
  {
    id: "4",
    name: "Juan Martínez",
    email: "juan.martinez@sogamoso.gov.co",
    role: "admin",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    permissions: {
      atractivos: false,
      prestadores: false,
      culturales: true,
      eventos: true,
      estadisticas: true,
    },
  },
  {
    id: "5",
    name: "Laura Sánchez",
    email: "laura.sanchez@sogamoso.gov.co",
    role: "admin",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    permissions: {
      atractivos: true,
      prestadores: false,
      culturales: true,
      eventos: false,
      estadisticas: false,
    },
  },
]

const moduleInfo = [
  {
    key: "atractivos" as const,
    label: "Atractivos Turísticos",
    icon: MapPin,
    description: "Gestión de lugares y sitios turísticos",
  },
  {
    key: "prestadores" as const,
    label: "Prestadores de Servicios",
    icon: Briefcase,
    description: "Administración de proveedores turísticos",
  },
  {
    key: "culturales" as const,
    label: "Servicios Culturales",
    icon: Palette,
    description: "Gestión de servicios y actividades culturales",
  },
  {
    key: "eventos" as const,
    label: "Eventos",
    icon: Calendar,
    description: "Administración de eventos y agenda",
  },
  {
    key: "estadisticas" as const,
    label: "Estadísticas",
    icon: BarChart3,
    description: "Acceso a métricas y reportes",
  },
]

function getAccessDescription(permissions: Administrator["permissions"]): string {
  const activeModules = moduleInfo.filter((m) => permissions[m.key])
  
  if (activeModules.length === 0) {
    return "Este usuario no tiene acceso a ningún módulo del sistema."
  }
  
  if (activeModules.length === moduleInfo.length) {
    return "Este usuario tiene acceso completo a todos los módulos del sistema."
  }
  
  if (activeModules.length === 1) {
    return `Este usuario solo tiene acceso a realizar cambios sobre el apartado de ${activeModules[0].label}.`
  }
  
  const moduleNames = activeModules.map((m) => m.label)
  const lastModule = moduleNames.pop()
  return `Este usuario tiene acceso a los módulos de ${moduleNames.join(", ")} y ${lastModule}.`
}

export function RoleManagement() {
  const [selectedUserId, setSelectedUserId] = useState("2") // Carlos Gomez selected by default
  const [userPermissions, setUserPermissions] = useState<Record<string, Administrator["permissions"]>>(
    Object.fromEntries(administrators.map((a) => [a.id, { ...a.permissions }]))
  )
  
  const selectedUser = administrators.find((a) => a.id === selectedUserId)
  const currentPermissions = selectedUser ? userPermissions[selectedUser.id] : null
  const isSuperadmin = selectedUser?.role === "superadmin"
  
  const handlePermissionChange = (moduleKey: keyof Administrator["permissions"], checked: boolean) => {
    if (!selectedUser || isSuperadmin) return
    
    setUserPermissions((prev) => ({
      ...prev,
      [selectedUser.id]: {
        ...prev[selectedUser.id],
        [moduleKey]: checked,
      },
    }))
  }
  
  const handleSaveChanges = () => {
    console.log("Saving permissions for user:", selectedUser?.name, currentPermissions)
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Gestión de Roles</h1>
        <p className="text-muted-foreground">
          Administra los permisos y niveles de acceso de los usuarios del sistema
        </p>
      </div>

      {/* User Grid Section */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Administradores del Sistema</CardTitle>
          <CardDescription>
            Selecciona un usuario para ver y modificar sus permisos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap justify-center gap-6 py-4 sm:gap-8 lg:gap-12">
            {administrators.map((admin) => {
              const isSelected = selectedUserId === admin.id
              const isSuperadminUser = admin.role === "superadmin"
              
              return (
                <button
                  key={admin.id}
                  onClick={() => setSelectedUserId(admin.id)}
                  className="group flex flex-col items-center gap-3 rounded-xl p-3 transition-all duration-300 hover:bg-muted/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <div
                    className={cn(
                      "relative rounded-full p-1 transition-all duration-300",
                      isSelected
                        ? isSuperadminUser
                          ? "ring-4 ring-accent ring-offset-2 ring-offset-background"
                          : "ring-4 ring-primary ring-offset-2 ring-offset-background"
                        : "ring-2 ring-transparent group-hover:ring-muted-foreground/30"
                    )}
                  >
                    <Avatar className="size-20 sm:size-24">
                      <AvatarImage 
                        src={admin.avatar} 
                        alt={admin.name}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                        {admin.name.split(" ").map((n) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    {/* Role indicator badge */}
                    <div
                      className={cn(
                        "absolute -bottom-1 -right-1 rounded-full p-1.5 shadow-md",
                        isSuperadminUser ? "bg-accent" : "bg-primary"
                      )}
                    >
                      {isSuperadminUser ? (
                        <ShieldCheck className="size-4 text-accent-foreground" />
                      ) : (
                        <Shield className="size-4 text-primary-foreground" />
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <span
                      className={cn(
                        "text-sm font-medium transition-colors",
                        isSelected ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                      )}
                    >
                      {admin.name}
                    </span>
                    <Badge
                      variant={isSuperadminUser ? "default" : "secondary"}
                      className={cn(
                        "text-[10px] px-2",
                        isSuperadminUser 
                          ? "bg-accent text-accent-foreground hover:bg-accent/90" 
                          : "bg-primary/10 text-primary"
                      )}
                    >
                      {isSuperadminUser ? "Superadministrador" : "Administrador"}
                    </Badge>
                  </div>
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Selected User Details Section */}
      {selectedUser && currentPermissions && (
        <Card className="shadow-sm transition-all duration-300">
          <CardHeader className="border-b border-border">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="size-14">
                  <AvatarImage 
                    src={selectedUser.avatar} 
                    alt={selectedUser.name}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {selectedUser.name.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <CardTitle className="text-lg">{selectedUser.name}</CardTitle>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="size-4" />
                    {selectedUser.email}
                  </div>
                </div>
              </div>
              <Badge
                variant={isSuperadmin ? "default" : "secondary"}
                className={cn(
                  "w-fit text-xs px-3 py-1",
                  isSuperadmin 
                    ? "bg-accent text-accent-foreground" 
                    : "bg-primary/10 text-primary"
                )}
              >
                {isSuperadmin ? (
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="size-3.5" />
                    Superadministrador
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5">
                    <Shield className="size-3.5" />
                    Administrador
                  </span>
                )}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">
              {/* Access Level Section */}
              <div>
                <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-foreground">
                  <Shield className="size-5 text-primary" />
                  Nivel de Acceso y Permisos
                </h3>
                
                {isSuperadmin ? (
                  <div className="rounded-lg border border-accent/50 bg-accent/10 p-4">
                    <p className="text-sm text-foreground">
                      Los superadministradores tienen acceso completo a todos los módulos del sistema. 
                      No es posible modificar sus permisos.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Access description */}
                    <div className="rounded-lg border border-border bg-muted/30 p-4">
                      <p className="text-sm text-muted-foreground">
                        {getAccessDescription(currentPermissions)}
                      </p>
                    </div>
                    
                    {/* Permission toggles grid */}
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {moduleInfo.map((module) => {
                        const isActive = currentPermissions[module.key]
                        const Icon = module.icon
                        
                        return (
                          <div
                            key={module.key}
                            className={cn(
                              "flex items-center justify-between rounded-lg border p-4 transition-all duration-200",
                              isActive 
                                ? "border-primary/50 bg-primary/5" 
                                : "border-border bg-background"
                            )}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={cn(
                                  "flex size-10 items-center justify-center rounded-lg transition-colors",
                                  isActive 
                                    ? "bg-primary text-primary-foreground" 
                                    : "bg-muted text-muted-foreground"
                                )}
                              >
                                <Icon className="size-5" />
                              </div>
                              <div className="flex flex-col">
                                <span
                                  className={cn(
                                    "text-sm font-medium transition-colors",
                                    isActive ? "text-foreground" : "text-muted-foreground"
                                  )}
                                >
                                  {module.label}
                                </span>
                                <span className="text-[11px] text-muted-foreground">
                                  {isActive ? "Acceso activo" : "Sin acceso"}
                                </span>
                              </div>
                            </div>
                            <Switch
                              checked={isActive}
                              onCheckedChange={(checked) => handlePermissionChange(module.key, checked)}
                              className={cn(
                                isActive && "data-[state=checked]:bg-primary"
                              )}
                            />
                          </div>
                        )
                      })}
                    </div>
                    
                    {/* Save button */}
                    <div className="flex justify-end pt-4">
                      <Button 
                        onClick={handleSaveChanges}
                        className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        <Save className="size-4" />
                        Guardar Cambios
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
