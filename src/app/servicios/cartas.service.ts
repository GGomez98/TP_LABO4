import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CartasService {

  http = inject(HttpClient);

  constructor() { }

  getCartas(){
    return this.http.get<any[]>("https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1");
  }

  mostrarCarta(id_baraja:string){
    return this.http.get<any[]>(`https://deckofcardsapi.com/api/deck/${id_baraja}/draw/?count=1`);
  }
}
