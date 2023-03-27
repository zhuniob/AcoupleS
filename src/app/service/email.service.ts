import { Injectable } from '@angular/core';

//Cliente de angular
import { HttpClient } from "@angular/common/http"
import {API_URI} from '../model/api'
@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor(private http: HttpClient) { }

  public sendEmailWelcome(email: any, name: any){
    return this.http.get<any>(API_URI+'/email/send/welcome/'+email+'/'+name);
  }

  public sendEmailofUserPreferences(id_tipo: any, id_persona_emisora: any, tipo_animal: any, raza_notifica: any, name_emisor:any){
    return this.http.get<any>(API_URI+'/email/sendmessageofUser/preferences/'+id_tipo+'/'+id_persona_emisora+'/'+tipo_animal+'/'+raza_notifica+'/'+name_emisor);
  }

  //Envio de correo donde la cuenta  a sido activada satisfactoriamente.
  public sendEmailActivationAccount(id_persona: any){
    return this.http.get<any>(API_URI+'/email/send/activation/account/'+id_persona);
  }

  //Enviar solicitud de recuperacion de contraseña
  public sendEmailRecoverPassword(cedula: any){
    return this.http.get<any>(API_URI+'/email/send/'+cedula);
  }

  //Enviar solicitud de aceptacion de animal.
  public sendEmailConfirmAnimalNotification(id_animal: any, id_receptor: any){
    return this.http.get<any>(API_URI+'/email/send/notification/acept/animalsolicitud/'+id_animal+'/'+id_receptor);
  }

}
