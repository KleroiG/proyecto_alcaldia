export interface Prestador {
    id: string
    nombre: string
    descripcion: string
    categoria: "Hotel" | "Restaurante" | "Agencia"
    imageUrl: string
    fotosOriginales?: any[]
    direccion: string
    telefono: string
    email?: string
    whatsapp?: string
    instagram?: string
    facebook?: string
    website?: string
    horario?: string
    isvisible?: boolean
}