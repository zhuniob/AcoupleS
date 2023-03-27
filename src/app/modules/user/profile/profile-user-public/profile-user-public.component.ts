import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Cuenta } from 'src/app/model/cuenta';
import { Persona } from 'src/app/model/persona';
import { RegisterAnimal } from 'src/app/model/register-animal';
import { AnimalService } from 'src/app/service/animal.service';
import { PersonaService } from 'src/app/service/persona.service';
import { RazaService } from 'src/app/service/raza-animal.service';
import { TipoService } from 'src/app/service/tipo-animal.service';

@Component({
  selector: 'app-profile-user-public',
  templateUrl: './profile-user-public.component.html',
  styleUrls: ['./profile-user-public.component.css'],
})
export class ProfileUserPublicComponent implements OnInit{
  public animal:any;
  public personas: Persona = new Persona();
  public user: Cuenta = new Cuenta();
  public animalUp: RegisterAnimal = new RegisterAnimal();

  id_persona: any;

  id_animal: any;

  listAnimals: any[] = [];
  listALLAnimals: any[] = [];

  
  listRazas: any[] = [];
  listTipos: any[] = [];

  listaAnimalPreferenceOfPerson: any[] = [];

  id_user_person: any;


  constructor(
    private servicePerson: PersonaService,
    private router: Router,
    private actiRouter: ActivatedRoute,
    private animalService: AnimalService,
    private serviceTipoAnimal: TipoService,
    private serviceRazaAnimal: RazaService
  ) {}

  ngOnInit(): void {
    this.id_persona = localStorage.getItem('id_user_person');
    //Traer lod datos del animalito
    this.actiRouter.params.subscribe((params) => {
      const id_persona = params['id'];

      this.optenerDatos(id_persona);
    });
   
  }

  optenerDatos(id_persona: any) {
    this.getFindAllAnimals(id_persona);
    this.servicePerson.getPersonById(id_persona).subscribe(
      (data: any) => {
        this.personas = data;
        console.log(this.personas);
      },
      (err) => {
        console.log('La persona no se a encontrado');
      }
    );
  }

  optenerDatosanimal(id_animal: any) {
    this.animalService.getAnimalByid(id_animal).subscribe(
      (data: any) => {
        this.animal = data;
        console.log(this.animal);
      },
      (err) => {
        console.log('La persona no se a encontrado');
      }
    );
  }

  public getFindAllAnimals(id_persona: any) {
    this.animalService.findAllCuentasA(id_persona).subscribe(
      (data: any) => {
        console.log(data);
        console.log(data.nombre);
        this.listALLAnimals = data;

        // console.log("Verificacion de la in-> "+this.listALLAnimals.estado);
      },
      (err) => {
        console.log(err);
      }
    );
  }

    //Implementacion del routenign
    public irPerfilAnimalProfile(id_animal: any){
      // alert(id_animal)
      this.router.navigate(['/usuario/perfil/animal', id_animal]);
    }
}