import { Persona } from "./persona";

export class Cuenta {
    id_cuenta?: number;
    usuario?: string;
    contrasenia?: string;
    estado?: boolean;
    rol?:string;
    persona?: Persona
}
