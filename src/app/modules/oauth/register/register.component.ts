import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Cuenta } from 'src/app/model/cuenta';
import { Persona } from 'src/app/model/persona';
import { LoadScript } from 'src/app/scripts/load-script';
import { OauthService } from 'src/app/service/oauth.service';
//Import de las rutas..
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import {
  ConfirmationService,
  ConfirmEventType,
  MessageService,
} from 'primeng/api';

//Import de la raza y el tipo service
import { RazaService } from 'src/app/service/raza-animal.service';
import { TipoService } from 'src/app/service/tipo-animal.service';

//Import de la raza y el tipo model
import { Tipo } from 'src/app/model/tipo';
import { Raza } from 'src/app/model/raza';
import { PreferenceService } from 'src/app/service/preference.service';
import { EmailService } from 'src/app/service/email.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [ConfirmationService, MessageService],
})
export class RegisterComponent implements OnInit {
  val2: string;

  //Import de la clase de persona
  public persona: Persona = new Persona();

  //Import de la cuenta
  public user: Cuenta = new Cuenta();

  //Import de la Tipo
  public tipoAnimal: Tipo = new Tipo();

  //Import de la Raza
  public razaAnimal: Raza = new Raza();

  //Variables para el control de las preferencias

  tipos: any[] = [];
  razas: any[] = [];
  razasSeleccionadas: any[] = [];
  selectedRazasIds: any[] = [];
  //Fin de las variables para la implementacion de las preferencias

  //Hacer un Json de la password

  passwordR = {
    passwordU: null,
  };
  //Fin del json

  selectedCity1: any;
  countries: any[] = [];

  //Es el control total de todo..
  public className = 'next';

  constructor(
    private scriptC: LoadScript,
    private authUser: OauthService,
    private changeDetector: ChangeDetectorRef,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private router: Router,
    private serviceTipoAnimal: TipoService,
    private serviceRazaAnimal: RazaService,
    private servicePreference: PreferenceService,
    private servieEmail: EmailService
  ) {
    scriptC.Cargar(['registro_user']);
  }
  ngOnInit(): void {
    //Implementacin de las preferencias

    this.serviceTipoAnimal.getAllTipos().subscribe((tipos) => {
      this.tipos = tipos;
    });
    this.serviceRazaAnimal.getAllRazas().subscribe((razas) => {
      this.razas = razas;
    });

    this.persona.correo_notifica = true;

    //this.validaUserPass();
    //this.onButtonClick()
  }

  //Metodo para limitar el numero de caracteres escritos
  public validarLongitudContra(event: KeyboardEvent) {
    const target = event.target as HTMLInputElement;
    if (
      target.value.length >= 10 &&
      event.keyCode !== 8 &&
      event.keyCode !== 46
    ) {
      event.preventDefault();
    }
  }

  onTipoSeleccionado(tipo: any) {
    // console.log('Fi1_> '+tipo.selected)
    tipo.selected = !tipo.selected;
    console.log('Fi_> ' + tipo.selected);
    this.razasSeleccionadas = this.razas.filter(
      (raza) => raza.id_tipoanimal === tipo.id_tipoanimal && raza.selected
    );
  }

  espacioLista: any = 0;
  onRazaSeleccionada(raza: any) {
    console.log('id-> ' + raza.id_razaanimal);

    // this.espacioLista = this.selectedRazasIds.length  + 1;
    console.log(this.espacioLista);
    raza.selected = !raza.selected;
    this.razasSeleccionadas = this.razas.filter((raza) => raza.selected);

    // if (size >= 3 && raza.selected) {
    //   alert('Son tres')
    // }

    if (raza.selected) {
      this.selectedRazasIds.push(raza.id_razaanimal);
    } else {
      this.selectedRazasIds = this.selectedRazasIds.filter(
        (id) => id !== raza.id_razaanimal
      );
    }
    this.espacioLista = this.selectedRazasIds.length;
    console.log(this.selectedRazasIds);
  }

