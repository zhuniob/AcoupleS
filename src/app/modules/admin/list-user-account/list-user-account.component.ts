import { Component, OnInit } from '@angular/core';
import { Cuenta } from 'src/app/model/cuenta';
import { Persona } from 'src/app/model/persona';
import { UserService } from 'src/app/service/user.service';

import { ConfirmationService, MessageService } from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';

//pasos para el pdf..
import * as fileSaver from 'file-saver';

import { DomSanitizer } from '@angular/platform-browser';
import { ReportsService } from 'src/app/service/reports.service';
import { PersonaService } from 'src/app/service/persona.service';
import { EmailService } from 'src/app/service/email.service';
import { SolicitudActivacionService } from 'src/app/service/solicitud-activacion.service';
import { SolicitudActivacion } from 'src/app/model/solicitud-activacion';

@Component({
  selector: 'app-list-user-account',
  templateUrl: './list-user-account.component.html',
  styleUrls: [
    './list-user-account.component.css',
    './list-user-account.component.scss',
  ],
  providers: [ConfirmationService, MessageService],
})
export class ListUserAccountComponent implements OnInit {
  cuenta: any[] = [];

  first = 0;

  rows = 5;
  //Para el pdf
  public pdfSrc: any;

  //Instancia de la clase account..
  public account: Cuenta = new Cuenta();
  //Fin de la creaicon de la clase account

  //Solicitudes de activacion de cuenta..
  public ListsolicitudesActivacionCuenta: any;
  //Otro modal
  displayBasic2: boolean;

  //La instancia de la solicitud para enviar el actualizado
  public solicitudAc: SolicitudActivacion = new SolicitudActivacion();

  public isLoadingDataAdmin: boolean = false;
  constructor(
    private userService: UserService,
    private reportService: ReportsService,
    public sanitizer: DomSanitizer,
    private peronaService: PersonaService,
    private messageService: MessageService,
    private primengConfig: PrimeNGConfig,
    private servieEmail: EmailService,
    private solicitudesService: SolicitudActivacionService
  ) {}

  ngOnInit(): void {
    this.isLoadingDataAdmin = true;
    this.getAllUser();
    this.primengConfig.ripple = true;
    this.getAllSolicitude();
  }

  ngAfterViewInit() {
    this.solicitudAc = { ...this.ListsolicitudesActivacionCuenta[0] };
  }

  public getdataOfuserActivateInModalView(solicitud: any) {
    console.log(solicitud);
    this.solicitudAc = { ...solicitud };

    this.botonHinabilitadoProcederBusqueda = false;
    // console.log(this.solicitudAc)
  }
  //------------------------------------------------------------------

  //Traer solicitudes de activacion de la cuenta
  public getAllSolicitude() {
    this.solicitudesService.getSolicitudesActivacion().subscribe((data) => {
      this.ListsolicitudesActivacionCuenta = data;
      console.log(this.ListsolicitudesActivacionCuenta);
    });
  }

  botonHinabilitado: boolean = true;
  botonHinabilitadoProcederBusqueda: boolean = true; // me sirve apra la segunda opicion
  // remainingTime: any;
  public isActivateActivations() {
    this.isActivate = !this.isActivate;

    if (this.isActivate == true) {
      this.showSuccess('Protección activa.');
    } else {
      this.showWarn('La seguridad de hablitación de la cuenta esta activa.');
    }
  }

  //Visible modal la perteque va capturar el id para sus busqueda.
  showBasicDialog2() {
    this.getAllSolicitude();
    this.displayBasic2 = true;
  }

  //Metodo qu me seive para controlar el evento de busqueda()---------------------------------------------------
  public getUserByrecuperacion() { // en esata parte me quedo..
    
    // if (this.botonHinabilitadoProcederBusqueda) {
    // }
    this.isActivate = !this.isActivate;
    if (this.isActivate != true) {
      this.showWarn('La seguridad de hablitación de la cuenta esta activa.');
    }
    this.displayBasic2 = false;
    console.log(this.solicitudAc.cuenta?.id_cuenta);

    this.userService
      .getUserLogginByID(this.solicitudAc.cuenta?.id_cuenta)
      .subscribe((data: any) => {
        this.cuenta = [data];
    
        console.log(data);
      });
  }

  // Fin del metodo para el modal

