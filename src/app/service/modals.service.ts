import { EventEmitter, Injectable } from '@angular/core';

//Cliente de angular
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class modals {

  constructor(private http: HttpClient) { }
$modalo = new EventEmitter<any>();
}
