// prestadores-service.ts
import type { Prestador, Guia } from "./types"
import { useAlert } from "@/components/global-alert"

import { apiUrl, API_BASE as API_URL } from "@/lib/api"


async function safeFetchJson(url: string) {
    try {
        const response = await fetch(url, { cache: "no-store" })
        if (!response.ok) {
            console.error(`Error HTTP ${response.status} en la ruta: ${url}`)
            return { success: false, data: [] }
        }
        const contentType = response.headers.get("content-type")
        if (contentType && contentType.includes("application/json")) {
            return await response.json()
        } else {
            console.error(`La ruta ${url} devolvió HTML en lugar de JSON. Verifica routes/api.php`)
            return { success: false, data: [] }
        }
    } catch (error) {
        console.error(`Error de conexión con ${url}:`, error)
        return { success: false, data: [] }
    }
}


// =========================================================================
// 1. OBTENER Y NORMALIZAR TODOS LOS PRESTADORES Y GUÍAS
// =========================================================================
export async function fetchAllPrestadoresYGuias() {
    try {
        const [jsonHoteles, jsonRestos, jsonAgencias, jsonGuias] = await Promise.all([
            safeFetchJson(`${API_URL}/hotel`),
            safeFetchJson(`${API_URL}/restaurant`),
            safeFetchJson(`${API_URL}/agency`),
            safeFetchJson(`${API_URL}/guide`)
        ])

        const unifiedPrestadores: Prestador[] = []

        if (jsonHoteles.success && jsonHoteles.data) {
            unifiedPrestadores.push(...jsonHoteles.data.map((h: any) => ({
                ...h,
                id: `hotel-${h.id_hotel || h.id}`,
                rawId: h.id_hotel || h.id,
                nombre: h.nombre,
                descripcion: h.observaciones || h.descripcion || "Hotel en Sogamoso",
                categoria: "Hotel",
                imageUrl: h.fotos?.[0]?.url_foto || "",
                direccion: h.direccion?.direccion || h.direccion || "Sogamoso",
                telefono: h.celular || "N/A",
                email: h.correo || "",
                fotosOriginales: h.fotos || [],
                isvisible: h.isvisible === true || h.isvisible === undefined,
            })))
        }

        if (jsonRestos.success && jsonRestos.data) {
            unifiedPrestadores.push(...jsonRestos.data.map((r: any) => ({
                ...r,
                id: `restaurante-${r.id_restaurante || r.id}`,
                rawId: r.id_restaurante || r.id,
                nombre: r.nombre,
                descripcion: r.tipo_cocina || r.descripcion || "Restaurante local",
                categoria: "Restaurante",
                imageUrl: r.fotos?.[0]?.url_foto || "",
                direccion: r.direccion?.direccion || r.direccion || "Sogamoso",
                telefono: r.celular || "N/A",
                email: r.correo || "",
                fotosOriginales: r.fotos || [],
                isvisible: r.isvisible === true || r.isvisible === undefined,
            })))
        }

        if (jsonAgencias.success && jsonAgencias.data) {
            unifiedPrestadores.push(...jsonAgencias.data.map((a: any) => ({
                ...a,
                id: `agencia-${a.id_agencia || a.id}`,
                rawId: a.id_agencia || a.id,
                nombre: a.nombre,
                descripcion: a.especialidad_turistica || a.descripcion || "Agencia de viajes",
                categoria: "Agencia",
                imageUrl: a.fotos?.[0]?.url_foto || "",
                direccion: "Sogamoso",
                telefono: a.celular || "N/A",
                email: a.correo || "",
                fotosOriginales: a.fotos || [],
                isvisible: a.isvisible === true || a.isvisible === undefined,
            })))
        }

        let normalizedGuias: Guia[] = []
        if (jsonGuias.success && jsonGuias.data) {
            // Debajo de: if (jsonGuias.success && jsonGuias.data) {
            jsonGuias.data.forEach((g: any) => console.log("Estructura de guía recibida:", g));
            normalizedGuias = jsonGuias.data.map((g: any) => ({
                ...g,
                id: (g.id_guia || g.id).toString(),
                rawId: g.id_guia || g.id,
                nombre: g.nombre || "",
                apellido: "",
                documento: g.n_cedula?.toString() || "",
                tipo_documento: "CC", // Valor por defecto
                telefono: g.celular?.toString() || "",
                email: g.correo || "",

                // Mapeo para los campos adicionales
                idiomas: typeof g.idiomas === 'string'
                    ? g.idiomas.split(',').map((s: string) => s.trim())
                    : [],
                especialidades: typeof g.especialidad === 'string'
                    ? g.especialidad.split(',').map((s: string) => s.trim())
                    : [],

                // Otros campos que el formulario pueda necesitar
                fecha_registro: g.created_at || new Date().toISOString(),
                numero_tarjeta: g.rnt || ""
            }))
        }

        return { prestadores: unifiedPrestadores, guias: normalizedGuias }
    } catch (error) {
        console.error("Error crítico en fetchAllPrestadoresYGuias:", error)
        throw error
    }
}

