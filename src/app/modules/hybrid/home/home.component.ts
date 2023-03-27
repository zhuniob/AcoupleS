import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadScript } from 'src/app/scripts/load-script';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{

  constructor(private scriptC: LoadScript, private router: Router){
    scriptC.Cargar(['home']);
  }

  ngOnInit(): void {
    
  }

  public developers() {

    this.router.navigate(['/developers']).then(() => {
    });
  }
}
