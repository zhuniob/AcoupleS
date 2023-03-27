import { Injectable } from '@angular/core';

//Cliente de angular
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Chat } from '../model/chat';
import { ChatRequest } from '../interface/chat-request';
import { MensajeRequest } from '../interface/mensaje-request';
import { Mensaje } from '../model/mensaje';
import { empty } from 'rxjs';
import {API_URI} from '../model/api'

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private http: HttpClient) { }
  
  public getChatByPersonasInSection(idPersonaEmisor: number, idPersonaReceptor: number): Observable<any> {
    const url = `${API_URI}/chat/finduser/exist/${idPersonaEmisor}/${idPersonaReceptor}`;
    return this.http.get<any>(url);
  }

  public getChatsByPersonas(idPersonaEmisor: number, idPersonaReceptor: number): Observable<Chat[]> {
    const url = `${API_URI}/chat/${idPersonaEmisor}/${idPersonaReceptor}`;
    return this.http.get<Chat[]>(url);
  }

  public getChatsByPersona(idPersona: number): Observable<Chat[]> {
    const url = `${API_URI}/chat/${idPersona}/chats`;
    return this.http.get<Chat[]>(url);
  }

  public createChat(idPersonaEmisor: number, idPersonaReceptor: number): Observable<Chat> {
    const url = `${API_URI}/chat/${idPersonaEmisor}/${idPersonaReceptor}`;
    return this.http.post<Chat>(url, {});
  }

  public getMensajesByChat(idChat: number): Observable<Mensaje[]> {
    if (!idChat) {
      return empty();
    }
    const url = `${API_URI}/chat/${idChat}/mensajes`;
    return this.http.get<Mensaje[]>(url);
  }

  public createMensaje(idChat: number, texto: string): Observable<Mensaje> {
    const url = `${API_URI}/chat/${idChat}/mensajes`;
    return this.http.post<Mensaje>(url, { texto });
  }

  //Implementacion de los nuevos metodos pero con los cambios que nos permitiran hacer los cambio para obtener los resultados de un chat.
  public createMensajeIsPresent(idChat: number, id_persona: number, texto: string): Observable<Mensaje> {
    const url = `${API_URI}/chat/${idChat}/mensajes/${id_persona}`;
    return this.http.post<Mensaje>(url, { texto });
  }

  //Nuevo metodo
  public getByChat(id_chat: number): Observable<Chat> {
    const url = `${API_URI}/chat/findBychat/${id_chat}`;
    return this.http.get<Chat>(url);
  }

  //Para contar los chats de chada persona
  public getByCountChat(id_persona: number): Observable<any> {
    return this.http.get<any>(API_URI+'/chat/findChat/count/'+id_persona);
  }
}
