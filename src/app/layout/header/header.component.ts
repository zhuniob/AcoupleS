import { Component, OnInit } from '@angular/core';
import { LoadScript } from 'src/app/scripts/load-script';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
//Import de la clase persona..
import { Persona } from '../../model/persona';
import { StorageService } from 'src/app/service/storage.service';
import { Solicitud } from 'src/app/model/solicitud';
import { SolicitudService } from 'src/app/service/solicitud.service';
import { UserService } from 'src/app/service/user.service';
import { ChatService } from 'src/app/service/chat.service';
import { RegisterAnimal } from 'src/app/model/register-animal';
import { AnimalService } from 'src/app/service/animal.service';
import {
  ConfirmationService,
  MessageService,
  PrimeNGConfig,
} from 'primeng/api';
import { modals } from 'src/app/service/modals.service';
import { GenericService } from 'src/app/service/serviceHybrid/genericService';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css', './header.component.scss'],
  providers: [ConfirmationService, MessageService],
})
export class HeaderComponent implements OnInit {
  public solicitud: Solicitud = new Solicitud();
  public solicitudAc: Solicitud = new Solicitud();
  public mianimalito: RegisterAnimal = new RegisterAnimal();
  modal: boolean;
  solicitudes: any;
  //creacion de objeto de la clase persona;
  userC: Persona = new Persona();

  //variables don de voy recibir el storage para el login
  id_user?: any;
  nombreUser?: any;

  isUserAdmin: boolean = false;
  isUserNormal: boolean = false;

  rolUser: any;
  numsolicitudes: any = 0;
  listALLSolicituds: any[] = [];
  listALLAnimals: any[] = [];

  //Variable para que me permita obtener el ide de usuairo
  public id_usuariologggin: any;

  public id_usuarioAccount: any;

  public picture_userAccount: any;

  public dataUser: any;
  //Implementacion de los items

  public numero_chats: any;

  //Variables de controlde inicion de sesion y de vanbar.
  // public statusbtnLoggin:boolean = true;
  // public statusnavbarLoggin:boolean = false;

  constructor(
    private router: Router,
    private solicitudService: SolicitudService,
    private storage: StorageService,
    private userService: UserService,
    private operacionesJS: LoadScript,
    private chatService: ChatService,
    private messageService: MessageService,
    private primengConfig: PrimeNGConfig,
    private modalss: modals,
    private animalService: AnimalService,
    private genericService: GenericService
  ) {
    operacionesJS.Cargar(['sheader']);
  }
  ngOnInit(): void {
    this.modalss.$modalo.subscribe((valor) => (this.modal = valor));
    this.primengConfig.ripple = true;
    this.id_usuarioAccount = localStorage.getItem('id_user');
    if (this.id_usuarioAccount != null) {
      this.getUser();
      // this.rolUser = localStorage.getItem('rol');
      this.id_usuariologggin = localStorage.getItem('id_user_person');
      this.picture_userAccount = localStorage.getItem('foto');
      this.getUserAccount(this.id_usuarioAccount);

      // PROCESO PARA RECIVIR LAS SOLICITUDES
      setInterval(() => {
        this.listarsolicitudes('Pendiente', 1);
      }, 10000);
    }

    setInterval(() => {
      let valorResult = this.genericService.getSolicitudMessage();
      if(valorResult == ''){

      }else{
        if(valorResult == 'Estamos validando la información, mantengase presente.'){
          this.showInfo(valorResult);
        }else{
          this.showWarn(valorResult);
        }
        this.genericService.setSolicitudMessage('');
      }
      
    }, 10);
  }

  //metodo para ocultar el estado de inicio de sesion.

  //Roter de lso chat a los que me puedo rediriguir.
  public routerChatUser() {
    this.router.navigate(['/chat']).then(() => {
      window.location.reload();
    });
  }

  //Navegacion de los hacia lso perfiles de los usuarios..
  public redirectToProfileUser(id_persona: any) {
    this.router
      .navigate(['/usuario/profileuser/profile', id_persona])
      .then(() => {
        window.location.reload();
      });
  }

  public getUserAccount(id_cuenta: any) {
    this.userService.getUserLogginByID(id_cuenta).subscribe((data) => {
      this.dataUser = data;
    });
  }

  public getUser() {
    // this.id_user = localStorage.getItem('id_cliente');
    this.rolUser = localStorage.getItem('rol');
    if (this.rolUser != null) {
      switch (this.rolUser) {
        case 'ADMIN':
          this.isUserAdmin = true;
          this.isUserNormal = false;
          break;
        case 'USUARIO':
          this.isUserAdmin = false;
          this.isUserNormal = true;
          break;
      }
    } else {
    }
  }

  public signOut() {
    this.storage.clean();
    this.router.navigate(['/welcome']).then(() => {
      window.location.reload();
    });
  }

  listarsolicitudes(e: string, x: number) {
    this.solicitudService
      .getAllSolicitudesByPersonaID(e, this.id_usuariologggin)
      .subscribe((data) => {
        this.solicitudes = data;
         this.genericService.setSolicitudList(data);
        this.numsolicitudes = this.solicitudes.length;
        console.log({ numero_soli: this.solicitudes }); // Muestra el resultado en la consola
      });
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
  openmodal() {
    // console.log('entra');
    if(this.numsolicitudes == 0){
      this.showInfo('Usted no tiene notificasiones.');
    }else{
      this.modal = true;
    }
   
  }
}
