import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {API_URI} from '../model/api'

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  constructor(private http: HttpClient) { }

  //Reportes que va tener el admin..
  public getReportUserPerAdmin() {
    return this.http.get(API_URI + '/sistemascouple/reports/users/download-report-user', { responseType: 'blob' });
  }

  //Reportes que va tener el admin..
  public getReportUserPerAdminOfUserRequest(id_persona: any, name:any) {
    return this.http.get(API_URI + '/sistemascouple/reports/users/request/download-report-user/'+id_persona+'/'+name, { responseType: 'blob' });
  }

  //Reportes de todas las razas pertenecientes a sus tiposel admin..
  public generateReporOftRazaDependenceTipo(id_persona: any, name:any) {
    return this.http.get(API_URI + '/sistemascouple/reports/users/request/raza/download-report-animal/'+id_persona+'/'+name, { responseType: 'blob' });
  }

  //Reportes de todas las razas pertenecientes a sus tiposel admin..
  public generateReporOftRazaOfBest(id_raza: any, limit: any, name:any) {
    return this.http.get(API_URI + '/sistemascouple/reports/users/request/raza/best/download-report-animal/'+id_raza+'/'+limit+'/'+name, { responseType: 'blob' });
  }

}
