// types.ts

export interface PrestadorBase {
    id: string;
    nombre: string;
    telefono: string;
    correo: string;
    instagram?: string;
    facebook?: string;
    whatsapp?: string;
    web?: string;
    id_direccion?: string;
    direccion?: string;
    isvisible?: boolean;
    imageUrl: string;
}

export interface Restaurante extends PrestadorBase {
    categoria: "Restaurante";
    tipo_cocina: string;
    horarios: string;
    propietario: string;
    capacidad: number;
    platos_principales: string;
}

export interface Hotel extends PrestadorBase {
    categoria: "Hotel";
    rnt: string;
    nombre_contacto: string;
    n_habitaciones_totales: number;
    n_habitaciones_simples: number;
    n_habitaciones_dobles: number;
    n_habitaciones_suites: number;
    petfriendly: boolean;
    acceso_discapacidad: boolean;
    parqueadero: boolean;
    restaurante: boolean; 
    calificacion_salud: boolean;
    visita_inspeccion_turismo: boolean;
    observaciones?: string;
}

export interface Agencia extends PrestadorBase {
    categoria: "Agencia";
    nit: string;
    rnt: string;
    tipo: string;
    representante_legal: string;
    n_empleados_asociados: number;
    especialidad_turistica: string;
    destinos_principales: string;
    observaciones?: string;
}

export interface Guia extends PrestadorBase {
  email: string
  apellido: string
  documento: string
  tipo_documento: string
  idiomas: string[]
  especialidades: string[]
  fecha_registro: string
  numero_tarjeta: string
}

// Para cuando necesites un tipo que abarque cualquier prestador
export type Prestador = Restaurante | Hotel | Agencia;