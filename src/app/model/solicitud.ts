import { Persona } from "./persona";
import { RegisterAnimal } from "./register-animal";

export class Solicitud {
    id_solicitud?: number;
    fecha?: Date;
    tipopago?: string;
    comentario?: string;
    estado?: string;

    animal?: RegisterAnimal;
    persona?: Persona;
}