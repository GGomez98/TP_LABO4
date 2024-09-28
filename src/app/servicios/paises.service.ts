import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PaisesService {

  http = inject(HttpClient);

  constructor() { }

  getPaises(){
    return this.http.get<any[]>("https://restcountries.com/v3.1/all");
  }
}
