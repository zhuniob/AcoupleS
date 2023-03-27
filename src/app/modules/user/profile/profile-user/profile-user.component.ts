import { Component, OnInit } from '@angular/core';
import { Cuenta } from 'src/app/model/cuenta';
import { Persona } from 'src/app/model/persona';
import { PersonaService } from 'src/app/service/persona.service';
import { UserService } from 'src/app/service/user.service';
import { LoadScript } from 'src/app/scripts/load-script';
import {
  ConfirmationService,
  ConfirmEventType,
  MessageService,
} from 'primeng/api';

import { PreferenceService } from 'src/app/service/preference.service';
//Import de la raza y el tipo service
import { RazaService } from 'src/app/service/raza-animal.service';
import { TipoService } from 'src/app/service/tipo-animal.service';

//Import de la raza y el tipo model
import { Tipo } from 'src/app/model/tipo';
import { Raza } from 'src/app/model/raza';
import { AnimalService } from 'src/app/service/animal.service';
import { FichasMedicas } from 'src/app/model/fichas-medicas';
import { RegisterAnimal } from 'src/app/model/register-animal';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { StorageService } from 'src/app/service/storage.service';
import { ReportsService } from 'src/app/service/reports.service';
//Other librari
@Component({
  selector: 'app-profile-user',
  templateUrl: './profile-user.component.html',
  styleUrls: ['./profile-user.component.css'],
  providers: [ConfirmationService, MessageService],
})
export class ProfileUserComponent implements OnInit {
  //Imporrt de la clase de persona
  public persona: Persona = new Persona();

  public user: Cuenta = new Cuenta();

  //Import de la Tipo
  public tipoAnimal: Tipo = new Tipo();

  //Import de la Raza
  public razaAnimal: Raza = new Raza();

  //Clave del usuario log.
  id_user: any;


  userPresent: any[] = [];

  //Implmentacion del modal

  displayMaximizable?: boolean;
  displayMaximizablePreferences?: boolean;

  displayPosition?: boolean;

  //Control view setvisible in the case view catecogory..
  enableViewDataPerson: boolean = true;

  //Control view setvisible in the case view product..
  enableViewPaswordChange: boolean = false;

  //Implementación del codigo de que me verifica cual de las dos es para el regristro..

  position?: string;

  //Cappturara el Json de la password
  //Hacer un Json de la password

  passwordActualBD = {
    passwordValida: null,
    passwordIsPresent: null,
  };

  value3: any;
  //Fin del json
  valorPassword: any;

  //Edad de la persona:
  edadPersona: any;

  //Implementación para las preferencias

  tipos: any[] = [];
  razas: any[] = [];
  razasSeleccionadas: any[] = [];
  selectedRazasIds: any[] = [];
  razasSeleccionadasVisible: any[] = [];
  responsiveOptions: any;

  public checked2: boolean = true;
  listALLAnimals: any[] = [];

  //idperson login
  id_user_person: any;

  first = 0;

  rows = 4;

  // clases a utilizar Update
  public personaUp: Persona = new Persona();
  public razaAnimalUp: Raza = new Raza();
  public fichaMedUp: FichasMedicas = new FichasMedicas();
  public animalUp: RegisterAnimal = new RegisterAnimal();

  public cuentaUpdate: Cuenta = new Cuenta();

  public username: any;

  public isPersonIsPresent: boolean = false;

  public imageIsPersonPrent: any;

  public userLoggin: any;
  constructor(
    private servicePerson: PersonaService,
    private userService: UserService,
    private scriptC: LoadScript,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private accountSer: UserService,
    private serviceTipoAnimal: TipoService,
    private serviceRazaAnimal: RazaService,
    private servicePreference: PreferenceService,
    private animalService: AnimalService,
    private router: Router,
    private localStorageService: StorageService,
    private reportService: ReportsService
  ) {
    scriptC.Cargar(['line']);
    this.responsiveOptions = [
      {
        breakpoint: '1024px',
        numVisible: 3,
        numScroll: 3,
      },
      {
        breakpoint: '768px',
        numVisible: 2,
        numScroll: 2,
      },
      {
        breakpoint: '560px',
        numVisible: 1,
        numScroll: 1,
      },
    ];
  }

