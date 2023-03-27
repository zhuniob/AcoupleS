import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Cuenta } from '../model/cuenta';
import {API_URI} from '../model/api'

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  public getAll(){
    return this.http.get(API_URI+'/cuentauser/listarcuenta')
  }

  public obtenerListaAcountOfUserDiferentAdmin(){
    return this.http.get(API_URI+'/cuentauser/listarcuenta/diferentAdmin')
  }

  public getUserLogginByID(id_user: any){
    return this.http.get(API_URI+'/cuentauser/buscarcuenta/'+id_user);
  }

  public updateDataAccount(id_user: any, cuenta:Cuenta){
    return this.http.put<Cuenta>(API_URI+'/cuentauser/actualizcuenta/'+id_user, cuenta);
  }

  //Metodo update status of account
  public updateAccountUserActive(id_user: number, user:any) {
    return this.http.put<any>(API_URI + '/cuentauser/actualizcuenta/' + id_user, user);
  }

  public findByIdUserInTableById_Persona(id_persona: any) {
    return this.http.get<any>(API_URI + '/cuentauser/buscarcuenta/findby/' + id_persona);
  }

}
