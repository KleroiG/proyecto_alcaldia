"use client"

import { useEffect, useState } from "react"
import { CheckCircle2, Loader2, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { gdriveUrl, type EventPayload, type EventRecord } from "@/lib/events"

export type EventFormState = Omit<EventPayload, "urlFoto" | "fotos" | "fotosAEliminar"> & {
  urlFoto: File | null
  urlFotoExistente: string
  fotos: File[]
  fotosAEliminar: string[]
}

const emptyForm: EventFormState = {
  nombre: "", descripcion: "", tipo: "", organizador: "", contacto: "",
  fechaInicio: "", fechaFin: "", asistentesEstimados: "", impactoEconomico: "",
  estado: "programado", observaciones: "", direccion: "", latitud: "",
  longitud: "", googlePlaceId: "", urlFoto: null, urlFotoExistente: "",
  fotos: [], fotosAEliminar: [],
}

function toFormState(event: EventRecord): EventFormState {
  return {
    ...event,
    estado: event.estado.toLowerCase(),
    urlFoto: null,
    urlFotoExistente: "",
    fotos: [],
    fotosAEliminar: [],
  }
}

interface EventFormProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  editingEvent: EventRecord | null
  onSave: (payload: EventPayload) => Promise<void>
  isSaving: boolean
}

export function EventForm({ isOpen, onOpenChange, editingEvent, onSave, isSaving }: EventFormProps) {
  const [form, setForm] = useState<EventFormState>(emptyForm)

  useEffect(() => {
    if (isOpen) {
      setForm(editingEvent ? toFormState(editingEvent) : emptyForm)
    }
  }, [isOpen, editingEvent])

  const updateField = (key: keyof EventFormState, value: string | File | File[] | null) => {
    setForm((current) => ({ ...current, [key]: value }))
  }

  const toggleFotoEliminar = (id: string) => {
    setForm((prev) => ({
      ...prev,
      fotosAEliminar: prev.fotosAEliminar.includes(id)
        ? prev.fotosAEliminar.filter((f) => f !== id)
        : [...prev.fotosAEliminar, id],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload: EventPayload = {
      ...form,
      urlFoto: form.urlFoto ?? (form.urlFotoExistente || null),
      fotos: form.fotos,
      fotosAEliminar: form.fotosAEliminar,
    }
    await onSave(payload)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{editingEvent ? "Editar evento" : "Nuevo evento"}</DialogTitle>
          <DialogDescription>
            Completa los campos definidos por el backend para la agenda de eventos.
          </DialogDescription>
        </DialogHeader>
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nombre">
              <Input required value={form.nombre} onChange={(e) => updateField("nombre", e.target.value)} />
            </Field>
            <Field label="Tipo">
              <Input required value={form.tipo} onChange={(e) => updateField("tipo", e.target.value)} />
            </Field>
            <Field label="Organizador">
              <Input value={form.organizador} onChange={(e) => updateField("organizador", e.target.value)} />
            </Field>
            <Field label="Contacto">
              <Input value={form.contacto} onChange={(e) => updateField("contacto", e.target.value)} />
            </Field>
            <Field label="Fecha inicio">
              <Input required type="date" value={form.fechaInicio} onChange={(e) => updateField("fechaInicio", e.target.value)} />
            </Field>
            <Field label="Fecha fin">
              <Input required type="date" value={form.fechaFin} onChange={(e) => updateField("fechaFin", e.target.value)} />
            </Field>
            <Field label="Asistentes estimados">
              <Input type="number" value={form.asistentesEstimados} onChange={(e) => updateField("asistentesEstimados", e.target.value)} />
            </Field>
            <Field label="Impacto economico">
              <Input type="number" value={form.impactoEconomico} onChange={(e) => updateField("impactoEconomico", e.target.value)} />
            </Field>
            <Field label="Estado">
              <Select value={form.estado} onValueChange={(value) => updateField("estado", value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecciona estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="programado">Programado</SelectItem>
                  <SelectItem value="en curso">En curso</SelectItem>
                  <SelectItem value="finalizado">Finalizado</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Dirección">
              <Input required value={form.direccion} onChange={(e) => updateField("direccion", e.target.value)} />
            </Field>
          </div>

          <Field label="Descripcion">
            <Textarea required value={form.descripcion} onChange={(e) => updateField("descripcion", e.target.value)} />
          </Field>
          <Field label="Observaciones">
            <Textarea value={form.observaciones} onChange={(e) => updateField("observaciones", e.target.value)} />
          </Field>

          {/* Galería Principal */}
          <div className="space-y-2 rounded-lg border border-border bg-muted/20 p-4">
            <Label className="text-sm font-semibold">Foto principal</Label>
            {editingEvent && (editingEvent.fotos.length > 0 || editingEvent.imageUrl) && (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">Selecciona una foto de la galería como foto principal:</p>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {[...(editingEvent.imageUrl ? [{ id: "__main__", url: editingEvent.imageUrl }] : []), ...editingEvent.fotos].map((foto) => {
                    const isSelected = form.urlFotoExistente === foto.url
                    return (
                      <button
                        key={foto.id}
                        type="button"
                        onClick={() => updateField("urlFotoExistente", isSelected ? "" : foto.url)}
                        className={cn("relative aspect-video overflow-hidden rounded-lg border-2 transition-all", isSelected ? "border-primary shadow-md" : "border-transparent hover:border-muted-foreground/40")}
                      >
                        <img src={gdriveUrl(foto.url)} alt="" loading="lazy" referrerPolicy="no-referrer" className="absolute inset-0 h-full w-full object-cover" />
                        {isSelected && (
                          <div className="absolute inset-0 flex items-center justify-center bg-primary/20">
                            <CheckCircle2 className="size-6 text-primary drop-shadow" />
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">{editingEvent ? "O sube una nueva foto principal:" : "Sube la foto principal:"}</p>
              <Input type="file" accept="image/*" onChange={(e) => { updateField("urlFoto", e.target.files?.[0] || null); if (e.target.files?.[0]) updateField("urlFotoExistente", ""); }} />
            </div>
          </div>

          {/* Galería Adicional */}
          <div className="space-y-2 rounded-lg border border-border bg-muted/20 p-4">
            <Label className="text-sm font-semibold">Galería de fotos adicionales</Label>
            {editingEvent && editingEvent.fotos.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">Haz clic en una foto para marcarla como eliminada:</p>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {editingEvent.fotos.map((foto) => {
                    const marcada = form.fotosAEliminar.includes(foto.id)
                    return (
                      <button
                        key={foto.id}
                        type="button"
                        onClick={() => toggleFotoEliminar(foto.id)}
                        className={cn("relative aspect-video overflow-hidden rounded-lg border-2 transition-all", marcada ? "border-red-500 opacity-60" : "border-transparent hover:border-muted-foreground/40")}
                      >
                        <img src={gdriveUrl(foto.url)} alt="" loading="lazy" referrerPolicy="no-referrer" className="absolute inset-0 h-full w-full object-cover" />
                        {marcada && (
                          <div className="absolute inset-0 flex items-center justify-center bg-red-500/30">
                            <X className="size-6 text-red-600 drop-shadow" />
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Agregar nuevas fotos a la galería:</p>
              <Input type="file" accept="image/*" multiple onChange={(e) => updateField("fotos", Array.from(e.target.files || []))} />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" disabled={isSaving} className="gap-2">
              {isSaving && <Loader2 className="size-4 animate-spin" />}
              {isSaving ? "Guardando..." : "Guardar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-2">
      <Label>{label}</Label>
      {children}
    </div>
  )
}