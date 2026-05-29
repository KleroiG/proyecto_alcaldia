// prestadores-service.ts
import type { Prestador } from "./page"
import type { Guia } from "./seccion-guia"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"
const API_URL = `${BASE_URL}/api`


async function safeFetchJson(url: string) {
    try {
        const response = await fetch(url)

        // Si la respuesta no es 200 OK, lanzamos una advertencia
        if (!response.ok) {
            console.error(`❌ Error HTTP ${response.status} en la ruta: ${url}`)
            return { success: false, data: [] }
        }

        // Verificamos que el contenido realmente sea JSON antes de parsearlo
        const contentType = response.headers.get("content-type")
        if (contentType && contentType.includes("application/json")) {
            return await response.json()
        } else {
            console.error(`❌ La ruta ${url} devolvió HTML en lugar de JSON. Verifica routes/api.php`)
            return { success: false, data: [] }
        }
    } catch (error) {
        console.error(`❌ Error de conexión con ${url}:`, error)
        return { success: false, data: [] }
    }
}


// =========================================================================
// 1. OBTENER Y NORMALIZAR TODOS LOS PRESTADORES Y GUÍAS
// =========================================================================
export async function fetchAllPrestadoresYGuias() {
    try {
        // Usamos nuestra función segura en lugar del fetch crudo
        const [jsonHoteles, jsonRestos, jsonAgencias, jsonGuias] = await Promise.all([
            safeFetchJson(`${API_URL}/hotel`),
            safeFetchJson(`${API_URL}/restaurant`),
            safeFetchJson(`${API_URL}/agency`),
            safeFetchJson(`${API_URL}/guide`)
        ])

        const unifiedPrestadores: Prestador[] = []

        if (jsonHoteles.success && jsonHoteles.data) {
            unifiedPrestadores.push(...jsonHoteles.data.map((h: any) => ({
                id: `hotel-${h.id_hotel || h.id}`,
                rawId: h.id_hotel || h.id,
                nombre: h.nombre,
                descripcion: h.observaciones || h.descripcion || "Hotel en Sogamoso",
                categoria: "Hotel",
                imageUrl: h.fotos?.[0]?.url_foto || "",
                direccion: h.direccion?.direccion || "Sogamoso",
                telefono: h.celular || "N/A",
                email: h.correo || "",
                fotosOriginales: h.fotos || [],
            })))
        }

        if (jsonRestos.success && jsonRestos.data) {
            unifiedPrestadores.push(...jsonRestos.data.map((r: any) => ({
                id: `restaurante-${r.id_restaurante || r.id}`,
                rawId: r.id_restaurante || r.id,
                nombre: r.nombre,
                descripcion: r.tipo_cocina || r.descripcion || "Restaurante local",
                categoria: "Restaurante",
                imageUrl: r.fotos?.[0]?.url_foto || "",
                direccion: r.direccion?.direccion || "Sogamoso",
                telefono: r.celular || "N/A",
                email: r.correo || "",
                fotosOriginales: r.fotos || [],
            })))
        }

        if (jsonAgencias.success && jsonAgencias.data) {
            unifiedPrestadores.push(...jsonAgencias.data.map((a: any) => ({
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
            })))
        }

        let normalizedGuias: Guia[] = []
        if (jsonGuias.success && jsonGuias.data) {
            normalizedGuias = jsonGuias.data.map((g: any) => ({
                id: (g.id_guia || g.id).toString(),
                rawId: g.id_guia || g.id,
                nombre: g.nombre,
                apellido: "",
                documento: g.n_cedula?.toString() || "",
                tipo_documento: "CC",
                telefono: g.celular?.toString() || "",
                email: g.correo || "",
                direccion: "Sogamoso",
                idiomas: ["Español"],
                especialidades: ["Turismo General"],
                fecha_registro: g.created_at || new Date().toISOString(),
                numero_tarjeta: g.rnt || "N/A"
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
    data: Partial<Prestador> & { imageFiles?: File[], fotosAEliminar?: number[] },
    editingPrestador: any | null
) {
    const isEditing = !!editingPrestador
    const endpointMap = {
        Hotel: "hoteles",
        Restaurante: "restaurantes",
        Agencia: "agencias"
    }

    const rutaBase = endpointMap[data.categoria as "Hotel" | "Restaurante" | "Agencia"]
    const url = isEditing
        ? `${API_URL}/${rutaBase}/${editingPrestador.rawId}`
        : `${API_URL}/${rutaBase}`

    const formData = new FormData()
    formData.append("nombre", data.nombre || "")
    formData.append("celular", data.telefono || "")
    formData.append("correo", data.email || "")
    if (data.categoria !== "Agencia") {
        formData.append("direccion", data.direccion || "")
    }

    if (isEditing) {
        formData.append("_method", "PUT")
    }

    if (data.fotosAEliminar && data.fotosAEliminar.length > 0) {
    data.fotosAEliminar.forEach((idFoto, index) => {
      formData.append(`fotos_a_eliminar[${index}]`, idFoto.toString())
    })
  }

    if (data.imageFiles && data.imageFiles.length > 0) {
        const fieldName = isEditing ? "nuevas_fotos" : "fotos"
        data.imageFiles.forEach((file, index) => {
            formData.append(`${fieldName}[${index}]`, file)
        })
    }

    const response = await fetch(url, {
        method: "POST", // POST requerido para el envío de archivos (FormData)
        body: formData,
    })

    if (!response.ok) throw new Error("Error al guardar prestador en el servidor")
    return await response.json()
}

// =========================================================================
// 3. GUARDAR / ACTUALIZAR GUÍA
// =========================================================================
export async function saveGuiaService(data: Partial<Guia>, editingGuia: any | null) {
    const isEditing = !!editingGuia
    const url = isEditing
        ? `${API_URL}/guias/${editingGuia.rawId}`
        : `${API_URL}/guias`

    const payload = {
        nombre: `${data.nombre} ${data.apellido || ""}`.trim(),
        n_cedula: data.documento,
        correo: data.email,
        celular: data.telefono,
        rnt: data.numero_tarjeta
    }

    const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    })

    if (!response.ok) throw new Error("Error al guardar guía en el servidor")
    return await response.json()
}

// =========================================================================
// 4. ELIMINAR PRESTADOR O GUÍA
// =========================================================================
export async function deletePrestadorService(prestador: Prestador) {
    const endpointMap = { Hotel: "hoteles", Restaurante: "restaurantes", Agencia: "agencias" }
    const rutaBase = endpointMap[prestador.categoria as "Hotel" | "Restaurante" | "Agencia"]
    const rawId = (prestador as any).rawId

    const response = await fetch(`${API_URL}/${rutaBase}/${rawId}`, { method: "DELETE" })
    if (!response.ok) throw new Error("Error al eliminar prestador")
}

export async function deleteGuiaService(guia: Guia) {
    const rawId = (guia as any).rawId || guia.id
    const response = await fetch(`${API_URL}/guias/${rawId}`, { method: "DELETE" })
    if (!response.ok) throw new Error("Error al eliminar guía")
}