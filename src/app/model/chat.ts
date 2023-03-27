import { Mensaje } from './mensaje';
import { Persona } from './persona';

export class Chat {
  id_chat: number;
  persona_emisor: Persona;
  persona_receptor: Persona;
  mensajes: Mensaje[];
}
