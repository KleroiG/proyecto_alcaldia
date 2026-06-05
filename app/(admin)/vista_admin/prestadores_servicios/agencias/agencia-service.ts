import { Agencia } from "../types";
import { apiUrl } from "@/lib/api";

export async function saveAgencia(data: Partial<Agencia>) {
    const isEditing = !!data.id;
    const url = isEditing ? apiUrl(`agency/${data.id}`) : apiUrl("agency");
    const method = isEditing ? "PUT" : "POST";

    const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al guardar la agencia");
    }
    return await response.json();
}

export async function deleteAgencia(id: string) {
    const response = await fetch(apiUrl(`agency/${id}`), {
        method: "DELETE",
        headers: { "Accept": "application/json" },
    });
    if (!response.ok) throw new Error("Error al eliminar la agencia");
    return true;
}
