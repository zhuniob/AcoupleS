import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ConfirmationService,
  MessageService,
  PrimeNGConfig,
} from 'primeng/api';
import { MensajeRequest } from 'src/app/interface/mensaje-request';
import { Persona } from 'src/app/model/persona';
import { LoadScript } from 'src/app/scripts/load-script';
import { AnimalService } from 'src/app/service/animal.service';
import { WebSocketService } from 'src/app/service/web-socket-service';
import { Chat } from '../../../model/chat';
import { Mensaje } from '../../../model/mensaje';
import { ChatService } from '../../../service/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css', './chat.component.scss'],
  providers: [ConfirmationService, MessageService],
})
export class ChatComponent implements OnInit, OnDestroy {
  chats: Chat[] = [];
  chatActual: Chat | undefined;
  mensajes: Mensaje[] = [];
  mensaje: MensajeRequest = { texto: '' };
  personaEmisor: Persona;
  public personaReceptor1: Persona = new Persona();
  private ws: WebSocket;

  nuevoMensaje: string;

  //List of animals
  listAnimal: any[] = [];

  chatnew: Chat;

  //Proceso para destruir el componente de la solicitud
  private intervaloMensajes: any;
  constructor(
    private chatService: ChatService,
    private webSocketService: WebSocketService,
    private scriptC: LoadScript,
    private servieAnimal: AnimalService,
    private router: Router,
    private actiRouter: ActivatedRoute,
    private messageService: MessageService,
    private primengConfig: PrimeNGConfig
  ) {
    scriptC.Cargar(['chat']);
  }

  id_personaIsLoggin: any;

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    this.id_personaIsLoggin = localStorage.getItem('id_user_person');
    this.getChats(this.id_personaIsLoggin);

    setInterval(() => {
      this.chatService
        .getMensajesByChat(this.id_chatOfsecuenceTime)
        .subscribe((mensajes) => {
          this.mensajes = mensajes;
        });
    }, 5000);

    //FASE DE PRUEBAS--------------------------------ID:2

    this.chatService
      .getChatsByPersona(this.id_personaIsLoggin)
      .subscribe((chats) => {
        this.chats = chats;
      });

    //FASE DE PRUEBAS--------------------------------ID:2

    this.webSocketService.mensajes.subscribe((mensaje) => {
      this.mensajes.push(mensaje);
    });

