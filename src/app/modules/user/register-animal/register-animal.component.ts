import { Component, OnInit } from '@angular/core';
import { RegisterAnimal } from '../../../model/register-animal';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { Persona } from 'src/app/model/persona';
import { Tipo } from 'src/app/model/tipo';
import { FichasMedicas } from 'src/app/model/fichas-medicas';
import { AnimalService } from 'src/app/service/animal.service';
import { Raza } from 'src/app/model/raza';
import { RazaService } from 'src/app/service/raza-animal.service';
import { PersonaService } from 'src/app/service/persona.service';
import {
  ConfirmationService,
  MessageService,
  PrimeNGConfig,
  ConfirmEventType,
} from 'primeng/api';

//Esta es la biblioteca de la seguridad con la que angular permite visualizar el pdf.
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-register-animal',
  templateUrl: './register-animal.component.html',
  styleUrls: ['./register-animal.component.css'],
  providers: [ConfirmationService, MessageService],
})
export class RegisterAnimalComponent implements OnInit {
  //
  fileSelected = false;
  ficha: FichasMedicas = { id_fichamedica: 0, documento: '' };
  on1FileSelected() {
    this.fileSelected = true;
  }
  //

  id_persona: any;
  id_razaanimal: any;
  id_tipoanimal: any;
  id_fichamedica: any;

  public animales: RegisterAnimal = new RegisterAnimal();
  public persona: Persona = new Persona(); //clase dependiente
  public tipoAnimal: Tipo = new Tipo();
  public fichaMedica: FichasMedicas = new FichasMedicas(); // clase dependiente
  // public animal: RegisterAnimal = new RegisterAnimal(); ->ID
  public raza: Raza = new Raza(); // clase dependiente
  public ficham: FichasMedicas = new FichasMedicas();

  public animal: any; // metodo suplente

  tipos: any[] = [];
  tiposAnimales: any[] = [];
  razas: Raza[] = [];
  razasFiltro: Array<any> = [];

  filtroRaza: any[] = [];

  fichaMedicaAnimal: any = {};
  selectedFile: File;

  animal_precio_trueq = {
    precio1: '',
    trueque: '',
  };

  constructor(
    private servicioAnimal: AnimalService,
    private razaAnimal: RazaService,
    private personaService: PersonaService,
    private sanitizer: DomSanitizer,
    private primengConfig: PrimeNGConfig,
    private messageService: MessageService,
    private router: Router,
    private actiRouter: ActivatedRoute,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.animal = new RegisterAnimal();
    this.id_persona = localStorage.getItem('id_user_person');
    this.findByIdPerson(this.id_persona);
    this.listarTiAnimal();
    this.primengConfig.ripple = true;

    this.actiRouter.params.subscribe((params) => {
      const id_animal = params['id'];

      this.servicioAnimal.getAnimalByid(id_animal).subscribe((data) => {
        this.animal = data;
        this.getRazaAnimal(this.animal.raAnimal.razaAnimal.id_tipoanimal);
        if (this.animal) {
          this.mostrarPDF_BDA();
        }
        console.log({ animal: this.animal });
        const preciosolicitud = this.animal.preciosolicitud || ''; // Si no hay preciosolicitud, usar una cadena vacía
        const valoresSeparados = preciosolicitud.split('-');
        this.animal_precio_trueq.precio1 = valoresSeparados[0];
        this.animal_precio_trueq.trueque = valoresSeparados[1];
      });
    });
  }

  public profileUserCancel() {
    this.router.navigate(['/usuario/perfil']).then(() => {});
  }

  //Método que me permite revisar si el genero esta o no vacio
  ngAfterViewInit() {
    if (!this.animal.genero) {
      this.animal.genero = '';
    }

    if (!this.animal.disponibilidad) {
      this.animal.disponibilidad = '';
    }
  }

  public updateDataAnimal() {
    if (this.animal.id_animal) {
      this.onSubmitUpdate();
    } else {
      this.onSubmit();
    }
  }

