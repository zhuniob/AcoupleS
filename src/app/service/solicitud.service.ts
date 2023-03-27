import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Solicitud } from '../model/solicitud'
import { API_URI } from '../model/api';

@Injectable({
  providedIn: 'root',
})
export class SolicitudService {
  
  constructor(private http: HttpClient) {}

  public getAllSolicitudes() {
    return this.http.get<any>(API_URI + '/solicitud/listarsolicitudes');
  }

  public createSolicitud(solicitud: Solicitud) {
    return this.http.post(API_URI + '/solicitud/crearsolicitud', solicitud);
  }

  public getSolicitudById(id_solicitud: number) {
    return this.http.get(
      API_URI + '/solicitud/buscarsolicitud/' + `${id_solicitud}`
    );
  }

  public deleteSolicitud(id_solicitud: number) {
    return this.http.delete(
      API_URI + '/solicitud/eliminarsolicitud/' + `${id_solicitud}`
    );
  }

//Metodo listar solicitudes por id de cliente logeado
public getAllSolicitudesByPersonaID(estado: any, id_persona: any){
  return this.http.get<any>(API_URI + '/solicitud/buscarsolicitudporpersona/'+estado+'/'+id_persona);
}

public EditarSolicitudById(id_solicitud : any, solicitud:any){
  console.log("sadsd")
  console.log(solicitud)
  return this.http.put<any>(API_URI + '/solicitud/actualizarsolicitud/'+id_solicitud, solicitud);
}

public getAllSolicitudesEsByPersonaID(estado: any, id_persona: any){
  return this.http.get<any>(API_URI + '/solicitud/buscarsolicitudesporpersona/'+estado+'/'+id_persona);
}


}
