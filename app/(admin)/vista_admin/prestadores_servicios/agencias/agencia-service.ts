import { Agencia } from "../types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export async function saveAgencia(data: Partial<Agencia>) {
    const isEditing = !!data.id;
    // Ajusta el endpoint según tus rutas de Laravel
    const url = isEditing 
        ? `${API_URL}/api/agency/${data.id}` 
        : `${API_URL}/api/agency`;
    
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
        throw new Error(errorData.message || "Error al guardar la agencia");
    }
    
    return await response.json();
}

export async function deleteAgencia(id: string) {
    const response = await fetch(`${API_URL}/api/agency/${id}`, {
        method: "DELETE",
        headers: {
            "Accept": "application/json"
        }
    });
    
    if (!response.ok) throw new Error("Error al eliminar la agencia");
    return true;
}