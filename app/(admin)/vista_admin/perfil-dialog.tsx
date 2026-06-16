"use client"

import { useRef, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Camera,
  CheckCircle2,
  ChevronDown,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Mail,
  Shield,
  ShieldCheck,
  XCircle,
} from "lucide-react"
import { type AuthProfile, getProfileName, getProfileRole, isSuperAdmin, saveSession, getStoredToken } from "@/lib/auth"
import { gdriveUrl } from "@/lib/events"

interface PerfilDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  profile: AuthProfile | null
  onProfileUpdate: (updated: AuthProfile) => void
}

import { apiUrl } from "@/lib/api"

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
}

function getAvatarUrl(profile: AuthProfile | null): string {
  if (!profile) return ""
  const raw = String(profile.url_foto ?? profile.avatar ?? profile.foto ?? "")
  return raw ? gdriveUrl(raw) : ""
}

export function PerfilDialog({ open, onOpenChange, profile, onProfileUpdate }: PerfilDialogProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [previewUrl, setPreviewUrl] = useState("")

  // Password change state
  const [pwOpen, setPwOpen] = useState(false)
  const [pwForm, setPwForm] = useState({ nueva: "", confirmar: "" })
  const [pwError, setPwError] = useState("")
  const [pwMessage, setPwMessage] = useState("")
  const [isSavingPw, setIsSavingPw] = useState(false)
  const [showNueva, setShowNueva] = useState(false)
  const [showConfirmar, setShowConfirmar] = useState(false)

  const name = getProfileName(profile)
  const role = getProfileRole(profile)
  const correo = String(profile?.correo ?? "")
  const telefono = String(profile?.telefono ?? "")
  const genero = String(profile?.genero ?? "")
  const fechaNacimiento = String(profile?.fecha_nacimiento ?? "")
  const avatarUrl = previewUrl || getAvatarUrl(profile)
  const superadmin = isSuperAdmin(profile)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Preview local
    const localUrl = URL.createObjectURL(file)
    setPreviewUrl(localUrl)

    const id = String(profile?.id_perfil ?? profile?.id ?? "")
    if (!id) return

    setIsUploading(true)
    setMessage("")
    setError("")

    try {
      const token = typeof window !== "undefined"
        ? (localStorage.getItem("sogamoso_auth_token") ?? localStorage.getItem("token"))
        : null

      const formData = new FormData()
      formData.append("_method", "PUT")
      formData.append("id_perfil", id)
      formData.append("correo", correo)
      formData.append("nombre", String(profile?.nombre ?? ""))
      formData.append("apellido", String(profile?.apellido ?? ""))
      formData.append("url_foto", file)

      const headers: Record<string, string> = { Accept: "application/json" }
      if (token) headers["Authorization"] = `Bearer ${token}`

      const response = await fetch(apiUrl(`/profiles/${encodeURIComponent(id)}`), {
        method: "POST",
        headers,
        body: formData,
      })

      const data = response.headers.get("content-type")?.includes("application/json")
        ? await response.json()
        : null

      if (!response.ok) {
        const msg = data?.message ?? data?.error ?? "No se pudo actualizar la foto."
        throw new Error(msg)
      }

      // Actualiza el perfil en localStorage con la nueva URL si viene en la respuesta
      const newFotoUrl: string =
        data?.data?.url_foto ?? data?.url_foto ?? ""

      const updatedProfile: AuthProfile = {
        ...profile,
        url_foto: newFotoUrl || (profile?.url_foto as string),
      }

      saveSession(getStoredToken(), updatedProfile, data)
      onProfileUpdate(updatedProfile)
      setMessage("Foto de perfil actualizada correctamente.")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al subir la foto.")
      setPreviewUrl("")
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setPwError("")
    setPwMessage("")

    if (pwForm.nueva.length < 8) {
      setPwError("La contraseña debe tener al menos 8 caracteres.")
      return
    }
    if (pwForm.nueva !== pwForm.confirmar) {
      setPwError("Las contraseñas no coinciden.")
      return
    }

    const id = String(profile?.id_perfil ?? profile?.id ?? "")
    if (!id) return

    setIsSavingPw(true)
    try {
      const token = typeof window !== "undefined"
        ? (localStorage.getItem("sogamoso_auth_token") ?? localStorage.getItem("token"))
        : null

      const formData = new FormData()
      formData.append("_method", "PUT")
      formData.append("id_perfil", id)
      formData.append("correo", correo)
      formData.append("nombre", String(profile?.nombre ?? ""))
      formData.append("apellido", String(profile?.apellido ?? ""))
      formData.append("password", pwForm.nueva)

      const headers: Record<string, string> = { Accept: "application/json" }
      if (token) headers["Authorization"] = `Bearer ${token}`

      const response = await fetch(apiUrl(`/profiles/${encodeURIComponent(id)}`), {
        method: "POST",
        headers,
        body: formData,
      })

      const data = response.headers.get("content-type")?.includes("application/json")
        ? await response.json()
        : null

      if (!response.ok) {
        const msg = data?.message ?? data?.error ?? "No se pudo actualizar la contraseña."
        throw new Error(msg)
      }

      setPwForm({ nueva: "", confirmar: "" })
      setPwMessage("Contraseña actualizada correctamente.")
    } catch (err) {
      setPwError(err instanceof Error ? err.message : "Error al cambiar la contraseña.")
    } finally {
      setIsSavingPw(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {superadmin ? (
              <ShieldCheck className="size-5 text-amber-500" />
            ) : (
              <Shield className="size-5 text-primary" />
            )}
            Mi Perfil
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          {/* Avatar + cambiar foto */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              <div className="size-24 rounded-full ring-4 ring-primary/20 overflow-hidden bg-primary flex items-center justify-center">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={name}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none"
                    }}
                  />
                ) : (
                  <span className="text-2xl font-semibold text-primary-foreground">
                    {getInitials(name)}
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="absolute -bottom-1 -right-1 flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md hover:bg-primary/90 transition disabled:opacity-50"
                title="Cambiar foto de perfil"
              >
                {isUploading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Camera className="size-4" />
                )}
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            <div className="text-center">
              <p className="text-base font-semibold text-foreground">{name}</p>
              <Badge
                variant="secondary"
                className={
                  superadmin
                    ? "mt-1 bg-amber-100 text-amber-800 border border-amber-200 text-xs"
                    : "mt-1 bg-primary/10 text-primary text-xs"
                }
              >
                {superadmin ? (
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="size-3" /> Superadministrador
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <Shield className="size-3" /> {role}
                  </span>
                )}
              </Badge>
            </div>
          </div>

          {/* Feedback */}
          {message && (
            <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
              <CheckCircle2 className="size-4 shrink-0 text-green-600" />
              {message}
            </div>
          )}
          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <XCircle className="size-4 shrink-0 text-red-500" />
              {error}
            </div>
          )}

          {/* Info fields */}
          <div className="divide-y divide-border rounded-xl border border-border overflow-hidden">
            <InfoRow icon={<Mail className="size-4" />} label="Correo" value={correo} />
            {telefono && <InfoRow label="Teléfono" value={telefono} />}
            {genero && <InfoRow label="Género" value={genero} />}
            {fechaNacimiento && (
              <InfoRow
                label="Fecha de nacimiento"
                value={new Date(`${fechaNacimiento}T00:00:00`).toLocaleDateString("es-CO", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              />
            )}
          </div>

          {/* Cambiar contraseña — colapsable */}
          <div className="rounded-xl border border-border overflow-hidden">
            <button
              type="button"
              onClick={() => {
                setPwOpen((v) => !v)
                setPwError("")
                setPwMessage("")
                setPwForm({ nueva: "", confirmar: "" })
              }}
              className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-muted/40 transition-colors"
            >
              <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <KeyRound className="size-4 text-primary" />
                Cambiar contraseña
              </span>
              <ChevronDown
                className={`size-4 text-muted-foreground transition-transform duration-200 ${pwOpen ? "rotate-180" : ""}`}
              />
            </button>

            {pwOpen && (
              <form onSubmit={handleChangePassword} className="border-t border-border p-4 space-y-3">
                {pwMessage && (
                  <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-xs text-green-800">
                    <CheckCircle2 className="size-3.5 shrink-0 text-green-600" />
                    {pwMessage}
                  </div>
                )}
                {pwError && (
                  <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                    <XCircle className="size-3.5 shrink-0 text-red-500" />
                    {pwError}
                  </div>
                )}
                <div className="space-y-1.5">
                  <Label htmlFor="pw-nueva" className="text-xs">Nueva contraseña</Label>
                  <div className="relative">
                    <Input
                      id="pw-nueva"
                      type={showNueva ? "text" : "password"}
                      placeholder="Mínimo 8 caracteres"
                      value={pwForm.nueva}
                      onChange={(e) => setPwForm((p) => ({ ...p, nueva: e.target.value }))}
                      className="pr-9 text-sm"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNueva((v) => !v)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      tabIndex={-1}
                    >
                      {showNueva ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="pw-confirmar" className="text-xs">Confirmar contraseña</Label>
                  <div className="relative">
                    <Input
                      id="pw-confirmar"
                      type={showConfirmar ? "text" : "password"}
                      placeholder="Repite la contraseña"
                      value={pwForm.confirmar}
                      onChange={(e) => setPwForm((p) => ({ ...p, confirmar: e.target.value }))}
                      className="pr-9 text-sm"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmar((v) => !v)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      tabIndex={-1}
                    >
                      {showConfirmar ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>
                <Button
                  type="submit"
                  size="sm"
                  disabled={isSavingPw}
                  className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {isSavingPw ? <Loader2 className="size-4 animate-spin" /> : <KeyRound className="size-4" />}
                  {isSavingPw ? "Guardando..." : "Actualizar contraseña"}
                </Button>
              </form>
            )}
          </div>

        </div>
      </DialogContent>
    </Dialog>
  )
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode
  label: string
  value: string
}) {
  if (!value) return null
  return (
    <div className="flex items-center gap-3 bg-muted/20 px-4 py-3">
      {icon && <span className="text-muted-foreground">{icon}</span>}
      <div className="min-w-0 flex-1">
        <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="truncate text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  )
}
