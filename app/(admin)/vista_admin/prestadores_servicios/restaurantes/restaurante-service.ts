import { Restaurante } from "../types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export async function saveRestaurante(data: Partial<Restaurante>) {
    const isEditing = !!data.id;
    // Ajusta el endpoint según tus rutas de Laravel
    const url = isEditing 
        ? `${API_URL}/api/restaurant/${data.id}` 
        : `${API_URL}/api/restaurant`;
    
    const method = isEditing ? "PUT" : "POST";

    const response = await fetch(url, {
        method,
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al guardar el restaurante");
    }
    
    return await response.json();
}

export async function deleteRestaurante(id: string) {
    const response = await fetch(`${API_URL}/api/restaurant/${id}`, {
        method: "DELETE",
        headers: {
            "Accept": "application/json"
        }
    });
    
    if (!response.ok) throw new Error("Error al eliminar el restaurante");
    return true;
}