  onSubmit(): void {
    const formData = new FormData();
    const file = this.selectedFile;
    if (this.animal.foto == undefined) {
      this.showError('Debe seleccionar una foto de su animal');
    } else {
      if (
        this.animal.nombre == null ||
        this.animal.nombre == undefined ||
        this.animal.nombre == '' ||
        this.animal.foto == null ||
        this.animal.foto == undefined ||
        this.animal.foto == '' ||
        this.animal.color == null ||
        this.animal.color == undefined ||
        this.animal.color == '' ||
        this.animal.edad == null ||
        this.animal.edad == undefined ||
        this.animal.edad == '' ||
        this.animal.disponibilidad == null ||
        this.animal.disponibilidad == undefined ||
        this.animal.disponibilidad == ''
      ) {
        this.showError('Debe ingresar todos los datos de su animal.');
      } else {
        if (file == undefined) {
          this.showError('Debe seleccionar la ficha medica de sua animal');
        } else {
          this.confirmationService.confirm({
            message: 'Mensaje de confirmación para la creación de su animal',
            header: 'Confirmación',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Aceptar',
            rejectLabel: 'Cancelar',
            accept: () => {
              // Init
              formData.append('file', file, file.name);
              this.servicioAnimal.crearFicha(formData).subscribe(
                (event) => {
                  if (event.type === HttpEventType.UploadProgress) {
                    const percentDone = Math.round(
                      (100 * event.loaded) / event.total
                    );
                    console.log(`File is ${percentDone}% uploaded.`);
                  } else if (event.type === HttpEventType.Response) {
                    console.log('File upload complete.');
                    // console.log(event.body);
                    this.fichaMedica = event.body;
                    console.log(this.fichaMedica);
                    this.guardarAnimal(this.fichaMedica);
                  }
                },
                (error) => {
                  console.error(error);
                }
              );
              // fin
            },
            reject: (type: any) => {
              switch (type) {
                case ConfirmEventType.REJECT:
                  break;
                case ConfirmEventType.CANCEL:
                  this.messageService.add({
                    severity: 'warn',
                    summary: 'En espera',
                    detail: 'Proceso de edición..',
                  });
                  break;
              }
            },
          });
        }
      }
    }
  }

  //Para la actualizacion del pdf
  public onSubmitUpdate(): void {
    
    const formData = new FormData();
    const file = this.selectedFile;
    //
    if (
      this.animal.nombre == null ||
      this.animal.nombre == undefined ||
      this.animal.nombre == '' ||
      this.animal.foto == null ||
      this.animal.foto == undefined ||
      this.animal.foto == '' ||
      this.animal.color == null ||
      this.animal.color == undefined ||
      this.animal.color == '' ||
      this.animal.edad == null ||
      this.animal.edad == undefined ||
      this.animal.edad == '' 
    ) {
      this.showError('Debe ingresar todos los datos de su animal.');
    } else {
      if (file == undefined || file == null) {
        this.updateAnimalMetodo();
      } else {
        formData.append('file', file, file.name);
        this.servicioAnimal.crearFicha(formData).subscribe(
          (event) => {
            if (event.type === HttpEventType.UploadProgress) {
              const percentDone = Math.round(
                (100 * event.loaded) / event.total
              );
              console.log(`File is ${percentDone}% uploaded.`);
            } else if (event.type === HttpEventType.Response) {
              console.log('File upload complete.');
              // console.log(event.body);
              this.fichaMedica = event.body;
              this.animal.fichaMedica = this.fichaMedica;
              console.log(this.fichaMedica);
              this.updateAnimalMetodo();
            }
          },
          (error) => {
            console.error(error);
          }
        );
      }
    }
  }

  // fileUrl: any;
  fileUrl: SafeResourceUrl;

