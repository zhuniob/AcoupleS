import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';
import { AnimalService } from 'src/app/service/animal.service';
import { PreferenceService } from 'src/app/service/preference.service';
import { Router } from '@angular/router';
import { GenericService } from 'src/app/service/serviceHybrid/genericService';

@Component({
  selector: 'app-view-animal',
  templateUrl: './view-animal.component.html',
  styleUrls: ['./view-animal.component.css', './view-animal.component.scss'],
})
export class ViewAnimalComponent implements OnInit {
  persona: any[] = [];

  listAnimals: any[] = [];
  listALLAnimals: any[] = [];

  razaAnimal: SelectItem[] = [];

  sortOrder?: number;

  sortField?: string;

  //Control view setvisible in the case view tipos..
  enableViewAllAnimals: boolean = true;

  //Control view setvisible in the case view preferences..
  enableViewPreferences: boolean = false;

  //Control view setvisible in the case view tipos..
  enableViewAllTipos: boolean = false;

  listRazas: any[] = [];
  listTipos: any[] = [];

  val2: number = 3;

  //Valores para las preferencias generales...
  //findByTipoByUserLoggin
  listaTipoPreference: any[] = [];
  listaRazaPreference: any[] = [];
  listaAnimalPreferenceOfPerson: any[] = [];

  selectedRazasIds: any[] = [];

  tipoSeleccionado: any;
  public razaSeleccionado: any;

  public razafinalUserSelected: any;

  //personaLoggin.
  id_user_person: any;

  //Implementacion para el genreo del animal..
  sortOptionsAnimalGender: SelectItem[];

  //Lista de letras para almacenar cada una de ellas asiendo el uso del cosntructor..
  public letter: string[] = [];

  //Esta varible nos sirve para ver el numero 0 de iteracion para el ALL
  public i: number = 0;

  //Esta varible nos vera el color del estado del boton en el cual esta iterando
  public selectedLetter: string;

  //Variable para que nos cuente cuanto animales a encontrado
  public numerFoundCountAnimal: number;

  //Variable para obtener todos los tipos de animales
  public allTypes: any;

  public listALLAnimalsFiltered: any;

  //Variable que me va a permitir hacer toda la accion para en caso de la carga de la información..
  public isLoadingData = false;

  public isLoadingDataPreferences: boolean = false;

  public name_user: any;
  constructor(
    private primengConfig: PrimeNGConfig,
    private animalService: AnimalService,
    private servicePreference: PreferenceService,
    private router: Router,
    private genericService: GenericService
  ) {
    //Un for donde vamos a iterar sobre el código ASCCI..
    for (let i = 65; i <= 90; i++) {
      this.letter.push(String.fromCharCode(i));
    }

    //Implementación para gener..
    this.sortOptionsAnimalGender = [
      { label: 'Macho', value: 'Macho' },
      { label: 'Hembra', value: 'Hembra' },
    ];
  }

  ngOnInit() {
    this.isLoadingData = true;
    this.isLoadingDataPreferences = true;
    this.id_user_person = localStorage.getItem('id_user_person');
    this.name_user = localStorage.getItem('username');
    this.primengConfig.ripple = true;

    //Login change
    this.findByTipoByUserLoggin(this.id_user_person);

    //Lo que me va a traer toda la informacion de los aniamles

    this.animalService.findAllAnimals().subscribe(
      (data: any) => {
        console.log(data);
        this.listALLAnimals = data.filter(
          (animal: any) => animal.persona.id_persona != this.id_user_person && animal.estado == true
        );
        this.genericService.setAnimalList(this.listALLAnimals);
        this.listALLAnimalsFiltered = this.listALLAnimals;
        this.numerFoundCountAnimal = this.listALLAnimals.length;
        // this.allTypes = [...new Set(this.listALLAnimals.map(animal => animal.raAnimal.razaAnimal.nombretipo))];
        //Método para filtar los animales por los que estan en el sistema más no hacer consultas incesesarias
        this.allTypes = this.listALLAnimals.reduce(
          (types: any[], animal: any) => {
            const typeId = animal.raAnimal.razaAnimal.id_tipoanimal;
            const type = types.find((t) => t.id_tipoanimal === typeId);
            if (!type) {
              types.push({
                id_tipoanimal: typeId,
                nombretipo: animal.raAnimal.razaAnimal.nombretipo,
              });
            }
            this.isLoadingData = false; // Establecer isLoadingData en false cuando se hayan cargado los datos

            return types;
          },

          []
        );
        //Fin de los metodos para traer los animales correctos..
        console.log({ alltypes: this.allTypes });
      },
      (err) => {
        console.log(err);
      }
    );
  }

