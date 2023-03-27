import { Persona } from "./persona";
import { Raza } from "./raza";

export class Preferencia {
    id_preferencia?: number;
    estado?: boolean;
    persona?: Persona;
    razaAnimal?: Raza
}
