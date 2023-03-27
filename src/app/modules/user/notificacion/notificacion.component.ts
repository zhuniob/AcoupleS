import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  ConfirmationService,
  MenuItem,
  MessageService,
  PrimeNGConfig,
} from 'primeng/api';
import { Persona } from 'src/app/model/persona';
import { RegisterAnimal } from 'src/app/model/register-animal';
import { Solicitud } from 'src/app/model/solicitud';
import { LoadScript } from 'src/app/scripts/load-script';
import { AnimalService } from 'src/app/service/animal.service';
import { ChatService } from 'src/app/service/chat.service';
import { modals } from 'src/app/service/modals.service';
import { GenericService } from 'src/app/service/serviceHybrid/genericService';
import { SolicitudService } from 'src/app/service/solicitud.service';
import { StorageService } from 'src/app/service/storage.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-notificacion',
  templateUrl: './notificacion.component.html',
  styleUrls: ['./notificacion.component.css'],
  providers: [ConfirmationService, MessageService],
})
export class NotificacionComponent implements OnInit {
  public solicitud: Solicitud = new Solicitud();
  public solicitudAc: Solicitud = new Solicitud();
  public mianimalito: RegisterAnimal = new RegisterAnimal();

  items: MenuItem[];

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
  numsolicitudes: any;
  listALLSolicituds: any[] = [];
  listALLAnimals: any[] = [];

  //Variable para que me permita obtener el ide de usuairo
  public id_usuariologggin: any;

  public id_usuarioAccount: any;

  public picture_userAccount: any;

  public dataUser: any;
  //Implementacion de los items

  public numero_chats: any;
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
  ) {}
  ngOnInit(): void {
    this.modalss.$modalo.subscribe((valor) => (this.modal = valor));
    this.primengConfig.ripple = true;
    this.id_usuarioAccount = localStorage.getItem('id_user');

    this.getUser();
    setInterval(() => {
      this.listarsolicitudes();
    }, 1);
    this.id_usuariologggin = localStorage.getItem('id_user_person');

    this.getUserAccount(this.id_usuarioAccount);
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



  public listarsolicitudes() {
    // this.solicitudes = this.genericService.getSolicitudList();
    // this.solicitudes = this.genericService.getSolicitudList().sort((a, b) => {
    //   const dateA = new Date(a.fecha).getTime();
    //   const dateB = new Date(b.fecha).getTime();
    //   return dateA - dateB;
    // });
    this.solicitudes = this.genericService.getSolicitudList().sort((a, b) => {
      const dateA = new Date(a.fecha).getTime();
      const dateB = new Date(b.fecha).getTime();
      return dateB - dateA;
    });
    
  }

  //Cambiamos estado a la solicitud
  id_ani: any;
  id_ani2: any;
  mianimal: any;
  disponible: Boolean = false;
  disponible2: boolean;

  public updateSolicitudperId(
    id_solicitud: any,
    solicitudAc: any,
    x: number,
    animal: any
  ) {
    this.genericService.setSolicitudMessage('Estamos validando la información, mantengase presente.');
    // console.log(solicitudAc);
    this.solicitudAc = { ...solicitudAc };
    this.id_ani = this.solicitudAc.animal?.id_animal;

    if (x == 1) {
      this.verificarestadoa(this.id_ani, id_solicitud);
    } else if (x == 2) {
      console.log('rechazando ');
      this.solicitudAc.estado = 'Rechazada';
      //editamos el estado de la solicitud
      this.solicitudService
        .EditarSolicitudById(id_solicitud, this.solicitudAc)
        .subscribe(
          (data: any) => {
            console.log('a verrr' + data);

            // Verificar si data es un arreglo
            if (Array.isArray(data)) {
              this.listALLSolicituds = data;
            }
            this.listarsolicitudes();
          },
          (err) => {
            console.log(err);
          }
        );
    }
  }
  public verificarestadoa(id_animal: any, id_solicitud: any) {

    this.id_ani2 = parseInt(id_animal + '');
    this.animalService.getAnimalByid(this.id_ani2).subscribe((data) => {
      this.mianimalito = data;
      console.log('Mi animal ');
      console.log(this.mianimalito.disponibilidad);
    
      this.showWarn('Lo sentimos el alnimal no esta disponible');
      if (this.mianimalito.disponibilidad == true) {
        console.log('dentro del if');
        console.log(this.mianimalito);
     
        this.actualizarEstadoAnimal(this.mianimalito, id_solicitud);

        // this.actualizarEstadoSolicitud(id_solicitud);
      } else {
        console.log('Lo sentimos el alnimal no esta disponible');
        this.genericService.setSolicitudMessage('Lo sentimos el animal no esta disponible..');
        //this.showWarn('Lo sentimos el alnimal no esta disponible');
      }
    });
    // return this.disponible;
  }

  public actualizarEstadoAnimal(
    Animal: any,
    id_solicitud: any,
    mianimal2 = new RegisterAnimal()
  ) {
    mianimal2 = Animal;
    mianimal2.disponibilidad = false;
    console.log(mianimal2);

    this.animalService.EditarAnimalById(this.id_ani, mianimal2).subscribe(
      (data: any) => {
        console.log('a verrr' + data);

        // Verificar si data es un arreglo
        if (Array.isArray(data)) {
          this.listALLAnimals = data;
        }
        this.actualizarCalificacion(Animal);
        this.actualizarEstadoSolicitud(id_solicitud);
        this.listarsolicitudes();
      },
      (err) => {
        console.log(err);
      }
    );
  }
  public actualizarEstadoSolicitud(id_solicitud: any) {
    console.log('antes de actualizar s');
    console.log(this.solicitudAc);
    this.solicitudAc.estado = 'Aceptada';
    console.log('despues de actualizar s');
    console.log(this.solicitudAc);
    //editamos el estado de la solicitud
    this.solicitudService
      .EditarSolicitudById(id_solicitud, this.solicitudAc)
      .subscribe(
        (data: any) => {
          // Verificar si data es un arreglo
          if (Array.isArray(data)) {
            this.listALLSolicituds = data;
          }
          // this.listarsolicitudes('Pendiente', 1);
          this.procedureCrearChat(this.solicitudAc.persona?.id_persona);
        },
        (err) => {
          console.log(err);
        }
      );
  }
  public actualizarCalificacion(animal: any) {
    // proceso de entrada de datos para enviar al servidor actualizar los datos..
    let valorCalificasion = animal.num_soli;

    let num_s = valorCalificasion + 1;

    this.animalService
      .updateAnimalOfCalification(animal.id_animal, false, num_s)
      .subscribe((data: any) => {
        console.log({ updateanial: data });
      });
  }
  //Proceso de creacion del chat con la persona emisora

  public procedureCrearChat(idPersonaReceptor: any): void {
    console.log(this.id_usuariologggin, idPersonaReceptor);

    this.chatService
      .getChatByPersonasInSection(this.id_usuariologggin, idPersonaReceptor)
      .subscribe((data) => {
        console.log({ data });

        console.log('Lo que tengo en el dato->' + data);
        setTimeout(() => {
          if (data == null) {
            console.log('data no hay nada');

            this.chatService
              .createChat(this.id_usuariologggin, idPersonaReceptor)
              .subscribe((chat) => {
                this.router.navigate(['/chat', chat.id_chat]).then(() => {
                  window.location.reload();
                });
              });
          } else {
            console.log('lo que me impre el chat el ID: ' + data.id_chat);
            this.router.navigate(['/chat', data.id_chat]).then(() => {
              window.location.reload();
            });
          }
        }, 1000);
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

  closemodal() {
    this.modalss.$modalo.emit(false);
  }
}