  //Metodo que nos va hacer el filtro por la letra pertenceciente a cada animal.

  public findByEstadoAndRaAnimal_RazaAnimal_NombretipoStartingWithIgnoreCase(
    letter: any
  ) {
    this.selectedLetter = letter;
    console.log(this.selectedLetter);

    let filteredAnimals = this.listALLAnimals.filter(
      (animal: any) =>
        animal.persona.id_persona != this.id_user_person &&
        animal.raAnimal.razaAnimal.nombretipo
          .toLowerCase()
          .startsWith(this.selectedLetter.toLowerCase())
    );
    console.log({ informacion: filteredAnimals });
    this.numerFoundCountAnimal = filteredAnimals.length;
    this.listALLAnimalsFiltered = filteredAnimals;
  }
  //Metodo de busquede por letra.
  public letraSeleccionada: any;
  seleccionarLetra(letra: any) {
    this.letraSeleccionada = letra;
  }

  public getAllPreferenceUserDiferentIsLloggin() {
    this.servicePreference
      .findByMisPreferenciasUserLoggin(this.id_user_person)
      .subscribe((data) => {
        this.listaAnimalPreferenceOfPerson = data.filter(
          (animal: any) =>
            animal.persona.id_persona != this.id_user_person &&
            animal.estado == true
        );

        this.isLoadingDataPreferences = false;
      });
  }

  //Implementacion del routenign
  public irPerfilAnimalProfile(id_animal: any) {
    // alert(id_animal)
    this.router.navigate(['/usuario/perfil/animal', id_animal]);
  }

  //Implementación de todo del filtro finala para las razasa y los generos..
  public filterGenderAnimalStatus(e: any) {
    let cod = e.value;

    let filteredAnimals = this.listALLAnimals.filter(
      (animal: any) =>
        animal.persona.id_persona != this.id_user_person &&
        animal.raAnimal.id_razaanimal === this.razafinalUserSelected &&
        animal.genero === cod
    );
    this.listALLAnimalsFiltered = filteredAnimals;
  }

  //Implementacion todo con referente a las preferencias...........
  public findByTipoByUserLoggin(e: any) {
    this.servicePreference.findByTipoByUserLoggin(e).subscribe((data) => {
      this.listaTipoPreference = data;
      console.log({ preferencaiasTipos: this.listaTipoPreference });
    });
  }

  //Metodo para ver los tipos en el cso ya de las razas..
  public ispreferencesSelected: boolean = false;
  public onTipoAnimalChange(event: any) {
    this.tipoSeleccionado = event.target.value;
    this.selectedRazasIds.splice(0, this.selectedRazasIds.length); // Limpiar el array
    this.findByrazazDependenceOfTipoAndUserLoggin(
      this.id_user_person,
      this.tipoSeleccionado
    );
  }

  public findByrazazDependenceOfTipoAndUserLoggin(
    id_persona: any,
    id_tipo: any
  ) {
    // let cod = e.value;
    this.servicePreference
      .findByrazazDependenceOfTipoAndUserLoggin(id_persona, id_tipo)
      .subscribe((data) => {
        console.log('Estamos entrando al evento preferencia');
        this.listaRazaPreference = data;
        console.log(this.listaRazaPreference);
        this.listaRazaPreference.forEach((item) => {
          this.selectedRazasIds.push(item[0]);
        });
        this.PreferenceOfUserLoggin(id_tipo);
        console.log(this.selectedRazasIds);
      });
    console.log('[--------------');
    console.log(this.selectedRazasIds);
  }

  public onRazaAnimalChange(event: any) {
    this.razaSeleccionado = event.target.value;
    console.log('tamos ingreso');
    this.animalService
      .getAllAnimalsByRazaID(this.razaSeleccionado)
      .subscribe((data) => {
        
        this.listaAnimalPreferenceOfPerson = data.filter(
          (animal: any) => animal.persona.id_persona != this.id_user_person
        );
      });
  }