  ngOnInit(): void {
    this.isPersonIsPresent = true;
    this.id_user = localStorage.getItem('id_user');
    this.id_user_person = localStorage.getItem('id_user_person');
    this.imageIsPersonPrent = localStorage.getItem('foto');
    this.username = localStorage.getItem('username');

    console.log('Lo que tenemos en el local storage-> ' + this.id_user);
    this.getUserLogginID(this.id_user);
    this.getPersonLooginID(this.id_user_person);

    // Para las preferencias
    this.servicePreference
      .getAllPreferencesOfUser(this.id_user_person)
      .subscribe((data: any) => {
        this.razasSeleccionadas = data;
        this.razasSeleccionadasVisible = this.razasSeleccionadas;
        console.log(this.razasSeleccionadas[1]);
      });

    this.serviceTipoAnimal.getAllTipos().subscribe((tipos: any) => {
      this.tipos = tipos.map((tipo: any) => {
        return {
          ...tipo,
          selected: false,
        };
      });
    });

    this.serviceRazaAnimal.getAllRazas().subscribe((razas) => {
      this.razas = razas.map((raza: any) => {
        return {
          ...raza,
          selected: false,
        };
      });
    });

    this.getFindAllAnimals(this.id_user_person);
  }

  //Reporte de usuario con sus animales
  public getReportOfUserOfAnimal() {
    this.reportService
      .getReportUserPerAdminOfUserRequest(
        this.id_user_person,
        this.username
      )
      .subscribe((r) => {
        const url = URL.createObjectURL(r);
        window.open(url, '_blank');
      });
  }

  //Inicio de la desactivacion de la cuenta..
  public showSwal2() {
    Swal.fire({
      icon: 'warning',
      title: '¿Desea desactivar su cuenta?',
      html: '<p class = text-align:"left"> ✔ Tus animales tambien se desactivarán <br> ✔ Ya no podras ingresar al sistema <br> ✔ No te llegaran correos de avisos </p>',
      showDenyButton: true,
      allowEscapeKey: false,
      denyButtonText: 'Cancelar',
      confirmButtonText: 'Aceptar',
      backdrop: false,
    }).then((result) => {
      // Swal.fire(
      //   'Cuenta desactivada con Exito',
      //   'Tus animales tambien fueron desactivados'
      // );
      if (result.isConfirmed) {
        this.userService.getUserLogginByID(this.id_user).subscribe((data) => {
          this.cuentaUpdate = data;
          this.cuentaUpdate.estado = false;
          this.userService
            .updateAccountUserActive(this.id_user, this.cuentaUpdate)
            .subscribe((datau) => {
              this.animalService
                .findAllByPersona(datau.persona.id_persona)
                .subscribe(
                  (data) => {
                    this.showSuccess(
                      'Su cuenta fue desactivada, se procedera a cerrar sesión.'
                    );
                    setTimeout(() => {
                      this.router.navigate(['/home']).then(() => {
                        this.localStorageService.clean();
                        window.location.reload();
                      });
                    }, 2200);
                  },
                  (err) => {
                    this.showError(
                      'Hemos tenido problemas al desactivar su cuenta.'
                    );
                  }
                );
            });
        });
      } else if (result.isDenied) {
        Swal.fire('Solicitud cancelada!');
      }
    });
  }
  //Fin del meto de la desactivacion de la cuenta..

  //Metodo que nos servira para la edicion de los animales
  public editAnimalData(id_animal: any) {
    this.router
      .navigate(['/usuario/editanimal/informacion', id_animal])
      .then(() => {
        window.location.reload();
      });
  }

  public actualizarAnimal(id_animal: any) {
    localStorage.setItem('id_animal1', String(id_animal));
    location.replace('/register-animal');
  }

