
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Solicitud } from 'src/app/model/solicitud';
import { LoadScript } from 'src/app/scripts/load-script';
import { SolicitudService } from 'src/app/service/solicitud.service';
import { StorageService } from 'src/app/service/storage.service';


@Component({
  selector: 'app-solicitud',
  templateUrl: './solicitud.component.html',
  styleUrls: ['./solicitud.component.css']
})
export class SolicitudComponent implements OnInit {

  public solicitudes: any; // variable que va recivir toda la data..
  public solicitudesr: any;
  public rolUser: any;
  public numsolicitudes: any;
  public idperlog: any;
  public id_user?: any;
  public nombreUser?: any;

  public isUserAdmin: boolean = false;
  public isUserNormal: boolean = false;

  public listsolicitudes: Solicitud[] = [];

  public nombreSalida: any = '';
  constructor(
    private router: Router,
    private solicitudService: SolicitudService,
    private operacionesJS: LoadScript
  ) { operacionesJS.Cargar(["notificacion"]) }

  ngOnInit(): void {
 
    this.rolUser = localStorage.getItem('rol');
    this.idperlog = localStorage.getItem('id_user_person');
    this.listarsolicitudesp(1, this.idperlog);
  }

  E1: any = 'Pendiente';
  E2: any = 'Aceptada';
  E3: any = 'Rechazada';
  E4: any = 'Enviadas';

  public listarsolicitudesp(e: number, x: number): void {
    this.nombreSalida = 'Pendientes'
    this.solicitudService.getAllSolicitudesByPersonaID(this.E1, this.idperlog).subscribe((data) => {
      this.solicitudes = data
      console.log(this.solicitudes); // Muestra el resultado en la consola
    });
  }

  public listarsolicitudesa(e: number, x: number): void {
    this.nombreSalida = 'Aceptadas'
    this.solicitudService.getAllSolicitudesByPersonaID(this.E2, this.idperlog).subscribe((data) => {
      this.solicitudes = data
      console.log(this.solicitudes); // Muestra el resultado en la consola
    });
  }
  public listarsolicitudesr(e: number, x: number): void {
    this.nombreSalida = 'Rechazadas'
    this.solicitudService.getAllSolicitudesByPersonaID(this.E3, this.idperlog).subscribe((data) => {
      this.solicitudes = data
      console.log(this.solicitudes); // Muestra el resultado en la consola
    });
  }

  public listarsolicitudespr(e: number, x: number): void {
    this.nombreSalida = 'Pendientes'
    this.solicitudService.getAllSolicitudesEsByPersonaID(this.E1, this.idperlog).subscribe((data) => {
      this.solicitudesr = data
      console.log(this.solicitudesr); // Muestra el resultado en la consola
    });
  }
  public listarsolicitudesar(e: number, x: number): void {
    this.nombreSalida = 'Aceptadas'
    this.solicitudService.getAllSolicitudesEsByPersonaID(this.E2, this.idperlog).subscribe((data) => {
      this.solicitudesr = data
      console.log(this.solicitudesr); // Muestra el resultado en la consola
    });
  }
  public listarsolicitudesrr(e: number, x: number): void {
    this.nombreSalida = 'Rechazadas'
    this.solicitudService.getAllSolicitudesEsByPersonaID(this.E3, this.idperlog).subscribe((data) => {
      this.solicitudesr = data
      console.log(this.solicitudesr); // Muestra el resultado en la consola
    });
  }

  public perfildePersona(id_persona: any) {
    //Implementacion del routenign
    this.router.navigate(['usuario/profileuser/profile/', id_persona]);
  }

  public irPerfilAnimalProfile(id_animal: any){
    // alert(id_animal)
    this.router.navigate(['/usuario/perfil/animal', id_animal]);
  }

  /********************************************************************************************************************************************************************************************/
  //  inicio control  - tabla-html

  first = 0;
  rows = 4;
  displayMaximizable?: boolean;
  displayMaximizableDelete?: boolean;

  showMaximizableDialog() {
    this.displayMaximizable = true;
  }

  next() {
    this.first = this.first + this.rows;
  }

  prev() {
    this.first = this.first - this.rows;
  }

  reset() {
    this.first = 0;
  }
  resetTemplate() {
    this.first = 0;
  }
  isLastPage(): boolean {
    return this.listsolicitudes ? this.first === (this.listsolicitudes.length - this.rows) : true;
  }

  isFirstPage(): boolean {
    return this.listsolicitudes ? this.first === 0 : true;
  }


  //  fin control  - tabla-html
  /********************************************************************************************************************************************************************************************/

}
