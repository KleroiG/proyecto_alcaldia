"use client"

import { useState, useEffect } from "react"
import { AttractionsTable, Attraction } from "./page"
import { AttractionForm } from "./attraction-form"
import { useAlert } from "@/components/global-alert"



export default function AdminTourismPage() {
    const [view, setView] = useState<"table" | "form">("table")
    const [currentAttraction, setCurrentAttraction] = useState<Attraction | null>(null)
    const [attractions, setAttractions] = useState<Attraction[]>([])
    const [isLoading, setIsLoading] = useState(true)

    const { showAlert } = useAlert()

    const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"


    // 1. Modificar Visibilidad (PATCH /api/tourism/{id}/visibility)
    const handleToggleActive = async (id: string, isvisible: boolean) => {
        // 1. Optimistic UI: Actualizamos el estado local inmediatamente para UX fluida
        setAttractions((prev) =>
            prev.map((attr) =>
                attr.id === id ? { ...attr, isvisible: isvisible } : attr
            )
        );

        try {
            const response = await fetch(`${BASE_URL}/api/tourism/${id}/visibility`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                // Aseguramos de enviar el booleano correctamente
                body: JSON.stringify({ isvisible: isvisible }),
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || "Error al actualizar en el servidor");
            }
        } catch (error) {
            console.error("Error al cambiar visibilidad:", error);

            // 2. Rollback: Si falla la petición, revertimos el estado visual
            setAttractions((prev) =>
                prev.map((attr) =>
                    attr.id === id ? { ...attr, isvisible: !isvisible } : attr
                )
            );

            showAlert("error", "Error de actualización", "No se pudo cambiar la visibilidad. Verifica tu conexión.");
        }
    };




    // 2. CARGAR TODOS LOS ATRACTIVOS (GET /api/tourism)
    const fetchAttractions = async () => {
        setIsLoading(true)
        try {
            const response = await fetch(`${BASE_URL}/api/tourism`)
            if (!response.ok) throw new Error("Error en el servidor")
            const result = await response.json()

            if (result.success && result.data) {
                // Mapeamos los datos relacionales de Laravel al modelo plano del Frontend
                const mapped: Attraction[] = result.data.map((item: any) => {
                    let finalImageUrl = "";

                    if (item.fotos && item.fotos.length > 0) {
                        const rawUrl = item.fotos[0].url_foto;

                        if (rawUrl && rawUrl.includes("drive.google.com")) {

                            const matches = rawUrl.match(/(?:id=|\/d\/)([a-zA-Z0-9_-]+)/);
                            if (matches && matches[1]) {

                                finalImageUrl = `https://drive.google.com/thumbnail?sz=w600&id=${matches[1]}`;
                            } else {
                                finalImageUrl = rawUrl;
                            }
                        } else {
                            finalImageUrl = rawUrl || "";
                        }
                    }
                    return {
                        id: String(item.id_atractivo_turistico),
                        name: item.nombre,
                        description: item.descripcion || "",
                        category: item.tipo || "Patrimonio",
                        imageUrl: finalImageUrl,
                        address: item.direccion ? item.direccion.direccion : "Sogamoso, Boyacá",
                        schedule: item.horario || "",
                        price: item.precio || "",
                        phone: item.telefono || "",
                        whatsapp: item.whatsapp || "",
                        instagram: item.instagram || "",
                        facebook: item.facebook || "",
                        website: item.web || "",
                        coordinates: "",
                        mapsLink: "",
                        fotosOriginales: item.fotos || [],
                        isvisible: item.isvisible === undefined ? true : Boolean(item.isvisible),
                    };
                })
                setAttractions(mapped)
            }
        } catch (error) {
            console.error("Error al cargar atractivos:", error)
            showAlert("error", "Error de conexión", "No se pudieron cargar los datos del servidor.")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchAttractions()
    }, [])

    // 2. CREAR O EDITAR ATRACTIVO (POST / PUT a Laravel)
    const handleSave = async (data: Partial<Attraction> & { imageFiles?: File[] }) => {
        try {
            const formData = new FormData()

            // 1. Campos obligatorios de texto para la tabla 'atractivoturistico'
            formData.append("nombre", data.name || "")
            formData.append("tipo", data.category || "Patrimonio")
            formData.append("descripcion", data.description || "")
            formData.append("horario", data.schedule || "")
            formData.append("precio", data.price || "")

            // 2. Campos de contacto
            formData.append("telefono", data.phone || "")
            formData.append("whatsapp", data.whatsapp || "")
            formData.append("instagram", data.instagram || "")
            formData.append("facebook", data.facebook || "")
            formData.append("web", data.website || "")

            // 3. LA DIRECCIÓN: Enviamos la dirección en texto plano. 
            // El controlador de Laravel se encargará de hacer un DireccionGoogle::create() 
            // antes de guardar el atractivo para generar el ID real automáticamente.
            formData.append("direccion", data.address || "Sogamoso, Boyacá")

            // 4. Adjuntar las fotos binarias de la computadora si existen

            if (data.imageFiles && data.imageFiles.length > 0) {
                // Definimos el nombre del campo dinámicamente según la acción
                const nombreCampoFoto = currentAttraction ? "nuevas_fotos[]" : "fotos[]";
                data.imageFiles.forEach((imageFile) => {
                    formData.append(nombreCampoFoto, imageFile);
                })
            }


            let response;
            if (currentAttraction) {
                // EDICIÓN: Simulación de PUT mediante POST usando '_method'
                formData.append("_method", "PUT")
                response = await fetch(`${BASE_URL}/api/tourism/${currentAttraction.id}`, {
                    method: "POST",
                    body: formData,
                })
            } else {
                // CREACIÓN: POST limpio sin ID prefijado
                response = await fetch(`${BASE_URL}/api/tourism/register`, {
                    method: "POST",
                    body: formData,
                })
            }

            // Análisis inteligente de la respuesta del servidor
            if (!response.ok) {
                // Si Laravel responde con un error (como un 422 de validación o un 500), leemos el JSON para ver qué falló
                const errorData = await response.json().catch(() => null)
                console.error("Detalles del error devuelto por Laravel:", errorData)

                if (errorData?.errors) {
                    const tieneErrorDeSubida = Object.values(errorData.errors).some((mensajes: any) =>
                        mensajes.some((msg: string) => msg.toLowerCase().includes("failed to upload"))
                    );

                    if (tieneErrorDeSubida) {
                        throw new Error("Una o más imágenes superan el límite permitido. El tamaño máximo por foto es de 2 MB.");
                    }
                }

                throw new Error(errorData?.message || "Error al guardar en el servidor")
            }

            const result = await response.json()
            if (result.success) {
                await fetchAttractions()
                setView("table")
                setCurrentAttraction(null)
            }
        } catch (error: any) {
            console.error("Error en la operación:", error)
            showAlert("error", "Error al guardar", error.message)
        }
    }

    // 3. ELIMINAR ATRACTIVO (DELETE /api/tourism/{id})
