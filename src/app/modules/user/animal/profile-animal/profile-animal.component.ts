import { Component, OnInit } from '@angular/core';
import { Cuenta } from 'src/app/model/cuenta';
import { Persona } from 'src/app/model/persona';
import { RegisterAnimal } from 'src/app/model/register-animal';
import { AnimalService } from 'src/app/service/animal.service';
import { PersonaService } from 'src/app/service/persona.service';
import { RazaService } from 'src/app/service/raza-animal.service';

//Implemtar router
import { ActivatedRoute, Router } from '@angular/router';
import { Solicitud } from 'src/app/model/solicitud';
import { SolicitudService } from 'src/app/service/solicitud.service';
import Swal from 'sweetalert2';
import {
  ConfirmationService,
  MessageService,
  PrimeNGConfig,
} from 'primeng/api';
import { LoadScript } from 'src/app/scripts/load-script';

@Component({
  selector: 'app-profile-animal',
  templateUrl: './profile-animal.component.html',
  styleUrls: [
    './profile-animal.component.css',
    './profile-animal.component.scss',
  ],
  providers: [ConfirmationService, MessageService],
})
export class ProfileAnimalComponent implements OnInit {
  // public animal: RegisterAnimal = new RegisterAnimal();
  public animal: any;
  public persona: Persona = new Persona();
  public user: Cuenta = new Cuenta();

  public id_animal: any;

  //La parte creada por zhunio
  public solicitud: Solicitud = new Solicitud();

  public solicitudes: Solicitud[] = [];
  public animales: RegisterAnimal[] = [];
  public usuarios: Cuenta[] = [];

  public id_cuenta: any;

  public id_animal2: any;

  public id_personalogeada: any;

  public animalRestoreBDA: any;

  public values: any[] = [];

  public displayModal?: boolean;

  public persona1: any;

  //Variable que me va a permitir hacer toda la accion para en caso de la carga de la información..
  public isLoadingData = false;

  constructor(
    private servicioAnimal: AnimalService,
    private razaAnimal: RazaService,
    private router: Router,
    private actiRouter: ActivatedRoute,
    private personaService: PersonaService,
    private solicitudService: SolicitudService,
    private messageService: MessageService,
    private primengConfig: PrimeNGConfig,
    private scriptC: LoadScript
  ) {
  }

  ngOnInit(): void {
    this.isLoadingData = true;
    this.primengConfig.ripple = true;
    this.id_animal = localStorage.getItem('id_user_person');
 
    this.actiRouter.params.subscribe((params) => {
      const id_animal = params['id'];
      this.optenerDatos(id_animal);
    });

    this.traerPersona(this.id_animal);
  }

  //La parte que iso zhunio----------------------------------------------------------------
  public create() {
    this.solicitud.persona = this.persona1;
    this.solicitud.animal = this.animal;

    this.solicitudService
      .createSolicitud(this.solicitud)
      .subscribe((response) => {
        // this.recogerDatos()
        console.log(response);
      });

    this.unShowModalDialog();
  }

  public traerPersona(id_persona: any) {
    this.personaService.getPersonById(id_persona).subscribe((data: any) => {
      this.persona1 = data;
    });
  }

  recogerDatos() {
    let txtAreaComentario: any;
    txtAreaComentario = document.getElementById('txtAreaComentario');

    this.solicitud.comentario = txtAreaComentario.value;
    this.solicitud.tipopago = 'tipopago';

    console.log(this.solicitud);
  }

  public onRazaAnimalChange(event: any) {
    let valor = event.target.value;
    console.log('Valor: ' + valor);
    this.solicitud.tipopago = valor;
  }

  public showSwal() {
    if (this.solicitud.tipopago == null) {
      this.showError(
        'Ustede debe escojer el metodo de pago para proceder con la solicitud.'
      );
    } else {
      if (
        this.solicitud.comentario == null ||
        this.solicitud.comentario == undefined
      ) {
        this.showError(
          'Debe ingresar un comentario.'
        );
      } else {
        let inputComentario: any;
        inputComentario = document.getElementById('txtAreaComentario');
        if (inputComentario && inputComentario.value) {
          this.unShowModalDialog();
          Swal.fire({
            title: '¿Desea enviar la solicitud?',
            showDenyButton: true,
            denyButtonText: 'Cancelar',
            confirmButtonText: 'Enviar',
            imageUrl: 'data:image/jpeg;base64,' + this.animal.foto,
            imageWidth: 240,
            imageHeight: 230,
            imageAlt: 'Custom image',
          }).then((result) => {
            Swal.fire(
              'Solicitud enviada!',
              'Se ha notificado al dueño del animal',
              'success'
            );
            if (result.isConfirmed) {
              this.create();
            } else if (result.isDenied) {
              Swal.fire('Solicitud cancelada!', ':D', 'info');
            }
          });
        }
      }
    }
  }

  //La parte fin de zhion-------------------------------------------------------------------

  public perfildePersona(id_persona: any) {
    //Implementacion del routenign
    this.router.navigate(['usuario/profileuser/profile/', id_persona]);
  }

  optenerDatos(id_animal: any) {
    this.servicioAnimal.getAnimalByid(id_animal).subscribe(
      (data: any) => {
        this.animal = data;
        console.log(this.animal);
        this.isLoadingData = false; // Establecer isLoadingData en false cuando se hayan cargado los datos
      },
      (err) => {
        console.log('La persona no se a encontrado');
      }
    );
  }

  mostrarPDF(): void {
    const byteCharacters = atob(this.animal.fichaMedica?.documento);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const pdfBlob = new Blob([byteArray], { type: 'application/pdf' });
    const pdfUrl = window.URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, '_blank');
  }

  //monstrar en la pantalla del perfil que el animal no esta disponible..
  public showMessageViewNodisponible() {
    this.showError('Lo sentimos en este momento el animal no esta disponible.');
  }

  //TODOS LOS MENSAJES QUE VAMOS A MONTRAR EN LAS VISTAS.. NO PONER CODDIGO MAS ABAJO...

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

  showModalDialog() {
    this.displayModal = true;
    this.solicitud = new Solicitud();
  }

  mostrarDatos() {
    console.log(this.id_animal, this.id_animal2);
  }

  unShowModalDialog() {
    this.displayModal = false;

  }

  sendSolicitud() {
    this.unShowModalDialog();
  }
}