    //implementacion con navigate
    this.getUserMessageMain();
  }
  //Fin del oninit proceso de dstroy

  ngOnDestroy() {
    clearInterval(this.intervaloMensajes); // Detener el intervalo al destruir el componente
  }

  //Proceso de cambio de rutas en el caso del perfil de usuario
  public redirectToProfileUser(id_persona: any) {
    this.router
      .navigate(['/usuario/profileuser/profile', id_persona])
      .then(() => {
        window.location.reload();
      });
  }

  //Proceso de cambio de rutas en el caso del perfil de animal perteneciente al usuario
  public redirectToProfileAnimal(id_animal: any) {
    this.router.navigate(['/usuario/perfil/animal', id_animal]).then(() => {
      window.location.reload();
    });
  }

  public getUserMessageMain() {
    this.actiRouter.params.subscribe((params) => {
      const idChat = params['id'];

      this.chatService.getByChat(idChat).subscribe((chat) => {
        this.visibleChat = true;
        this.chatnew = chat;
        this.chatActual = chat;
        this.id_chatOfsecuenceTime = chat.id_chat;
        this.getMensajesByChat(chat.id_chat);
        this.mensajes = chat.mensajes;

        this.personaEmisor = chat.persona_emisor;

        if (chat.persona_emisor.id_persona == this.id_personaIsLoggin) {
          this.personaReceptor1 = chat.persona_receptor;
        } else {
          if (chat.persona_receptor.id_persona == this.id_personaIsLoggin) {
            this.personaReceptor1 = chat.persona_emisor;
          }
        }
        this.createMensajeDepenecenes(this.chatActual);

        this.getAnimalOfPerson(this.personaReceptor1.id_persona);
      });
    });
  }

  //Metodo que vamos a implementar para que el chat envie el mensaje correspodiente a la persona emisor: ID 12

  public createMensajeDepenecenes(chat: any): void {
    if (chat.persona_emisor.nombres != 'AnimalCouple') {
      let message =
        'Hola, te informo que tú solicitud fue aceptada, espero tu mensaje :).';
      this.chatService
        .createMensajeIsPresent(chat.id_chat, this.id_personaIsLoggin, message)
        .subscribe((mensaje) => {
          // Agregar el nuevo mensaje
          this.mensajes.push(mensaje);
          // Reiniciar mensaje para la entrada de texto
          this.mensaje = { texto: '' };

          // Enviar el nuevo mensaje a través del WebSocket
          this.webSocketService.sendMessage(mensaje);
        });
    }
  }

  //Fin del metodo para verificar para implementar el chat. ID: 12

  public getChats(id_persona_emisor: any): void {
    this.chatService.getChatsByPersona(id_persona_emisor).subscribe((chats) => {
      this.chats = chats;
    });
  }

  public enviarMensaje(): void {
    if (this.chatActual) {
      // Llamar al método del servicio para crear un nuevo mensaje en el chat actual
      this.chatService
        .createMensaje(this.chatActual.id_chat, this.mensaje.texto)
        .subscribe((mensaje) => {
          // Agregar el nuevo mensaje a la lista de mensajes
          this.mensajes.push(mensaje);

          this.webSocketService.sendMessage(mensaje);
          // Reiniciar el objeto de mensaje para la entrada de texto
          this.mensaje = { texto: '' };
        });
    }
  }

  public crearChat(idPersonaEmisor: any, idPersonaReceptor: any): void {
    // Llamar al método del servicio para crear un nuevo chat
    this.chatService
      .createChat(idPersonaEmisor, idPersonaReceptor)
      .subscribe((chat) => {
        // Agregar el chat a la lista de chats
        this.chats.push(chat);
        // Establecer el chat actual como el chat recién creado
        this.chatActual = chat;
        // Obtener los mensajes del chat actual
        this.getMensajesByChat(chat.id_chat);
      });
  }

  public getMensajesByChat(idChat: number): void {
    // Llamar al método del servicio para obtener los mensajes del chat
    this.chatService.getMensajesByChat(idChat).subscribe((mensajes) => {
      // Actualizar la lista de mensajes
      this.mensajes = mensajes;
    });
  }

  //Event on input key
  public onEnter(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      const inputValue = (event.target as HTMLInputElement).value;
      this.createMensaje();
    }
  }

  public createMensaje(): void {
    if (this.chatActual) {
      // Llamar al método del servicio para crear un nuevo mensaje
      this.chatService
        .createMensajeIsPresent(
          this.chatActual.id_chat,
          this.id_personaIsLoggin,
          this.mensaje.texto
        )
        .subscribe((mensaje) => {
          // Agregar el nuevo mensaje
          this.mensajes.push(mensaje);
          // Reiniciar mensaje para la entrada de texto
          this.mensaje = { texto: '' };

          // Enviar el nuevo mensaje a través del WebSocket
         // this.webSocketService.sendMessage(mensaje);
        });
    }
  }

  //Metodo boolean que me va permitir hacer los cambios para el ingresi al chat
  public visibleChat: boolean = false;

  public id_chatOfsecuenceTime: any;
  public cargarChat(chat: Chat): void {
    this.visibleChat = true;
    console.log(chat);
    this.id_chatOfsecuenceTime = chat.id_chat;
    // Establecer el chat actual como el chat seleccionado
    this.chatActual = chat;
    this.getMensajesByChat(chat.id_chat);

    //this.chatActual = chat;
    this.mensajes = chat.mensajes;

    this.personaEmisor = chat.persona_emisor;

    if (chat.persona_emisor.id_persona == this.id_personaIsLoggin) {
      this.personaReceptor1 = chat.persona_receptor;
      console.log(this.personaReceptor1);
    } else {
      if (chat.persona_receptor.id_persona == this.id_personaIsLoggin) {
        this.personaReceptor1 = chat.persona_emisor;
        console.log(this.personaReceptor1);
      }
    }
    this.getAnimalOfPerson(this.personaReceptor1.id_persona);
  }

  public getAnimalOfPerson(id_persona: any) {
    this.servieAnimal.findAllCuentasA(id_persona).subscribe((data) => {
      this.listAnimal = data;
    });
    // findAllCuentasA
  }

  //Metodos para el direccionamiento del usuario dependiendo de ADMIN Y USUARIO..

  public goITnewPersonMessage() {
    let userRol = localStorage.getItem('rol');
    if (userRol == 'ADMIN') {
      this.router.navigate(['/list/users']);
    } else {
      this.router.navigate(['/catalogo/animales']);
    }
  }

  //Metodos que va mostrar la parte de de los mendsjes del proceso de desaroollo.
  public showSuccess(key: any) {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
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

  public showError(key: any) {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: key,
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
