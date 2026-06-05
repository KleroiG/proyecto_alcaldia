import { Restaurante } from "../types";
import { apiUrl } from "@/lib/api";

export async function saveRestaurante(data: Partial<Restaurante>) {
    const isEditing = !!data.id;
    const url = isEditing ? apiUrl(`restaurant/${data.id}`) : apiUrl("restaurant");
    const method = isEditing ? "PUT" : "POST";

    const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al guardar el restaurante");
    }
    return await response.json();
}

export async function deleteRestaurante(id: string) {
    const response = await fetch(apiUrl(`restaurant/${id}`), {
        method: "DELETE",
        headers: { "Accept": "application/json" },
    });
    if (!response.ok) throw new Error("Error al eliminar el restaurante");
    return true;
}