  filtrarRazasPorTipo(tipoId: number) {
    console.log(tipoId);
    return this.razas.filter(
      (raza) => raza.razaAnimal.id_tipoanimal === tipoId
    );
  }

  value3?: string;
  value4?: string;

  //Implementacion del evento que captura la imagen del usuario..
  async loadPictureUser(event: any) {
    const file = event.target.files[0];
    const fileSize = file.size; // tamaño en bytes
    if (fileSize > 262144) {
      // mensaje de error al usuario
      this.showError(
        'El tamaño de la foto es mayor al máximo permitido, la foto de perfil debe ser máximo de 262144 bytes.'
      );
      event.target.value = null;
    } else {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      try {
        if (!allowedTypes.includes(file.type)) {
          this.showWarn('Solo se permiten archivos de tipo jpeg, jpg o png');
        } else {
          this.persona.foto = await this.convertToBase64(file);
        }
      } catch (error) {
        console.error(error);
      }
    }
  }
  //Fin del metodo que captura la imagen del usuario..

  // Formato para convertir en BASE64
  async convertToBase64(file: File): Promise<string> {
    const reader = new FileReader();
    return new Promise<string>((resolve, reject) => {
      reader.onload = () => {
        const result = btoa(reader.result as string);
        resolve(result);
      };
      reader.onerror = () => {
        reject(reader.error);
      };
      reader.readAsBinaryString(file);
    });
    //Fin dek firmato para convertir..
  }

  //Metodo que me va permitir ingresar la informacion del cliente y tambien a proceder a crear la cuenta del mismo
  public savePersona() {
    this.persona.cedula = this.persona.cedula?.replace(/\D/g, '');
    console.log('CI - RUC-> ' + this.persona.cedula);
    console.log(this.persona);
    this.authUser.registerUser(this.persona).subscribe(
      (data: any) => {
        this.user.persona = data;

        //Implementacion request para la creacion de la cuenta del usuario:
        this.authUser.signUp(this.user).subscribe((data: any) => {
          console.log('Es lo que tenemoos ene la parte' + data);
          this.showSuccessFinal('Cuenta creada satisfactoriamente');
        });

        //Para la bienvenida del usuario al sistema
        this.servieEmail.sendEmailWelcome(data.correo, data.nombres).subscribe(
          (data) => {
            console.log('Bien email' + data);
          },
          (err) => {
            console.log('Mal email' + data);
          }
        );

        //Para las preferencias
        this.servicePreference
          .savePreferenceOfUser(data.id_persona, this.selectedRazasIds)
          .subscribe((data) => {
            console.log('Las preferencias' + data);
          });
      },
      (err) => {
        this.showError('Lo sentimos mucho a ocurrido un error');
      }
    );
  }
  //Fin del metodo de la creacion de la persona y de su cuenta.

  //Esta varivale me va permitir usar para que los cambios de apartados no me permitan hacerlos por las validaciones..

  isButtonDisabled = true;
  enableViewBtnF = true;
  enableViewBtnT = false;

  //Validaciones para los campos
  uservalida = false;
  passvalida = false;

  //Mensaje de error por parte del servidor.
  errorMessage: any;

  validMessage: any;

  isPresent: any;

