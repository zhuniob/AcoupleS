import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Tipo } from '../model/tipo';
import { API_URI } from '../model/api';
@Injectable({
    providedIn: 'root'
})
export class TipoService {

    private urlEndPointList: string = API_URI+'/tipoanimal/listartiposAnimales';
    private urlEndPointSearch: string = API_URI+'/tipoanimal/buscartipoAnimal/';
    private urlEndPointCreate: string = API_URI+'/tipoanimal/creartipoAnimal';
    private urlEndPointDelete: string = API_URI+'/tipoanimal/eliminartipoAnimal/';

    private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })


    constructor(private http: HttpClient) { }

    public getAllTipos(){
        return this.http.get<any>(API_URI+'/tipoanimal/listartiposAnimales');
    }

    getTipos(): Observable<Tipo[]> {
        return this.http.get<Tipo[]>(this.urlEndPointList);
    }

    create(tipo: Tipo): Observable<Tipo> {
        return this.http.post<Tipo>(this.urlEndPointCreate, tipo, { headers: this.httpHeaders })
    }


    public searchById(id_tipoanimal: any): Observable<Tipo> {
        return this.http.get<Tipo>(this.urlEndPointSearch + `/${id_tipoanimal}`);
    }

    public delete(id_tipoanimal: number): Observable<any> {
        return this.http.delete<any>(this.urlEndPointDelete + `/${id_tipoanimal}`)
    }

    public getFilterCount(): Observable<any>{
        return this.http.get<any>(API_URI+'/filter/tipos/razas/usuario/animales/count');
    }

}