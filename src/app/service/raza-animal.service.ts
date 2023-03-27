import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Raza } from '../model/raza';
import { Tipo } from '../model/tipo';
import {API_URI} from '../model/api'

@Injectable({
    providedIn: 'root'
})
export class RazaService {

    private urlEndPointList: string = API_URI+'/raza/listarrazas';
    private urlEndPointListTipos: string = API_URI+'/tipoanimal/listartiposAnimales';
    private urlEndPointSearch: string = API_URI+'/raza/buscarraza/';
    private urlEndPointCreate: string = API_URI+'/raza/crearraza';
    private urlEndPointDelete: string = API_URI+'/raza/eliminarraza/';


    private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })


    constructor(private http: HttpClient) { }

    public getAllRazas(){
        return this.http.get<any>(API_URI+'/raza/listarrazas');
    }

    public getRazas(): Observable<Raza[]> {
        return this.http.get<Raza[]>(this.urlEndPointList);
    }

    //
    getTipos(): Observable<Tipo[]> {
        return this.http.get<Tipo[]>(this.urlEndPointListTipos);
    }
    //

    public create(raza: Raza) {
        return this.http.post(this.urlEndPointCreate, raza)
    }

    public searchById(id_razaanimal: number): Observable<Raza> {
        return this.http.get<Raza>(this.urlEndPointSearch + `/${id_razaanimal}`);
    }



    public delete(id_razaanimal: number): Observable<any> {
        return this.http.delete<any>(this.urlEndPointDelete + `/${id_razaanimal}`)
    }

    public findByTipoAnimal(id_tipoanimal: any) {
        return this.http.get<any>(API_URI+'/raza/listarrazasFilter/'+id_tipoanimal)
    }

}