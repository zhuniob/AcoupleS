import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GenericService {

  private animalList: any[] = [];

  private solicitudeslList: any[] = []; 

  private messageSolicitud: string = ''; 

  constructor() {}

  //Para los animales se carguen en tiempo de ejecución.
  public setAnimalList(list: any[]) {
    this.animalList = list;
  }

  public getAnimalList(): any[] {
    return this.animalList;
  }

  //Para que las solicitudes carguen en tiempo de ejecusión.
  public setSolicitudList(list: any[]) {
    this.solicitudeslList = list;
  }

  public getSolicitudList(): any[] {
    return this.solicitudeslList;
  }

  //Para que los mensajes de la solicitudes carguen en tiempo de ejecusión.
  public setSolicitudMessage(message: string) {
    this.messageSolicitud = message;
  }

  public getSolicitudMessage() {
    return this.messageSolicitud;
  }
}
