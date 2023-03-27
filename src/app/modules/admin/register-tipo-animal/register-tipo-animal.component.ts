import { Component } from '@angular/core';
import { Tipo } from 'src/app/model/tipo';
import { TipoService } from 'src/app/service/tipo-animal.service';

import Swal from 'sweetalert2';

//pasos para el pdf..
import * as fileSaver from 'file-saver';

import { DomSanitizer } from '@angular/platform-browser';
import { ReportsService } from 'src/app/service/reports.service';
import { ConfirmationService, MessageService, PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-register-tipo-animal',
  templateUrl: './register-tipo-animal.component.html',
  styleUrls: ['./register-tipo-animal.component.css'],
  providers: [ConfirmationService, MessageService],
})
export class RegisterTipoAnimalComponent {
  tipos: Tipo[] = [];
  public tipo: Tipo = new Tipo();
  public isDisabledTipoCreate = false;

  public isLoadingDataAdmin: boolean = false;
  constructor(
    private tipoService: TipoService,
    private reportService: ReportsService,
    public sanitizer: DomSanitizer,
    private messageService: MessageService,
    private primengConfig: PrimeNGConfig,
  ) {}

  ngOnInit() {
    this.isLoadingDataAdmin = true;
    this.isDisabledTipoCreate = false;
    this.primengConfig.ripple = true;
    this.getAllTipos();
    
  }

  private getAllTipos(){
    // this.tipoService.getTipos().subscribe((tipos) => (this.tipos = tipos));
    this.tipoService.getTipos().subscribe(data=>{
      this.tipos = data;
      this.isLoadingDataAdmin = false;
    })
    
  }

  //Nuevos cambios de zhunio.....

  fileSelected = false;

  onFileSelected() {
    this.fileSelected = true;
  }

  async loadTipoPicture(event: any) {
    const file = event.target.files[0];
    const fileSize = file.size; // tamaño en bytes
    if (fileSize > 1048576) {
      // mensaje de error al usuario
      this.showError('El tamaño máximo de la foto debe ser de 1 MB.');
      event.target.value = null;
    } else {
      try {
        this.tipo.foto = await this.convertToBase64(file);
      } catch (error) {
        console.error(error);
      }
    }
  }

  clearForm() {
    this.tipo.id_tipoanimal = 0;
    this.tipo.nombretipo = '';
    this.tipo.descripcion = '';
    this.tipo.foto = '';
  }

  // Mensajes
  public showError(err: any) {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: err,
    });
  }
  //Fin de los cambios dez zhunio.....

  //Reportes
  public getReportOfUserRequest(id_tipo: any, name: any) {
    this.reportService
      .generateReporOftRazaDependenceTipo(id_tipo, name)
      .subscribe((r) => {
        const url = URL.createObjectURL(r);
        window.open(url, '_blank');
      });
  }

  display: boolean = false;

  showForm() {
    this.display = true;
  }

  //  listar
  public enlist(): void {
    this.tipoService.getTipos().subscribe((tipos) => (this.tipos = tipos));
  }

  //  crear
  public create(): void {
    if (this.tipo.foto != '') {
      let inputNombre: any;
      inputNombre = document.getElementById('txt_nombre');
      if (inputNombre && inputNombre.value) {
        this.isDisabledTipoCreate = true;
        this.tipoService.create(this.tipo).subscribe((tipo) => {
          this.displayMaximizable = false;
          this.showMessageConfirmCreate();
          this.enlist();
        });
      } else {
        alert('Error al guardar el registro');
      }
    } else {
      this.showError('Debe ingresar la foto del tipo de animal.');
    }
  }

  //  actualizar
  public editTipo(tipo: any) {
    this.tipo = {
      ...tipo,
    };
  }

  //  convertir archivo a b64
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

  //  guardar b64 en la database
  async loadPictureTypeAnimal(event: any) {
    const file = event.target.files[0];
    const fileSize = file.size; // tamaño en bytes
    if (fileSize > 262144) {
      // mensaje de error al usuario
      this.showError(
        'El tamaño de la foto es muy pesado, debe ser máximo de 262144 bytes.'
      );
      event.target.value = null;
    } else {
      try {
        this.tipo.foto = await this.convertToBase64(file);
      } catch (error) {
        console.error(error);
      }
    }
  }

  //  fin codigo crud-html
  /********************************************************************************************************************************************************************************************/

  /********************************************************************************************************************************************************************************************/
  //  inicio control  - tabla-html

  first = 0;
  rows = 5;
  displayMaximizable?: boolean;
  displayMaximizableDelete?: boolean;

  showMaximizableDialog() {
    this.displayMaximizable = true;
  }

  next() {
    this.first = this.first + this.rows;
  }

  prev() {
    this.first = this.first - this.rows;
  }

  reset() {
    this.first = 0;
  }

  resetTemplate() {
    this.first = 0;
  }

  isLastPage(): boolean {
    return this.tipos ? this.first === this.tipos.length - this.rows : true;
  }

  isFirstPage(): boolean {
    return this.tipos ? this.first === 0 : true;
  }

  //  fin control  - tabla-html
  /********************************************************************************************************************************************************************************************/

  //      CRUD  - crear
  public showMessageConfirmCreate() {
    Swal.fire(
      'Tipo de animal',
      `"${this.tipo.nombretipo}" guardado con exito`,
      'success'
    );
    this.isDisabledTipoCreate = false;
  }

  //    CRUD  - eliminar
  public showMessageConfirmDelete() {
    Swal.fire({
      title: '¿Seguro que quieres eliminar este registro?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('Registro eliminado', '', 'success');
      } else if (result.isDenied) {
        Swal.fire('Ningún cambio efectuado', '', 'info');
      }
    });
  }

  //  recargar pagina
  reloadPage() {
    window.location.reload();
  }
}