  public validaUserPass() {
    this.className = 'novalidatenext';
    // let passwordR = (<HTMLInputElement>document.getElementById("usuario")).value;
    console.log('Lo que tenemos en la pass: ' + this.user.contrasenia);
    if (
      this.user.usuario === '' ||
      this.user.usuario === undefined ||
      this.user.usuario === null ||
      this.user.contrasenia === '' ||
      this.user.contrasenia === undefined ||
      this.user.contrasenia === null ||
      this.passwordR.passwordU === '' ||
      this.passwordR.passwordU === undefined ||
      this.passwordR.passwordU === null
    ) {
      this.uservalida = true;
      this.passvalida = true;

      this.showErrorValida();

      console.log('mal');

      this.enableViewBtnF = true;
      this.enableViewBtnT = false;

      this.isButtonDisabled = true;
    } else {
      //Validado que los campos estan vacios
      this.uservalida = false;
      this.passvalida = false;

      let passwordStrong = '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})';
      let pattern = new RegExp(passwordStrong);
      if (pattern.test(this.user.contrasenia)) {
        if (this.user.contrasenia === this.passwordR.passwordU) {
          if (this.isPresent === null) {
            this.className = 'validatec';
            this.showSuccess();
          } else {
            this.className = 'nvalidatec';
            this.uservalida = true;
            this.showError(
              'Lo sentimos pero este nombre de usuairo ya es existente'
            );
          }

          // this.className = 'validatec';
          // this.enableViewBtnF = false;
          // this.enableViewBtnT = true;
          // this.isButtonDisabled = false;
        } else {
          this.showWarn('Las contraseñas no coinciden');
        }
      } else {
        this.showWarn('La contraseña ingresada no cumple los reuisitos');
      }
    }
  }

  checkInputValue(event: any) {
    this.className = 'nvalidatec';
    let username = event.target.value;
    console.log('mIrame' + username);

    this.authUser.existByUsername(username).subscribe(
      (data: any) => {
        if (data != null) {
          this.isPresent = data;
        } else {
          this.isPresent = null;
        }
      },
      (err: HttpErrorResponse) => {
        // manejar el error aquí
      }
    );
  }

  //Método que me va impedir poner otra contraseña por parte del uuario..
  //Declaramos una bandera.
  passwordIgual: boolean = false;
  validarMismaPassword(evento: any) {
    let passwordValor = this.user.contrasenia;
    let passwordINgreso = evento.target.value;

    if (passwordValor === passwordINgreso) {
      this.passwordIgual = false;
    } else {
      this.passwordIgual = true;
    }
  }
  //Fin del Método que me va impedir poner otra contraseña por parte del uuario..

  // public selectedGender = '';
  //Validar para que ingrese el user y pass y cambien el contenido

  //FIN DE LA PRIMER PARTE INGRESO DE DATOS PARA LA CUENTA.-------------------------------------------------------------------

  //CONTROL DE LA SEGUNDA PARTE DE LOS REGISTRO CON LOS DATOS PERSONALES.-------------------------------------------------------------------

  //Implementación de la validacion de los datos personales del usuario..

  //Valores boleanos que controlaran la ejecuacion de las vistas en el caso de los colores de los campos que estan incorrectos..
  cedulaValida = false;
  nombresValida = false;
  direccionValida = false;
  generoValida = false;
  telefonoValida = false;
  correoValida = false;
  celularValida = false;
  edadValida = false;

