import { Component } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { addDoc, collection, Firestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-simon-dice',
  standalone: false,
  templateUrl: './simon-dice.component.html',
  styleUrl: './simon-dice.component.scss'
})
export class SimonDiceComponent {
  secuenciaComputadora: Number[] = [];
  secuenciaJugador: Number[] = [];
  puntaje: number = 0;
  timeoutId:any;
  mensaje: string = '';

  constructor(private firestore: Firestore, protected auth: Auth, protected router: Router){}

  ngOnDestroy(){
    console.log("Se cerro el juego");
    this.secuenciaComputadora = [];
    clearTimeout(this.timeoutId);
    this.timeoutId = null;
  }

  ngOnInit(){
    Swal.fire({
      title: `Simon dice`,
      html:`<div style="text-align: left;">
      -Se mostrara una secuencia que el jugador debera repetir<br><br>
      -Cada secuencia correcta suma un punto<br><br>
      -El jugador tiene 3 segundos para sumar un color a la secuencia<br><br>
      -El juego termina si el jugador ingresa una secuencia incompleta o incorrecta<br><br>
      </div>`,
      background: '#000',
      color: '#fff',
      confirmButtonColor: '#ff5722',
      confirmButtonText:"Entendido",
      allowOutsideClick: false,
      allowEscapeKey: false 
    }).then((result)=>{
      if(result.isConfirmed){
        this.jugar();
      }
    });
  }

  jugar(){
    const botones = document.querySelectorAll(".simon");

    this.secuenciaJugador = [];
    this.mensaje = '';
    this.agregarBotonASecuenciaComputadora();
    this.mostrarSecuenciaComputadora().then(()=>{
      botones.forEach(boton =>{
        if(boton instanceof HTMLButtonElement){
          boton.disabled = false;
        }
      })
      this.timeoutId = setTimeout(() => {
        console.log("SE ACABO EL TIEMPO");
        this.mensaje = "SE ACABO EL TIEMPO"
        botones.forEach(boton =>{
          if(boton instanceof HTMLButtonElement){
            boton.disabled = true;
          }
        })
        let col = collection(this.firestore, "simon-dice");
        addDoc(col,{puntaje: this.puntaje, "user": this.auth.currentUser?.displayName, fecha: new Date()});
        Swal.fire({
          title: `Perdiste\nPuntaje final: ${this.puntaje}`,
          background: '#000',
          color: '#fff',
          confirmButtonColor: '#ff5722',
          cancelButtonText: "Salir",
          allowOutsideClick: false,
          allowEscapeKey: false,
          cancelButtonColor: "#d33",
          showCancelButton: true,
        }).then((result)=>{
          if(result.isConfirmed){
            this.secuenciaComputadora = [];
            this.secuenciaJugador = [];
            this.puntaje = 0;
            this.jugar();
          }
          else{
            this.router.navigate(['../../home']);
          }
        });
      }, 3000); 
    });
  }

  agregarBotonASecuenciaJugador(id: number){
    this.secuenciaJugador.push(id);
    clearTimeout(this.timeoutId);
    this.validarSecuencia();
  }

  agregarBotonASecuenciaComputadora(){
    const numeroAleatorio = Math.ceil(Math.random() * 4);
    this.secuenciaComputadora.push(numeroAleatorio);
    console.log(`Secuencia computadora:${this.secuenciaComputadora}`);
  }