  public PreferenceOfUserLoggin(id_tipo: any) {
    console.log('--------------');
    console.log(id_tipo);

    this.animalService
      .PreferenceOfUserLoggin(id_tipo, this.selectedRazasIds)
      .subscribe((data) => {
        this.listaAnimalPreferenceOfPerson = data.filter(
          (animal: any) => animal.persona.id_persona != this.id_user_person
        );
      });
  }

  //fin de todos los filtos de las prefencias las preferencias.......................
  public valuedataGender: boolean = false;
  public filterPerRazaIsSelected(e: any) {
    console.log('Estamos entrando al evento');
    let cod = e.value;
    this.razafinalUserSelected = cod;
    let filteredAnimals = this.listALLAnimals.filter(
      (animal: any) =>
        animal.persona.id_persona != this.id_user_person &&
        animal.raAnimal.id_razaanimal === cod
    );
    this.listALLAnimalsFiltered = filteredAnimals;
    this.valuedataGender = true;
  }

  //Traer todos los animales
  public getFindAllAnimals() {
    this.selectedLetter = 'AC';
    this.listALLAnimalsFiltered = this.listALLAnimals;
    this.numerFoundCountAnimal = this.listALLAnimals.length;
  }

  public getRazaAnimalByID(id_tipo: any) {
    const filteredAnimals = this.listALLAnimals.filter(
      (animal: any) => animal.raAnimal.razaAnimal.id_tipoanimal === id_tipo
    );

    const uniqueRazas = [
      ...new Set(
        filteredAnimals.map((animal: any) => animal.raAnimal.id_razaanimal)
      ),
    ];

    this.razaAnimal = uniqueRazas.map((id_razaanimal: any) => {
      const animal = filteredAnimals.find(
        (animal: any) => animal.raAnimal.id_razaanimal === id_razaanimal
      );
      return {
        label: animal.raAnimal.nombreraza,
        value: id_razaanimal,
      };
    });
  }

  public getAllAnimalPerTipo(id_tipo: any) {
    let filteredAnimals = this.listALLAnimals.filter(
      (animal: any) =>
        animal.persona.id_persona != this.id_user_person &&
        animal.raAnimal.razaAnimal.id_tipoanimal === id_tipo
    );
    this.listALLAnimalsFiltered = filteredAnimals;
  }

  onSortChange(event: any) {
    let value = event.value;

    if (value.indexOf('!') === 0) {
      this.sortOrder = -1;
      this.sortField = value.substring(1, value.length);
    } else {
      this.sortOrder = 1;
      this.sortField = value;
    }
  }

  //Implementacion para que se me haga las busquedas mediante palabras claves.
  //Implementación del metodo incremental del producto por su nombre..
  wordNoFind: string = '';
  public getAllAnimalsPerfilter(e: any) {
    let letter = e.target.value.toLowerCase();

    this.wordNoFind = letter;
    console.log(this.wordNoFind);

    if (this.wordNoFind === '') {
      // this.getFindAllAnimals();
      this.listALLAnimalsFiltered = this.listALLAnimals;
      this.numerFoundCountAnimal = this.listALLAnimals.length;
    } else {
      let filteredAnimals = this.listALLAnimals.filter(
        (animal: any) =>
          animal.persona.id_persona != this.id_user_person &&
          (animal.nombre.toLowerCase().includes(this.wordNoFind) ||
            animal.raAnimal.nombreraza
              .toLowerCase()
              .includes(this.wordNoFind) ||
            animal.raAnimal.razaAnimal.nombretipo
              .toLowerCase()
              .includes(this.wordNoFind))
      );
      this.numerFoundCountAnimal = filteredAnimals.length;
      this.listALLAnimalsFiltered = filteredAnimals;
    }
  }

  //Controles para que las ventanas aparescan y desapararescan, primero para el de todos de los animales
  public setEnableAll(): void {
    this.enableViewAllAnimals = true;
    this.enableViewPreferences = false;
    this.enableViewAllTipos = false;
  }

  //Controles para que las ventanas aparescan y desapararescan, para las preferencias
  public setDisable(): void {
    this.enableViewAllAnimals = false;
    this.enableViewPreferences = true;
    this.enableViewAllTipos = false;
  }

  //Controles para que las ventanas aparescan y desapararescan, cada uno de los tipos
  public setEnable(): void {
    this.enableViewAllAnimals = false;
    this.enableViewPreferences = false;
    this.enableViewAllTipos = true;
  }

  public setDisabledGender() {
    this.valuedataGender = false;
  }
}
