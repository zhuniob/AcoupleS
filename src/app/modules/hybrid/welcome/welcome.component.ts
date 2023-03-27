import { Component, OnInit, HostListener  } from '@angular/core';
import { Router } from '@angular/router';
import { AnimalService } from 'src/app/service/animal.service';
import { TipoService } from 'src/app/service/tipo-animal.service';
import { LoadScript } from '../../../scripts/load-script';
@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css', './welcome.component.scss'],
})
export class WelcomeComponent implements OnInit {
  public userRol: any;
  public listALLAnimals: any;
  public listALLAnimalsFiltered: any;

  public id_persona_loggin: any;

  //Variable para obtener todos los tipos de animales
  public allTypes: any;

  //Variables para los metodos de acceso de la informacion.
  public misAnimalesCount: any;
  public misAnimalesCountLend: any;
  public tiposAnimales: any;
  public razaAnimales: any;

  public filters={
    misAnimalesCount: 0,
    misAnimalesCountLend: 0,
    tiposAnimales: 0,
    razaAnimales: 0,
    allAnimals: 0,
    allAnimalsDisponible: 0,
    allAnimalsOcupados: 0
  }

  public filterCountAdmin = {
    num_raza: 0,
    num_tipo: 0,
    num_user: 0,
    num_animal: 0
  }

  public isLoadingDataAdmin: boolean = false;
  public isLoadingDataUser: boolean = false;

  showSlides = true;
  constructor(
    private scriptC: LoadScript,
    private animalService: AnimalService,
    private router: Router,
    private tipoService: TipoService
  ) {
    scriptC.Cargar(['welcome']);
  }
  ngOnInit(): void {
    this.updateSlidesVisibility();
    this.isLoadingDataAdmin = true;
    this.isLoadingDataUser = true;
    this.userRol = localStorage.getItem('rol');
    this.id_persona_loggin = localStorage.getItem('id_user_person');
    
    if(this.userRol === 'ADMIN'){
      this.adminInformation();
    }else{
      this.getAllAnimals();
    }
    
  }
  @HostListener('window:resize', ['$event'])
  onResize(event:any) {
    this.updateSlidesVisibility();
  }

  updateSlidesVisibility() {
    this.showSlides = window.innerWidth > 600;
  }

  public irPerfilAnimalProfile(id_animal: any) {
    this.router.navigate(['/usuario/perfil/animal', id_animal]);
  }

  public getAllAnimals() {
    this.animalService.findAllAnimals().subscribe(
      (data: any) => {
        this.listALLAnimals = data;
        console.log({AlllAnimales: this.listALLAnimals})
        this.filterUserAdmin();
      },
      (err) => {
        console.log(err);
      }
    );
  }

  public adminInformation(){
    this.tipoService.getFilterCount().subscribe((data)=>{
      this.filterCountAdmin.num_raza = data.num_raza;
      this.filterCountAdmin.num_tipo = data.num_tipo;
      this.filterCountAdmin.num_user = data.num_user;
      this.filterCountAdmin.num_animal = data.num_animal;

      this.isLoadingDataAdmin = false;
    }, (err)=>{
      console.log(err)
    });
  }

  public filterUserAdmin() {
    let animalsDisponible = this.listALLAnimals.filter(
      (animal: any) => animal.persona.id_persona == this.id_persona_loggin && animal.disponibilidad == true
    );

    let animalSolicitud = this.listALLAnimals.filter(
      (animal: any) => animal.persona.id_persona == this.id_persona_loggin && animal.disponibilidad == false
    );

    let tiposAnimals = this.listALLAnimals.reduce(
      (types: any[], animal: any) => {
        const typeId = animal.raAnimal.razaAnimal.id_tipoanimal;
        const type = types.find((t) => t.id_tipoanimal === typeId);
        if (!type) {
          types.push({
            id_tipoanimal: typeId,
            nombretipo: animal.raAnimal.razaAnimal.nombretipo,
          });
        }
        return types;
      },

      []
    );

    let razasAnimals = this.listALLAnimals.reduce(
      (types: any[], animal: any) => {
        const typeId = animal.raAnimal.id_razaanimal;
        const type = types.find((t) => t.id_razaanimal === typeId);
        if (!type) {
          types.push({
            id_razaanimal: typeId,
            nombreRaza: animal.raAnimal.id_razaanimal,
          });
        }
        return types;
      },[]
    );

    let animalDisponibles = this.listALLAnimals.filter(
      (animal: any) => animal.persona.id_persona != this.id_persona_loggin && animal.disponibilidad == true && animal.estado == true
    );

    let animalOcupados = this.listALLAnimals.filter(
      (animal: any) => animal.persona.id_persona != this.id_persona_loggin && animal.disponibilidad == false && animal.estado == true
    );

    this.filters.misAnimalesCount = animalsDisponible.length;
    this.filters.misAnimalesCountLend = animalSolicitud.length;
    this.filters.tiposAnimales = tiposAnimals.length;
    this.filters.razaAnimales = razasAnimals.length;
    this.filters.allAnimalsDisponible = animalDisponibles.length;
    this.filters.allAnimalsOcupados = animalOcupados.length;
    
    this.isLoadingDataUser = false;
  }
}
