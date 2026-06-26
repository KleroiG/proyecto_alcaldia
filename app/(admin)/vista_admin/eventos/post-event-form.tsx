"use client"

import { useState, useEffect } from "react"
import { DollarSign, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { EventRecord } from "@/lib/events"

interface PostEventFormProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  selectedEvent: EventRecord | null
  onSave: (asistentes: string, impacto: string) => Promise<void>
}

export function PostEventForm({ isOpen, onOpenChange, selectedEvent, onSave }: PostEventFormProps) {
  const [asistentesReales, setAsistentesReales] = useState("")
  const [impactoEconomico, setImpactoEconomico] = useState("")

  useEffect(() => {
    if (isOpen && selectedEvent) {
      setAsistentesReales(selectedEvent.asistentesEstimados || "")
      setImpactoEconomico(selectedEvent.impactoEconomico || "")
    }
  }, [isOpen, selectedEvent])

  const handleSubmit = () => {
    onSave(asistentesReales, impactoEconomico)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Registro Post-Evento</DialogTitle>
          <DialogDescription>
            Ingrese los datos finales del evento: {selectedEvent?.nombre}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>Asistentes reales</Label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-primary" />
              <Input
                type="number"
                className="pl-9"
                value={asistentesReales}
                onChange={(e) => setAsistentesReales(e.target.value)}
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label>Impacto económico (COP)</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-accent" />
              <Input
                type="number"
                className="pl-9"
                value={impactoEconomico}
                onChange={(e) => setImpactoEconomico(e.target.value)}
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>Guardar Registro</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}