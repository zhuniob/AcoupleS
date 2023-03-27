import { Chat } from './chat';
import { Persona } from './persona';

export class Mensaje {
  id_mensaje: number;
  texto: string;
  fecha: Date;
  chat: Chat;
  persona: Persona;
}