  edadPersona: any;
  public validarDatosPersona() {
    this.className = 'nvalidatec';
    console.log(this.persona);
    if (
      this.persona.cedula === '' ||
      this.persona.cedula === undefined ||
      this.persona.cedula === null
    ) {
      this.cedulaValida = true;
    } else {
      this.cedulaValida = false;
    }

    //Second
    if (
      this.persona.nombres === '' ||
      this.persona.nombres === undefined ||
      this.persona.nombres === null
    ) {
      this.nombresValida = true;
    } else {
      this.nombresValida = false;
    }

    //3
    if (
      this.persona.genero === '' ||
      this.persona.genero === undefined ||
      this.persona.genero === null
    ) {
      this.generoValida = true;
    } else {
      this.generoValida = false;
    }

    //4
    if (
      this.persona.genero === '' ||
      this.persona.genero === undefined ||
      this.persona.genero === null
    ) {
      this.generoValida = true;
    } else {
      this.generoValida = false;
    }

    //5
    if (
      this.persona.direccion === '' ||
      this.persona.direccion === undefined ||
      this.persona.direccion === null
    ) {
      this.direccionValida = true;
    } else {
      this.direccionValida = false;
    }

    //6
    if (
      this.persona.telefono === '' ||
      this.persona.telefono === undefined ||
      this.persona.telefono === null
    ) {
      this.telefonoValida = true;
    } else {
      this.telefonoValida = false;
    }

    //7
    if (
      this.persona.celular === '' ||
      this.persona.celular === undefined ||
      this.persona.celular === null
    ) {
      this.celularValida = true;
    } else {
      this.celularValida = false;
    }

    //8
    if (
      this.persona.correo === '' ||
      this.persona.correo === undefined ||
      this.persona.correo === null
    ) {
      this.correoValida = true;
    } else {
      this.correoValida = false;
    }

    //8
    if (this.persona.edad === undefined || this.persona.edad === null) {
      // this.showWarn('Debe ingresar una fecha de nacimiento');
      this.edadValida = true;
    } else {
      this.edadValida = false;
    }

    if (
      this.cedulaValida == true ||
      this.nombresValida == true ||
      this.generoValida == true ||
      this.direccionValida == true ||
      this.telefonoValida == true ||
      this.correoValida == true ||
      this.celularValida == true ||
      this.edadValida == true
    ) {
      this.showErrorValida();
    } else {
      let valorClaveE = false;
      let valorClaveC = false;
      if (this.validateGoogleEmail(this.persona.correo)) {
        this.correoValida = false;
        valorClaveE = true;
      } else {
        valorClaveE = false;
        this.correoValida = true;
        this.showError('El correo ingresado no es valido.');
      }

      // let cedula = this.persona.cedula?.replace(/\D/g, ''); // eliminar cualquier carácter que no sea un número, incluyendo el guión

      let cedula = this.persona.cedula?.replace(/\D/g, '');
      cedula = cedula?.replace('-', ''); // eliminar cualquier guion que pueda haber en la cédula
      // alert(cedula)
      if (cedula?.length != 10 && cedula?.length != 13) {
        valorClaveC = false;
        this.cedulaValida = true;
        this.showError('El campo de cedula no cumple el formato');
      } else {
        valorClaveC = true;
        this.cedulaValida = false;
      }

      //vamos a validar si es mayor de edad
      if (this.persona.edad) {
        this.edadPersona = this.calculateAge(this.persona.edad);

        if (this.edadPersona == -1) {
        } else {
          if (this.edadPersona >= 18) {
            if (valorClaveE == true && valorClaveC == true) {
              if (
                this.isPresentCedula === null &&
                this.isPresentCorreo == false
              ) {
                this.className = 'validatec';
                this.showSuccess();
              } else {
                if (this.isPresentCedula != null) {
                  this.className = 'nvalidatec';
                  this.cedulaValida = true;
                  this.showError(
                    'La cédula ingresada ya pertence a otro usuario.'
                  );
                }

                if (this.isPresentCorreo != false) {
                  this.className = 'nvalidatec';
                  this.correoValida = true;
                  this.showError(
                    'Lo sentimos el correo electronico ingresado ya esta en uso por otra persona.'
                  );
                }
              }
            }
          } else {
            this.showError('Lo sentimos ustede debe ser mayor de edad!!');
          }
        }
      } else {
        console.log('errro en la parte de fecha');
      }
    }
  }

  public calculateAge(dateOfBirth: Date): number {
    const today = new Date();
    const diffInMilliseconds = today.getTime() - dateOfBirth.getTime();
    const millisecondsInYear = 1000 * 60 * 60 * 24 * 365.25; // aprox. milisegundos en un año
    const age = Math.floor(diffInMilliseconds / millisecondsInYear);

    if (age < 0) {
      this.showError(
        'La fecha de nacimiento no puede ser posterior a la fecha actual.' + age
      );
    }

    return age;
  }

