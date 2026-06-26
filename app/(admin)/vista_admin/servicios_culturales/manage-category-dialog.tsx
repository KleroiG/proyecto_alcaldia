"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface ManageCategoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  placeholder: string
  items: { id: number; nombre: string }[]
  onAdd: (name: string) => Promise<void>
  onDelete: (id: number) => Promise<void>
  isManaging: boolean
}

export function ManageCategoryDialog({
  open,
  onOpenChange,
  title,
  description,
  placeholder,
  items,
  onAdd,
  onDelete,
  isManaging,
}: ManageCategoryDialogProps) {
  const [newName, setNewName] = useState("")

  const handleAdd = async () => {
    if (!newName.trim()) return
    await onAdd(newName)
    setNewName("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white rounded-2xl p-6 shadow-xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="flex gap-2">
            <Input
              placeholder={placeholder}
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="border-slate-200"
            />
            <Button 
              onClick={handleAdd} 
              disabled={isManaging || !newName.trim()} 
              className="bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
            >
              Agregar
            </Button>
          </div>

          <div className="border border-slate-100 rounded-xl overflow-hidden max-h-60 overflow-y-auto divide-y divide-slate-100">
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between px-3 py-2 text-sm text-gray-700 bg-white hover:bg-slate-50">
                <span>{item.nombre}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(item.id)}
                  className="size-8 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                  disabled={isManaging}
                >
                  <X className="size-4" />
                </Button>
              </div>
            ))}
            {items.length === 0 && (
              <p className="text-center py-4 text-xs text-gray-400 italic">No hay registros.</p>
            )}
          </div>
        </div>
        <DialogFooter className="pt-4 border-t border-slate-100">
          <Button onClick={() => onOpenChange(false)} className="bg-slate-100 hover:bg-slate-200 text-gray-800 cursor-pointer">
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}