const handleDelete = async (id: string) => {
        try {
            const response = await fetch(`${BASE_URL}/api/tourism/${id}`, {
                method: "DELETE",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) throw new Error("Error en la respuesta del servidor");

            const result = await response.json();

            if (result.success) {
                setAttractions((prev) => prev.filter((item) => item.id !== id));
                showAlert("success", "Eliminado", "El atractivo fue eliminado por completo.")
            } else {
                throw new Error(result.message || "No se pudo completar la eliminación");
            }
        } catch (error: any) {
            console.error("Error al eliminar:", error);
            // Aseguramos capturar el mensaje dinámico si viene del backend
            const errorMsg = error.message || "No se pudo eliminar el atractivo. Intenta nuevamente.";
            showAlert("error", "Error en eliminación", errorMsg);
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            {view === "table" ? (
                <AttractionsTable
                    attractions={attractions}
                    isLoading={isLoading}
                    onEdit={(attraction) => {
                        setCurrentAttraction(attraction)
                        setView("form")
                    }}
                    onDelete={handleDelete}
                    onToggleActive={handleToggleActive}
                    onAddClick={() => {
                        setCurrentAttraction(null)
                        setView("form")
                    }}
                />
            ) : (
                <AttractionForm
                    attraction={currentAttraction}
                    onBack={() => {
                        setView("table")
                        setCurrentAttraction(null)
                    }}
                    onSave={handleSave}
                />
            )}
        </div>
    )
}