  // Fin para calvulra la edad de la persona..
  //Metodo para ejecutar las partes de la validaciones del back..
  // public formatCedula(event: any) {
  //   const cedula = event.replace(/\D/g, ''); // eliminar cualquier carácter que no sea un número
  //   if (cedula.length === 10) {
  //     this.persona.cedula = cedula;
  //   } else if (cedula.length === 13) {
  //     this.persona.cedula = cedula.substr(0, 10) + '-' + cedula.substr(10);
  //     console.log('->' + this.persona.cedula);
  //   }
  // }

  //PROCESO DE PRUEBAS DE LA CEDULA RUC
  public formatCedula(event: any) {
    const cedula = event.replace(/\D/g, ''); // eliminar cualquier carácter que no sea un número
    if (cedula.length === 10) {
      this.persona.cedula = cedula;
    } else if (cedula.length === 11) {
      if (event.keyCode === 8) {
        // Si se presiona el botón de eliminar, simplemente actualizar la cédula sin sufijo
        this.persona.cedula = cedula.substr(0, 10);
      } else {
        // De lo contrario, concatenar el sufijo "-001"
        this.persona.cedula = cedula.substr(0, 10) + '-001';
      }
    }
  }

  public onDeleteKeyDown(event: KeyboardEvent) {
    const cedula = this.persona.cedula?.replace(/\D/g, ''); // eliminar cualquier carácter que no sea un número
    if (cedula?.length === 13 && event.keyCode === 8) {
      // Si la cédula tiene el sufijo "-001" y se presiona el botón Eliminar, quitar el sufijo
      this.persona.cedula = cedula.substr(0, 11);
    }
  }

  isPresentCedula: any;
  public checkInputValueCedula(event: any) {
    this.className = 'nvalidatec';
    let cedula = event.target.value;
    console.log('mIrame' + cedula);

    this.authUser.existByCedula(cedula).subscribe(
      (data: any) => {
        console.log('La data de cedula' + data);
        if (data != null) {
          this.isPresentCedula = data;
        } else {
          this.isPresentCedula = null;
        }
      },
      (err: HttpErrorResponse) => {
        // manejar el error aquí
      }
    );
  }

  public checkInputValueCedula1(event: any) {
    this.className = 'nvalidatec';
    let cedula = event.target.value;

    // Formatear la cédula
    const cedulaFormateada = cedula.replace(/\D/g, ''); // eliminar cualquier carácter que no sea un número

    console.log('-> ' + cedulaFormateada);
    this.authUser.existByCedula(cedulaFormateada).subscribe(
      (data: any) => {
        if (data != null) {
          this.isPresentCedula = data;
        } else {
          this.isPresentCedula = null;
        }
      },
      (err: HttpErrorResponse) => {
        // manejar el error aquí
      }
    );
  }

  isPresentCorreo: any;
  public checkInputValueCorreo(event: any) {
    this.className = 'nvalidatec';
    let correo = event.target.value;
    console.log('mIrame' + correo);

    this.authUser.existByCorreo(correo).subscribe(
      (data: any) => {
        if (data != null) {
          console.log('info de data de correo-> ' + data);
          this.isPresentCorreo = data;
        }
        console.log('la data en' + data);
      },
      (err: HttpErrorResponse) => {
        // manejar el error aquí
      }
    );
  }
  //Fin del Metodo para ejecutar las partes de la validaciones del back..
  //Validar correo que sea de google
  public validateGoogleEmail(email: any) {
    const pattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@gmail.com$/;
    return pattern.test(email);
  }

  // const email = "example@google.com";
  // console.log(validateGoogleEmail(email)); // true

  //Fin del validar correo que sea por google..

  //Validacion del email
  public validateEmail(email: any) {
    const regex =
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(email);
  }

  // const email = "example@example.com";
  // console.log(validateEmail(email)); // outputs: true

  //Fin de la validacion del email..

