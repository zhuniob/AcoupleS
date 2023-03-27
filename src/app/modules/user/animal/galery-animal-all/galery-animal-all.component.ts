import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AnimalService } from 'src/app/service/animal.service';
import { GenericService } from 'src/app/service/serviceHybrid/genericService';

@Component({
  selector: 'app-galery-animal-all',
  templateUrl: './galery-animal-all.component.html',
  styleUrls: [
    './galery-animal-all.component.css',
    './galery-animal-all.component.scss',
  ],
})
export class GaleryAnimalAllComponent implements OnInit {
  public listALLAnimals: any;

  public id_persona_loggin: any;

  //Variable que me va a permitir hacer toda la accion para en caso de la carga de la información..
  public isLoadingData: boolean = false;
  constructor(
    private animalService: AnimalService,
    private router: Router,
    private genericService: GenericService
  ) {}
  ngOnInit(): void {
    this.isLoadingData = true;
    this.getFindAllAnimals();
    this.id_persona_loggin = localStorage.getItem('id_user_person');
  }

  //Traer todos los animales
  public getFindAllAnimals() {
    this.listALLAnimals = this.genericService.getAnimalList();

    if(this.listALLAnimals == 0){
      this.getAnimalIfListEmpty();
    }else{
      this.isLoadingData = false;
    }

  }

  public getAnimalIfListEmpty(){
        this.animalService.findAllAnimals().subscribe(
      (data: any) => {

        this.listALLAnimals = data.filter(
          (animal: any) => animal.persona.id_persona != this.id_persona_loggin
        );
        this.isLoadingData = false;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  public irPerfilAnimalProfile(id_animal: any) {
    this.router.navigate(['/usuario/perfil/animal', id_animal]);
  }
}
