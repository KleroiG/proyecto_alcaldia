"use client"

import { useCallback, useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Mail,
  Shield,
  ShieldCheck,
  MapPin,
  Briefcase,
  Palette,
  Calendar,
  BarChart3,
  Save,
  Plus,
  Trash2,
  Loader2,
  RefreshCcw,
  CheckCircle2,
  XCircle,
  UserPlus,
  KeyRound,
  Eye,
  EyeOff,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  type AdminPermissions,
  type AdminUser,
  type CreateAdminPayload,
  changeUserPassword,
  createAdminUser,
  deleteAdminUser,
  getAdminUsers,
  updateUserPermissions,
} from "@/lib/roles"

const MODULE_INFO = [
  {
    key: "perm_atractivos" as const,
    label: "Atractivos Turísticos",
    icon: MapPin,
    description: "Gestión de lugares y sitios turísticos",
  },
  {
    key: "perm_prestadores_servicios" as const,
    label: "Prestadores de Servicios",
    icon: Briefcase,
    description: "Administración de proveedores turísticos",
  },
  {
    key: "perm_servicios_culturales" as const,
    label: "Servicios Culturales",
    icon: Palette,
    description: "Gestión de servicios y actividades culturales",
  },
  {
    key: "perm_agenda_eventos" as const,
    label: "Eventos",
    icon: Calendar,
    description: "Administración de eventos y agenda",
  },
  {
    key: "perm_estadisticas" as const,
    label: "Estadísticas",
    icon: BarChart3,
    description: "Acceso a métricas y reportes",
  },
]

const EMPTY_CREATE_FORM: CreateAdminPayload = {
  id_perfil: "",
  nombre: "",
  apellido: "",
  correo: "",
  password: "",
  fecha_nacimiento: "",
  genero: "",
  telefono: "",
  tipo_identificacion: "",
}

const getDirectDriveLink = (url: string | null | undefined): string | undefined => {
  if (!url || url.trim() === "") return undefined;
  const match = url.match(/\/d\/(.+?)\//);
  if (match && match[1]) {
    return `https://lh3.googleusercontent.com/d/${match[1]}`
  }
  return url
}

function getAccessDescription(permissions: AdminPermissions): string {
  const active = MODULE_INFO.filter((m) => permissions[m.key])
  if (active.length === 0) return "Este usuario no tiene acceso a ningún módulo del sistema."
  if (active.length === MODULE_INFO.length) return "Este usuario tiene acceso completo a todos los módulos del sistema."
  if (active.length === 1) return `Este usuario solo tiene acceso al módulo de ${active[0].label}.`
  const names = active.map((m) => m.label)
  const last = names.pop()
  return `Este usuario tiene acceso a los módulos de ${names.join(", ")} y ${last}.`
}

function getInitials(nombre: string, apellido: string) {
  return [nombre[0], apellido[0]].filter(Boolean).join("").toUpperCase() || "?"
}

function InlineAlert({ type, message }: { type: "success" | "error"; message: string }) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-lg border px-4 py-3 text-sm",
        type === "success"
          ? "border-green-200 bg-green-50 text-green-800"
          : "border-red-200 bg-red-50 text-red-700",
      )}
    >
      {type === "success" ? (
        <CheckCircle2 className="size-4 shrink-0 text-green-600" />
      ) : (
        <XCircle className="size-4 shrink-0 text-red-500" />
      )}
      {message}
    </div>
  )
}

function UserCardSkeleton() {
  return (
    <div className="flex flex-col items-center gap-3 p-3">
      <Skeleton className="size-24 rounded-full" />
      <Skeleton className="h-4 w-24 rounded" />
      <Skeleton className="h-5 w-28 rounded-full" />
    </div>
  )
}
const getMaxDateFor18YearsOld = () => {
  const d = new Date()
  d.setFullYear(d.getFullYear() - 18)
  return d.toISOString().split("T")[0]
}
const MAX_DATE = getMaxDateFor18YearsOld()

