import { Injectable } from '@angular/core';

//Cliente de angular
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {API_URI} from '../model/api'
@Injectable({
  providedIn: 'root',
})
export class AnimalService {
  constructor(private http: HttpClient) {}

  //Metodo Animal
  public getAnimalByid(id_animal: number) {
    return this.http.get(API_URI + '/animal/buscaranimal/' + id_animal);
  }

  

  //Metodo listar animales
  public getTiposAn() {
    return this.http.get<any>(API_URI + '/tipoanimal/listartiposAnimales');
  }

  //Metodo Raza
  public getRazaById(id_razaanimal: number) {
    return this.http.get<any>(API_URI + '/raza/buscarraza/' + id_razaanimal);
  }

  //Metodo Animal
  public saveAnimal(animal: any) {
    return this.http.post(API_URI + '/animal/crearanimal', animal);
  }

  //Metodo listar raza
  public getListRaza() {
    return this.http.get<any>(API_URI + '/raza/listarrazas');
  }

  public getAllAnimalsByTipoID(id_tipo: any) {
    return this.http.get<any>(API_URI + '/animal/listperTip/' + id_tipo);
  }

  public getAllAnimalsByRazaID(id_raza: any) {
    return this.http.get<any>(API_URI + '/animal/listperRaza/' + id_raza);
  }

  //Find all
  public findAllAnimals() {
    return this.http.get<any>(API_URI + '/animal/findAll');
  }

  crearFicha(formData: FormData): Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');

    return this.http.post<any>(API_URI+'/ficha', formData, {
      headers,
      reportProgress: true,
      observe: 'events'
    });
  }


  guardarFichaMedica(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post<any>(API_URI+'/ficha', formData);
  }

  fichamedicaByID(id: any){
    return this.http.get<any>(API_URI + '/ficha/buscarfichaMedica/' + id);
  }
  
  //Find all trues
  public findAllAnimals1() {
    return this.http.get<any>(API_URI + '/animal/listaranimales');
  }

  //cuentas
  public findAllCuentasA(id_persona: any) {
    return this.http.get<any>(API_URI + '/animal/findByUser/' + id_persona);
  }

  //para editar desde el perfil
  public EditarAnimalById(id_animal: any, animal: any) {
    return this.http.put<any>(
      API_URI + '/animal/actualizaranimal/' + id_animal,
      animal
    );
  }

  //Filtro para usuario de sus animales de preferencia..
  public PreferenceOfUserLoggin(id_tipo: any, razasId: any[]) {
    console.log('lO QUE TENEMOS EN EL SERVICE')
    console.log(razasId)
    return this.http.post<any>(API_URI + '/animal/findAllByRazasBytipo/'+id_tipo+'/getall', razasId);
  }

  //Update de animal en el caso del estado de animal como su numero de estrellitas
  public updateAnimalOfCalification(disponibilidad: any, id_animal:any, num_soli: any) {
    return this.http.put<any>(API_URI + '/animal/actualizaranimal/calificasion/'+id_animal+'/'+disponibilidad+'/'+num_soli, {});
  }

  //Actualizar el estado de todos los aimales cuando ellos estan activos.
  public findAllByPersona(id_persona: any) {
    return this.http.get<any>(API_URI + '/animal/getallanimals/update/status/desactiva/'+id_persona);
  }
}
