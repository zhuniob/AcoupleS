import { Component, OnInit } from '@angular/core';
import { Cuenta } from 'src/app/model/cuenta';
import { Persona } from 'src/app/model/persona';
import { UserService } from 'src/app/service/user.service';

//pasos para el pdf..
import * as fileSaver from 'file-saver';

import { DomSanitizer } from '@angular/platform-browser';
import { ReportsService } from 'src/app/service/reports.service';
import { PersonaService } from 'src/app/service/persona.service';
import { ChatService } from 'src/app/service/chat.service';
import { Router } from '@angular/router';
import { Chat } from 'src/app/model/chat';

@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.css'],
})
export class ListUsersComponent implements OnInit {
  usersList: any[] = [];

  first = 0;

  rows = 5;
  //Para el pdf
  public pdfSrc: any;

  public userAdminIsLoggin: any;

  chats: Chat[] = [];

  public isLoadingDataAdmin: boolean = false;
  constructor(
    private userService: UserService,
    private reportService: ReportsService,
    public sanitizer: DomSanitizer,
    private peronaService: PersonaService,
    private chatService: ChatService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isLoadingDataAdmin = true;
    this.userAdminIsLoggin = localStorage.getItem('id_user_person');

    this.getAllUser();
  }

  //Navegacion de los hacia lso perfiles de los usuarios..
  public redirectToProfileUser(id_persona: any) {
    this.router.navigate(['/usuario/profileuser/profile', id_persona]);
  }

  //Implementación del chat..
  public crearChat(idPersonaReceptor: any): void {
    console.log(this.userAdminIsLoggin, idPersonaReceptor);
    this.chatService
      .getChatsByPersonas(this.userAdminIsLoggin, idPersonaReceptor)
      .subscribe((data) => {
        if (!data || data.length === 0) {
          console.log('data no hay nada');

          this.chatService
            .createChat(this.userAdminIsLoggin, idPersonaReceptor)
            .subscribe((chat) => {
              // this.router.navigate(['/chat', chat.id_chat]);
              this.router.navigate(['/chat', chat.id_chat]).then(() => {
                window.location.reload();
              });
            });
        } else {
          const idChat = data[0].id_chat;
          console.log('lo que me impre el chat el ID: ' + idChat);
          this.router.navigate(['/chat', idChat]).then(() => {
            window.location.reload();
          });
        }
      });
  }

  public getAllUser() {
    this.peronaService.getAllPersons().subscribe((data: any) => {
      this.usersList = data.filter(
        (user: any) => user.nombres != 'AnimalCouple'
      );
      this.isLoadingDataAdmin = false;
    });
  }

  public getPdf() {
    this.reportService.getReportUserPerAdmin().subscribe((r) => {
      const url = URL.createObjectURL(r);
      window.open(url, '_blank');
    });
  }

  public getReportOfUserRequest(id_user: any, name: any) {
    this.reportService
      .getReportUserPerAdminOfUserRequest(id_user, name)
      .subscribe((r) => {
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
  }

  isLastPage(): boolean {
    return this.usersList
      ? this.first === this.usersList.length - this.rows
      : true;
  }

  isFirstPage(): boolean {
    return this.usersList ? this.first === 0 : true;
  }
  // fin de los metodos de la tabla de primeng
}
