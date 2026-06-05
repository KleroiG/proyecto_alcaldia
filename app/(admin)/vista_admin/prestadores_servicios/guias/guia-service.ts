import { Guia } from "../types";
import { apiUrl } from "@/lib/api";

export async function saveGuia(data: Partial<Guia>) {
    const isEditing = !!data.id;
    const url = isEditing ? apiUrl(`guide/${data.id}`) : apiUrl("guide");
    const method = isEditing ? "PUT" : "POST";

    const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error("Error al guardar el guía");
    return await response.json();
}

export async function deleteGuia(id: string) {
    const response = await fetch(apiUrl(`guide/${id}`), { method: "DELETE" });
    if (!response.ok) throw new Error("Error al eliminar el guía");
    return true;
}
