import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  ConfirmationService,
  MessageService,
  PrimeNGConfig,
} from 'primeng/api';
import { timeInterval, timeout } from 'rxjs';
import { EmailService } from 'src/app/service/email.service';
import { SolicitudActivacionService } from 'src/app/service/solicitud-activacion.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-recover-and-enabled-account',
  templateUrl: './recover-and-enabled-account.component.html',
  styleUrls: ['./recover-and-enabled-account.component.css'],
  providers: [ConfirmationService, MessageService],
})
export class RecoverAndEnabledAccountComponent implements OnInit {
  recover = {
    identificasion: '',
  };

  constructor(
    private router: Router,
    private emailService: EmailService,
    private messageService: MessageService,
    private primengConfig: PrimeNGConfig,
    private solicitudAcService: SolicitudActivacionService
  ) { }


  valueBoolean: boolean = false;
  enlaceA: any;
  enlaceB: any;

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    this.valueBoolean = false;
  }


  waitAThreeSeconds() {
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 3000);
  }

  desactivarBtn() {
    this.enlaceA = document.getElementById("firstA");
    this.enlaceA.styleUrls.enabled = false;
    this.enlaceB = document.getElementById("firstB");
    this.enlaceB.styleUrls.enabled = false;
  }

  public sendEmailRecoverPassword() {
    //alert(this.recover.identificasion)
    if (this.valueBoolean == false) {
      if (this.recover.identificasion != '') {
        this.emailService
          .sendEmailRecoverPassword(this.recover.identificasion)
          .subscribe(
            (data: any) => {
              // la respuesta del servidor se recibe en el parametro 'data'
              console.log('Recuperacion realizada con exito'); // Muestra un mensaje de éxito en la consola
              this.showSuccess(
                'Solicitud de "Recuperación de cuenta" enviada. Revise su correo.'
              );
              this.valueBoolean = true;
              this.waitAThreeSeconds();
              // aquí puedes realizar otras operaciones con los datos recibidos
            },
            (err: any) => {
              // Si hay un error, se recibe en el parametro 'err'
              switch (err.error) {
                case 'NOT_FOUND':
                  this.showError(
                    'Lo sentimos, no hemos podido encontrar su cuenta, asegúrese de que su cédula esté bien.'
                  );
                  console.log('no encontrado'); // Muestra un mensaje de éxito en la consola
                  break;
                default: // Muestra un mensaje de éxito en la consola
                  this.showError('Problemas con el servidor');
                  console.log('Error en el sistema');
                  break;
              }
              // console.log('Error al enviar correo: ' + err.message); // Muestra un mensaje de error en la consola
            }
          );
      } else {
        this.showWarn('Ingrese su número de cédula/RUC para enviar una solictud.');
      }
    }
  }

  // public recoverActivarionAccount() {
  //   alert(this.recover.identificasion);
  //   this.solicitudAcService
  //     .saveSolicitudesActivacion(this.recover.identificasion)
  //     .subscribe((data) => {
  //       console.log({ act: data });
  //     });
  // }

  // Partes jonh-------------------------------------------------------------------
  public recoverActivarionAccount() {
    if (this.valueBoolean == false) {
      if (this.recover.identificasion != '') {
        this.solicitudAcService
          .saveSolicitudesActivacion(this.recover.identificasion)
          .subscribe(
            (data) => {
              console.log('Solicitud enviada con éxito'); // Muestra un mensaje de éxito en la consola
              this.showSuccess(
                'Solicitud de "Habilitación de cuenta" enviada exitosamente.'
              );
              this.emailService
              this.valueBoolean = true;
              this.waitAThreeSeconds();
            },
            (err: any) => {
              this.showError(err.error);
              // Si hay un error, se recibe en el parametro 'err'
              console.log('Lo que tengo el error-> ' + err.error);
            }
          );
      } else {
        this.showWarn('Ingrese su número de cédula/RUC para enviar una solictud.');
      }
    }
  }
  //Fin partes del john------------------------------------------------------------

  //Metodos para mandar los mensajes a la pantalla

  public showSuccess(key: any) {
    this.messageService.add({
      severity: 'success',
      summary: 'Verificado',
      detail: key,
    });
  }

  public showInfo(key: any) {
    this.messageService.add({
      severity: 'info',
      summary: 'Info',
      detail: key,
    });
  }

  public showWarn(key: any) {
    this.messageService.add({
      severity: 'warn',
      summary: 'Warn',
      detail: key,
    });
  }

  public showError(err: any) {
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

/*
              
*/