import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { CartasService } from '../../../../servicios/cartas.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { addDoc, collection, Firestore } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-mayor-o-menor',
  standalone: false,
  templateUrl: './mayor-o-menor.component.html',
  styleUrl: './mayor-o-menor.component.scss'
})

export class MayorOMenorComponent implements OnInit, OnDestroy{
  baraja:any;
  idBaraja:any;
  cartaEnMesa:any;
  cartaEnMesaImagen:any;
  subscription!:Subscription;
  dataCargada = false;
  cartaRecogida:any;
  cartasDescartadas:any[] = [];
  puntaje = 0;
  cartasEnBaraja = 0;

  constructor(private cartasService: CartasService,private firestore: Firestore, protected auth: Auth) {}
  
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit():void{
    this.cartasEnBaraja = 51;
    this.puntaje = 0;
    Swal.fire({
      title: 'Cargando...',
      text: 'Por favor espera',
      allowOutsideClick: false,
      background: '#000',
      color: '#fff',
      didOpen: () => {
        Swal.showLoading();
      }
    });
    this.subscription = this.cartasService.getCartas()
    .subscribe(
      baraja => {
        this.baraja = baraja;
        this.idBaraja = this.baraja.deck_id
        this.obtenerCarta();
        Swal.close();
        this.dataCargada = true;
        Swal.fire({
          title: `Mayor o Menor`,
          html:`<div style="text-align: left;">
          -Al jugador se le muestra una carta de un mazo de 52 cartas y debe adivinar si la proxima carta es mayor, menor o igual a la siguiente<br><br>
          -Por cada acierto suma un punto<br><br>
          -El juego finaliza cuando el mazo se queda sin cartas<br><br>
          </div>`,
          background: '#000',
          color: '#fff',
          confirmButtonColor: '#ff5722',
          confirmButtonText:"Entendido",
          allowOutsideClick: false,
          allowEscapeKey: false 
        });
      });
  }

  obtenerCarta(){
    this.subscription = this.cartasService.mostrarCarta(this.idBaraja)
      .subscribe(
        async cartaRecogida => {
          this.cartaRecogida = cartaRecogida;
          this.cartaEnMesa = this.cartaRecogida.cards[0];
          this.cartaEnMesaImagen = this.cartaEnMesa.image;
          this.asignarValores();
        }
      );
  }

  asignarValores(){
    switch(this.cartaEnMesa.value){
      case 'ACE':
        this.cartaEnMesa.value=1;
      break;
      case 'KING':
        this.cartaEnMesa.value=13;
      break;
      case 'QUEEN':
        this.cartaEnMesa.value=12;
      break;
      case 'JACK':
        this.cartaEnMesa.value=11;
      break;
      default:
        this.cartaEnMesa.value=parseInt(this.cartaEnMesa.value);
      break
    }
  }

  Apostar(opcion: string) {
    // Descartar la carta actual
    this.cartasDescartadas.push(this.cartaEnMesa);
    console.log(this.cartasDescartadas[this.cartasDescartadas.length - 1]);
  
    // Obtener la nueva carta antes de hacer la comparación
    this.cartasService.mostrarCarta(this.idBaraja).subscribe(
      nuevaCarta => {
        this.cartaRecogida = nuevaCarta;
        this.cartaEnMesa = this.cartaRecogida.cards[0];
        this.cartaEnMesaImagen = this.cartaEnMesa.image;
        this.asignarValores();
        // Realizar las comparaciones después de obtener la nueva carta
        switch (opcion) {
          case "mayor":
            if (this.cartaEnMesa.value > this.cartasDescartadas[this.cartasDescartadas.length - 1].value) {
              console.log("Es Mayor");
              this.puntaje+=1
            }
            break;
          case "menor":
            if (this.cartaEnMesa.value < this.cartasDescartadas[this.cartasDescartadas.length - 1].value) {
              console.log("Es Menor");
              this.puntaje+=1
            }
            break;
          case "igual":
            if (this.cartasDescartadas[this.cartasDescartadas.length - 1].value == this.cartaEnMesa.value) {
              console.log("Es Igual");
              this.puntaje+=1
            }
            break;
        }
console.log(this.puntaje);
        if (this.cartasDescartadas.length == 51) {
          let col = collection(this.firestore, "mayor-o-menor");
          addDoc(col,{puntaje: this.puntaje, "user": this.auth.currentUser?.displayName, fecha: new Date()});
          Swal.fire({
            title: `Juego Terminado`,
            background: '#000',
            color: '#fff',
            confirmButtonColor: '#ff5722',
            confirmButtonText: 'Reiniciar Juego',
            allowOutsideClick: false,
            allowEscapeKey: false 
          }).then((result)=>{
            if(result.isConfirmed){
              this.ngOnInit();
            }
          });
        }
        else{
          this.cartasEnBaraja -= 1;
        }
      }
    );
  }
}