  //Incorporamos la biblioteca para la seguridad para que el pdf se visualize en la parte del cliente.
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile && this.selectedFile.size > 300000) {
      this.showWarn(
        'El archivo seleccionado es demasiado grande. Por favor, seleccione un archivo menor a 300 KB.'
      );

      return;
    }
    this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      URL.createObjectURL(this.selectedFile)
    );
  }

  //Busquedas por IDS
  public getRazaByID(id_raza: any) {
    this.razaAnimal.searchById(id_raza).subscribe((data) => {
      this.raza = data;
    });
  }

  //Get Person
  public findByIdPerson(id_persona: any) {
    this.personaService.getPersonById(id_persona).subscribe((data) => {
      this.persona = data;
    });
  }
  //fIN BUSQUEDAS POR IDS

  public listarTiAnimal() {
    this.servicioAnimal.getTiposAn().subscribe(
      (data: any) => {
        this.tiposAnimales = data;
        console.log(data);
      },
      (err) => {
        alert(err);
      }
    );
  }

  public getRazaAnimal(id_tipo: any) {
    this.razaAnimal.findByTipoAnimal(id_tipo).subscribe(
      (data) => {
        this.filtroRaza = data;
      },
      (err) => {
        console.log(err);
      }
    );
   this.raza = this.animal.raAnimal // Esta es la linea la que me permite solucionar el update
  }

  public animalRestoreBDA: any;
  public guardarAnimal(fichaMed: FichasMedicas) {
    //tengo que recibir el id de la persona
    this.animal.persona = this.persona; //Json persona
    this.animal.raAnimal = this.raza; // Json raza

    this.animal.fichaMedica = this.fichaMedica; // Json ficha
    this.animal.preciosolicitud =
      this.animal_precio_trueq.precio1 + '-' + this.animal_precio_trueq.trueque;

    if (this.persona != null && this.raza != null && this.fichaMedica != null) {
      this.servicioAnimal.saveAnimal(this.animal).subscribe((data: any) => {
        this.showSuccess('Animal Registrado Correctamente');

        setTimeout(() => {
          this.router.navigate(['/usuario/perfil']).then(() => {
            window.location.reload();
          });
          this.animal = new RegisterAnimal();
        }, 1000);

        console.log({ n: this.animal });
      });
    } else {
      this.showError('');
    }

    console.log(this.animal);
  }

  public updateAnimalMetodo() {
    console.log({dataraza: this.animal.raAnimal})
    if (this.raza) {
      this.animal.raAnimal = this.raza; // Json raza
    }else{
      this.animal.raAnimal = this.animal.raAnimal
    }
    this.animal.preciosolicitud =
      this.animal_precio_trueq.precio1 + '-' + this.animal_precio_trueq.trueque;

    
    this.servicioAnimal
      .EditarAnimalById(this.animal.id_animal, this.animal)
      .subscribe((data) => {
        this.showSuccess(
          'Los datos del animalito ' +
            this.animal.nombre +
            ' han sido actualizados.'
        );

        setTimeout(() => {
          this.router.navigate(['/usuario/perfil']).then(() => {
            window.location.reload();
          });
          this.animal = new RegisterAnimal();
        }, 1000);

        console.log({ n: this.animal });
      });
  }

  //evento capturar id
  capturaidTipoAnimal(e: any) {
    let id = e.target.value;
    console.log(id);
    this.getRazaAnimal(id);
  }

  //evento capturar id
  categoriaRaza(e: any) {
    let id_tipoRaza = e.target.value;
    this.getRazaByID(id_tipoRaza);
    console.log(id_tipoRaza);
  }

  //genero
  filtersImplements(e: any) {
    let filters = e.target.value;
    if (filters === '' || filters === undefined || filters === null) {
      console.log('Genero no seleccionado');
    } else {
      this.animal.genero = filters;
      console.log(this.animal.genero);
    }
  }

  //Todo de la foto y del documento..----------------------------------------------------

  // foto
  async loadAnimalPicture(event: any) {
    const file = event.target.files[0];
    const fileSize = file.size; // tamaño en bytes
    if (fileSize > 262144) {
      // mensaje de error al usuario
      this.showError(
        'El tamaño de la foto es mayor al máximo permitido, la foto del animal debe ser máximo de 262144 bytes.'
      );
      event.target.value = null;
    } else {
      try {
        this.animal.foto = await this.convertToBase64(file);
      } catch (error) {
        console.error(error);
      }
    }
  }

  //carga foto
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
  }

  public getFichaMedicaByID(id_ficha: any) {
    this.servicioAnimal.fichamedicaByID(id_ficha).subscribe((data) => {
      this.animalRestoreBDA = data;
      console.log(this.animalRestoreBDA);
    });
  }
  //Implementacion
  pdfUrl: SafeResourceUrl;

  //mETOO QUE ME MOSTRAR EN EL CASO DE LA VISTA
  public mostrarPDF_BDA(): void {
    const byteCharacters = atob(this.animal.fichaMedica.documento);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const pdfBlob = new Blob([byteArray], { type: 'application/pdf' });
    this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      window.URL.createObjectURL(pdfBlob)
    );
  }

  //disponibilidad
  disponibilidad(e: any) {
    let filters = e.target.value;
    console.log({ genero: filters });
    if (filters === '' || filters === undefined || filters === null) {
      console.log('Disponibilidad no seleccionado');
    } else {
      this.animal.disponibilidad = filters;
    }
  }
  // Mensajes
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

  public onConfirm() {
    this.messageService.clear('c');
  }

  public onReject() {
    this.messageService.clear('c');
  }

  public clear() {
    this.messageService.clear();
  }
}
