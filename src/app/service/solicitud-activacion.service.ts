import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http"
import {API_URI} from '../model/api'

@Injectable({
  providedIn: 'root'
})
export class SolicitudActivacionService {

  constructor(private http: HttpClient) { }

  public getSolicitudesActivacion(){
    return this.http.get<any>(API_URI+'/solicitud/ativacion/listarsolicitudesdActivacion');
  }

  public saveSolicitudesActivacion(cedula: any){
    return this.http.get<any>(API_URI+'/solicitud/ativacion/solicitarActivacion/'+cedula);
  }

  public updateSolicitudesActivacion(id_solicitud: any, solicitudA: any){
    return this.http.put<any>(API_URI+'/solicitud/ativacion/updatesolicitud/accepSolicitude/'+id_solicitud, solicitudA);
  }
}