// =========================================================================
// 2. GUARDAR / ACTUALIZAR PRESTADOR (Hotel, Restaurante, Agencia)
// =========================================================================
export async function savePrestadorService(
    data: any,
    editingPrestador: any | null
) {
    const isEditing = !!editingPrestador
    const endpointMap: Record<string, string> = {
        Hotel: "hotel",
        Restaurante: "restaurant",
        Agencia: "agency"
    }

    const rutaBase = endpointMap[data.categoria]
    if (!rutaBase) throw new Error("Categoría de prestador no válida")

    const url = isEditing
        ? `${API_URL}/${rutaBase}/${editingPrestador.rawId}`
        : `${API_URL}/${rutaBase}/register`

    const formData = new FormData()

    // Barremos dinámicamente todo lo que el formulario envíe
    const keysToIgnore = ['imageFiles', 'fotosAEliminar', 'id', 'rawId', 'categoria', 'fotosOriginales']

    Object.keys(data).forEach((key) => {
        if (!keysToIgnore.includes(key)) {
            let value = data[key]
            if (typeof value === 'boolean') {
                value = value ? '1' : '0'
            } else if (value === null || value === undefined) {
                value = ''
            }
            formData.append(key, value.toString())
        }
    })

    if (isEditing) {
        formData.append("_method", "PUT")
    }

    if (data.fotosAEliminar && data.fotosAEliminar.length > 0) {
        const idsValidos = data.fotosAEliminar.filter((id: any) => id !== undefined && id !== null && id !== "");

        idsValidos.forEach((idFoto: any, index: number) => {
            formData.append(`fotos_a_eliminar[${index}]`, idFoto.toString());
        });
    }

    if (data.imageFiles && data.imageFiles.length > 0) {
        const fieldName = isEditing ? "nuevas_fotos" : "fotos"
        data.imageFiles.forEach((file: File, index: number) => {
            formData.append(`${fieldName}[${index}]`, file)
        })
    }

    const response = await fetch(url, {
        method: "POST",
        headers: { "Accept": "application/json" },
        body: formData,
    })

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Detalles del error de Laravel:", errorData);
        throw new Error(errorData.message || "Error al guardar prestador en el servidor");
    }
    return await response.json()
}

// =========================================================================
// 3. GUARDAR / ACTUALIZAR GUÍA
// =========================================================================
export async function saveGuiaService(data: any, editingGuia: any | null) {
    const isEditing = !!editingGuia

    // CORRECCIÓN 1: Apuntamos al endpoint correcto en singular
    // (Ajusta '/guide/register' si tu ruta de creación en Laravel exige el '/register')
    const url = isEditing
        ? `${API_URL}/guide/${editingGuia.rawId}`
        : `${API_URL}/guide`

    // CORRECCIÓN 2: Tomamos toda la data exacta que envía el nuevo formulario
    const payload = {
        ...data
    }

    // CORRECCIÓN 3: Si Laravel espera los arrays (idiomas, especialidad) como texto 
    // separado por comas en la BD, los transformamos aquí antes de enviar.
    if (Array.isArray(payload.idiomas)) {
        payload.idiomas = payload.idiomas.join(', ')
    }
    if (Array.isArray(payload.especialidad)) {
        payload.especialidad = payload.especialidad.join(', ')
    }

    const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(payload),
    })

    if (!response.ok) {
        // Capturamos el mensaje de error de validación de Laravel para saber exactamente qué falló
        const errorData = await response.json().catch(() => ({}));
        console.error(" Error de validación en Laravel (Guías):", errorData);
        throw new Error(errorData.message || "Error al guardar el guía en el servidor");
    }

    return await response.json()
}

// =========================================================================
// 4. ELIMINAR PRESTADOR O GUÍA (CORREGIDO CON ENPOINTS Y CAPTURA DE ERRORES)
// =========================================================================
export async function deletePrestadorService(prestador: Prestador) {
    const endpointMap = {
        Hotel: "hotel",
        Restaurante: "restaurant",
        Agencia: "agency"
    }
    const rutaBase = endpointMap[prestador.categoria as "Hotel" | "Restaurante" | "Agencia"]
    const rawId = (prestador as any).rawId

    const response = await fetch(`${API_URL}/${rutaBase}/${rawId}`, {
        method: "DELETE",
        headers: {
            "Accept": "application/json"
        }
    })
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error(` Error del backend al eliminar prestador (${response.status}):`, errorData);
        // Lanzamos el error con el mensaje específico del servidor para que el front lo muestre
        throw new Error(errorData.message || "No se pudo eliminar el prestador debido a un error en el servidor.");
    }

    return await response.json().catch(() => ({ success: true }))
}

export async function deleteGuiaService(guia: Guia) {
    const rawId = (guia as any).rawId || guia.id

    const response = await fetch(`${API_URL}/guide/${rawId}`, {
        method: "DELETE",
        headers: {
            "Accept": "application/json"
        }
    })

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error(` Error del backend al eliminar guía (${response.status}):`, errorData);
        throw new Error(errorData.message || "No se pudo eliminar el guía debido a un error en el servidor.");
    }

    return await response.json().catch(() => ({ success: true }))
}

// =========================================================================
// 5. MODIFICAR VISIBILIDAD (PATCH)
// =========================================================================
export async function togglePrestadorVisibilityService(
    rawId: number | string,
    categoria: string,
    isvisible: boolean
) {
    // CORRECCIÓN CRÍTICA: Rutas en singular y en inglés coincidiendo con Laravel
    const endpointMap: Record<string, string> = {
        Hotel: "hotel",
        Restaurante: "restaurant",
        Agencia: "agency",
        Guia: "guide"
    }

    const rutaBase = endpointMap[categoria]
    const url = `${API_URL}/${rutaBase}/${rawId}/visibility`

    const response = await fetch(url, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        // Enviamos el booleano puro para pasar la validación 'required|boolean'
        body: JSON.stringify({ isvisible: isvisible }),
    })

    const textData = await response.text()

    if (!response.ok) {
        console.error(` Error del backend en visibilidad (${response.status}):`, textData)
        throw new Error(`Error HTTP: ${response.status}`)
    }

    try {
        const result = textData ? JSON.parse(textData) : { success: true }
        if (result.success === false) {
            throw new Error(result.message || "El servidor rechazó el cambio lógico.")
        }
        return result
    } catch (parseError) {
        return { success: true }
    }
}