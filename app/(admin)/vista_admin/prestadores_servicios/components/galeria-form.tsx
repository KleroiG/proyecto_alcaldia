"use client"

import { useCallback } from "react"
import { Label } from "@/components/ui/label"
import { Upload, X, ImageIcon } from "lucide-react"
import { useAlert } from "@/components/global-alert"
import { useConfirmation } from "@/components/confirmacion-alert"

interface ImageFile {
    id: string
    file: File
    preview: string
}

interface GaleriaFormProps {
    newImages: ImageFile[]
    setNewImages: React.Dispatch<React.SetStateAction<ImageFile[]>>
    existingImages: any[]
    setExistingImages: React.Dispatch<React.SetStateAction<any[]>>
    fotosAEliminar: number[]
    setFotosAEliminar: React.Dispatch<React.SetStateAction<number[]>>
}

export function GaleriaForm({
    newImages,
    setNewImages,
    existingImages,
    setExistingImages,
    fotosAEliminar,
    setFotosAEliminar
}: GaleriaFormProps) {
    const { showAlert } = useAlert()
    const { confirm } = useConfirmation()

    // 🛠️ FUNCIÓN: Convierte URLs de Google Drive a miniaturas de alta calidad
    const getDriveImage = (url: string) => {
        if (!url) return "";
        
        // Expresión regular para extraer el ID de archivo de Google Drive (mínimo 25 caracteres)
        const match = url.match(/[-\w]{25,}/);

        if (!match) return url; // Si no es de Drive, retorna la URL limpia tal cual

        // Retorna el endpoint de miniaturas con tamaño grande (w2000)
        return `https://drive.google.com/thumbnail?id=${match[0]}&sz=w2000`;
    };

    // FUNCIÓN AUXILIAR: Extrae dinámicamente el ID real de la BD
    const getFotoId = (img: any): number | undefined => {
        const idVal = img.id || img.id_foto || img.id_foto_hotel || img.id_foto_restaurante || img.id_foto_atractivo;
        return idVal ? Number(idVal) : undefined;
    }

    const onDropImages = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files)
            
            if (existingImages.length + newImages.length + filesArray.length > 8) {
                showAlert("error", "Límite de imágenes superado", "Puedes subir un máximo de 8 imágenes promocionales.")
                return
            }

            const validFiles: ImageFile[] = []
            for (const file of filesArray) {
                if (file.size > 5 * 1024 * 1024) {
                    showAlert("error", "Archivo muy pesado", `La imagen ${file.name} supera el límite de 5MB.`)
                    continue
                }
                validFiles.push({
                    id: Math.random().toString(36).substring(2, 9),
                    file,
                    preview: URL.createObjectURL(file)
                })
            }

            if (validFiles.length > 0) {
                setNewImages((prev) => [...prev, ...validFiles])
            }
        }
    }, [existingImages, newImages, showAlert, setNewImages])

    const removeNewImage = (id: string) => {
        setNewImages((prev) => prev.filter((img) => img.id !== id))
    }

    const removeExistingImage = async (img: any, index: number) => {
        const fotoId = getFotoId(img)

        const isConfirmed = await confirm({
            title: "¿Eliminar imagen existente?",
            message: "Esta acción quitará la foto inmediatamente de la galería pública al guardar los cambios.",
            variant: "danger"
        })

        if (isConfirmed) {
            if (fotoId !== undefined) {
                setFotosAEliminar((prev) => [...prev, fotoId])
            }

            setExistingImages((prev) => prev.filter((item, i) => {
                const itemId = getFotoId(item)
                return itemId !== undefined && fotoId !== undefined ? itemId !== fotoId : i !== index;
            }))

            showAlert("success", "Imagen removida", "La imagen se ha programado para ser eliminada.")
        }
    }


    return (
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6 mt-6">

            {/* HEADER */}
            <div className="flex items-start justify-between">
                <div>
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <ImageIcon className="h-5 w-5 text-[#6b1d1d]" />
                        Galería del Establecimiento
                    </h3>

                    <p className="text-sm text-gray-500 mt-1 max-w-xl">
                        Sube imágenes que representen el hotel. Estas fotos se mostrarán en la app y ayudarán a los usuarios a conocer el lugar.
                    </p>
                </div>
            </div>

            {/* DROPZONE */}
            <div className="relative border-2 border-dashed border-gray-200 rounded-2xl p-10 text-center cursor-pointer transition-all hover:border-[#6b1d1d]/50 hover:bg-gray-50 group">

                <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={onDropImages}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />

                <div className="flex flex-col items-center justify-center gap-3">

                    <div className="p-4 rounded-full bg-red-50 text-[#6b1d1d] group-hover:scale-110 transition-transform shadow-sm">
                        <Upload className="h-6 w-6" />
                    </div>

                    <div>
                        <p className="text-sm font-semibold text-gray-700">
                            Arrastra o selecciona imágenes
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                            JPG, PNG o WEBP · Máximo recomendado 5MB
                        </p>
                    </div>

                    {newImages.length > 0 && (
                        <div className="mt-2 px-3 py-1 rounded-full bg-green-50 text-green-600 text-xs font-medium">
                            {newImages.length} imágenes listas para subir
                        </div>
                    )}

                </div>
            </div>

            {/* EXISTENTES */}
            {existingImages.length > 0 && (
                <div className="space-y-3">
                    <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                        Imágenes actuales
                    </Label>

                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
                        {existingImages.map((img, index) => {
                            const fotoId = getFotoId(img) || `existing-${index}`;
                            const srcUrl = img.url_foto || img.url || img.ruta || "";

                            return (
                                <div key={fotoId} className="relative aspect-video rounded-xl overflow-hidden border border-gray-100 group shadow-sm bg-gray-50">
                                    <img 
                                        src={getDriveImage(srcUrl)} 
                                        alt="Establecimiento" 
                                        className="w-full h-full object-cover" 
                                        loading="lazy"
                                        referrerPolicy="no-referrer"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-start justify-end p-2">
                                        <button 
                                            type="button" 
                                            onClick={() => removeExistingImage(img, index)}
                                            className="w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-md"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* NUEVAS */}
            {newImages.length > 0 && (
                <div className="space-y-3">
                    <Label className="text-xs font-bold text-green-600 uppercase tracking-wider">
                        Nuevas imágenes
                    </Label>

                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
                        {newImages.map((image, index) => (
                            <div
                                key={image.id}
                                className="relative aspect-video rounded-xl overflow-hidden border border-green-100 shadow-sm group bg-gray-50"
                            >
                                <img
                                    src={image.preview}
                                    alt={`preview-${index}`}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />

                                {/* BADGE */}
                                <div className="absolute top-2 left-2 bg-green-500 text-white text-[10px] px-2 py-0.5 rounded-full">
                                    Nueva
                                </div>

                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-start justify-end p-2">
                                    <button
                                        type="button"
                                        onClick={() => removeNewImage(image.id)}
                                        className="w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </section>
    )
}