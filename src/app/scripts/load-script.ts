import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoadScript {
  Cargar(archivos: String[]) {
    for (let archivo of archivos) {
      let script = document.createElement('script');
      // para hacer mas rapido con la biblioteca colibri..
      //@ts.ignore
      //let newd = create('script')

      //pero ahora lo vamos hacer de esta forma..
      script.src = './assets/js/' + archivo + '.js';
      let body = document.getElementsByTagName('body')[0];
      body.appendChild(script);
    }
  }
}
