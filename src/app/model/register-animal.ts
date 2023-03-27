import { FichasMedicas } from "src/app/model/fichas-medicas";
import { Persona } from "src/app/model/persona";
import { Raza } from "src/app/model/raza";
import { Tipo } from "src/app/model/tipo";

export class RegisterAnimal {
    id_animal?: number;
    nombre?: string;
    foto?: string;
    genero?: string;
    color?: string;
    edad?: number;
    preciosolicitud?: string;
    peso?: number;
    disponibilidad?: boolean;
    estado?: boolean;
    num_soli?: number;
    raAnimal?: Raza;
    persona?: Persona;
    fichaMedica?: FichasMedicas
}
