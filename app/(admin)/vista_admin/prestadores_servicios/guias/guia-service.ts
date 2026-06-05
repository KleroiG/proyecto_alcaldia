// admin/prestadores/guias/guia-service.ts
import { Guia } from "../types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export async function saveGuia(data: Partial<Guia>) {
    const isEditing = !!data.id;
    const url = isEditing 
        ? `${API_URL}/api/guide/${data.id}` 
        : `${API_URL}/api/guide`;
    
    const method = isEditing ? "PUT" : "POST";

    const response = await fetch(url, {
        method,
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error("Error al guardar el guía");
    return await response.json();
}

export async function deleteGuia(id: string) {
    const response = await fetch(`${API_URL}/api/guide/${id}`, {
        method: "DELETE",
    });
    if (!response.ok) throw new Error("Error al eliminar el guía");
    return true;
}