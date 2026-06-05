import { Hotel } from "../types";
import { apiUrl } from "@/lib/api";

export async function saveHotel(data: Partial<Hotel>) {
    const isEditing = !!data.id;
    const url = isEditing ? apiUrl(`hotel/${data.id}`) : apiUrl("hotel");
    const method = isEditing ? "PUT" : "POST";

    const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al guardar el hotel");
    }
    return await response.json();
}

export async function deleteHotel(id: string) {
    const response = await fetch(apiUrl(`hotel/${id}`), {
        method: "DELETE",
        headers: { "Accept": "application/json" },
    });
    if (!response.ok) throw new Error("Error al eliminar el hotel");
    return true;
}
