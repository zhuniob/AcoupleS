import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http'
import { Persona } from '../model/persona';
import { Cuenta } from '../model/cuenta';
import {API_URI} from '../model/api'

@Injectable({
  providedIn: 'root'
})
export class OauthService {

  constructor(private http: HttpClient) { }

  public signIn(nuser: string, password: string) {
    return this.http.get<any>(API_URI + '/signIn/getuser/' + nuser + '/' + password);
  }

  public registerUser(persona: Persona){
    return this.http.post(API_URI+'/registerData/saveUser', persona);
  }

  public signUp(user: Cuenta){
    return this.http.post(API_URI+'/signUp/saveUser', user);
  }

  public checkUser(username: string){
    return this.http.get(API_URI+'/oauth/searchByUser/'+username);
  }

  public existByUsername(username: string){
    return this.http.get(API_URI+'/oauth/existByUsername/'+username);
  }

  public existByCedula(cedula: any){
    return this.http.get(API_URI+'/oauth/existByCedula/'+cedula);
  }

  public existByCorreo(correo: any){
    return this.http.get(API_URI+'/oauth/existByCorreo/'+correo);
  }
}
