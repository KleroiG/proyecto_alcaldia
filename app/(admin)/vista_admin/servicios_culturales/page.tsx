"use client"

import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
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
import { useAlert } from "@/components/global-alert"

import {
  getCulturalServices,
  getCulturalServiceById,
  createCulturalService,
  updateCulturalService,
  deleteCulturalService,
  getArtisticAreas,
  createArtisticArea,
  deleteArtisticArea,
  getProfileTypesSc,
  createProfileTypeSc,
  deleteProfileTypeSc,
  type CulturalService,
  type ArtisticArea,
  type ProfileTypeSc,
} from "@/lib/cultural-services"

import { CulturalServicesTable } from "../servicios_culturales/cultural-services-table"
import { CulturalServiceForm } from "../servicios_culturales/cultural-service-form"
import { ManageCategoryDialog } from "../servicios_culturales/manage-category-dialog"

export default function CulturalServicesPage() {
  const [view, setView] = useState<"table" | "form">("table")
  
  const [services, setServices] = useState<CulturalService[]>([])
  const [areas, setAreas] = useState<ArtisticArea[]>([])
  const [profiles, setProfiles] = useState<ProfileTypeSc[]>([])

  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isManagingSec, setIsManagingSec] = useState(false)
  const [fetchingServiceId, setFetchingServiceId] = useState<number | null>(null)

  const [manageAreasOpen, setManageAreasOpen] = useState(false)
  const [manageProfilesOpen, setManageProfilesOpen] = useState(false)
  const [editingService, setEditingService] = useState<CulturalService | null>(null)
  const [serviceToDelete, setServiceToDelete] = useState<CulturalService | null>(null)

  const { showAlert } = useAlert()

  const loadAllData = async (showMainSpinner = true) => {
    try {
      if (showMainSpinner) setIsLoading(true)
      const [servicesData, areasData, profilesData] = await Promise.all([
        getCulturalServices(),
        getArtisticAreas(),
        getProfileTypesSc(),
      ])
      setServices(servicesData)
      setAreas(areasData)
      setProfiles(profilesData)
    } catch (err: any) {
      showAlert("error", "Error de red", err.message || "No se pudieron obtener los datos.")
    } finally {
      if (showMainSpinner) setIsLoading(false)
    }
  }

  useEffect(() => {
    loadAllData(true)
  }, [])

  const openCreateDialog = () => {
    setEditingService(null)
    setView("form")
  }

  const openEditDialog = async (service: CulturalService) => {
    try {
      setFetchingServiceId(service.id)
      const data = await getCulturalServiceById(service.id)
      setEditingService(data)
      setView("form")
    } catch (err: any) {
      showAlert("error", "Error al cargar", "No se pudo obtener el detalle del servicio.")
    } finally {
      setFetchingServiceId(null)
    }
  }

  const handleSave = async (formData: FormData) => {
    try {
      if (editingService) {
        await updateCulturalService(editingService.id, formData)
        showAlert("success", "Actualizado", "Ficha cultural actualizada con éxito.")
      } else {
        await createCulturalService(formData)
        showAlert("success", "Registrado", "Nuevo servicio cultural guardado con éxito.")
      }
      setView("table")
      await loadAllData(false)
    } catch (err: any) {
      showAlert("error", "Error al guardar", err.message || "Hubo un problema procesando la solicitud.")
    }
  }

  const handleDelete = async () => {
    if (!serviceToDelete) return
    setIsDeleting(true)
    try {
      await deleteCulturalService(serviceToDelete.id)
      showAlert("success", "Eliminado", "El registro ha sido eliminado permanentemente.")
      setServiceToDelete(null)
      await loadAllData(false)
    } catch (err: any) {
      showAlert("error", "Error al eliminar", err.message || "Ocurrió un error en el servidor.")
    } finally {
      setIsDeleting(false)
    }
  }

  const handleAddArea = async (name: string) => {
    setIsManagingSec(true)
    try {
      await createArtisticArea(name)
      setAreas(await getArtisticAreas())
      showAlert("success", "Creado", "Área artística agregada.")
    } catch (err: any) {
      showAlert("error", "Error", err.message)
    } finally {
      setIsManagingSec(false)
    }
  }

  const handleDeleteArea = async (id: number) => {
    setIsManagingSec(true)
    try {
      await deleteArtisticArea(id)
      setAreas(await getArtisticAreas())
      showAlert("success", "Eliminado", "Área artística eliminada.")
    } catch (err: any) {
      showAlert("error", "Error", err.message)
    } finally {
      setIsManagingSec(false)
    }
  }

  const handleAddProfile = async (name: string) => {
    setIsManagingSec(true)
    try {
      await createProfileTypeSc(name)
      setProfiles(await getProfileTypesSc())
      showAlert("success", "Creado", "Tipo de perfil agregado.")
    } catch (err: any) {
      showAlert("error", "Error", err.message)
    } finally {
      setIsManagingSec(false)
    }
  }

  const handleDeleteProfile = async (id: number) => {
    setIsManagingSec(true)
    try {
      await deleteProfileTypeSc(id)
      setProfiles(await getProfileTypesSc())
      showAlert("success", "Eliminado", "Tipo de perfil eliminado.")
    } catch (err: any) {
      showAlert("error", "Error", err.message)
    } finally {
      setIsManagingSec(false)
    }
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 space-y-6">
      
      {view === "table" ? (
        <CulturalServicesTable
          services={services}
          areas={areas}
          profiles={profiles}
          isLoading={isLoading}
          fetchingServiceId={fetchingServiceId}
          onEdit={openEditDialog}
          onDelete={setServiceToDelete}
          onAdd={openCreateDialog}
        />
      ) : (
        <CulturalServiceForm
          initialData={editingService}
          areas={areas}
          profiles={profiles}
          onSave={handleSave}
          onBack={() => setView("table")}
          onManageAreas={() => setManageAreasOpen(true)}
          onManageProfiles={() => setManageProfilesOpen(true)}
        />
      )}

      <ManageCategoryDialog
        open={manageAreasOpen}
        onOpenChange={setManageAreasOpen}
        title="Administrar Áreas Artísticas"
        description="Agrega o elimina categorías de áreas artísticas del sistema."
        placeholder="Nombre del área"
        items={areas}
        onAdd={handleAddArea}
        onDelete={handleDeleteArea}
        isManaging={isManagingSec}
      />

      <ManageCategoryDialog
        open={manageProfilesOpen}
        onOpenChange={setManageProfilesOpen}
        title="Administrar Tipos de Perfil"
        description="Agrega o elimina tipos de perfil de gestores culturales."
        placeholder="Nombre del perfil"
        items={profiles}
        onAdd={handleAddProfile}
        onDelete={handleDeleteProfile}
        isManaging={isManagingSec}
      />

      <AlertDialog open={!!serviceToDelete} onOpenChange={(open) => !open && setServiceToDelete(null)}>
        <AlertDialogContent className="bg-white rounded-2xl p-6 shadow-xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar eliminación</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas eliminar este registro cultural permanentemente?
              Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting} className="border-slate-200 cursor-pointer">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault()
                handleDelete()
              }}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white cursor-pointer gap-2"
            >
              {isDeleting && <Loader2 className="size-4 animate-spin" />}
              {isDeleting ? "Eliminando..." : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}