export function RoleManagement() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [pendingPermissions, setPendingPermissions] = useState<Record<string, AdminPermissions>>({})
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<AdminUser | null>(null)
  const [createForm, setCreateForm] = useState<CreateAdminPayload>(EMPTY_CREATE_FORM)
  const [createError, setCreateError] = useState("")
  const [pwDialogOpen, setPwDialogOpen] = useState(false)
  const [pwForm, setPwForm] = useState({ password: "", confirm: "" })
  const [pwError, setPwError] = useState("")
  const [isChangingPw, setIsChangingPw] = useState(false)
  const [showPw, setShowPw] = useState(false)
  const [showConfirmPw, setShowConfirmPw] = useState(false)

  const loadUsers = useCallback(async () => {
    try {
      setIsLoading(true)
      setError("")
      const data = await getAdminUsers()
      setUsers(data)
      setPendingPermissions(
        Object.fromEntries(data.map((u) => [u.id, { ...u.permissions }])),
      )
      if (!selectedUserId && data.length > 0) {
        const firstAdmin = data.find((u) => u.role !== "superadmin") ?? data[0]
        setSelectedUserId(firstAdmin.id)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudieron cargar los usuarios.")
    } finally {
      setIsLoading(false)
    }
  }, [selectedUserId])

  useEffect(() => {
    loadUsers()
  }, [])

  const selectedUser = users.find((u) => u.id === selectedUserId) ?? null
  const currentPermissions = selectedUser ? pendingPermissions[selectedUser.id] : null
  const isSuperadmin = selectedUser?.role === "superadmin"

  const handlePermissionChange = (key: keyof AdminPermissions, checked: boolean) => {
    if (!selectedUser || isSuperadmin) return
    setPendingPermissions((prev) => ({
      ...prev,
      [selectedUser.id]: { ...prev[selectedUser.id], [key]: checked },
    }))
    setMessage("")
    setError("")
  }

  const handleSavePermissions = async () => {
    if (!selectedUser || isSuperadmin) return
    setIsSaving(true)
    setMessage("")
    setError("")
    try {
      await updateUserPermissions(selectedUser, pendingPermissions[selectedUser.id])
      setMessage(`Permisos de ${selectedUser.nombre} ${selectedUser.apellido} guardados correctamente.`)
      await loadUsers()
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudieron guardar los permisos.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleCreateUser = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    setCreateError("")

    if (createForm.fecha_nacimiento) {
      const born = new Date(createForm.fecha_nacimiento)
      const minDate = new Date()
      minDate.setFullYear(minDate.getFullYear() - 18)
      if (born > minDate) {
        setCreateError("El administrador debe tener al menos 18 años.")
        return
      }
    }

    setIsCreating(true)
    try {
      await createAdminUser(createForm)
      setCreateDialogOpen(false)
      setCreateForm(EMPTY_CREATE_FORM)
      setMessage("Administrador creado correctamente.")
      await loadUsers()
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : "No se pudo crear el administrador.")
    } finally {
      setIsCreating(false)
    }
  }

  const handleDeleteUser = async () => {
    if (!userToDelete) return
    setIsDeleting(true)
    setError("")
    setMessage("")
    try {
      await deleteAdminUser(userToDelete.id)
      setMessage(`Usuario ${userToDelete.nombre} ${userToDelete.apellido} eliminado correctamente.`)
      if (selectedUserId === userToDelete.id) setSelectedUserId(null)
      setUserToDelete(null)
      await loadUsers()
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo eliminar el usuario.")
      setUserToDelete(null)
    } finally {
      setIsDeleting(false)
    }
  }

  const updateCreateField = (key: keyof CreateAdminPayload, value: string) => {
    setCreateForm((prev) => ({ ...prev, [key]: value }))
  }

  const openPwDialog = () => {
    setPwForm({ password: "", confirm: "" })
    setPwError("")
    setShowPw(false)
    setShowConfirmPw(false)
    setPwDialogOpen(true)
  }

  const handleChangePassword = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!selectedUser) return
    if (pwForm.password !== pwForm.confirm) {
      setPwError("Las contraseñas no coinciden.")
      return
    }
    if (pwForm.password.length < 8) {
      setPwError("La contraseña debe tener al menos 8 caracteres.")
      return
    }
    setIsChangingPw(true)
    setPwError("")
    try {
      await changeUserPassword(selectedUser, pwForm.password)
      setPwDialogOpen(false)
      setPwForm({ password: "", confirm: "" })
      setMessage(`Contraseña de ${selectedUser.nombre} ${selectedUser.apellido} actualizada correctamente.`)
    } catch (err) {
      setPwError(err instanceof Error ? err.message : "No se pudo cambiar la contraseña.")
    } finally {
      setIsChangingPw(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Gestión de Roles</h1>
          <p className="text-sm text-muted-foreground">
            Administra los permisos y niveles de acceso de los usuarios del sistema
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadUsers}
            disabled={isLoading}
            className="gap-2"
          >
            {isLoading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <RefreshCcw className="size-4" />
            )}
            Actualizar
          </Button>
          <Button
            size="sm"
            onClick={() => { setCreateDialogOpen(true); setCreateError("") }}
            className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <UserPlus className="size-4" />
            Nuevo Administrador
          </Button>
        </div>
      </div>

      {/* Global alerts */}
      {message && <InlineAlert type="success" message={message} />}
      {error && <InlineAlert type="error" message={error} />}

      {/* User Grid */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Administradores del Sistema</CardTitle>
          <CardDescription>
            Selecciona un usuario para ver y modificar sus permisos
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex flex-wrap justify-center gap-6 py-4 sm:gap-8 lg:gap-12">
              {Array.from({ length: 4 }).map((_, i) => (
                <UserCardSkeleton key={i} />
              ))}
            </div>
          ) : users.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-10 text-center text-muted-foreground">
              <Shield className="size-10 opacity-30" />
              <p className="text-sm">No hay administradores registrados.</p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setCreateDialogOpen(true)}
                className="gap-2"
              >
                <Plus className="size-4" />
                Crear el primer administrador
              </Button>
            </div>
          ) : (
            <div className="flex flex-wrap justify-center gap-6 py-4 sm:gap-8 lg:gap-12">
              {users.map((user) => {
                const isSelected = selectedUserId === user.id
                const isSA = user.role === "superadmin"
                return (
                  <button
                    key={user.id}
                    onClick={() => { setSelectedUserId(user.id); setMessage(""); setError("") }}
                    className="group flex flex-col items-center gap-3 rounded-xl p-3 transition-all duration-300 hover:bg-muted/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <div
                      className={cn(
                        "relative rounded-full p-1 transition-all duration-300",
                        isSelected
                          ? isSA
                            ? "ring-4 ring-amber-500 ring-offset-2 ring-offset-background"
                            : "ring-4 ring-primary ring-offset-2 ring-offset-background"
                          : "ring-2 ring-transparent group-hover:ring-muted-foreground/30",
                      )}
                    >
                      <Avatar className="size-20 sm:size-24">
                        <AvatarImage src={getDirectDriveLink(user.url_foto)} alt={user.nombre} className="object-cover" />
                        <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                          {getInitials(user.nombre, user.apellido)}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={cn(
                          "absolute -bottom-1 -right-1 rounded-full p-1.5 shadow-md",
                          isSA ? "bg-amber-500" : "bg-primary",
                        )}
                      >
                        {isSA ? (
                          <ShieldCheck className="size-4 text-white" />
                        ) : (
                          <Shield className="size-4 text-primary-foreground" />
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <span
                        className={cn(
                          "text-sm font-medium transition-colors",
                          isSelected ? "text-foreground" : "text-muted-foreground group-hover:text-foreground",
                        )}
                      >
                        {user.nombre} {user.apellido}
                      </span>
                      <Badge
                        variant="secondary"
                        className={cn(
                          "text-[10px] px-2",
                          isSA
                            ? "bg-amber-100 text-amber-800 border border-amber-200"
                            : "bg-primary/10 text-primary",
                        )}
                      >
                        {isSA ? "Superadministrador" : "Administrador"}
                      </Badge>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Selected User Panel */}
      {selectedUser && currentPermissions && (
        <Card className="shadow-sm">
          <CardHeader className="border-b border-border">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="size-14">
                  <AvatarImage src={getDirectDriveLink(selectedUser.url_foto)} alt={selectedUser.nombre} className="object-cover" />
                  <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                    {getInitials(selectedUser.nombre, selectedUser.apellido)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">
                    {selectedUser.nombre} {selectedUser.apellido}
                  </CardTitle>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="size-4" />
                    {selectedUser.correo}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge
                  variant="secondary"
                  className={cn(
                    "text-xs px-3 py-1",
                    isSuperadmin
                      ? "bg-amber-100 text-amber-800 border border-amber-200"
                      : "bg-primary/10 text-primary",
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
                <Button
                  variant="outline"
                  size="sm"
                  onClick={openPwDialog}
                  className="gap-1.5"
                >
                  <KeyRound className="size-3.5" />
                  Cambiar Contraseña
                </Button>
                {!isSuperadmin && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setUserToDelete(selectedUser)}
                    className="gap-1.5 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 hover:text-red-700"
                  >
                    <Trash2 className="size-3.5" />
                    Eliminar
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            <div className="space-y-5">
              <h3 className="flex items-center gap-2 text-base font-semibold text-foreground">
                <Shield className="size-5 text-primary" />
                Nivel de Acceso y Permisos
              </h3>

              {isSuperadmin ? (
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                  <p className="text-sm text-amber-800">
                    Los superadministradores tienen acceso completo a todos los módulos del sistema.
                    No es posible modificar sus permisos.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Access summary */}
                  <div className="rounded-lg border border-border bg-muted/30 p-4">
                    <p className="text-sm text-muted-foreground">
                      {getAccessDescription(currentPermissions)}
                    </p>
                  </div>

                  {/* Permission toggles */}
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {MODULE_INFO.map((mod) => {
                      const isActive = currentPermissions[mod.key]
                      const Icon = mod.icon
                      return (
                        <div
                          key={mod.key}
                          className={cn(
                            "flex items-center justify-between rounded-xl border p-4 transition-all duration-200",
                            isActive
                              ? "border-primary/40 bg-primary/5 shadow-sm"
                              : "border-border bg-background",
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={cn(
                                "flex size-10 shrink-0 items-center justify-center rounded-lg transition-colors",
                                isActive
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted text-muted-foreground",
                              )}
                            >
                              <Icon className="size-5" />
                            </div>
                            <div>
                              <p className={cn(
                                "text-sm font-medium leading-tight",
                                isActive ? "text-foreground" : "text-muted-foreground",
                              )}>
                                {mod.label}
                              </p>
                              <p className="text-[11px] text-muted-foreground">
                                {isActive ? "Acceso activo" : "Sin acceso"}
                              </p>
                            </div>
                          </div>
                          <Switch
                            checked={isActive}
                            onCheckedChange={(checked) => handlePermissionChange(mod.key, checked)}
                            className={cn(isActive && "data-[state=checked]:bg-primary")}
                          />
                        </div>
                      )
                    })}
                  </div>

                  {/* Save */}
                  <div className="flex justify-end pt-2">
                    <Button
                      onClick={handleSavePermissions}
                      disabled={isSaving}
                      className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      {isSaving ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <Save className="size-4" />
                      )}
                      {isSaving ? "Guardando..." : "Guardar Cambios"}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create Admin Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={(open) => {
        setCreateDialogOpen(open)
        if (!open) {
          setCreateForm(EMPTY_CREATE_FORM)
          setCreateError("")
        }
      }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="size-5 text-primary" />
              Nuevo Administrador
            </DialogTitle>
            <DialogDescription>
              Completa los datos para registrar un nuevo administrador del sistema.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateUser} className="space-y-4">
            {createError && <InlineAlert type="error" message={createError} />}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="create-nombre">Nombre</Label>
                <Input
                  id="create-nombre"
                  placeholder=""
                  value={createForm.nombre}
                  onChange={(e) => {
                    const v = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]/g, "")
                    updateCreateField("nombre", v)
                  }}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="create-apellido">Apellido</Label>
                <Input
                  id="create-apellido"
                  placeholder=""
                  value={createForm.apellido}
                  onChange={(e) => {
                    const v = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]/g, "")
                    updateCreateField("apellido", v)
                  }}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="create-correo">Correo electrónico</Label>
              <Input
                id="create-correo"
                type="email"
                placeholder="admin@sogamoso.gov.co"
                value={createForm.correo}
                onChange={(e) => updateCreateField("correo", e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="create-password">Contraseña</Label>
              <Input
                id="create-password"
                type="password"
                placeholder="Mínimo 8 caracteres"
                value={createForm.password}
                onChange={(e) => updateCreateField("password", e.target.value)}
                required
                minLength={8}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="create-fecha">Fecha de nacimiento</Label>
                <Input
                  id="create-fecha"
                  type="date"
                  max={MAX_DATE}
                  value={createForm.fecha_nacimiento}
                  onChange={(e) => updateCreateField("fecha_nacimiento", e.target.value)}
                  required
                />
                {createForm.fecha_nacimiento && (() => {
                  const born = new Date(createForm.fecha_nacimiento)
                  const minDate = new Date()
                  minDate.setFullYear(minDate.getFullYear() - 18)
                  return born > minDate
                })() && (
                    <p className="text-xs text-red-500 mt-1">El administrador debe tener al menos 18 años.</p>
                  )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="create-genero">Género</Label>
                <Select
                  value={createForm.genero}
                  onValueChange={(v) => updateCreateField("genero", v)}
                  required
                >
                  <SelectTrigger id="create-genero">
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Masculino">Masculino</SelectItem>
                    <SelectItem value="Femenino">Femenino</SelectItem>
                    <SelectItem value="Otro">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="create-tipo-id">Tipo de identificación</Label>
                <Select
                  value={createForm.tipo_identificacion}
                  onValueChange={(v) => updateCreateField("tipo_identificacion", v)}
                  required
                >
                  <SelectTrigger id="create-tipo-id">
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CC">Cédula de Ciudadanía</SelectItem>
                    <SelectItem value="CE">Cédula de Extranjería</SelectItem>
                    <SelectItem value="TI">Tarjeta de Identidad</SelectItem>
                    <SelectItem value="PP">Pasaporte</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="create-id-perfil">Número de documento</Label>
                <input
                  id="create-id-perfil"
                  type="text"
                  placeholder="1234567890"
                  value={createForm.id_perfil ?? ""}
                  onChange={(e) => {
                    const soloNumeros = e.target.value.replace(/[^0-9]/g, "");
                    const limiteCaracteres = soloNumeros.slice(0, 11);
                    updateCreateField("id_perfil", limiteCaracteres);
                  }}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="create-telefono">Teléfono</Label>
              <Input
                id="create-telefono"
                type="tel"
                placeholder="300XXXXXX"
                value={createForm.telefono}
                onChange={(e) => {
                  const soloNumeros = e.target.value.replace(/[^0-9]/g, "");
                  const limiteCaracteres = soloNumeros.slice(0, 10);
                  updateCreateField("telefono", limiteCaracteres);
                }}
                required
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCreateDialogOpen(false)}
                disabled={isCreating}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isCreating}
                className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {isCreating ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Plus className="size-4" />
                )}
                {isCreating ? "Creando..." : "Crear Administrador"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!userToDelete} onOpenChange={(open) => { if (!open) setUserToDelete(null) }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-600">
              <Trash2 className="size-5" />
              Eliminar administrador
            </AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que quieres eliminar a{" "}
              <strong>{userToDelete?.nombre} {userToDelete?.apellido}</strong>?
              Esta acción no se puede deshacer y el usuario perderá acceso al sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteUser}
              disabled={isDeleting}
              className="gap-2 bg-red-600 text-white hover:bg-red-700 focus:ring-red-600"
            >
              {isDeleting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Trash2 className="size-4" />
              )}
              {isDeleting ? "Eliminando..." : "Sí, eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Change Password Dialog */}
      <Dialog open={pwDialogOpen} onOpenChange={(open) => { if (!open) setPwDialogOpen(false) }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <KeyRound className="size-5 text-primary" />
              Cambiar Contraseña
            </DialogTitle>
            <DialogDescription>
              Nueva contraseña para{" "}
              <strong>{selectedUser?.nombre} {selectedUser?.apellido}</strong>.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleChangePassword} className="space-y-4">
            {pwError && <InlineAlert type="error" message={pwError} />}

            <div className="space-y-1.5">
              <Label htmlFor="pw-new">Nueva contraseña</Label>
              <div className="relative">
                <Input
                  id="pw-new"
                  type={showPw ? "text" : "password"}
                  placeholder="Mínimo 8 caracteres"
                  value={pwForm.password}
                  onChange={(e) => setPwForm((p) => ({ ...p, password: e.target.value }))}
                  required
                  minLength={8}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  tabIndex={-1}
                >
                  {showPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="pw-confirm">Confirmar contraseña</Label>
              <div className="relative">
                <Input
                  id="pw-confirm"
                  type={showConfirmPw ? "text" : "password"}
                  placeholder="Repite la contraseña"
                  value={pwForm.confirm}
                  onChange={(e) => setPwForm((p) => ({ ...p, confirm: e.target.value }))}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  tabIndex={-1}
                >
                  {showConfirmPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setPwDialogOpen(false)}
                disabled={isChangingPw}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isChangingPw}
                className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {isChangingPw ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <KeyRound className="size-4" />
                )}
                {isChangingPw ? "Guardando..." : "Cambiar Contraseña"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