  //Metodos para implemetar las actualizaciones de las cuentas..
  public updateStatusAccountId(id_account: any, cuenta: any) {
    this.account = { ...cuenta };
    if (!this.isActivate) {
      setTimeout(() => {
        this.userService
          .updateAccountUserActive(id_account, this.account)
          .subscribe(
            (data: any) => {
              console.log(data);

              // Verificar si data es un arreglo
              if (Array.isArray(data)) {
                this.cuenta = data;
              }

              //Priceso de actualizacion de la cuenta
              this.solicitudAc.estado = true;
              this.solicitudesService
                .updateSolicitudesActivacion(
                  this.solicitudAc.id_solicitud_activacion,
                  this.solicitudAc
                )
                .subscribe((data) => {
                  console.log(data);
                  this.ListsolicitudesActivacionCuenta = [];
                  // this.solicitudAc = new SolicitudActivacion();
                  this.getAllSolicitude();
                  this.getAllUser();
                  this.isActivate = !this.isActivate;

                  if (this.isActivate == true) {
                    this.showSuccess('Protección activa.');
                  }
                });
            },
            (err) => {
              console.log(err);
            }
          );
      });
    }
  }
  //Fin de los metodos de actualizacion de la cuenta..

  public getAllUser() {
    this.userService
      .obtenerListaAcountOfUserDiferentAdmin()
      .subscribe((data: any) => {
        this.cuenta = data;
        this.isLoadingDataAdmin = false;
      });
    //this.userService.getAll().subscribe((data)=> (this.cuenta = data as Cuenta[]))
  }

  // para que se me desgargue automaticamente en el dispocitivo
  //Para traer el pdf
  // getPdf() {
  //   this.reportService.getReportUserPerAdmin().subscribe((r) => {

  //     fileSaver.saveAs(r, 'mi-pdf.pdf');
  //   });
  // }

  //2da forma para que se me visualize el pdf en la misma vista del html
  // getPdf() {
  //   this.reportService.getReportUserPerAdmin().subscribe((r) => {

  //     const url = URL.createObjectURL(r);
  //       this.pdfSrc = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  //   });
  // }

  getPdf() {
    this.reportService.getReportUserPerAdmin().subscribe((r) => {
      const url = URL.createObjectURL(r);
      window.open(url, '_blank');
    });
  }

  //Implementacion de la tabla de todo referente a primeng
  next() {
    this.first = this.first + this.rows;
  }

  prev() {
    this.first = this.first - this.rows;
  }

  reset() {
    this.first = 0;
    this.getAllUser();
  }

  isLastPage(): boolean {
    return this.cuenta ? this.first === this.cuenta.length - this.rows : true;
  }

  isFirstPage(): boolean {
    return this.cuenta ? this.first === 0 : true;
  }
  // fin de los metodos de la tabla de primeng

  //Validar el tiempo el cual de habilitara la activacion de la cuenta.
  public isActivate: boolean = true;

  public isActivateActivation() {
    this.isActivate = false;

    // setTimeout(() => {
    //   this.isActivateButton = false;
    //   this.isActivate = true;
    // }, 15000);
  }

  //Para los toast

  // validar estod de habilitacion y inabilitacoin de la cuenta..
  public validarStaustAccount(valor: any, cedula: any) {
    if (!this.isActivate) {
      // Comprobar si el botón está activo
      if (valor == true) {
        this.showSuccess('Cuenta habilitada');
        this.servieEmail.sendEmailActivationAccount(cedula).subscribe(
          (data) => {
            console.log('Succesful');
          },
          (err) => {
            console.log('err');
          }
        );
      } else {
        this.showWarn('Cuenta Inhabilitada');
      }
    }
  }

  showSuccess(key: any) {
    this.messageService.add({
      severity: 'success',
      summary: 'Verificado',
      detail: key,
    });
  }

  showInfo(key: any) {
    this.messageService.add({
      severity: 'info',
      summary: 'Info',
      detail: key,
    });
  }

  showWarn(key: any) {
    this.messageService.add({
      severity: 'warn',
      summary: 'Precaución',
      detail: key,
    });
  }

  showError(err: any) {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: err,
    });
  }

  onConfirm() {
    this.messageService.clear('c');
  }

  onReject() {
    this.messageService.clear('c');
  }

  clear() {
    this.messageService.clear();
  }
}