  public updateAnimalperId(id_animal: any, animal: any) {
    console.log(animal);
    this.animalUp = { ...animal };

    this.animalService.EditarAnimalById(id_animal, this.animalUp).subscribe(
      (data: any) => {
        console.log(data);

        // Verificar si data es un arreglo
        if (Array.isArray(data)) {
          this.listALLAnimals = data;
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  public updateAnimalperIdDisponibility(id_animal: any, animal: any) {
    console.log(animal);
    this.animalUp = { ...animal };

    this.animalService.EditarAnimalById(id_animal, this.animalUp).subscribe(
      (data: any) => {
        console.log(data);

        // Verificar si data es un arreglo
        if (Array.isArray(data)) {
          this.listALLAnimals = data;
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  //New opc
  public countAnimalsUser: boolean = false;
  public getFindAllAnimals(id_persona: any) {
    this.animalService.findAllCuentasA(id_persona).subscribe(
      (data: any) => {
        if (data != null) {
          this.countAnimalsUser = true;
        }
        this.listALLAnimals = data;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  onTipoSeleccionado(tipo: any) {
    tipo.selected = !tipo.selected;
    console.log('Fi_> ' + tipo.selected);
    this.razasSeleccionadas = this.razas.filter(
      (raza) => raza.id_tipoanimal === tipo.id_tipoanimal && raza.selected
    );
  }

  espacioLista: any = 0;
  onRazaSeleccionada(raza: any) {
    console.log('id-> ' + raza.id_razaanimal);
    console.log(this.espacioLista);
    raza.selected = !raza.selected;
    this.razasSeleccionadas = this.razas.filter((raza) => raza.selected);


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
  //Fin de la implementacion de los metodos para las preferencias..

  setEnable(): void {
    this.enableViewDataPerson = false;
    this.enableViewPaswordChange = true;
  }

  //Usamos una funcion o metodo que nos permita ejecutar dos acciones a la vez..
  //1- Mostrar las categoruias..
  //2- Ocultar los productos..
  setDisable(): void {
    this.enableViewDataPerson = true;
    this.enableViewPaswordChange = false;
  }

  public getPersonLooginID(id_persona: any) {
    this.servicePerson.getPersonById(id_persona).subscribe(
      (data) => {
        if (data != null) {
          this.persona = data;
          //La condicional para formatear la fecha
          if (this.persona.edad) {
            this.persona.edad = new Date(this.persona.edad);
          }

          if (this.persona.edad) {
            this.edadPersona = this.calculateAge(this.persona.edad);
          }
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  //Calcular la edad de la persona

  calculateAge(birthday: Date): number {
    const today = new Date();
    let age = today.getFullYear() - birthday.getFullYear();
    const m = today.getMonth() - birthday.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthday.getDate())) {
      age--;
    }
    return age;
  }
  //Fin para el calcular la edad de la persona

  public getUserLogginID(id_user: any) {
    this.userService.getUserLogginByID(id_user).subscribe(
      (data: any) => {
        this.user = data;
        this.valorPassword = data.contrasenia;
        this.user.contrasenia = '';
        if (data.persona.edad) {
          this.persona.edad = new Date(data.persona.edad);
        }

        if (this.persona.edad) {
          this.edadPersona = this.calculateAge(this.persona.edad);
        }

        this.isPersonIsPresent = false;
      },
      (err) => {
        console.log('La persona no se a encontrado');
      }
    );
  }

  newPicture?: string;
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
          alert('Solo se permiten archivos de tipo jpeg, jpg o png');
        } else {
          this.persona.foto = await this.convertToBase64(file);

          console.log(this.persona.id_persona, this.persona);
          this.servicePerson
            .updatepersona(this.persona.id_persona, this.persona)
            .subscribe(
              (data: any) => {
                console.log('bien' + data);
              },
              (err) => {
                console.log('mal');
              }
            );
        }
      } catch (error) {
        console.error(error);
      }
    }
  }
  //Fin del metodo que captura la imagen del usuario..

  //Implementacion del evento que captura la imagen del usuario..
  async loadPictureUserP(event: any) {
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
          alert('Solo se permiten archivos de tipo jpeg, jpg o png');
        } else {
          this.persona.foto = await this.convertToBase64(file);
        }
      } catch (error) {
        console.error(error);
      }
    }
  }

  // Implementacion de la nueva forma de envio

  // Fin-------------------------------------

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

  public updatePicture(foto: any) {}

  //Implementacion de los metodos..

  showMaximizableDialog(key: any) {
    if (key === 1) {
      this.clean();
      //Llamado de nuevo al service de los datos.
      this.getPersonLooginID(this.id_user_person);
      this.displayMaximizable = true;
    } else {
      this.displayMaximizablePreferences = true;
    }
  }

  showPositionDialog(position: string) {
    this.position = position;
    this.displayPosition = true;
  }

  //Implemetacion para que de nuevo ingrese:
  public clean() {
    this.nombresValida = false;
    this.direccionValida = false;
    this.generoValida = false;
    this.telefonoValida = false;

    this.celularValida = false;
    this.edadValida = false;
  }

  //mensaje de confirmacion.
  //Metodos de los mensajes
  MessageOfconfirmation() {
    this.confirmationService.confirm({
      message: 'Confiremar en actualizar datos?',
      header: 'Confirmación de la cuenta',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Confirmar',
      rejectLabel: 'Mantener',
      accept: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Verificando información',
          detail: 'Wait a moment. La información se esta validando..',
        });

        setTimeout(() => {
          this.controllerStatusCountAndPerson();
        }, 3000);
      },
      reject: (type: any) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({
              severity: 'warn',
              summary: 'Cancelado',
              detail: 'Cuenta cancelada, se procedera al login.',
            });

            // setTimeout(() => {
            //   this.router.navigate(['/login']);
            // }, 3000);
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

  public controllerStatusCountAndPerson() {
    if (this.enableViewDataPerson == true) {
      this.validarDatosPersona();
    } else {
      this.validarSecurityPassword();
      //this.updateDataAccountPassword();
    }
  }
  //Actualizar los datos de la persona.
  public updateDataperson() {
    if (this.persona.id_persona != null) {
      this.servicePerson
        .updatepersona(this.persona.id_persona, this.persona)
        .subscribe(
          (data) => {
            this.showSuccess(
              'La información fue actualizada satisfactoriamente.'
            );
            console.log('birn->' + data);
          },
          (err) => {
            alert('Tenemos un inconveniente update person.');
          }
        );
    } else {
      alert('estamos con erroes');
    }
  }

  //Fin de actualizar los datos de la persona.
  public updateDataAccountPassword() {
    this.accountSer.updateDataAccount(this.id_user, this.user).subscribe(
      (data) => {
        this.user = data;
        this.showSuccess('Contraseña actualizada satisfactoriamente!!');
        this.displayMaximizable = false;
        this.cleanDataPassword();
      },
      (err) => {}
    );
  }

  //Limpiar datos
  public cleanDataPassword() {
    this.user.contrasenia = '';
    this.passwordActualBD.passwordIsPresent = null;
    this.passwordActualBD.passwordValida = null;
  }

  coincideBasePass = false;
  public validarSecurityPassword() {
    if (
      this.user.contrasenia === '' ||
      this.user.contrasenia === undefined ||
      this.user.contrasenia === null ||
      this.passwordActualBD.passwordValida === '' ||
      this.passwordActualBD.passwordValida === null ||
      this.passwordActualBD.passwordValida === undefined
    ) {
      this.showError('Los campos de las contraseñas estan vacios');
    } else {
      if (this.passwordActualBD.passwordValida != this.valorPassword) {
        this.showWarn('La contraseña no coincede con la base de datos.');
        this.coincideBasePass = true;
      } else {
        this.coincideBasePass = false;
        let passwordStrong = '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})';
        let pattern = new RegExp(passwordStrong);
        if (pattern.test(this.user.contrasenia)) {
          if (
            this.user.contrasenia === this.passwordActualBD.passwordIsPresent
          ) {
            console.log('Estoy llegando a ');
            this.user.persona = this.persona;
            this.updateDataAccountPassword();
          } else {
            this.showWarn('Las contraseña no es igual');
          }
        } else {
          this.showWarn('La contraseña no es segura.');
        }
      }
    }
  }

  //Implemetaicon de todos los metodos para los controles de los campos en los fiels
  //Método que me va impedir poner espacios en los imputs
  contatSpace(evento: any) {
    let espacioBlanco = evento.target.value;

    let sinEspacios = espacioBlanco.replace(/\s/g, '');
    evento.target.value = sinEspacios;
  }
  //Fin del Método que me va impedir poner espacios en los imputs

  verFecha(evento: any) {
    let espacioBlanco = evento.target.value;

    console.log('Lo qu-> ' + espacioBlanco);
  }

  nombresValida = false;
  direccionValida = false;
  generoValida = false;
  telefonoValida = false;
  celularValida = false;
  edadValida = false;

  public validarDatosPersona() {
    console.log(this.persona);

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
    if (this.persona.edad === undefined || this.persona.edad === null) {
      this.edadValida = true;
    } else {
      this.edadValida = false;
    }

    if (
      this.nombresValida == true ||
      this.generoValida == true ||
      this.direccionValida == true ||
      this.telefonoValida == true ||
      this.celularValida == true ||
      this.edadValida == true
    ) {
      this.showError('Verifique los datos ingresados');
    } else {
      let valorClaveE = false;
      let valorClaveC = false;
      if (this.validateGoogleEmail(this.persona.correo)) {
        valorClaveE = true;
      } else {
        valorClaveE = false;

        this.showError('El correo ingresado no es valido.');
      }

      if (valorClaveE == true) {
        this.updateDataperson();
      }
    }
  }
  //Fin de la Implementación de la validacion de los datos personales del usuario..

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

  //Fin de la implemetanicon de la validacion del correo electronico

  //Implementacion de la validacion del correo
  //Validar correo que sea de google
  public validateGoogleEmail(email: any) {
    const pattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@gmail.com$/;
    return pattern.test(email);
  }

  //Implemntacion de los toast para los mensajes de error..

  public showSuccess(key: any) {
    this.messageService.add({
      severity: 'success',
      summary: 'Verificado',
      detail: key,
    });
  }

  public showWarn(msgg: any) {
    this.messageService.add({
      severity: 'warn',
      summary: 'Warn',
      detail: msgg,
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
  //fin de la Implementacion de los errores mandados por el servidor.. ID:01
  //Fin de a implementacion de los toast para el manejo de los  mensajes de error

  public validarPreferencias() {
    if (this.selectedRazasIds.length < 1) {
      this.showWarn('Debe escojer minimo una raza para sus preferencias.');
    } else {
      this.MessageOfconfirmationPreferences();
    }
  }

  MessageOfconfirmationPreferences() {
    this.confirmationService.confirm({
      message: 'Mensaje de confirmación para la creación de su cuenta?',
      header: 'Confirmación de la cuenta',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Aceptar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Aceptación',
          detail: 'Tus precerencias se van actualizar',
        });

        setTimeout(() => {
          this.updatePreferencesUser();
          this.displayMaximizablePreferences = false;
        }, 2000);
      },
      reject: (type: any) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({
              severity: 'error',
              summary: 'Cancelado',
              detail: 'Tus datos se mantendran para tu edición.',
            });
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

  private updatePreferencesUser() {
    console.log(this.id_user_person, this.selectedRazasIds);
    this.servicePreference
      .updatePreferenceOfUser(this.id_user_person, this.selectedRazasIds)
      .subscribe(
        (data) => {
          console.log('Todo bien');
        },
        (err) => {
          console.log('Algo salio mal');
        }
      );
  }

  //Metodos para lal tabla
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
    return this.listALLAnimals
      ? this.first === this.listALLAnimals.length - this.rows
      : true;
  }

  isFirstPage(): boolean {
    return this.listALLAnimals ? this.first === 0 : true;
  }
}
