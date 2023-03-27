import { Component, OnInit } from '@angular/core';
import { Cuenta } from 'src/app/model/cuenta';
import { OauthService } from '../../../service/oauth.service';

//Implementadion del err de la API de prime..
import { MessageService } from 'primeng/api';
//Import de las rutas..
import { Router } from '@angular/router';

//import del script
import { LoadScript } from '../../../scripts/load-script';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
    `
      :host ::ng-deep .p-password input {
        width: 15rem;
      }
    `,
  ],
  styleUrls: ['./login.component.css', './login.component.scss'],
  providers: [MessageService],
})
export class LoginComponent implements OnInit {
  //import de la clase cuenta
  public user: Cuenta = new Cuenta();

  errorMessage = '';

  public isloggin: boolean = false; 

  constructor(
    private scriptC: LoadScript,
    private oauthService: OauthService,
    private messageService: MessageService,
    private router: Router
  ) {
    //script que estoy creando par hacer el uso de la password visible y no..
    scriptC.Cargar(['login_eye']);
  }

  ngOnInit(): void {
    
    // this.user.persona?.id_persona;
  }

  public viewRecoverAccount() {
    this.router
      .navigate(['/sistemAnimalscouple/recoverandenabled/account'])
      .then(() => {
        window.location.reload();
      });
  }

  public signInUser() {
    this.isloggin = true;
    this.oauthService
      .signIn(this.user.usuario ?? '', this.user.contrasenia ?? '')
      .subscribe(
        (data: any) => {
          console.log(data);
          if (data != null) {
            this.isloggin = false;
            //Para borrar el stogare de la otra persona en el caso de que no sea la misma.
            localStorage.removeItem('id_user');
            localStorage.removeItem('id_user_person');
            localStorage.removeItem('foto');
            localStorage.removeItem('rol');
            localStorage.removeItem('username');

            //Mensaje de correcto..
            this.showSuccess();

            //Ingreso de nueva información..
            localStorage.setItem('id_user', String(data.id_cuenta));
            localStorage.setItem(
              'id_user_person',
              String(data.persona.id_persona)
            );
            localStorage.setItem('foto', String(data.persona.foto));
            localStorage.setItem('rol', String(data.rol));
            localStorage.setItem('username', String(data.usuario));
            location.replace('/home');
           
          } else {
            alert('err');
          }
        },
        (err) => {
          let errorCode: any;

          errorCode = err.status;
          this.errorMessage = err.error;
          console.log(errorCode, this.errorMessage);

          //vamos implementar el switch para capturar los valores de los respectivos errores..
          switch (errorCode) {
            case 404:
              this.showError(err.error);
              this.isloggin = false;
              break;
            case 401:
              this.showWarn(err.error);
              this.isloggin = false;
              break;
            case 409:
              this.showInfo(err.error);
              this.isloggin = false;
              break;
          }
          //alert(errorCode);
        }
      );
  }

  public validUserAndPassword() {
    let valorView = false;
    if (
      this.user.usuario != null &&
      this.user.usuario != undefined &&
      this.user.usuario != '' &&
      this.user.contrasenia != null &&
      this.user.contrasenia != undefined &&
      this.user.contrasenia != ''
    ) {
      this.signInUser();
    } else {
      valorView = true;
      this.showWarn('Debe ingresar usuario y contraseña');
    }
    if (valorView) {
      if (
        this.user.usuario === null ||
        this.user.usuario === undefined ||
        this.user.usuario === ''
      ) {
        this.showInfo('Ingrese su usuario');
      } else {
        this.showInfo('Ingrese su contraseña');
      }
    }
  }

  //Implementacion de los errores mandados por el servidor.. ID:01
  showSuccess() {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Ingreso al sistema satisfactoriamente',
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
      summary: 'Warn',
      detail: key,
    });
  }

  showError(key: any) {
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
  //fin de la Implementacion de los errores mandados por el servidor.. ID:01
}