  //Implementación de el evento el cual va a cojer el usuario para su genero
  public filtersImplements(e: any) {
    let filters = e.target.value;
    if (filters === '' || filters === undefined || filters === null) {
      console.log('Genero no seleccionado');
    } else {
      this.persona.genero = filters;
      console.log(this.persona.genero);
    }
  }
  //Fin de la Implementación de el evento el cual va a cojer el usuario para su genero

  //FIN DEL CÓDIGO CONTROL DE LA SEGUNDA PARTE DE LOS REGISTRO CON LOS DATOS PERSONALES.-------------------------------------------------------------------

  //ESTE MÉTODO NOS VA SERVIR PARA TODO PARA QUE NO PUEDA INGRESAR CON ESPACIOS EN BLANCO
  //Método que me va impedir poner espacios en los imputs
  contatSpace(evento: any) {
    let espacioBlanco = evento.target.value;

    let sinEspacios = espacioBlanco.replace(/\s/g, '');
    evento.target.value = sinEspacios;
  }
  //Fin del Método que me va impedir poner espacios en los imputs

  //Metodos de los mensajes
  public MessageOfconfirmation() {
    this.className = 'nvalidatec';
    this.confirmationService.confirm({
      message: '¿Esta usted de acuerdo que desea crear su cuenta.',
      header: 'Confirmación de la cuenta',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Aceptar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Aceptación',
          detail: 'Tú has aceptado',
        });

        setTimeout(() => {
          this.savePersona();
        }, 3000);
      },
      reject: (type: any) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({
              severity: 'error',
              summary: 'Cancelado',
              detail: 'Cuenta cancelada, se procedera al login.',
            });

            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 3000);
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({
              severity: 'warn',
              summary: 'En espera',
              detail: 'Tus datos se mantendran para tu edición.',
            });
            break;
        }
      },
    });
  }

  idp: number = 1;

  //Implementacion de los errores mandados por el servidor.. ID:01
  showSuccess() {
    this.messageService.add({
      severity: 'success',
      summary: 'Verificado',
      detail: 'Información correcta.',
    });
  }

  showSuccessFinal(key: any) {
    this.messageService.add({
      severity: 'success',
      summary: 'Verificado',
      detail: key,
    });

    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 3000);
  }

  showSuccessVe(key: any) {
    this.messageService.add({
      severity: 'success',
      summary: 'Verificado',
      detail: key,
    });
  }

  showInfo() {
    this.messageService.add({
      severity: 'info',
      summary: 'Info',
      detail: this.errorMessage,
    });
  }

  showWarn(msgg: any) {
    this.messageService.add({
      severity: 'warn',
      summary: 'Warn',
      detail: msgg,
    });
  }

  showError(err: any) {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: err,
    });
  }

  showErrorValida() {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Verifique los datos ingresados',
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

  //Validar preferencias del usuario que sean minimo 1 y maximo 3..

  public validarPreferencias() {
    this.className = 'nvalidatec';
    if (this.selectedRazasIds.length < 1) {
      this.showWarn('Debe escojer minimo una raza para sus preferencias.');
      this.className = 'nvalidatec';
    } else {
      this.className = 'validatec';
      this.MessageOfconfirmation();
    }
  }
  //Fin de la validacion de las preferencias del usaurio..

  //CONTROL PRINCIPAL QUE SE VA HACER A LA HORA DE VALIDAAR LOS DATOS..
  onNextClick(event: Event, id: any) {
    const target = event.target as HTMLElement;
    if (!target) {
      return;
    }
    if (target.classList.contains(this.className)) {
      // código para ejecutar la acción normal del botón
      // this.className = 'validatec';
      switch (id) {
        case 1:
          this.validaUserPass();
          //this.className = 'validatec';
          break;
        case 2:
          this.validarDatosPersona();
          // this.className = 'validatec';
          //this.className = 'nvalidatec';
          //this.validaUserPass()
          break;
        case 3:
          this.validarPreferencias();
          break;
      }

      // alert(this.className)
      // return;
    }
    event.preventDefault();
  }
}