  async mostrarSecuenciaComputadora(): Promise<void>{
    await new Promise<void>((resolve)=>{
      setTimeout(() => {
        for(let i=0; i<this.secuenciaComputadora.length; i++){
          let element = document.getElementsByClassName(`button-${this.secuenciaComputadora[i]}`)[0];
          if(element!=null && element instanceof HTMLElement){
            setTimeout(() => {  
              switch(this.secuenciaComputadora[i]){
              case 1:
                element.classList.add('active-yellow')
                element.classList.remove('deactive-yellow')
                  setTimeout(() => {
                    element.classList.remove('active-yellow')
                    element.classList.add('deactive-yellow')
                  }, 1000);
              break;
              case 2:
                element.classList.add('active-red')
                element.classList.remove('deactive-red')
                setTimeout(() => {
                  element.classList.remove('active-red')
                  element.classList.add('deactive-red')
                }, 1000);
              break;
              case 3:
                element.classList.add('active-blue')
                element.classList.remove('deactive-blue')
                setTimeout(() => {
                  element.classList.remove('active-blue')
                  element.classList.add('deactive-blue')
                }, 1000);
              break;
              default:
                element.classList.add('active-green')
                element.classList.remove('deactive-green')
                setTimeout(() => {
                  element.classList.remove('active-green')
                  element.classList.add('deactive-green')
                }, 1000);
              break;
              }
              if(i == this.secuenciaComputadora.length-1){
                setTimeout(() => {
                  resolve();
                }, 1000);
              }
            }, i*2000);
          }
        }
      }, 2000);
    })
  }

  async validarSecuencia(): Promise<void>{
    await new Promise<void>((resolve)=>{
    const botones = document.querySelectorAll(".simon");

    for(let i=0; i<botones.length; i++){
      const boton = botones[i] as HTMLButtonElement
      boton.disabled = false;
    }

    if(this.secuenciaComputadora.length==this.secuenciaJugador.length){
      if(JSON.stringify(this.secuenciaComputadora)==JSON.stringify(this.secuenciaJugador)){
        for(let i=0; i<botones.length; i++){
          const boton = botones[i] as HTMLButtonElement
          boton.disabled = true;
        }
        console.log("SECUENCIA CORRECTA");
        this.mensaje = 'SECUENCIA CORRECTA'
        this.puntaje++;
        setTimeout(() => {
          this.jugar();
        }, 2000);
      }
      else{
        console.log("SECUENCIA INCORRECTA");
        console.log("JUEGO TERMINADO");
        this.mensaje = 'SECUENCIA INCORRECTA'
        for(let i=0; i<botones.length; i++){
          const boton = botones[i] as HTMLButtonElement
          boton.disabled = true;
        }
        let col = collection(this.firestore, "simon-dice");
        addDoc(col,{puntaje: this.puntaje, "user": this.auth.currentUser?.displayName, fecha: new Date()});
        Swal.fire({
          title: `Perdiste\nPuntaje final: ${this.puntaje}`,
          background: '#000',
          color: '#fff',
          confirmButtonColor: '#ff5722',
          confirmButtonText: 'Reiniciar Juego',
          cancelButtonText: "Salir",
          allowOutsideClick: false,
          allowEscapeKey: false,
          cancelButtonColor: "#d33",
          showCancelButton: true,
        }).then((result)=>{
          if(result.isConfirmed){
            this.secuenciaComputadora = [];
            this.secuenciaJugador = [];
            this.puntaje = 0;
            this.jugar();
          }
          else{
            this.router.navigate(['../../home']);
          }
        });
      }
    }
    else{
      this.timeoutId = setTimeout(() => {
        console.log("SE ACABO EL TIEMPO");
        this.mensaje = 'SE ACABO EL TIEMPO'
        console.log("JUEGO TERMINADO");
        botones.forEach(boton =>{
          if(boton instanceof HTMLButtonElement){
            boton.disabled = true;
          }
        });
        let col = collection(this.firestore, "simon-dice");
        addDoc(col,{puntaje: this.puntaje, "user": this.auth.currentUser?.displayName, fecha: new Date()});
        Swal.fire({
          title: `Perdiste\nPuntaje final: ${this.puntaje}`,
          background: '#000',
          color: '#fff',
          confirmButtonColor: '#ff5722',
          confirmButtonText: 'Reiniciar Juego',
          cancelButtonText: "Salir",
          allowOutsideClick: false,
          allowEscapeKey: false,
          cancelButtonColor: "#d33",
          showCancelButton: true,
        }).then((result)=>{
          if(result.isConfirmed){
            this.secuenciaComputadora = [];
            this.secuenciaJugador = [];
            this.puntaje = 0;
            this.jugar();
          }
          else{
            this.router.navigate(['../../home']);
          }
        });
      }, 3000); 
    }
    })
  }
}
